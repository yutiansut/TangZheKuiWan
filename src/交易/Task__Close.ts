import { BitMEXcreateTask } from './BitMEXPositionAndOrder'
import { BaseType } from '../app/BaseType'
import { io } from '../utils/io'
import { 一坨屎 } from './一坨屎'
import { func } from '../utils/func'

//重复的 Tast_Stop

export const Task__Close = (symbol: BaseType.BitmexSymbol) => BitMEXcreateTask({
    止盈: 10,
    留多少不平: 0,
}, async (self, xxxxxxxxxxxxx) => {
    while (true) {
        let 调用成功 = true
        if (xxxxxxxxxxxxx.开关) {
            if (self.bitmex_初始化.仓位 && self.bitmex_初始化.委托) {

                const 止盈点 = xxxxxxxxxxxxx.参数.止盈

                const { 仓位数量, 开仓均价, 委托列表 } = self.jsonSync.rawData.market.bitmex[symbol]

                //自动关闭
                if (xxxxxxxxxxxxx.参数.止盈 < 0 && 仓位数量 === 0) {
                    xxxxxxxxxxxxx.开关 = false
                    self.刷新到jsonsync任务()
                }

                const 减仓委托 = 委托列表.filter(v => v.type === '限价只减仓')

                const side = 仓位数量 > 0 ? 'Sell' : 'Buy'

                const 卖1价 = 一坨屎.miniRealData.getSell1Price(symbol) //<----
                const 买1价 = 一坨屎.miniRealData.getBuy1Price(symbol)  //<----

                const 止盈价格 = func.toPriceAlign({
                    grid: symbol === 'XBTUSD' ? 0.5 : 0.05,
                    value: 仓位数量 > 0 ?
                        Math.max(卖1价, 开仓均价 + 止盈点) :
                        Math.min(买1价, 开仓均价 - 止盈点),
                    side,
                })

                const 平仓数量 = Math.max(0, Math.abs(仓位数量) - xxxxxxxxxxxxx.参数.留多少不平)

                //没有止盈
                if (减仓委托.length === 0) {
                    if (平仓数量 > 0) {
                        调用成功 = await self.newOrder(() => ({
                            symbol,
                            side: 仓位数量 > 0 ? 'Sell' : 'Buy',
                            size: 平仓数量,
                            price: 止盈价格,
                            type: 'maker_and_reduceOnly',
                            text: `${止盈点}点止盈`
                        }))
                    }
                }
                //有止盈
                else if (减仓委托.length === 1) {
                    if (平仓数量 > 0) {
                        //止盈数量错了
                        //止盈价格错了 
                        if (平仓数量 !== 减仓委托[0].orderQty - 减仓委托[0].cumQty || 减仓委托[0].price !== 止盈价格) {
                            调用成功 = await self.updateMaker({
                                orderID: 减仓委托[0].id,
                                price: () => 止盈价格,
                                size: 平仓数量,
                            })
                        }
                    }
                    else {
                        调用成功 = await self.cancel({ orderID: 减仓委托.map(v => v.id) })
                    }
                }
                //多个止盈 全取消
                else {
                    调用成功 = await self.cancel({ orderID: 减仓委托.map(v => v.id) })
                }
            }
        }
        await io.waitFor(调用成功 ? 10 : 2000)
    }
}) 