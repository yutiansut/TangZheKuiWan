import { BaseType } from '../app/BaseType'
import { BitMEXHTTP } from '../BitMEXSDK/BitMEXHTTP'
import { BitMEXWS } from '../BitMEXSDK/BitMEXWS'
import { pure } from '../utils/pure'
import { io } from '../utils/io'
import { BitMEXCreateJSONSync } from './BitMEXCreateJSONSync'
import { BitMEXMessage } from '../BitMEXSDK/BitMEXMessage'
import { 本地存储 } from '../utils/本地存储'

//TODO bianance 
//TODO ctp
export type BitMEXPositionAndOrderTask = {
    参数type: any
    xxxxxxxxxxxxx: {
        开关: boolean
        参数: { [key: string]: any } //可变数据 只能一层
    }
    run(self: BitMEXPositionAndOrder): void
}

export const BitMEXcreateTask = <T extends { [key: string]: any }>(参数type: T, f: (self: BitMEXPositionAndOrder, xxxxxxxxxxxxx: { 开关: boolean, 参数: T }) => void) => {

    const xxxxxxxxxxxxx = {
        开关: false,
        参数: pure.toType(参数type)({}),
    }

    const obj: BitMEXPositionAndOrderTask = {
        参数type,
        xxxxxxxxxxxxx,
        run: (self: BitMEXPositionAndOrder) => {
            f(self, xxxxxxxxxxxxx)
        }
    }

    return obj
}

const 重试几次 = 3
const 重试休息多少毫秒 = 5

export class BitMEXPositionAndOrder {

    private cookie: string
    private 本地存储: 本地存储<{
        time: number
        total: number
        XBTUSD仓位数量: number
    }>

    ws: BitMEXWS


    get本地维护仓位数量(symbol: BaseType.BitmexSymbol) {
        return this.ws.wsData.仓位数量.get(symbol)
    }

    jsonSync = BitMEXCreateJSONSync()


    bitmex_初始化 = {
        仓位: false,
        委托: false,
    }

    constructor(p: { accountName: string, cookie: string }) {
        this.cookie = p.cookie
        this.本地存储 = new 本地存储(`.__${p.accountName}__.json`)

        this.ws = new BitMEXWS(p.cookie, [
            { theme: 'margin' },
            { theme: 'position' },
            { theme: 'order' },

            //这样订阅2次 服务器返回有问题
            // { theme: 'position', filter: 'XBTUSD' },
            // { theme: 'order', filter: 'XBTUSD' },
            // { theme: 'position', filter: 'ETHUSD' },
            // { theme: 'order', filter: 'ETHUSD' }, 
        ])

        this.ws.wsData.subject.isConnected.subscribe(isConnected => {
            this.jsonSync.data.ws.____set(isConnected)
            this.bitmex_初始化 = {
                仓位: false,
                委托: false,
            }
        })

        this.ws.wsData.subject.frameData.subscribe(frame => {

            if (frame.table === 'margin') {
                this.updateMargin()
            }
            if (frame.table === 'position') {
                this.bitmex_初始化.仓位 = true
                this.updatePosition()
            }
            else if (frame.table === 'order') {
                this.bitmex_初始化.委托 = true
                this.updateOrder()
            }
        })

        this.read资金曲线()
    }


    private read资金曲线() {
        this.jsonSync.data.wallet.____set(this.本地存储.read())
    }

    private push资金曲线(obj: { time: number, total: number, XBTUSD仓位数量: number }) {
        this.本地存储.push(obj)
        this.jsonSync.data.wallet.____push(obj)
    }

    private updateMargin() {
        this.ws.wsData.getMap('margin').forEach(({ walletBalance, timestamp }) => {
            const { wallet } = this.jsonSync.rawData
            if (wallet.length === 0 || wallet[wallet.length - 1].total !== walletBalance) {
                this.push资金曲线({
                    time: new Date(timestamp).getTime(),
                    total: walletBalance,
                    XBTUSD仓位数量: this.jsonSync.rawData.market.bitmex.XBTUSD.仓位数量,
                })
            }
        })
    }

