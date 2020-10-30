import { JSONSync } from '../utils/JSONSync'
import { BaseType } from '../app/BaseType'
import { BitmexQuotes } from './BitmexQuotes'
import { BinanceQuotes } from './BinanceQuotes'
import { toPairs } from 'ramda'
import { pure } from '../utils/pure'
import { TA } from '../utils/TA'
import { sum } from 'ramda'
import { 普通K } from '../utils/普通K'
import { Quotes } from './Quotes'
import { userConfig } from '../userConfig'
const 单位时间 = 500

const 全部指标 = ({ data, orderBook, 持仓量arr }: {
    data: BaseType.KLine__废弃[]
    orderBook: BaseType.OrderBook[]
    持仓量arr: { id: number, 持仓量: number }[]
}, 盘口算价格: boolean) => {

    const 收盘价 = TA.map(() => data.length, i => data[i].close)

    //orderBook[i] && orderBook[i].buy  ??
    const 盘口价格 = TA.map(() => orderBook.length, i =>
        (orderBook[i] && orderBook[i].buy && orderBook[i].buy.length > 0 && orderBook[i].sell && orderBook[i].sell.length > 0) ?
            ((orderBook[i].buy[0].price + orderBook[i].sell[0].price) / 2) : NaN)


    const 价格 = 盘口算价格 ? 盘口价格 : 收盘价
    const 最高 = TA.map(() => data.length, i => data[i].high)
    const 最低 = TA.map(() => data.length, i => data[i].low)

    const 最高_10 = TA.MAX(最高, 10, 单位时间)
    const 最低_10 = TA.MIN(最低, 10, 单位时间)
    const 最高_10减最低_10 = TA.map(() => data.length, i => 最高_10[i] - 最低_10[i])

    //100w
    const 持仓量_M = TA.map(() => 持仓量arr.length, i => Number(持仓量arr[i].持仓量) / 1000000)

    const 波动率_60 = TA.波动率(价格, 60)

    const 时间 = TA.map(() => data.length, i => pure.timeID.xx_ms(RealData旧.单位时间).toTimestamp(data[i].id))

    const 成交量买 = TA.map(() => data.length, i => data[i].buySize)
    const 成交量卖 = TA.map(() => data.length, i => data[i].sellSize)

    const 盘口买5档量 = TA.map(() => orderBook.length, i => sum(orderBook[i].buy.slice(0, 5).map(v => v.size)))
    const 盘口卖5档量 = TA.map(() => orderBook.length, i => sum(orderBook[i].sell.slice(0, 5).map(v => v.size)))


    const 买盘口_10S最高 = TA.MAX(盘口买5档量, 10, 单位时间)
    const 卖盘口_10S最高 = TA.MAX(盘口卖5档量, 10, 单位时间)

    const 盘口买1量 = TA.map(() => orderBook.length, i => orderBook[i].buy.length > 0 ? orderBook[i].buy[0].size : NaN)
    const 盘口卖1量 = TA.map(() => orderBook.length, i => orderBook[i].sell.length > 0 ? orderBook[i].sell[0].size : NaN)

    const 盘口买1价 = TA.map(() => orderBook.length, i => orderBook[i].buy.length > 0 ? orderBook[i].buy[0].price : NaN)
    const 盘口卖1价 = TA.map(() => orderBook.length, i => orderBook[i].sell.length > 0 ? orderBook[i].sell[0].price : NaN)

    const 买成交量_累加30 = TA.累加(
        TA.map(
            () => data.length,
            i => (data[i].buySize),
        ),
        30,
        RealData旧.单位时间)
    const 卖成交量_累加30 = TA.累加(
        TA.map(
            () => data.length,
            i => (data[i].sellSize),
        ),
        30,
        RealData旧.单位时间)
    const 买成交量_累加全部 = TA.累加全部(成交量买)
    const 卖成交量_累加全部 = TA.累加全部(成交量卖)

    const 净OBV = TA.map(
        () => 买成交量_累加全部.length,
        i => 买成交量_累加全部[i] - 卖成交量_累加全部[i],
    )

    const 成交量_累加30 = TA.累加(
        TA.map(
            () => data.length,
            i => (data[i].buySize + data[i].sellSize),
        ),
        30,
        RealData旧.单位时间)

    const 买成交量_累加10 = TA.累加(
        TA.map(
            () => data.length,
            i => (data[i].buySize),
        ),
        10,
        RealData旧.单位时间)
    const 卖成交量_累加10 = TA.累加(
        TA.map(
            () => data.length,
            i => (data[i].sellSize),
        ),
        10,
        RealData旧.单位时间)


    const 净盘口 = TA.map(
        () => Math.min(盘口买5档量.length, 盘口卖5档量.length),
        i => 盘口买5档量[i] - 盘口卖5档量[i],
    )

    return {
        净OBV,
        时间,
        买成交量_累加30,
        卖成交量_累加30,
        买成交量_累加10,
        卖成交量_累加10,
        买盘口_10S最高,
        卖盘口_10S最高,
        买: {
            盘口1价: 盘口买1价,
            盘口1量: 盘口买1量,

            盘口5档量: 盘口买5档量,
            盘口5档量_负数: TA.map(() => 盘口买5档量.length, i => -盘口买5档量[i]),

            净盘口,
            净盘口_均线3: TA.SMA(净盘口, 3, RealData旧.单位时间),
        },
        卖: {
            盘口1价: 盘口卖1价,
            盘口1量: 盘口卖1量,
            盘口5档量: 盘口卖5档量,
            盘口5档量_负数: TA.map(() => 盘口卖5档量.length, i => -盘口卖5档量[i]),
        },
        成交量_累加30,
        kline: data,
        价格,
        持仓量: 持仓量_M,
        波动率_60,
        最高_10减最低_10,
    }
}

