import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { 任务遥控器UI } from './任务遥控器UI'
import { toPairs } from 'ramda'
import { ChartView, layer } from '../ChartView'
import { RealData旧 } from '../行情/RealData旧'
import { CustomDialog } from './CustomDialog'
import { config____Tick行情 } from './config____Tick行情'
import { pure } from '../utils/pure'
import { io } from '../utils/io'
import { Item__temp } from './Item__temp'
import { orderClientArr, OrderClientType } from '../交易/orderClient'
import { theme } from '../ChartView/theme'
import FlexView from 'react-flexview'
import { 提醒__realTickClient } from './提醒'
import { TA } from '../utils/TA'
import { RBLineLayer } from '../ChartView/layer/RBLineLayer' 

const 显示秒 = [500, 250, 150, 50, 1000, 2000, 3600, 7200, 10000, 14400, 20000]

let ___state___ = {

    选项卡: 0,
    showCount: 显示秒[0] * (1000 / RealData旧.单位时间),
    nowChart: pure.keys(config____Tick行情)[0],

    倍数: 1,
    折叠dic: new Map<string, boolean>(),
}

let tabIsDown = false


// const orderClient = orderClientArr[___state___.选项卡].client

const 资金曲线Arr = orderClientArr.map(({ client }) => TA.map(
    () => client.jsonSync.rawData.wallet.length,
    i => client.jsonSync.rawData.wallet[i].total / 100000,
))

const 资金曲线strArr = orderClientArr.map(({ client }, index) => TA.map(
    () => 资金曲线Arr[index].length,
    i => new Date(client.jsonSync.rawData.wallet[i].time).toLocaleString() + '  ' + 资金曲线Arr[index][i].toFixed(2),
))


const chartJSX = <ChartView FPS={4} getData={
    () => {
        if (tabIsDown) {
            const 资金曲线 = 资金曲线Arr[___state___.选项卡]
            const 资金曲线str = 资金曲线strArr[___state___.选项卡]
            return {
                底部十字光标显示: i => i >= 0 && i < 资金曲线str.length ? 资金曲线str[i] : '',
                底部显示: () => '',
                showRange: theme.showAll({ length: 资金曲线str.length }),
                items: {
                    heightList: [1],
                    items: [
                        {
                            layerList: [
                                layer(RBLineLayer, { data: 资金曲线 }),
                            ]
                        },
                    ]
                }
            }
        }

        const items = config____Tick行情[___state___.nowChart](提醒__realTickClient.dataExt)
        const xArr = items.时间

        const showRange = theme.showAll({
            length: items.时间.length,
            maxCount: ___state___.showCount,
        })

        const 图表显示分钟 = (showRange.right - showRange.left) / (60 * 2)
        let 单位显示 = 60000

        //卧槽..!!! 
        if (图表显示分钟 > 4 * 60) {
            单位显示 = 60000 * 30//
        }
        if (图表显示分钟 > 60) {
            单位显示 = 60000 * 15//
        }
        else if (图表显示分钟 > 30) {
            单位显示 = 60000 * 10 //
        }
        else if (图表显示分钟 > 10) {
            单位显示 = 60000 * 5 //
        }
        else if (图表显示分钟 >= 0) {
            单位显示 = 60000 * 1
        }

        return {
            底部十字光标显示: i => i >= 0 && i < xArr.length ?
                pure.formatDate(new Date(xArr[i]), v => `${v.时}:${v.分}:${v.秒}:${v.毫秒}`)
                : '',
            底部显示: v => {
                if (v > xArr.length - 1 || v < 0) return ''

                const time = xArr[v]

                if (time % 单位显示 === 0) {
                    return pure.formatDate(new Date(time),
                        v => `${v.时}:${v.分}`,
                    )
                }
                else {
                    return ''
                }
            },
            showRange,
            items,
        }
    }
} />


class 实盘 extends React.Component {

    //临时..