    private updatePosition() {
        ['XBTUSD' as 'XBTUSD', 'ETHUSD' as 'ETHUSD'].forEach(symbol => {
            this.ws.wsData.getMap('position').forEach(item => {
                if (item.symbol === symbol) {
                    const { 仓位数量, 开仓均价, 强平价格 } = this.jsonSync.data.market.bitmex[symbol]
                    const raw = this.jsonSync.rawData.market.bitmex[symbol]
                    if (item !== undefined) {
                        if (raw.仓位数量 !== item.currentQty || raw.开仓均价 !== Number(item.avgEntryPrice) || raw.强平价格 !== Number(item.liquidationPrice)) {
                            仓位数量.____set(item.currentQty)
                            开仓均价.____set(Number(item.avgEntryPrice)) //<---------------------------null to 0
                            强平价格.____set(Number(item.liquidationPrice)) //null to 0
                            io.log(`仓位更新: ${symbol} 开仓均价:${Number(item.avgEntryPrice)} 仓位数量:${item.currentQty} 强平价格:${item.liquidationPrice}  本地维护仓位数量:${this.ws.wsData.仓位数量.get(symbol)}  开仓均价:${item.avgEntryPrice}`)
                        }
                    } else {
                        if (raw.仓位数量 !== 0 || raw.开仓均价 !== 0 || raw.强平价格 !== 0) {
                            仓位数量.____set(0)
                            开仓均价.____set(0)
                            强平价格.____set(0)
                            io.log(`仓位更新: ${symbol} 仓位数量:0  本地维护仓位数量:${this.ws.wsData.仓位数量.get(symbol)}`)
                        }
                    }
                }
            })

        })
    }

    private updateOrder() {

        pure.keys(this.jsonSync.rawData.market.bitmex).forEach(symbol => {

            const arr = [] as {
                type: '限价' | '限价只减仓' | '止损'
                timestamp: number
                id: string
                side: BaseType.Side
                cumQty: number
                orderQty: number
                price: number
            }[]

            this.ws.wsData.getMap('order').forEach(v => {
                if (v.symbol === symbol) {
                    if (v.ordType === 'Limit' && v.execInst === 'ParticipateDoNotInitiate,ReduceOnly' && v.workingIndicator) {//先检测只减仓
                        arr.push({
                            type: '限价只减仓',
                            timestamp: new Date(v.timestamp).getTime(),
                            id: v.orderID,
                            side: v.side as BaseType.Side,
                            cumQty: v.cumQty,
                            orderQty: v.orderQty,
                            price: v.price,
                        })
                    }
                    else if (v.ordType === 'Limit' /*&& v.execInst === 'ParticipateDoNotInitiate'*/ && v.workingIndicator) { //不勾被动委托也行
                        arr.push({
                            type: '限价',
                            timestamp: new Date(v.timestamp).getTime(),
                            id: v.orderID,
                            side: v.side as BaseType.Side,
                            cumQty: v.cumQty,
                            orderQty: v.orderQty,
                            price: v.price,
                        })
                    }
                    else if (v.ordType === 'Stop' && v.execInst === 'Close,LastPrice') {
                        arr.push({
                            type: '止损',
                            timestamp: new Date(v.timestamp).getTime(),
                            id: v.orderID,
                            side: v.side as BaseType.Side,
                            cumQty: v.cumQty,
                            orderQty: v.orderQty,
                            price: v.stopPx,
                        })
                    }
                }
            })
            this.jsonSync.data.market.bitmex[symbol].委托列表.____set(arr)

            if (symbol === 'XBTUSD') {
                io.log(`委托列表_更新 ${JSON.stringify(arr, null, 4)}`)
            }
        })
    }

    private insertOrder = (arr: BitMEXMessage.Order[]) => {
        //TODO  ws insert  -->  ws delete  -->  this insert ???
        io.log(`onAction__start`)
        this.ws.onAction({
            action: 'insert',
            table: 'order',
            data: arr,
        })
        io.log(`onAction__end`)
    }

    private DDOSCALL = <P extends any>(f: (p: P) => Promise<boolean>) =>
        async (p: P, logText = '') => {
            let success = false
            for (let i = 1; i <= 重试几次; i++) {
                success = await f(p)
                if (success) break
                await io.waitFor(重试休息多少毫秒)
            }
            if (logText !== '') io.log(`${logText} ${success ? '成功' : '失败'}`)
            return success
        }



    newOrder = this.DDOSCALL<() => {
        symbol: BaseType.BitmexSymbol
        side: BaseType.Side
        size: number
        price: number
        type: 'taker' | 'maker' | 'maker_and_reduceOnly' | 'taker_and_reduceOnly'
        text: string
    }>(
        async f => {
            const p = f()
            const ret = await BitMEXHTTP.Order.new(this.cookie, {
                symbol: p.symbol,
                ordType: 'Limit',
                side: p.side,
                orderQty: p.size,
                price: p.price,
                execInst: {
                    'taker': undefined,
                    'maker': 'ParticipateDoNotInitiate',
                    'maker_and_reduceOnly': 'ParticipateDoNotInitiate,ReduceOnly',
                    'taker_and_reduceOnly': 'ReduceOnly',
                }[p.type] as any,
                text: p.text,
            })
            if (ret.data && ret.data.ordStatus !== 'Rejected' && ret.data.ordStatus !== 'Canceled') {
                this.insertOrder([ret.data])
                return true
            } else {
                return false
            }
        }
    )

