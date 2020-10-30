import { BitMEXMessage } from './BitMEXMessage'
import { BaseType } from '../app/BaseType'
import { Subject } from 'rxjs'

type OrderBook10 = {
    symbol: string
    bids: [number, number][]
    asks: [number, number][]
    timestamp: string
}

type SubscribeThemeMap = {
    //public
    'announcement': BitMEXMessage.Announcement
    'chat': BitMEXMessage.Chat
    'connected': BitMEXMessage.ConnectedUsers
    'funding': BitMEXMessage.Funding
    'instrument': BitMEXMessage.Instrument
    'insurance': BitMEXMessage.Insurance
    'liquidation': BitMEXMessage.Liquidation
    'orderBookL2': BitMEXMessage.OrderBookL2
    'orderBook10': OrderBook10
    'publicNotifications': BitMEXMessage.GlobalNotification
    'quote': BitMEXMessage.Quote
    'quoteBin1m': BitMEXMessage.Quote
    'quoteBin5m': BitMEXMessage.Quote
    'quoteBin1h': BitMEXMessage.Quote
    'quoteBin1d': BitMEXMessage.Quote
    'settlement': BitMEXMessage.Settlement
    'trade': BitMEXMessage.Trade
    'tradeBin1m': BitMEXMessage.TradeBin
    'tradeBin5m': BitMEXMessage.TradeBin
    'tradeBin1h': BitMEXMessage.TradeBin
    'tradeBin1d': BitMEXMessage.TradeBin

    //private
    'affiliate': BitMEXMessage.Affiliate
    'execution': BitMEXMessage.Execution
    'order': BitMEXMessage.Order
    'margin': BitMEXMessage.Margin
    'position': BitMEXMessage.Position
    'privateNotifications': BitMEXMessage.GlobalNotification
    'transact': BitMEXMessage.Transaction
    'wallet': BitMEXMessage.Wallet[]
}

export type SubscribeTheme = keyof SubscribeThemeMap

type TableAndData = {
    [T in SubscribeTheme]: {
        table: T
        data: SubscribeThemeMap[T][]
    }
}[SubscribeTheme]

type Action = 'partial' | 'update' | 'insert' | 'delete'

export type FrameData = TableAndData & {
    action: Action
    keys?: string[]
}




//TODO
const createItem = () => ({
    仓位数量: 0,
})
const XXX = createItem()
export class WSData {

    subject = {
        filled: new Subject<{
            symbol: BaseType.BitmexSymbol
            side: BaseType.Side
            price: number
            size: number
            type: '限价' | '限价只减仓' | '止损' | '强平'
        }>(),
        frameData: new Subject<FrameData>(),
        isConnected: new Subject<boolean>(),
    }

    filledOrder = new Map<string, boolean>()
    filledExecution = new Map<string, boolean>()

    deleteOrder(v: BitMEXMessage.Order, key: string) {
        if (v.ordStatus === 'Rejected' || v.ordStatus === 'Canceled' || v.ordStatus === 'Filled') {
            this.delete({ key, table: 'order' })
            if (v.ordStatus === 'Filled') {
                this.filledOrder.set(key, true)
            }
        }
    }

    deleteExecution(v: BitMEXMessage.Execution, key: string) {
        if (v.ordStatus === 'Filled') {
            this.delete({ key, table: 'execution' })
            this.filledExecution.set(key, true)
        }
    }



    //可变数据  直接修改 

    新成交(v: { symbol: string, side: string, 已经成交?: number, cumQty: number, text: string }) {
        if (v.已经成交 === undefined) {
            v.已经成交 = 0
        }

        const 新成交 = v.cumQty - v.已经成交

        if (新成交 > 0) {
            v.已经成交 = v.cumQty
            this.仓位数量.update(v.symbol as BaseType.BitmexSymbol, 新成交 * (v.side === 'Buy' ? 1 : -1))
        }
    }