    //TODO
    componentWillMount() {

        io.addTicker(() => {
            this.forceUpdate()
        })

        window.addEventListener('keydown', e => {

            // console.log('e.keyCode', e.keyCode)

            //tab
            if (e.keyCode === 9) {
                tabIsDown = true
                e.preventDefault()
            }

            //f1 f2 f3 f4
            if (e.keyCode >= 112 && e.keyCode <= 115) ___state___.选项卡 = e.keyCode - 112

            //`
            if (e.keyCode === 192) ___state___.倍数 = 0.5

            //1 2 3 4
            if (e.keyCode >= 49 && e.keyCode <= 52) ___state___.倍数 = e.keyCode - 48


        })

        window.addEventListener('keyup', e => {

            //tab
            if (e.keyCode === 9) {
                tabIsDown = false
                e.preventDefault()
            }

        })
    }


    set_任务_开关 = (orderClient: OrderClientType, 名字: string, value: boolean) => {
        const item = orderClient.jsonSync.rawData.任务.find(v => v.名字 === 名字)
        if (item !== undefined) {
            orderClient.func.set_任务_开关({
                名字,
                开关: value,
            })
        }
    }

    set_任务_参数 = (orderClient: OrderClientType, 名字: string, key: string, value: any) => {
        const item = orderClient.jsonSync.rawData.任务.find(v => v.名字 === 名字)
        if (item !== undefined) {
            orderClient.func.set_任务_参数({
                名字,
                参数: JSON.stringify({ [key]: value }),
            })
        }
    }


    render() {


        return <FlexView height='100%'>
            <div style={{ flex: '1 1 auto', width: `calc(100% - 370px)` }} onMouseDown={e => {
                if (e.button === 2) {
                    CustomDialog.popupMenu([
                        {
                            label: '显示秒',
                            submenu: 显示秒.map(v => ({
                                label: v + '秒',
                                type: 'checkbox' as 'checkbox',
                                checked: v === ___state___.showCount / (1000 / RealData旧.单位时间),
                                click: () => ___state___.showCount = v * (1000 / RealData旧.单位时间)
                            }))
                        },
                        {
                            label: '显示图',
                            submenu: pure.keys(config____Tick行情).map(v => ({
                                label: v,
                                type: 'checkbox' as 'checkbox',
                                checked: v === ___state___.nowChart,
                                click: () => ___state___.nowChart = v
                            }))
                        },
                    ])
                }
            }} >
                {chartJSX}
            </div>
            <div style={{ width: `370px` }}>

                <div style={{ backgroundColor: '#24292d' }}>


                    {
                        orderClientArr.map((v, i) => <div
                            hidden={i !== ___state___.选项卡}
                            key={v.name}
                            style={{
                                backgroundColor: '#24292d',
                                margin: 'auto auto',
                                width: `370px`,
                                padding: '10px 5px',
                                fontFamily: 'SourceHanSansSC-regular',
                                color: 'white',
                                fontSize: '24px',
                                userSelect: 'none',
                                cursor: 'default'
                            }}>

                            <div>
                                <h2>
                                    {
                                        v.client.isConnected ?
                                            v.client.jsonSync.rawData.ws ?
                                                v.client.jsonSync.rawData.market.bitmex.XBTUSD.手动下单中 ? `${v.name}下单中...` :
                                                    <>
                                                        <span>{v.name}</span>
                                                    </>
                                                : '服务器连接中...'
                                            : '连接中...'
                                    }
                                </h2>
                            </div>

                            <Item__temp
                                symbol='XBTUSD'
                                orderClient={v.client}
                                data={() => v.client.jsonSync.rawData.market.bitmex.XBTUSD}
                                下单数量={v.下单数量 * ___state___.倍数} />

                            <任务遥控器UI
                                list={v.client.jsonSync.rawData.任务.map(v => ({
                                    ...v,
                                    id: v.名字,
                                    折叠: ___state___.折叠dic.get(v.名字) || false,
                                    参数: toPairs(pure.safeJSONParse(v.参数)).map(([key, value]) => ({ key, value })),
                                }))}
                                set折叠={(id: string, value: boolean) => ___state___.折叠dic.set(id, value)}
                                set开关={(id: string, value: boolean) => this.set_任务_开关(v.client, id, value)}
                                set参数={(id: string, key: string, value: any) => this.set_任务_参数(v.client, id, key, value)}
                            />
                        </div>
                        )
                    }




                </div>
            </div>
        </FlexView>
    }
}

ReactDOM.render(<实盘 />, document.querySelector('#root'))