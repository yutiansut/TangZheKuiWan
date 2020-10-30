import { Quotes } from './Quotes'
import { BaseType } from '../app/BaseType'
import { func } from '../utils/func'
import { _____temp } from './_____temp'


export class BitmexQuotes extends Quotes<BaseType.BitmexSymbol> {

    private get ws() {
        return _____temp()
    }

    constructor() {
        super()

        this.ws.wsData.subject.isConnected.subscribe(isConnected => {
            this.subject.status.next({ isConnected: isConnected })
        })

        this.ws.wsData.subject.frameData.subscribe(frame => {

            //trade 只会插入新数据  不会更新
            if (frame.table === 'trade' && (frame.action === 'partial' || frame.action === 'insert')) {
                frame.data.forEach(({ symbol, side, size, price, timestamp }) => {
                    this.subject.trade.next({
                        symbol: symbol as BaseType.BitmexSymbol,
                        timestamp: new Date(timestamp).getTime(),
                        side: side as BaseType.Side,
                        size,
                        price,
                    })
                })
            }

            //
            if (frame.table === 'orderBook10') {
                this.ws.wsData.getMap('orderBook10').forEach(v => {
                    const { symbol, bids, asks, timestamp } = v
                    this.subject.orderBook.next({
                        symbol: symbol as BaseType.BitmexSymbol,
                        timestamp: new Date(timestamp).getTime(),
                        buy: bids.map(func.盘口map).slice(0, 5),
                        sell: asks.map(func.盘口map).slice(0, 5),
                    })
                })
            }


            if (frame.table === 'instrument') {
                this.ws.wsData.getMap('instrument').forEach(v => {
                    this.subject.XBTUSD持仓量.next({
                        timestamp: new Date(v.timestamp).getTime(),
                        持仓量: v.openInterest,
                    })
                })
            }


        })


    }
}