import { pure } from '../utils/pure'

export namespace BaseType {

    //bitmex
    export const BitmexSymbolDic = {
        'XBTUSD': {},
        'ETHUSD': {},
    }
    export type BitmexSymbol = keyof typeof BitmexSymbolDic
    export const BitmexSymbolArr = pure.keys(BitmexSymbolDic)

    //binance
    export const BinanceSymbolDic = {
        'btcusdt': {},
        'ethusdt': {},
        'ltcusdt': {},
        'btcusdt合约': {},
        'ethusdt合约': {},
        'ltcusdt合约': {},
    }
    export type BinanceSymbol = keyof typeof BinanceSymbolDic
    export const BinanceSymbolArr = pure.keys(BinanceSymbolDic)

    //ctp d.符号 ----> 天勤的符号
    export const CTPSymbolDic = {
        '螺纹': 'KQ.m@SHFE.rb',
        '铁矿': 'KQ.m@DCE.i',
        '郑醇': 'KQ.m@CZCE.MA',
        'PTA': 'KQ.m@CZCE.TA',
        '豆粕': 'KQ.m@DCE.m',
        '沥青': 'KQ.m@SHFE.bu',
        '燃油': 'KQ.m@SHFE.fu',
        '玻璃': 'KQ.m@CZCE.FG',
        'EG': 'KQ.m@DCE.eg',
        '玉米': 'KQ.m@DCE.c',
        '菜粕': 'KQ.m@CZCE.RM',
    }
    export type CTPSymbol = keyof typeof CTPSymbolDic
    export const CTPSymbolArr = pure.keys(CTPSymbolDic)

    export type Side = 'Buy' | 'Sell'

    export type OrderBook = {
        id: number
        buy: {
            price: number
            size: number
        }[]
        sell: {
            price: number
            size: number
        }[]
    }

    export type KLine__废弃 = {
        id: number
        open: number
        high: number
        low: number
        close: number
        buySize: number
        sellSize: number
        buyCount: number
        sellCount: number
        成交性质?: 成交性质Type
    }


    export type 成交性质Type = '双开' | '双平' | '多换' | '空换' | '多平' | '空平' | '空开' | '多开' | '不知道'


    export type OHLC = {
        id: number
        open: number
        high: number
        low: number
        close: number
    }

    export type KLine = {
        type: '合成中' | '已完成' | '数据丢失'
        id: number
        timestamp: number
        open: number
        high: number
        low: number
        close: number
        volume: number
    }
} 