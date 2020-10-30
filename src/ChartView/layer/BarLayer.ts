import { Graphics } from 'pixi.js'
import { Layer } from '../Layer'

export class BarLayer extends Layer<{ data: ArrayLike<number>, color: number }> {

    private g = new Graphics()

    init() {
        this.addChild(this.g)
    }

    render() {
        const { g, viewport, props: { data, color } } = this
        g.clear()
        g.lineStyle(0)
        g.beginFill(color)

        const y0 = viewport.toY(0)

        viewport.forEach(data, (v, i) => {
            if (isNaN(v)) return
            const y1 = viewport.toY(v)
            const x1 = viewport.toX(i - 0.3)
            const x2 = viewport.toX(i + 0.3)
            g.drawRect(x1, v > 0 ? y1 : y0, Math.max(1, x2 - x1), Math.max(1, Math.abs(y1 - y0)))
        })
        g.endFill()
    }

    updateViewport() {
        this.viewport.forEach(this.props.data, v => {
            if (isNaN(v) === false) {
                this.viewport.updateTopAndBottom({
                    top: Math.max(0, v),
                    bottom: Math.min(0, v),
                })
            }
        })
    }

}