const createItem = () => ({
    data: [] as BaseType.KLine__废弃[],
    orderBook: [] as BaseType.OrderBook[],

    //bitmex XBTUSD 才有
    持仓量arr: [] as { id: number, 持仓量: number }[],
})

export class RealData旧 {

    //________________________________________________________________________________________________//
    protected jsonSync = new JSONSync(
        {
            startTick: 0,
            // ctp: pure.mapKV(createItem, BaseType.CTPSymbolDic),
            bitmex: pure.mapKV(createItem, BaseType.BitmexSymbolDic),
            binance: pure.mapKV(createItem, BaseType.BinanceSymbolDic),
        }
    )

    CREATE = () => {

        // const ctp = pure.mapKV((v, k) => 全部指标(this.data.ctp[k], false), BaseType.CTPSymbolDic)
        const bitmex = pure.mapKV((v, k) => 全部指标(this.data.bitmex[k], true), BaseType.BitmexSymbolDic)
        const binance = pure.mapKV((v, k) => 全部指标(this.data.binance[k], false), BaseType.BinanceSymbolDic)


        //
        const BTC差价 = TA.map(
            () => Math.min(binance.btcusdt.价格.length, bitmex.XBTUSD.价格.length),
            i => binance.btcusdt.价格[i] - bitmex.XBTUSD.价格[i],
        )
        const BTC差价MACD = TA.macd(BTC差价)
        const 币安MACD = TA.macd(binance.btcusdt.价格)
        const BTC60s平均差价 = TA.SMA(BTC差价, 30, RealData旧.单位时间)
        const BTC360s平均差价 = TA.SMA(BTC差价, 180, RealData旧.单位时间)
        const BTC60s平均差价__减去__360s平均差价 = TA.map(
            () => Math.min(BTC60s平均差价.length, BTC360s平均差价.length),
            i => BTC60s平均差价[i] - BTC360s平均差价[i],
        )
        const 联动 = {
            BTC差价,
            BTC60s平均差价,
            BTC360s平均差价,
            BTC60s平均差价__减去__360s平均差价,
            BTC差价MACD,
            币安MACD
        }
        return {
            // ctp, 
            bitmex, binance, 联动,
        }

    }

    dataExt = this.CREATE()

    重新初始化 = () => this.dataExt = this.CREATE()

    getTradeAndOrderBookArr = () => toPairs({
        bitmex: new BitmexQuotes(),
        binance: new BinanceQuotes(),
    })

    static 单位时间 = userConfig.单位时间 || 500

    protected get data() {
        return this.jsonSync.rawData
    }


    private RDSArr: [string, Quotes<any>][]

    onTitle = (str: string) => { }


    private on着笔Dic = Object.create(null) as {
        [symbol: string]: 普通K<BaseType.KLine__废弃>
    }

    private on着笔(p: {
        key: string
        xxxxxxxx: {
            ____push: (v: BaseType.KLine__废弃) => void
            ____updateLast: (v: BaseType.KLine__废弃) => void
        }
        timestamp: number
        side: BaseType.Side
        price: number
        size: number
        成交性质?: BaseType.成交性质Type
    }) {

        const tick = Math.floor(p.timestamp / RealData旧.单位时间)

        if (this.data.startTick === 0) {
            this.jsonSync.data.startTick.____set(tick)
        }


        //500ms
        if (this.on着笔Dic[p.key] === undefined) {
            this.on着笔Dic[p.key] = new 普通K<BaseType.KLine__废弃>({
                open: '开',
                high: '高',
                low: '低',
                close: '收',
                buySize: '累加',
                buyCount: '累加',
                sellSize: '累加',
                sellCount: '累加',
                成交性质: '收',
            })

            this.on着笔Dic[p.key].onNew = item => p.xxxxxxxx.____push(item)
            this.on着笔Dic[p.key].onUpdate = item => p.xxxxxxxx.____updateLast(item)
            this.on着笔Dic[p.key].input({
                id: this.data.startTick,
                open: NaN,
                high: NaN,
                low: NaN,
                close: NaN,
                //
                buySize: 0,
                buyCount: 0,
                sellSize: 0,
                sellCount: 0,
                成交性质: '不知道',
            })
        }

        this.on着笔Dic[p.key].input({
            id: tick,
            open: p.price,
            high: p.price,
            low: p.price,
            close: p.price,
            buySize: p.side === 'Buy' ? p.size : 0,
            buyCount: p.side === 'Buy' ? 1 : 0,
            sellSize: p.side === 'Sell' ? p.size : 0,
            sellCount: p.side === 'Sell' ? 1 : 0,
            成交性质: p.成交性质,
        })
    }

