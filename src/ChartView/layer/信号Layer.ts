import { Graphics, Container } from 'pixi.js'
import { Layer } from '../Layer'
import { BitmapText } from '../BitmapText'
import { range } from 'ramda'

export class 信号Layer extends Layer<{ data: ArrayLike<{ name: string, value: boolean, color?: number }[]>, color: number }> {

    private g = new Graphics()
    private textArr: BitmapText[] = []
    private textContainer = new Container()

    init() {
        this.addChild(this.g)
        this.addChild(this.textContainer)
        range(0, 200).forEach(() => {
            let text = new BitmapText({
                fontSize: 20,
                fill: 0xaaaaaa,
                anchor: { x: 0, y: 0.5 }
            }, this.app)
            this.textContainer.addChild(text)
            this.textArr.push(text)
        })
    }

    render() {
        const { g, viewport, props: { data, color } } = this

        //clear
        let III = 0
        this.textArr.forEach(v => v.visible = false)
        g.clear()



        if (data.length === 0) return

        const strArr = data[0].map(v => v.name)
        const oneH = viewport.height / strArr.length


        //
        strArr.forEach((v, i) => {
            let text = this.textArr[III]
            III += 1
            text.text = v
            text.x = viewport.width + 5
            text.y = oneH * (i + 0.5)
            text.visible = true
        })

        viewport.forEach(data, (v, i) => {
            const x = viewport.toX(i)
            strArr.forEach((_, j) => {
                if (v[j].value) {
                    if (v[j].color !== undefined) {
                        g.lineStyle(1, v[j].color)
                    } else {
                        g.lineStyle(1, color)
                    }
                    g.moveTo(x, oneH * j)
                    g.lineTo(x, oneH * (j + 1))
                }
            })
        })

    }

} 