import * as React from 'react'
import { Application, Container } from 'pixi.js'
import { Layer } from './Layer'
import { Coordinate } from './Coordinate'
import { theme } from './theme'
import { Crosshairs } from './Crosshairs'
import { Viewport } from './Viewport'

type LayerClass<P> = {
    new(props: P, app: Application, viewport: Viewport): Layer<P>
}

export type LayerItem = [LayerClass<any>, any, '__用layer函数创建__']

export const layer = <P extends any>(a: LayerClass<P>, b: P): LayerItem => [a, b] as any

type Item = {
    CHART_上面加空隙?: number
    CHART_下面加空隙?: number
    onRightMouseDown?: (value: number) => void
    y单个间隔?: number
    numberColor?: number
    format?: (value: number) => string
    numberX?: number
    yCoordinate?: '普通' | '对数'
    layerList: LayerItem[]
}

type PPP = {
    //TODO
    //底部显示 showRange ----> arr auto real
    底部显示: (v: number) => string
    底部十字光标显示: (v: number) => string
    showRange: { left: number, right: number }
    items: {
        heightList: number[]
        items: (Item | Item[])[]
    }
}

export type ChartViewProps = {
    FPS?: number
    getData: (width: number, height: number) => PPP
}

export class ChartView extends React.Component<ChartViewProps>{
    app = new Application({
        resolution: window.devicePixelRatio,
        autoResize: true,
        antialias: false,
        backgroundColor: 0x000000,
    })

    initChart = (element: HTMLElement | null) => {
        if (element !== null) {


            element.addEventListener('mousedown', e => {
                if (e.button === 2) {
                    this.rightMouseDown()
                }
            })

            element.appendChild(this.app.view)
            const onResize = () => this.app.renderer.resize(element.clientWidth, element.clientHeight)
            window.addEventListener('resize', onResize)
            onResize()

            const onTick = () => {
                //window.devicePixelRatio会变化的(多屏)
                if (this.app.renderer.options.resolution !== window.devicePixelRatio) {
                    this.app.renderer.options.resolution = window.devicePixelRatio
                }
                this.onTick(this.props.getData(this.width, this.height))
            }

            const FPS = this.props.FPS || 60
            if (FPS >= 60) {
                this.app.ticker.add(onTick)
            } else {
                setInterval(onTick, 1000 / FPS)
            }
        }
    }

    render() {
        return <div
            style={{ width: '100%', height: '100%' }}
            ref={this.initChart}
        />
    }

    坐标刻度 = new Coordinate(this.app)
    layerContainer = new Container()
    十字光标 = new Crosshairs(this.app)
    indexX = 0
    mouseX = 0
    mouseY = 0
    mouseY2 = 0

    componentWillMount() {

        this.app.stage.addChild(this.坐标刻度)
        this.app.stage.addChild(this.layerContainer)
        this.app.stage.addChild(this.十字光标)

        window.addEventListener('mousemove', e => {
            this.mouseX = e.clientX - this.app.view.offsetLeft
            this.mouseY = e.clientY - this.app.view.offsetTop
        })
        window.addEventListener('mouseover', () => this.十字光标.visible = true)
        window.addEventListener('mouseout', () => this.十字光标.visible = false)


    }

    rightMouseDown = () => { }
    y单个间隔 = 0

    layerCache = new Map<LayerClass<any>, Layer<any>[]>()

    popLayer = (c: LayerClass<any>, p: any, viewport: Viewport) => {

        if (this.layerCache.has(c) === false) {
            this.layerCache.set(c, [])
        }

        const arr = this.layerCache.get(c)!
        if (arr.length > 0) {
            const layer = arr.pop() as Layer<any>
            layer.props = p
            layer.viewport = viewport
            return layer
        } else {
            const layer = new c(p, this.app, viewport)
                ; (layer as any)['__xxx__'] = c //!!!
            layer.init()
            return layer
        }
    }

    pushLayer = (layer: Layer<any>) => {
        const c = (layer as any)['__xxx__'] //!!!

        if (this.layerCache.has(c) === false) {
            this.layerCache.set(c, [])
        }

        const arr = this.layerCache.get(c)!
        arr.push(layer)
    }

    get width() {
        return this.app.screen.width - theme.CHART_RIGHT_WIDTH
    }

    get height() {
        return this.app.screen.height - theme.CHART_BOTTOM_HEIGHT
    }

    onTick(data: PPP) {
        let { 底部十字光标显示, 底部显示, showRange: { left, right }, items } = data
        const { width, height } = this

        this.indexX = Math.round(left + (right - left) * (this.mouseX / width))

        this.坐标刻度.clear()
        this.坐标刻度.drawH(width, height)

        const toX = (value: number) => (value - left) / (right - left) * width

        for (let i = Math.floor(left); i <= Math.floor(right); i++) {
            const msg = 底部显示(i)
            if (msg !== '') {
                this.坐标刻度.drawTemp(toX(i), height, msg)
            }
        }

        while (this.layerContainer.children.length > 0) {
            this.pushLayer(this.layerContainer.removeChildAt(0) as Layer<any>)
        }

        let price = NaN
        let startY = 0

        const aaa = (v: Item, heightPercentage: number, CHART_上面加空隙: number, CHART_下面加空隙: number) => {
            let viewport = new Viewport()
            viewport.CHART_上面加空隙 = CHART_上面加空隙
            viewport.CHART_下面加空隙 = CHART_下面加空隙

            viewport.width = width
            viewport.height = height * heightPercentage
            viewport.left = left
            viewport.right = right
            viewport.top = -Number.MAX_VALUE
            viewport.bottom = Number.MAX_VALUE
            viewport.yCoordinate = v.yCoordinate

            //layerList
            const layerList = v.layerList.map(([C, P]) => this.popLayer(C, P, viewport))
            layerList.forEach(layer => layer.updateViewport())
            viewport.updateLast()

            //坐标刻度
            this.坐标刻度.render({
                numberColor: v.numberColor,
                format: v.format,
                numberX: v.numberX,
                startY,
                viewport,
            })

            if (this.mouseY - startY > 0 && this.mouseY - startY < viewport.height) {

                const vvv = viewport.toValue(this.mouseY - startY)
                // price = vvv

                price = Math.round(vvv * 2) / 2 // <----TODO 写死 0.5
                this.mouseY2 = viewport.toY(price) + startY //<------

                this.rightMouseDown = () => {
                    const f = v.onRightMouseDown
                    if (f) f(price)
                }
                this.y单个间隔 = v.y单个间隔 || 0
            }

            //layer render
            layerList.forEach(layer => {
                layer.x = 0
                layer.y = startY
                layer.render()
                this.layerContainer.addChild(layer)
            })
        }

        items.items.forEach((v, i) => {
            if (v instanceof Array) {
                v.forEach(v => aaa(v, items.heightList[i], v.CHART_上面加空隙 || theme.CHART_上面加空隙, v.CHART_下面加空隙 || theme.CHART_下面加空隙))
            } else {
                aaa(v, items.heightList[i], v.CHART_上面加空隙 || theme.CHART_上面加空隙, v.CHART_下面加空隙 || theme.CHART_下面加空隙)
            }
            startY += height * items.heightList[i]
        })

        this.十字光标.render({
            x: (this.indexX - left) / (right - left) * width,
            y: this.mouseY2,//
            width,
            height,
            xStr: 底部十字光标显示(this.indexX),
            yStr: price.toFixed(2)
        })
    }
}