    private on盘口Dic = Object.create(null) as {
        [symbol: string]: 普通K<BaseType.OrderBook>
    }

    private on盘口(p: {
        key: string
        xxxxxxxx: {
            ____push: (v: BaseType.OrderBook) => void
            ____updateLast: (v: BaseType.OrderBook) => void
        }
        timestamp: number
        orderBook: BaseType.OrderBook
    }) {
        const tick = Math.floor(p.timestamp / RealData旧.单位时间)

        if (this.data.startTick === 0) {
            this.jsonSync.data.startTick.____set(tick)
        }

        if (this.on盘口Dic[p.key] === undefined) {
            this.on盘口Dic[p.key] = new 普通K<BaseType.OrderBook>({
                buy: '最新',
                sell: '最新',
            })
            this.on盘口Dic[p.key].onNew = item => p.xxxxxxxx.____push(item)
            this.on盘口Dic[p.key].onUpdate = item => p.xxxxxxxx.____updateLast(item)
            this.on盘口Dic[p.key].input({
                id: this.data.startTick,
                buy: [],
                sell: [],
            })
        }

        this.on盘口Dic[p.key].input(p.orderBook)
    }

    XBTUSD持仓量Dic = Object.create(null) as {
        [symbol: string]: 普通K<{ id: number, 持仓量: number }>
    }

    private on持仓量(p: {
        timestamp: number
        持仓量: number
    }) {
        const tick = Math.floor(p.timestamp / RealData旧.单位时间)

        if (this.data.startTick === 0) {
            this.jsonSync.data.startTick.____set(tick)
        }

        if (this.XBTUSD持仓量Dic['XBTUSD'] === undefined) {
            this.XBTUSD持仓量Dic['XBTUSD'] = new 普通K({
                持仓量: '最新',
            })
            this.XBTUSD持仓量Dic['XBTUSD'].onNew = item => this.jsonSync.data.bitmex.XBTUSD.持仓量arr.____push(item)
            this.XBTUSD持仓量Dic['XBTUSD'].onUpdate = item => this.jsonSync.data.bitmex.XBTUSD.持仓量arr.____updateLast(item)
            this.XBTUSD持仓量Dic['XBTUSD'].input({
                id: this.data.startTick,
                持仓量: p.持仓量,
            })
        }

        this.XBTUSD持仓量Dic['XBTUSD'].input({
            id: tick,
            持仓量: p.持仓量,
        })
    }

    constructor() {
        this.RDSArr = this.getTradeAndOrderBookArr()
        this.重新初始化()//<-----------fix  

        let xxx: { [key: string]: boolean } = {}
        const onTitle = () => this.onTitle(JSON.stringify(xxx))

        this.RDSArr.forEach(([name, xx]) => {
            xx.subject.status.subscribe(v => {
                xxx[name] = v.isConnected
                onTitle()
            })
        })

        this.RDSArr.forEach(([name, v]) => {

            v.subject.trade.subscribe(({ symbol, timestamp, side, size, price }) => {

                this.on着笔({
                    key: name + '_' + symbol,
                    xxxxxxxx: this.jsonSync.data[name as 'bitmex'][symbol as 'XBTUSD'].data,
                    timestamp,
                    side: side as BaseType.Side,
                    size,
                    price,
                })

                const { orderBook } = this.data[name as 'bitmex'][symbol as 'XBTUSD']

                if (orderBook.length > 0 &&
                    orderBook[orderBook.length - 1].buy.length > 0 &&
                    orderBook[orderBook.length - 1].sell.length > 0) {

                }
            })


            v.subject.orderBook.subscribe(({ symbol, timestamp, buy, sell }) => {

                this.on盘口({
                    key: name + '_' + symbol,
                    xxxxxxxx: this.jsonSync.data[name as 'bitmex'][symbol as 'XBTUSD'].orderBook,
                    timestamp,
                    orderBook: {
                        id: Math.floor(timestamp / RealData旧.单位时间),
                        buy,
                        sell,
                    }
                })
            })

            v.subject.XBTUSD持仓量.subscribe(v => {
                this.on持仓量(v)
            })
        })
    }
}