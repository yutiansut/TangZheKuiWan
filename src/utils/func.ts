import { BaseType } from '../app/BaseType'
import { pure } from './pure'

export namespace func {

    export const toBuySellPriceFunc = (side: BaseType.Side, f: () => number) => {
        let ret = NaN
        return () => {
            const n = f()
            ret = isNaN(ret) ? n : (side === 'Sell' ? Math.max(ret, n) : Math.min(ret, n))
            return ret
        }
    }

    export const toPriceAlign = ({ grid, side, value }: {
        grid: number
        side: BaseType.Side
        value: number
    }) =>
        pure.fixFloat((side === 'Buy' ? Math.floor : Math.ceil)(value / grid) * grid)


   

    export const 盘口map = (v: any) => ({
        price: Number(v[0]),
        size: Number(v[1]),
    })


}