    makerBulk = this.DDOSCALL<{
        symbol: BaseType.BitmexSymbol
        arr: { side: BaseType.Side, price: number, size: number, reduceOnly: boolean }[]
    }>(
        async p => {
            const ret = await BitMEXHTTP.Order.newBulk(this.cookie, {
                orders: JSON.stringify(p.arr.map(v =>
                    ({
                        symbol: p.symbol,
                        ordType: 'Limit',
                        side: v.side,
                        orderQty: v.size,
                        price: v.price,
                        execInst: (v.reduceOnly ? 'ParticipateDoNotInitiate,ReduceOnly' : 'ParticipateDoNotInitiate') as any,
                    })
                ))
            })
            if (ret.data) {
                this.insertOrder(ret.data)
                return true
            } else {
                return false
            }
        }
    )

    stopBulk = this.DDOSCALL<{
        symbol: BaseType.BitmexSymbol
        arr: { side: BaseType.Side, price: number }[]
    }>(
        async p => {
            const ret = await BitMEXHTTP.Order.newBulk(this.cookie, {
                orders: JSON.stringify(p.arr.map(v =>
                    ({
                        symbol: p.symbol,
                        ordType: 'Stop',
                        stopPx: v.price,
                        orderQty: 100000,
                        side: v.side,
                        execInst: 'Close,LastPrice' as any,
                    })
                ))
            })
            if (ret.data) {
                this.insertOrder(ret.data)
                return true
            } else {
                return false
            }
        }
    )

    stop = this.DDOSCALL<{
        symbol: BaseType.BitmexSymbol
        side: BaseType.Side
        price: number
    }>(
        async p => {
            const ret = await BitMEXHTTP.Order.new(this.cookie, {
                symbol: p.symbol,
                ordType: 'Stop',
                stopPx: p.price,
                orderQty: 100000,
                side: p.side,
                execInst: 'Close,LastPrice' as any,
            })
            if (ret.data) {
                this.insertOrder([ret.data])
                return true
            } else {
                return false
            }
        }
    )

    updateStop = this.DDOSCALL<{
        orderID: string
        price: number
    }>(
        async p => {
            const ret = await BitMEXHTTP.Order.amend(this.cookie, {
                orderID: p.orderID,
                stopPx: p.price,
            })
            if (ret.data) {
                this.insertOrder([ret.data])
                return true
            } else {
                return false
            }
        }
    )

    updateMaker = this.DDOSCALL<{
        orderID: string
        price: () => number
        size: number
    }>(
        async p => {
            const ret = await BitMEXHTTP.Order.amend(this.cookie, {
                orderID: p.orderID,
                price: p.price(),
                orderQty: p.size,
            })
            if (ret.data) {
                this.insertOrder([ret.data])
                return true
            } else {
                return false
            }
        }
    )

    close = this.DDOSCALL<{
        symbol: BaseType.BitmexSymbol
        text: string
    }>(
        async p => {
            const ret = await BitMEXHTTP.Order.new(this.cookie, {
                symbol: p.symbol,
                ordType: 'Market',
                execInst: 'Close',
                text: p.text,
            })
            if (ret.data) {
                this.insertOrder([ret.data])
                return true
            } else {
                return false
            }
        }
    )

    cancel = this.DDOSCALL<{
        orderID: string[]
    }>(
        async p => {
            const ret = await BitMEXHTTP.Order.cancel(this.cookie, { orderID: JSON.stringify(p.orderID) })
            if (ret.data) {
                this.insertOrder(ret.data)
                return true
            } else {
                return false
            }
        }
    )



    private taskDic = new Map<string, BitMEXPositionAndOrderTask>()

    runTask(arr: { name: string, task: BitMEXPositionAndOrderTask }[]) {
        arr.forEach(v => this.runTask1(v.name, v.task))
    }

    private runTask1(name: string, task: BitMEXPositionAndOrderTask) {
        this.taskDic.set(name, task)

        task.run(this)

        this.刷新到jsonsync任务()
    }

    set_任务_开关(p: { 名字: string, 开关: boolean }) {
        const task = this.taskDic.get(p.名字)
        if (task !== undefined) {
            task.xxxxxxxxxxxxx.开关 = p.开关
            this.刷新到jsonsync任务()
        }
    }

    set_任务_参数(p: { 名字: string, 参数: string }) {
        const task = this.taskDic.get(p.名字)
        if (task !== undefined) {
            const obj = pure.toType(task.参数type)({ ...task.xxxxxxxxxxxxx.参数, ...pure.safeJSONParse(p.参数) })
            for (let key in obj) {
                task.xxxxxxxxxxxxx.参数[key] = obj[key]
            }
            this.刷新到jsonsync任务()
        }
    }


    刷新到jsonsync任务() {
        let arr = [] as { 名字: string, 开关: boolean, 参数: string }[]
        this.taskDic.forEach((v, k) => {
            arr.push({
                名字: k,
                开关: v.xxxxxxxxxxxxx.开关,
                参数: JSON.stringify(v.xxxxxxxxxxxxx.参数)
            })
        })
        this.jsonSync.data.任务.____set(arr)
    }
}