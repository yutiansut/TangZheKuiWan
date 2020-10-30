import { BitMEXPositionAndOrder, BitMEXcreateTask } from './BitMEXPositionAndOrder'
import { BaseType } from '../app/BaseType'
import { 一坨屎 } from './一坨屎'
import { io } from '../utils/io'
import { pure } from '../utils/pure'
import { RealData旧 } from '../行情/RealData旧'


//多了一路连接
export const client = new RealData旧()
const util = require('util');
const setTimeoutPromise = util.promisify(setTimeout);

export const Task__BTC预判开仓 = () => BitMEXcreateTask({
    //自动预判买卖_按钮: false,
    自动预判买_按钮: false,
    自动预判卖_按钮: false,
    价差: 15,
   // 波动率: 80,
    杠杆: 10,
    仓位: 10,
    预判卖_按钮: false,
    预判买_按钮: false,
}, async (self, xxxxxxxxxxxxx) => {

    const 预判买卖触发 = async (self: BitMEXPositionAndOrder, side: BaseType.Side) => {
        const { high, low } = 一坨屎.miniRealData.get3秒最高最低('XBTUSD')
        io.log("size = "+xxxxxxxxxxxxx.参数.仓位)
        io.log( `预判开仓${side}`)
        io.log("price = "+(side === 'Buy' ? (low + 10) : (high - 10)))

        io.logToFile("size = "+xxxxxxxxxxxxx.参数.仓位)
        io.logToFile( `预判开仓${side}`)
        io.logToFile("price = "+(side === 'Buy' ? (low + 10) : (high - 10)))
       
        
       
        await self.newOrder(() => ({
            symbol: 'XBTUSD',
            side: side,
            size: xxxxxxxxxxxxx.参数.仓位,
            price: side === 'Buy' ? (low + 10) : (high - 10),
            type: 'taker',
            text: `预判开仓${side}`,
        }))
        xxxxxxxxxxxxx.参数.预判买_按钮 = false
        xxxxxxxxxxxxx.参数.预判卖_按钮 = false
        self.刷新到jsonsync任务()
    }

    const 预判市价开仓 = async () => {
        const 净盘口均线3秒 = 一坨屎.miniRealData.临时getBTC净盘口均线3秒()
        const 买1量 = 一坨屎.miniRealData.getBuy1Size('XBTUSD')
        const 卖1量 = 一坨屎.miniRealData.getSell1Size('XBTUSD')
        if (净盘口均线3秒 === undefined) return

        if (xxxxxxxxxxxxx.参数.预判买_按钮) {
            if (净盘口均线3秒 >= 0 && 卖1量 < 50 * 10000) {
                await 预判买卖触发(self, 'Buy')
            }
        } else if (xxxxxxxxxxxxx.参数.预判卖_按钮) {
            if (净盘口均线3秒 <= 0 && 买1量 < 50 * 10000) {
                await 预判买卖触发(self, 'Sell')
            }
        }
    }

    //
    while (true) {
        if (xxxxxxxxxxxxx.开关) {
            const 当前价格 = (一坨屎.miniRealData.getBuy1Price('XBTUSD') + 一坨屎.miniRealData.getSell1Price('XBTUSD')) / 2
            const 当前余额XBT = self.jsonSync.rawData.wallet[self.jsonSync.rawData.wallet.length - 1].total / 100000 / 1000
            const size = Math.floor(当前价格 * 当前余额XBT * xxxxxxxxxxxxx.参数.杠杆)

            //xxxxxxxxxxxxx.参数.仓位 = size
            //
            if (xxxxxxxxxxxxx.参数.仓位 !== size) {
                xxxxxxxxxxxxx.参数.仓位 = size
                self.刷新到jsonsync任务()
            }


            const { 仓位数量 } = self.jsonSync.rawData.market.bitmex.XBTUSD
            if (仓位数量 === 0) {
                if (xxxxxxxxxxxxx.参数.预判买_按钮 || xxxxxxxxxxxxx.参数.预判卖_按钮) {
                    await 预判市价开仓()
                }
                //自动打开预判开仓开关 
                else if (xxxxxxxxxxxxx.参数.自动预判卖_按钮) {

                    //TODO 
                    const { XBTUSD } = client.dataExt.bitmex //???????
                    const btc_macd = client.dataExt.联动.币安MACD
                    //////!!!!!

                    let 价差 = pure.lastNumber(XBTUSD.最高_10减最低_10) >= xxxxxxxxxxxxx.参数.价差
                    let 成交量 = pure.lastNumber(XBTUSD.买成交量_累加10) > 300 * 10000
                    let 净成交量 = (pure.lastNumber(XBTUSD.买成交量_累加30) - pure.lastNumber(XBTUSD.卖成交量_累加30)) > 200 * 10000
                    let 盘口最高 = pure.lastNumber(XBTUSD.买盘口_10S最高) > 200 * 10000
                    let currentbdl_is_ok = pure.lastNumber(XBTUSD.波动率_60)< 120
                    let btcusdt_macd_is_ok = pure.lastNumber(btc_macd.DIF)< pure.lastNumber(btc_macd.DEM)
                    let n = 价差 && 净成交量 && (盘口最高 || 成交量)&&currentbdl_is_ok&&btcusdt_macd_is_ok
                    if(价差){
                        io.log(`自动预判卖 价差` + 价差 + ' 成交量:' + 成交量 + '  净成交量:' + 净成交量 + ' 盘口最高' + 盘口最高+' currentbdl_is_ok '+currentbdl_is_ok+' btcusdt_macd_is_ok = '+btcusdt_macd_is_ok)
                    }
                    if (n) {
                        io.log(`自动预判卖 价差` + 价差 + ' 成交量:' + 成交量 + '  净成交量:' + 净成交量 + ' 盘口最高' + 盘口最高+' currentbdl_is_ok '+currentbdl_is_ok+' btcusdt_macd_is_ok = '+btcusdt_macd_is_ok)
                       // xxxxxxxxxxxxx.参数.自动预判买卖_按钮 = false
                        xxxxxxxxxxxxx.参数.预判卖_按钮 = true
                        xxxxxxxxxxxxx.参数.自动预判卖_按钮 = false
                        setTimeoutPromise(1000*120).then(() => {
                            xxxxxxxxxxxxx.参数.自动预判卖_按钮 = true
                        });
                        self.刷新到jsonsync任务()
                    }
                    //_________

                }
                else if (xxxxxxxxxxxxx.参数.自动预判买_按钮) {

                    //TODO 
                    const { XBTUSD } = client.dataExt.bitmex //???????
                    const btc_macd = client.dataExt.联动.币安MACD
                    //////!!!!!
                    let 价差 = pure.lastNumber(XBTUSD.最高_10减最低_10) >= xxxxxxxxxxxxx.参数.价差
                    let 成交量 = pure.lastNumber(XBTUSD.卖成交量_累加10) > 300 * 10000
                    let 净成交量 = (pure.lastNumber(XBTUSD.卖成交量_累加30) - pure.lastNumber(XBTUSD.买成交量_累加30)) > 200 * 10000
                    let 盘口最高 = pure.lastNumber(XBTUSD.买盘口_10S最高) > 200 * 10000
                    let currentbdl_is_ok = pure.lastNumber(XBTUSD.波动率_60)< 120
                    let btcusdt_macd_is_ok = pure.lastNumber(btc_macd.DIF)> pure.lastNumber(btc_macd.DEM)
                    let n = 价差 && 净成交量 && (盘口最高 || 成交量)&&currentbdl_is_ok&&btcusdt_macd_is_ok
                    if(价差){
                        io.log(`自动预判卖 价差` + 价差 + ' 成交量:' + 成交量 + '  净成交量:' + 净成交量 + ' 盘口最高' + 盘口最高+' currentbdl_is_ok '+currentbdl_is_ok+' btcusdt_macd_is_ok = '+btcusdt_macd_is_ok)
                    }
                    if (n) {
                        io.log(`自动预判卖 价差` + 价差 + ' 成交量:' + 成交量 + '  净成交量:' + 净成交量 + ' 盘口最高' + 盘口最高+' currentbdl_is_ok '+currentbdl_is_ok+currentbdl_is_ok+' btcusdt_macd_is_ok = '+btcusdt_macd_is_ok)
                       // xxxxxxxxxxxxx.参数.自动预判买卖_按钮 = false
                        xxxxxxxxxxxxx.参数.自动预判买_按钮 = false
                        xxxxxxxxxxxxx.参数.预判买_按钮 = true
                        setTimeoutPromise(1000*120).then(() => {
                            xxxxxxxxxxxxx.参数.自动预判买_按钮 = true
                        });
                        self.刷新到jsonsync任务()
                    }
                    //_________



                }
            }
        }
        await io.waitFor(10)
    }
})