import { Layer } from '../Layer'
import { Graphics } from 'pixi.js'
import { res } from '../../app/res'

export class KLineLayer extends Layer<{
    data: ArrayLike<{
        type?: '合成中' | '已完成' | '数据丢失'
        open: number
        close: number
        high: number
        low: number
    }>
}>{

    private g = new Graphics()

    init() {
        this.addChild(this.g)
    }

    render() {
        const { g, viewport, props: { data } } = this
        g.clear()

        let lastColor = res.color.UP

        viewport.forEach(data, (v, i) => {

            const openY = viewport.toY(v.open)
            const closeY = viewport.toY(v.close)
            const highY = viewport.toY(v.high)
            const lowY = viewport.toY(v.low)

            const x0 = viewport.toX(i)
            const x1 = viewport.toX(i - 0.3)
            const x2 = viewport.toX(i + 0.3)

            const color = v.close === v.open ? lastColor : (v.close > v.open ? res.color.UP : res.color.DOWN)
            lastColor = color


            if (v.type !== '数据丢失') {
                //最高最低价
                this.g.lineStyle(1, color)
                this.g.moveTo(x0, highY)
                this.g.lineTo(x0, highY + Math.max(1, lowY - highY))

                //开盘收盘价
                // this.g.beginFill(v.type !== '合成中' ? color : 0x000000)
                this.g.beginFill(color)
                this.g.drawRect(x1, v.open > v.close ? openY : closeY, Math.max(1, x2 - x1), Math.max(1, Math.abs(openY - closeY)))
                this.g.endFill()
            }
        })
    }

    updateViewport() {
        this.viewport.forEach(this.props.data, ({ high, low }) => {
            if (isNaN(high) === false && isNaN(low) === false) {
                this.viewport.updateTopAndBottom({
                    top: high,
                    bottom: low,
                })
            }
        })
    }
}