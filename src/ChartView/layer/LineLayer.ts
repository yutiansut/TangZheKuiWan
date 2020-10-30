import { Graphics } from 'pixi.js'
import { Layer } from '../Layer'

export class LineLayer extends Layer<{ data: ArrayLike<number>, color: number }> {

    private g = new Graphics()

    init() {
        this.addChild(this.g)
    }

    render() {
        const { g, viewport, props: { data, color } } = this
        g.clear()
        g.lineStyle(1, color)

        let hasMove = false

        viewport.forEach(data, (v, i) => {
            if (isNaN(v)) {
                hasMove = false
                return
            }

            const x = viewport.toX(i)

            let y = viewport.toY(v)


            if (hasMove === false) {
                hasMove = true
                g.moveTo(x, y)
            } else {
                g.lineTo(x, y)
            }
        })
    }

    updateViewport() {
        this.viewport.forEach(this.props.data, v => {
            if (isNaN(v) === false) {
                this.viewport.updateTopAndBottom({
                    top: v,
                    bottom: v,
                })
            }
        })
    }

} 