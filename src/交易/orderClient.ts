import { funcList } from './funcList'
import { userConfig } from '../userConfig'
import { BitMEXCreateJSONSync } from './BitMEXCreateJSONSync'
import * as querystring from 'querystring'
import { WSSync } from '../utils/WSSync'
import { io } from '../utils/io'
import { toPairs } from 'ramda'
import { BaseType } from '../app/BaseType'
import { 普通K } from '../utils/普通K'
import { pure } from '../utils/pure'

export const orderClientArr = toPairs(userConfig.account || {}).map(([_, v]) =>
    ({
        client: new WSSync.Client({
            url: `ws://${v.orderServerIP}:4567?${querystring.stringify({ cookie: v.cookie })}`,
            getJSONSync: BitMEXCreateJSONSync,
            funcList,
            ss: userConfig.下单ss,
        }),
        下单数量: v.下单数量,
        name: _,
        资金曲线日线K线: [] as BaseType.OHLC[], //可变数据
    }))

export type OrderClientType = typeof orderClientArr[number]['client']

const get日线K线 = (wallet: {
    time: number
    total: number
}[]) => {
    let ret: BaseType.OHLC[] = []
    let k = new 普通K<BaseType.OHLC>({
        open: '开',
        high: '高',
        low: '低',
        close: '收',
    })

    k.onNew = v => ret.push(v)
    k.onUpdate = v => ret[ret.length - 1] = v

    wallet.forEach(v => {
        k.input({
            id: pure.timeID.xx_ms(1440 * 60 * 1000).toID(v.time),
            open: v.total / 100000,
            high: v.total / 100000,
            low: v.total / 100000,
            close: v.total / 100000,
        })
    })
    return ret
}

const init = () => {

    orderClientArr.forEach(v => {
        const orderClient = v.client

        let obj = {
            lastBTCStopCount: 0,
            lastETHStopCount: 0,
            lastBTCCount: 0,
            lastETHCount: 0,
        }

        orderClient.onData = () => {


            v.资金曲线日线K线 = get日线K线(orderClient.jsonSync.rawData.wallet)

            const { XBTUSD, ETHUSD } = orderClient.jsonSync.rawData.market.bitmex

            const BTCStopCount = XBTUSD.委托列表.filter(v => v.type === '止损').length
            if (BTCStopCount < obj.lastBTCStopCount) io.speak('提醒')
            if (XBTUSD.仓位数量 !== obj.lastBTCCount) io.speak(`${XBTUSD.仓位数量}张`)
            obj.lastBTCStopCount = BTCStopCount
            obj.lastBTCCount = XBTUSD.仓位数量

            //重复
            const ETHStopCount = ETHUSD.委托列表.filter(v => v.type === '止损').length
            if (ETHStopCount < obj.lastETHStopCount) io.speak('提醒')
            if (ETHUSD.仓位数量 !== obj.lastETHCount) io.speak(`${ETHUSD.仓位数量}张`)
            obj.lastETHStopCount = ETHStopCount
            obj.lastETHCount = ETHUSD.仓位数量
        }
    })
}

init()