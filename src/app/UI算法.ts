import { theme } from '../ChartView/theme'
import { pure } from '../utils/pure'

export namespace UI算法 {

    //chart x 坐标轴 显示
    const getF = (p: {
        time: ArrayLike<number>
        单位显示: number
    }) => (v: number) => {
        if (v > p.time.length - 1 || v < 0) return ''

        const time = p.time[v]

        if (time % p.单位显示 === 0) {
            return pure.formatDate(new Date(time),
                v => `${v.时}:${v.分}`,
            )
        }
        else {
            return ''
        }
    }

    const m = 60 * 1000
    const h = 60 * m
    const d = 24 * h

    const arr = [
        1 * m,
        5 * m,
        15 * m,
        30 * m,
        1 * h,
        2 * h,
        4 * h,
        8 * h,
        12 * h,
        1 * d,
        5 * d,
        15 * d,
        30 * d,
        365 * d,
    ]
    const minW = 128

    export const get底部显示 = (p: {
        time: ArrayLike<number>
        width: number
        range: number
    }) => {
        const a = Math.floor(p.width / minW)
        const b = p.range / a
        const 单位显示 = arr.find(v => v > b)

        return 单位显示 ? getF({
            time: p.time,
            单位显示,
        }) : () => ''
    }

    //chart y 坐标轴 显示

    //滚轮缩放 
    export class ShowCustom {
        private S: {
            left: number,
            right: number,
        }

        显示最后 = (maxCount: number) => {
            this.lastLength = this.getLength()
            const { left, right } = theme.showAll({
                length: this.lastLength,
                maxCount,
            })
            this.S.left = left
            this.S.right = right
        }

        getRange() {
            const len = this.getLength()
            if (this.lastLength !== len) {
                const a = len - this.lastLength
                this.S.left += a
                this.S.right += a
                this.lastLength = len
            }
            return this.S
        }

        开关 = true

        private lastLength = 0
        constructor(private getLength = () => 0) {
            this.lastLength = this.getLength()
            this.S = {
                left: this.lastLength - 64,
                right: this.lastLength - 0.5,
            }


            const { S } = this

            const xx = () => {

                const 多出 = 12

                S.left = pure.toRange({ min: -多出, max: getLength() - 多出, value: S.left })

                if (S.right <= S.left + 多出) {
                    S.right = S.left + 多出
                }

                S.right = pure.toRange({ min: 多出, max: getLength() + 多出, value: S.right })

                // p.onChange(S.left, S.right)
            }

            let isDown = false
            let startX = 0
            let startLeft = 0
            let startRight = 0

            window.addEventListener('keydown', e => {
                if (e.keyCode === 37) {
                    S.left--
                    S.right--
                    xx()
                }
                if (e.keyCode === 39) {
                    S.left++
                    S.right++
                    xx()
                }
            })

            window.addEventListener('mousewheel', (e: any) => {

                const count = S.right - S.left
                const d = e['wheelDelta'] / 120 * (count * 0.05)

                const n = 1//startX / (document.body.clientWidth - theme.CHART_RIGHT_WIDTH)


                S.left += d * n
                S.right -= d * (1 - n)

                xx()

                startX = e['clientX']
                startLeft = S.left
                startRight = S.right
            })

            window.addEventListener('mousedown', e => {
                if (e.button === 0 && this.开关) {
                    isDown = true
                    startX = e.clientX
                    startLeft = S.left
                    startRight = S.right
                }
            })


            window.addEventListener('mouseup', e => {
                if (e.button === 0) {
                    isDown = false
                }
            })

            window.addEventListener('mousemove', e => {
                if (isDown) {
                    S.left = startLeft - (startRight - startLeft) * (e.clientX - startX) / (document.body.clientWidth - theme.CHART_RIGHT_WIDTH)
                    S.right = startRight - (startRight - startLeft) * (e.clientX - startX) / (document.body.clientWidth - theme.CHART_RIGHT_WIDTH)
                    xx()
                }
            })
        }
    }
}
