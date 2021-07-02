import { defineComponent, h, renderSlot } from 'vue'

type Indicator = 'activate' | 'deactivate' | 'loading' | 'finish'

const isWebView =
  typeof navigator !== 'undefined' &&
  /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(navigator.userAgent)

export default defineComponent({
  props: {
    distanceToRefresh: {
      type: Number,
      default: 42,
    },
    damping: {
      type: Number,
      default: 224,
    },
    scale: {
      type: Number,
      default: 0.6,
    },
    onRefresh: {
      type: Function,
      default: null,
    },
  },
  data() {
    return {
      state: {
        currSt: 'deactivate' as Indicator,
        dragOnEdge: false,
      },
      isScrolling: false,
      progress: 0,

      _startScreenX: null as any,
      _startScreenY: null as any, // 시작 스크롤의 Y
      _ScreenY: null as any, // 현재 스크롤 중인 Y 값
      _lastScreenY: null as any,

      scrollTop: 0,
    }
  },
  mounted() {
    const $el = this.$el as HTMLDivElement
    $el.addEventListener('touchstart', this.onStart)
    $el.addEventListener('touchmove', this.onMove)
    $el.addEventListener('touchend', this.onEnd)
    $el.addEventListener('touchcancel', this.onEnd)
  },
  beforeUnmount() {
    const $el = this.$el as HTMLDivElement
    $el.removeEventListener('touchstart', this.onStart)
    $el.removeEventListener('touchmove', this.onMove)
    $el.removeEventListener('touchend', this.onEnd)
    $el.removeEventListener('touchcancel', this.onEnd)
  },
  methods: {
    onStart(event: TouchEvent) {
      this._startScreenX = event.touches[0].screenX
      this._startScreenY = event.touches[0].screenY
      this._ScreenY = event.touches[0].screenY
      this._lastScreenY = this._lastScreenY || 0
    },

    onMove(event: TouchEvent) {
      const ele = this.$el

      const _screenY = event.touches[0].screenY
      const _screenX = event.touches[0].screenX

      if (
        Math.abs(_screenX - this._startScreenX) >
        20 * window.devicePixelRatio
      ) {
        return
      }
      if (this._startScreenY > _screenY) {
        return
      }

      if (this.isEdge(ele)) {
        if (!this.state.dragOnEdge) {
          this._startScreenY = event.touches[0].screenY
          this._ScreenY = event.touches[0].screenY
          this.state.dragOnEdge = true
        }
        event.preventDefault()

        const _diff = Math.round(_screenY - this._ScreenY)
        this._ScreenY = _screenY
        this._lastScreenY += this.gravity(_diff)

        const ratio = this._lastScreenY / this.damping
        this.progress = ratio > 1 ? 1 : ratio
        this.setContentStyle(this._lastScreenY)

        if (Math.abs(this._lastScreenY) < this.distanceToRefresh) {
          if (this.state.currSt !== 'deactivate') {
            this.state.currSt = 'deactivate'
          }
        } else if (this.state.currSt === 'deactivate') {
          this.state.currSt = 'activate'
        }

        // https://github.com/ant-design/ant-design-mobile/issues/573#issuecomment-339560829
        // iOS UIWebView issue, It seems no problem in WKWebView
        if (isWebView && event.changedTouches[0].clientY < 0) {
          this.onEnd(event)
        }
      }
    },

    async onEnd(_: TouchEvent) {
      if (this.state.dragOnEdge) {
        this.state.dragOnEdge = false
      }
      if (this.state.currSt === 'activate') {
        this.state.currSt = 'loading'
        this.triggerPullToRefresh()
        if (this.onRefresh) {
          await this.onRefresh()
        }
        this.state.currSt = 'finish'
        if (!this.state.dragOnEdge) {
          this.reset()
        }
      } else {
        this.reset()
      }
    },

    isEdge(ele: any) {
      return ele.scrollTop <= 0
    },

    gravity(dy: number): number {
      const ratio =
        Math.abs(this._ScreenY - this._startScreenY) / window.screen.height
      dy *= (1 - ratio) * this.scale
      return dy
    },

    triggerPullToRefresh() {
      if (!this.state.dragOnEdge) {
        this._lastScreenY = this.distanceToRefresh + 1
        this.state.currSt = 'loading'
        this.setContentStyle(this._lastScreenY)
      }
    },

    reset() {
      this._lastScreenY = 0
      this.setContentStyle(0)
    },

    setContentStyle(ty: number) {
      const nodeStyle = (this.$refs.contents as any).style
      nodeStyle.transform = `translate3d(0px,${ty}px,0)`
      nodeStyle.webkitTransform = `translate3d(0px,${ty}px,0)`
      nodeStyle.MozTransform = `translate3d(0px,${ty}px,0)`
    },

    scrollTo(target = 0, smooth = true) {
      if (!this.$refs.scrollView || this.isScrolling) {
        return
      }
      const scrollView = this.$refs.scrollView as HTMLDivElement
      if (!smooth) {
        scrollView.scrollTop = target
        return
      }
      this.isScrolling = true
      const toScroll = target
      let currentScroll = scrollView.scrollTop

      const duration = Math.abs(toScroll - currentScroll) > 1000 ? 1000 : 500
      const start = Date.now()
      let stop = false

      const animation = () => {
        if (stop || Math.abs(toScroll - currentScroll) < 50) {
          scrollView.scrollTop = toScroll
          this.isScrolling = false
          return
        }
        window.requestAnimationFrame(animation)

        const now = Date.now()
        if (now - start >= duration) {
          stop = true
        }
        const p = (now - start) / duration
        const val = this.easeInOut(p)

        currentScroll += (toScroll - currentScroll) * val
        scrollView.scrollTop = currentScroll
      }
      window.requestAnimationFrame(animation)
    },

    easeInOut(n: number): number {
      n *= 2
      if (n < 1) {
        return 0.5 * n * n * n * n
      }
      return -0.5 * ((n -= 2) * n * n * n - 2)
    },
  },
  render() {
    return h(
      'div',
      {
        ref: 'scrollView',
        style: this.isScrolling ? { overflow: 'hidden' } : {},
      },
      [
        h(
          'div',
          {
            style: { overflow: 'hidden' },
          },
          [
            h(
              'div',
              {
                ref: 'contents',
                style: !this.state.dragOnEdge
                  ? {
                      width: '100%',
                      'transform-origin': 'left top 0px',
                      transition: 'transform 0.3s',
                      '-webkit-transition': 'transform 0.3s',
                    }
                  : { width: '100%', 'transform-origin': 'left top 0px' },
              },
              [
                h(
                  'div',
                  {
                    ref: 'loading',
                    style: {
                      height: `${this.distanceToRefresh}px`,
                      'margin-top': `-${this.distanceToRefresh}px`,
                    },
                  },
                  renderSlot(
                    this.$slots,
                    'loading',
                    { state: this.state.currSt, progress: this.progress },
                    () => []
                  )
                ),
                renderSlot(this.$slots, 'default', {}, () => []),
              ]
            ),
          ]
        ),
      ]
    )
  },
})
