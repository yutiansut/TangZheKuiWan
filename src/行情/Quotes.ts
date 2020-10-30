import { BaseType } from '../app/BaseType'
import { Subject } from 'rxjs'

export class Quotes<T extends string = string> {
    subject = {
        status: new Subject<{
            isConnected: boolean
        }>(),

        trade: new Subject<{
            symbol: T
            timestamp: number
            side: BaseType.Side
            size: number
            price: number
            成交性质?: BaseType.成交性质Type
        }>(),

        orderBook: new Subject<{
            symbol: T
            timestamp: number
            buy: {
                price: number
                size: number
            }[]
            sell: {
                price: number
                size: number
            }[]
        }>(),

        XBTUSD持仓量: new Subject<{
            timestamp: number
            持仓量: number
        }>(),
    }
}