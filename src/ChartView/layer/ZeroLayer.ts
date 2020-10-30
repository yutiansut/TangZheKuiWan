import { Graphics } from 'pixi.js'
import { Layer } from '../Layer'

export class ZeroLayer extends Layer<{ color: number, value?: number }> {

    private g = new Graphics()

    init() {
        this.addChild(this.g)
    }

    render() {
        const { g, viewport, props: { color, value } } = this

        g.clear()
        g.lineStyle(1, color)

        const y = viewport.toY(value || 0)

        g.moveTo(0, y)
        g.lineTo(viewport.width, y)

    }

    updateViewport() {
        this.viewport.updateTopAndBottom({
            top: this.props.value || 0,
            bottom: this.props.value || 0,
        })
    }

} 