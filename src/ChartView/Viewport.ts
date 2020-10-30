import { theme } from './theme'

export class Viewport { //可变数据
    CHART_上面加空隙 = theme.CHART_上面加空隙
    CHART_下面加空隙 = theme.CHART_下面加空隙
    left = 0
    right = 0
    top = 0
    bottom = 0
    width = 0
    height = 0
    yCoordinate?: '普通' | '对数' = '普通'

    toX = (value: number) => (value - this.left) / (this.right - this.left) * this.width

    toIndex = (x: number) =>
        (x / this.width) * (this.right - this.left) + this.left


    toY = (value: number) => {
        let n = (value - this.bottom) / (this.top - this.bottom) //0--1
        if (this.yCoordinate === '对数') { //重复
            n = Math.log10(1 + n * 9)
        }
        return this.CHART_上面加空隙 + (this.height - this.CHART_上面加空隙 - this.CHART_下面加空隙) * (1 - n)
    }


    toValue = (y: number) => {
        let n = (y - this.CHART_上面加空隙) / (this.height - this.CHART_上面加空隙 - this.CHART_下面加空隙)
        if (this.yCoordinate === '对数') { //重复
            n = Math.log10(1 + n * 9)
        }
        return this.top - (this.top - this.bottom) * n
    }

    updateTopAndBottom = ({ top, bottom }: { top: number, bottom: number }) => {
        this.top = Math.max(this.top, top)
        this.bottom = Math.min(this.bottom, bottom)
    }

    updateLast = () => {
        if (this.top === this.bottom) {
            this.top += 0.1
            this.bottom -= 0.1
        }
    }

    forEach = <T>(data: ArrayLike<T>, f: (value: T, index: number) => void) => {
        const start = Math.max(0, Math.floor(this.left))
        const end = Math.min(Math.round(this.right), data.length - 1)
        for (let i = start; i <= end; i++) f(data[i], i)
    }
} 