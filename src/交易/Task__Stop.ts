import { BitMEXcreateTask } from './BitMEXPositionAndOrder'
import { BaseType } from '../app/BaseType'
import { io } from '../utils/io'
import { func } from '../utils/func'

export const Task__Stop = (symbol: BaseType.BitmexSymbol) => BitMEXcreateTask({
    止损: 10,
}, async (self, xxxxxxxxxxxxx) => {
    while (true) {
        let 调用成功 = true
        if (xxxxxxxxxxxxx.开关) {
            if (self.bitmex_初始化.仓位 && self.bitmex_初始化.委托) {
                const 止损点 = xxxxxxxxxxxxx.参数.止损

                const { 仓位数量, 开仓均价, 委托列表 } = self.jsonSync.rawData.market.bitmex[symbol]

                const 止损委托 = 委托列表.filter(v => v.type === '止损')

                const side = 仓位数量 > 0 ? 'Sell' : 'Buy'
                const 止损价格 = func.toPriceAlign({
                    grid: symbol === 'XBTUSD' ? 0.5 : 0.05,
                    value: 仓位数量 > 0 ? 开仓均价 - 止损点 : 开仓均价 + 止损点,
                    side,
                })

                //没有止损 
                if (止损委托.length === 0) {
                    if (仓位数量 !== 0) {
                        调用成功 = await self.stop({
                            symbol: symbol,
                            side,
                            price: 止损价格,
                        })
                    }
                    else {
                        //
                    }
                }
                //有止损
                else if (止损委托.length === 1) {
                    //止损方向错了
                    if (仓位数量 === 0 || (仓位数量 > 0 && 止损委托[0].side !== 'Sell') || (仓位数量 < 0 && 止损委托[0].side !== 'Buy')) {
                        调用成功 = await self.cancel({ orderID: 止损委托.map(v => v.id) })
                    }
                    //止损价格错了
                    else if (止损委托[0].price !== 止损价格) {
                        调用成功 = await self.updateStop({ orderID: 止损委托[0].id, price: 止损价格 })
                    }
                    else {
                        //
                    }
                }
                //多个止损 全取消
                else {
                    调用成功 = await self.cancel({ orderID: 止损委托.map(v => v.id) })
                }
            }
        }
        await io.waitFor(调用成功 ? 10 : 2000)
    }
}) 