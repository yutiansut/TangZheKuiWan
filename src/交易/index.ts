import { funcList } from './funcList'
import { BitMEXPositionAndOrder } from './BitMEXPositionAndOrder'
import { toPairs } from 'ramda'
import { userConfig } from '../userConfig'
import { config____Task } from '../app/config____Task'
import { 一坨屎 } from './一坨屎'
import { WSSync } from '../utils/WSSync'
import { func } from '../utils/func'



const fArr: (() => string)[] = []





//运行的账户
//cookie --> Account
const accountDic = new Map<string, BitMEXPositionAndOrder>()
if (userConfig.account !== undefined) {
    toPairs(userConfig.account).forEach(([accountName, { cookie }]) => {
        const account = new BitMEXPositionAndOrder({
            accountName,
            cookie,
        })
        account.runTask(config____Task())
        accountDic.set(cookie, account)


        fArr.push(() => {
            const arr = account.jsonSync.rawData.wallet.map(v => ({
                time: v.time / 1000,
                value: v.total / 100000,
            }))
            const html = `
                <body></body>
                <script src="https://unpkg.com/lightweight-charts@2.0.0/dist/lightweight-charts.standalone.production.js"></script>
                <script> 
                    const chart = LightweightCharts.createChart(document.body, { width: 1500, height: 600 });
                    const lineSeries = chart.addLineSeries();
                    lineSeries.setData(${JSON.stringify(arr)});
                </script>`
            return html
        })

    })
} else {
    console.log('运行的账户 没有设置')
}


const orderServer = new WSSync.Server(
    cookie => {
        const account = accountDic.get(cookie)
        return account ? account.jsonSync : undefined
    },
    funcList,
)

orderServer.func.取消委托 = async (cookie, req) => {
    const account = accountDic.get(cookie)
    if (account === undefined) throw 'cookie不存在'
    return await account.cancel({ orderID: req.orderID })
}

orderServer.func.市价平仓 = async (cookie, req) => {
    const account = accountDic.get(cookie)
    if (account === undefined) throw 'cookie不存在'
    if (req.symbol !== 'XBTUSD' && req.symbol !== 'ETHUSD') {
        throw 'symbol不存在'
    }
    return await account.close({ symbol: req.symbol, text: '手动市价平仓' })
}


orderServer.func.价格挂止损 = async (cookie, req) => {
    const account = accountDic.get(cookie)
    if (account === undefined) throw 'cookie不存在'
    if (req.symbol !== 'XBTUSD' && req.symbol !== 'ETHUSD') {
        throw 'symbol不存在'
    }
    return await account.stop(req)
}



orderServer.func.下单 = async (cookie, req) => {
    const account = accountDic.get(cookie)
    if (account === undefined) throw 'cookie不存在'

    if (req.symbol !== 'XBTUSD' && req.symbol !== 'ETHUSD') {
        throw 'symbol不存在'
    }
    if (req.type !== 'taker' && req.type !== 'maker' && req.type !== 'taker_and_reduceOnly' && req.type !== 'maker_and_reduceOnly') {
        throw 'type不存在'
    }

    const getPrice = () =>
        req.price === 0 ?
            (
                req.side === 'Buy' ?
                    一坨屎.miniRealData.getBuy1Price(req.symbol) :
                    一坨屎.miniRealData.getSell1Price(req.symbol)
            )
            :
            req.price

    if ((req.type === 'maker' || req.type === 'maker_and_reduceOnly') && isNaN(getPrice())) {
        throw '服务器还没有 买1 卖1 价格'
    }

    const 活动委托 = account.jsonSync.rawData.market.bitmex[req.symbol].委托列表.filter(v => v.type !== '止损')

    if (活动委托.length > 1) {
        throw '已经有委托了'
    }
    else if (活动委托.length === 1) {
        //更新 限价委托
        if (活动委托[0].side === req.side && req.type !== 'taker' && req.type !== 'taker_and_reduceOnly') {
            //ws返回有时间  直接给委托列表加一条记录??
            return await account.updateMaker({
                orderID: 活动委托[0].id,
                price: func.toBuySellPriceFunc(req.side, getPrice),
                size: req.size,
            })
        } else {
            throw '已经有委托了'
        }
    }

    if (account.jsonSync.rawData.market.bitmex[req.symbol].手动下单中) {
        throw '下单中....'
    }

    account.jsonSync.data.market.bitmex[req.symbol].手动下单中.____set(true)

    await account.newOrder(() => {
        let price = func.toBuySellPriceFunc(req.side, getPrice)()

        if (req.type === 'taker' || req.type === 'taker_and_reduceOnly') {

            const { high, low } = 一坨屎.miniRealData.get3秒最高最低(req.symbol)
            price = req.side === 'Buy' ? low + 10 : high - 10

            if (isNaN(price)) {
                throw 'price is NaN ...'
            }
        }

        return {
            symbol: req.symbol,
            side: req.side,
            size: req.size,
            price,
            type: req.type,
            text: `手动${req.type}`
        }
    })

    account.jsonSync.data.market.bitmex[req.symbol].手动下单中.____set(false)

    return
}

orderServer.func.set_任务_开关 = async (cookie, req) => {
    const account = accountDic.get(cookie)
    if (account === undefined) throw 'cookie不存在'
    account.set_任务_开关(req)
    return false
}

orderServer.func.set_任务_参数 = async (cookie, req) => {
    const account = accountDic.get(cookie)
    if (account === undefined) throw 'cookie不存在'
    account.set_任务_参数(req)
    return false
}



orderServer.run()







import * as http from 'http'
http.createServer((request, response) => {
    response.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' })
    const n = Number((request.url || '').slice(1))
    const f = fArr[n]
    if (f !== undefined) {
        response.end(f())
    } else {
        response.end(`n=${n}`)
    }
}).listen(3000)