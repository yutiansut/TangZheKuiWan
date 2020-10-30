import { Layer } from '../Layer'
import { BitmapText } from '../BitmapText'

export class TextLayer extends Layer<{ text: string, color: number }> {

    private bitmapText?: BitmapText


    init() {
        this.bitmapText = new BitmapText({
            fontSize: 16,
            fill: this.props.color,
            anchor: {
                x: 1,
                y: 0,
            },
        }, this.app)
        this.addChild(this.bitmapText)
    }

    render() {
        const { width } = this.viewport
        if (this.bitmapText !== undefined) {
            this.bitmapText.text = this.props.text
            this.bitmapText.fill = this.props.color
            this.bitmapText.x = width - 10
            this.bitmapText.y = 10
        }
    }
}


export class LeftTextLayer extends Layer<{ text: string, color: number }> {

    private bitmapText?: BitmapText


    init() {
        this.bitmapText = new BitmapText({
            fontSize: 16,
            fill: this.props.color,
            anchor: {
                x: 0,
                y: 0,
            },
        }, this.app)
        this.addChild(this.bitmapText)
    }

    render() {
        if (this.bitmapText !== undefined) {
            this.bitmapText.text = this.props.text
            this.bitmapText.fill = this.props.color
            this.bitmapText.x = 10
            this.bitmapText.y = 10
        }
    }
}