import { Quotes } from './Quotes'
import { BaseType } from '../app/BaseType'
import { userConfig } from '../userConfig'
import { WebSocketClient } from '../utils/WebSocketClient'
import { func } from '../utils/func'

export class BinanceQuotes extends Quotes<BaseType.BinanceSymbol> {

    private ws = new WebSocketClient({
        log_tag: 'BinanceTradeAndOrderBook',
        ss: userConfig.ss,
        url: 'wss://stream.binance.com:9443/stream?streams=' + [
            //近期交易
            'btcusdt@trade',
            'ethusdt@trade',
            'ltcusdt@trade',
            //盘口 
            'btcusdt@depth5',
            'ethusdt@depth5',
            'ltcusdt@depth5',
        ].join('/'),
    })

    private ws合约 = new WebSocketClient({
        log_tag: 'Binance合约',
        ss: userConfig.ss,
        url: 'wss://fstream.binance.com/stream?streams=' + [
            //近期交易
            'btcusdt@aggTrade',
            'ethusdt@aggTrade', 
        ].join('/'),
    })

    constructor() {
        super()

        this.ws.onStatusChange = this.ws合约.onStatusChange = () => {
            this.subject.status.next({ isConnected: this.ws.isConnected && this.ws合约.isConnected })
        }

        // this.ws.onStatusChange = () => {
        //     this.subject.status.next({ isConnected: this.ws.isConnected })
        // }

        this.ws.onData = ({ stream, data }: { stream: string, data: any }) => {
            const arr = stream.split('@')
            const symbol = arr[0] as BaseType.BinanceSymbol
            const type = arr[1]

            if (type === 'trade') {
                this.subject.trade.next({
                    symbol,
                    timestamp: data.E,
                    price: Number(data.p),
                    side: data.m ? 'Sell' : 'Buy',
                    size: Number(data.q),
                })
            }

            if (type === 'depth5') {
                this.subject.orderBook.next({
                    symbol,
                    timestamp: Date.now(),//直接读取本地时间
                    buy: data.bids.map(func.盘口map),
                    sell: data.asks.map(func.盘口map),
                })
            }
        }


        this.ws合约.onData = ({ stream, data }: { stream: string, data: any }) => {
            const arr = stream.split('@')
            const symbol = arr[0] as BaseType.BinanceSymbol
            const type = arr[1]

            if (type === 'aggTrade') {
                this.subject.trade.next({
                    symbol: `${symbol}合约` as any,
                    timestamp: data.E,
                    price: Number(data.p),
                    side: data.m ? 'Sell' : 'Buy',
                    size: Number(data.q),
                })
            }

            if (type === 'depth5') {
                this.subject.orderBook.next({
                    symbol: `${symbol}合约` as any,
                    timestamp: Date.now(),//直接读取本地时间
                    buy: data.bids.map(func.盘口map),
                    sell: data.asks.map(func.盘口map),
                })
            }
        }


    }
}