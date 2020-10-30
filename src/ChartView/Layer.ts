
import { Container, Application } from 'pixi.js'
import { Viewport } from './Viewport'

export class Layer<P> extends Container {

    constructor(
        public props: P,
        public app: Application,
        public viewport: Viewport,
    ) {
        super()
    }

    init() {

    }

    //destroy ?? TODO

    render() {

    }


    //TODO
    getTopBottom(): {
        top: number
        bottom: number
    } | undefined {
        return undefined
    }

    updateViewport() {

    }
}