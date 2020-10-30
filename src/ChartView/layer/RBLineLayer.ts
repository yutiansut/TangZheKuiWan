import { Graphics } from 'pixi.js'
import { Layer } from '../Layer'
import { res } from '../../app/res'

export class RBLineLayer extends Layer<{ data: ArrayLike<number> }> {

    private g = new Graphics()

    init() {
        this.addChild(this.g)
    }

    render() {
        const { g, viewport, props: { data } } = this
        g.clear()

        let hasMove = false

        let last = res.color.UP

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
                const y0 = viewport.toY(data[i - 1])
                last = y === y0 ? last : (y > y0 ? res.color.DOWN : res.color.UP)
                g.lineStyle(2, last)
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