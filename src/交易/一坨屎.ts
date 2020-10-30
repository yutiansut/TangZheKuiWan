import { BitMEXWS } from '../BitMEXSDK/BitMEXWS'
import { pure } from '../utils/pure'
import { BaseType } from '../app/BaseType'
import { func } from '../utils/func'


class MiniRealData {

    //1秒1个
    private dic = pure.mapKV(() => [] as BaseType.OrderBook[], BaseType.BitmexSymbolDic)

    constructor() {

    }

    in盘口 = (p: {
        symbol: BaseType.BitmexSymbol
        timestamp: number
        buy: {
            price: number;
            size: number;
        }[]
        sell: {
            price: number;
            size: number;
        }[]
    }) => {
        const pk = this.dic[p.symbol]
        const id = pure.timeID._500ms.toID(p.timestamp)

        if (pk.length > 0 && pk[pk.length - 1].id === id) {
            pk[pk.length - 1] = { id, buy: p.buy, sell: p.sell }
        } else {
            pk.push({ id, buy: p.buy, sell: p.sell })
        }

        if (pk.length > 30 * 2) {//30秒
            pk.shift()
        }
    }




    //TODO
    临时getBTC净盘口均线3秒() {
        const pk = this.dic.XBTUSD
        if (pk.length < 6) {
            return undefined
        }

        let buy = 0
        let sell = 0
        for (let i = pk.length - 6; i <= pk.length - 1; i++) {
            // buy += sum(pk[i].buy.map(v => v.size))
            // sell += sum(pk[i].sell.map(v => v.size))
            buy += pk[i].buy[0].size
            sell += pk[i].sell[0].size
        }
        return (buy - sell) / 6
    }



    get3秒最高最低(symbol: BaseType.BitmexSymbol) {
        let high = NaN
        let low = NaN

        const pk = this.dic[symbol]
        if (pk.length < 6) {
            return { high, low }
        }


        for (let i = pk.length - 6; i <= pk.length - 1; i++) {
            high = isNaN(high) ? pk[i].sell[0].price : Math.max(high, pk[i].sell[0].price)
            low = isNaN(low) ? pk[i].buy[0].price : Math.min(low, pk[i].buy[0].price)
        }
        return { high, low }
    }

    临时getBTC净盘口() {
        const pk = this.dic.XBTUSD
        if (pk.length < 1) {
            return undefined
        }
        const i = pk.length - 1
        return pk[i].buy[0].size - pk[i].sell[0].size
    }

    盘口价格_5不动() {
        const pk = this.dic.XBTUSD
        if (pk.length < 5) {
            return false
        }

        const f = (i: number) =>
            pk[pk.length - i].buy[0].price === pk[pk.length - 1].buy[0].price &&
            pk[pk.length - i].sell[0].price === pk[pk.length - 1].buy[0].price

        return f(2) && f(3) && f(4) && f(5)
    }

    getBuy1Price(symbol: BaseType.BitmexSymbol) {
        const pk = this.dic[symbol]

        if (pk.length < 1) return NaN

        const p = pk[pk.length - 1]

        return p.buy[0].price
    }

    getBuy1Size(symbol: BaseType.BitmexSymbol) {
        const pk = this.dic[symbol]

        if (pk.length < 1) return NaN

        const p = pk[pk.length - 1]

        return p.buy[0].size
    }

    getSell1Price(symbol: BaseType.BitmexSymbol) {
        const pk = this.dic[symbol]

        if (pk.length < 1) return NaN

        const p = pk[pk.length - 1]

        return p.sell[0].price
    }

    getSell1Size(symbol: BaseType.BitmexSymbol) {
        const pk = this.dic[symbol]

        if (pk.length < 1) return NaN

        const p = pk[pk.length - 1]

        return p.sell[0].size
    }

}

class A {
    miniRealData = new MiniRealData()

    private ws = new BitMEXWS('', [
        { theme: 'orderBook10', filter: 'XBTUSD' },
        { theme: 'orderBook10', filter: 'ETHUSD' },
    ])

    constructor() {
        this.ws.wsData.subject.frameData.subscribe(frame => {
            if (frame.table === 'orderBook10') {
                this.ws.wsData.getMap('orderBook10').forEach(v => {
                    const { symbol, bids, asks, timestamp } = v
                    this.miniRealData.in盘口({
                        symbol: symbol as BaseType.BitmexSymbol,
                        timestamp: new Date(timestamp).getTime(),
                        buy: bids.map(func.盘口map).slice(0, 5),
                        sell: asks.map(func.盘口map).slice(0, 5),
                    })
                })
            }
        })
    }
}


export const 一坨屎 = new A()