    onOrder(order: BitMEXMessage.Order) {
        this.新成交(order)

        if (order.ordType === 'Limit' && order.execInst === 'ParticipateDoNotInitiate,ReduceOnly' && order.ordStatus === 'Filled') {
            this.subject.filled.next({
                symbol: order.symbol as BaseType.BitmexSymbol,
                side: order.side as BaseType.Side,
                price: order.price,
                size: order.orderQty,
                type: '限价只减仓',
            })
        }
        else if (order.ordType === 'Stop' && order.execInst === 'Close,LastPrice' && order.ordStatus === 'Filled') {
            this.subject.filled.next({
                symbol: order.symbol as BaseType.BitmexSymbol,
                side: order.side as BaseType.Side,
                price: order.stopPx, //<-------------------------------------------------??
                size: order.orderQty,
                type: '止损',
            })
        }
        else if (order.ordType === 'Limit' && order.ordStatus === 'Filled') {
            this.subject.filled.next({
                symbol: order.symbol as BaseType.BitmexSymbol,
                side: order.side as BaseType.Side,
                price: order.price,
                size: order.orderQty,
                type: '限价',
            })
        }
    }

    onExecution(execution: BitMEXMessage.Execution) {
        if (execution.ordType === 'StopLimit') {
            this.新成交(execution)
            this.subject.filled.next({
                symbol: execution.symbol as BaseType.BitmexSymbol,
                side: execution.side as BaseType.Side,
                price: execution.stopPx, //<--------------------------------------------??
                size: execution.orderQty,//<--------------------------------------------??
                type: '强平',
            })
        }
    }




    //________________________________________________//
    private dic = new Map<BaseType.BitmexSymbol, typeof XXX>()
    private xxx = (key: keyof typeof XXX) => ({
        partial: (symbol: BaseType.BitmexSymbol, n: number) => {
            const obj = this.dic.get(symbol) as any
            if (obj !== undefined) {
                obj[key] = n
            }
            else {
                const obj = createItem()
                obj[key] = n
                this.dic.set(symbol, obj)
            }
            // (`增量同步数据 ${symbol} ${key} partial ${n}`)
        },
        update: (symbol: BaseType.BitmexSymbol, n: number) => {
            const obj = this.dic.get(symbol) as any
            if (obj !== undefined) {
                obj[key] += n
            }
            else {
                const obj = createItem()
                obj[key] = n
                this.dic.set(symbol, obj)
            }
            // (`增量同步数据 ${symbol}  ${key} update to ${this.dic.get(symbol)![key]}`)
        },
        get: (symbol: BaseType.BitmexSymbol) => {
            const obj = this.dic.get(symbol)
            if (obj !== undefined) {
                return obj[key] as number
            }
            else {
                return 0
            }
        },
    })
    仓位数量 = this.xxx('仓位数量')
    //________________________________________________//

    clearAll() {
        this.__ = {}
        this.filledOrder = new Map<string, boolean>()
        this.filledExecution = new Map<string, boolean>()
    }

    clear(table: SubscribeTheme) {
        const map = this.getMap(table)
        map.clear()
    }

    insert<T extends SubscribeTheme>(p: { key: string, table: T, data: SubscribeThemeMap[T] }) {
        const map = this.getMap(p.table)
        map.set(p.key, p.data)
    }

    update<T extends SubscribeTheme>(p: { key: string, table: T, data: SubscribeThemeMap[T] }) {
        const map = this.getMap(p.table)
        const v = map.get(p.key) || {}
        map.set(p.key, { ...v, ...p.data })
    }

    delete<T extends SubscribeTheme>(p: { key: string, table: T }) {
        const map = this.getMap(p.table)
        map.delete(p.key)
    }

    private __: { [key: string]: any } = {}
    getMap<T extends SubscribeTheme>(table: T): Map<string, SubscribeThemeMap[T]> {
        if (this.__[table] === undefined) {
            this.__[table] = new Map()
        }
        return this.__[table]
    }
}