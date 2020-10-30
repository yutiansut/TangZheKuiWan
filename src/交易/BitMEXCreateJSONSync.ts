import { JSONSync } from '../utils/JSONSync'
import { pure } from '../utils/pure'
import { BaseType } from '../app/BaseType'

const symbol = () => ({
    //TODO overload状态
    手动下单中: false,
    委托列表: [] as {
        type: '限价' | '限价只减仓' | '止损'
        timestamp: number
        id: string
        side: BaseType.Side
        cumQty: number      //成交数量
        orderQty: number    //委托数量
        price: number
    }[],
    仓位数量: 0,
    开仓均价: 0,
    强平价格: 0,
})

export const BitMEXCreateJSONSync = () =>
    new JSONSync({
        ws: false,
        wallet: [] as {
            time: number
            total: number
            XBTUSD仓位数量:number
        }[],
        任务: [] as {
            名字: string
            开关: boolean
            参数: string
        }[],
        market: {
            bitmex: pure.mapKV(symbol, BaseType.BitmexSymbolDic),
        }
    })