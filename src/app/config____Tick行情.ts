import { RealData旧 } from '../行情/RealData旧'
import { layer, LayerItem } from '../ChartView'
import { LineLayer } from '../ChartView/layer/LineLayer'
import { TextLayer, LeftTextLayer } from '../ChartView/layer/TextLayer'
import { ZeroLayer } from '../ChartView/layer/ZeroLayer'
import { pure } from '../utils/pure'
import { res } from './res'
import { RBLineLayer } from '../ChartView/layer/RBLineLayer' 


type ItemFunc = (d: RealData旧['dataExt']) => {
    heightList: number[]
    时间: ArrayLike<number>
    items: ({
        yCoordinate?: '普通' | '对数'
        layerList: LayerItem[]
    }[] | {
        yCoordinate?: '普通' | '对数'
        layerList: LayerItem[]
    })[]
} 

export const config____Tick行情: { [key in string]: ItemFunc } = {

    bitmex和币安合约完美版: d => ({
        heightList: [0.8, 0.15, 0.05],
        时间: d.bitmex.XBTUSD.时间,
        items: [



            [
                {
                    numberColor: res.color.净成交量颜色,
                    numberX: 100,
                    layerList: [
                        layer(LineLayer, { data: d.bitmex.XBTUSD.净OBV, color: 0xfffffff }),
                    ]
                },
                {
                    numberColor:  res.color.LTC颜色,
                    numberX: 100,
                    layerList: [
                        layer(ZeroLayer, { color: 0xaaaaaa }),
                        layer(LineLayer, { data: d.联动.BTC差价MACD.DEM, color:  res.color.UP }),
                        layer(LineLayer, { data: d.联动.BTC差价MACD.DIF, color:  res.color.DOWN }),
                       
                    ]
                },
                // {
                //     numberColor:  res.color.石青,
                //     numberX: 100,
                //     layerList: [
                //         layer(LineLayer, { data: d.联动.BTC60s平均差价__减去__360s平均差价, color:  res.color.石青 }),
                //     ]
                // },
                {
                    numberColor: 0x000000,
                    layerList: [
                        layer(LineLayer, { data: d.binance.btcusdt.价格, color: res.color.ETH颜色 }),
                    ]
                },

                {
                    numberColor: res.color.BTC颜色,
                    layerList: [
                        // layer(LineLayer, { data: d.bitmex.XBTUSD.价格, color: config____Color.BTC颜色 }),
                        layer(RBLineLayer, { data: d.bitmex.XBTUSD.价格 }),

                        layer(LeftTextLayer, {
                            text:
                                `binance:${pure.lastNumber(d.binance.btcusdt.价格).toFixed(2)}  ` +
                                `binance:${pure.lastNumber(d.binance.ethusdt.价格).toFixed(2)}  ` +
                                `binance合约:${pure.lastNumber(d.binance.btcusdt合约.价格).toFixed(2)}      `,

                            color: res.color.BTC颜色,
                        }),

                        layer(TextLayer, {
                            text:
                                `期货30秒内成交量:${(pure.lastNumber(d.bitmex.XBTUSD.成交量_累加30) / 10000).toFixed(2)}万   ` +
                                `波动率:${pure.lastNumber(d.bitmex.XBTUSD.波动率_60).toFixed(2)}      ` +
                                `bitmex:${pure.lastNumber(d.bitmex.XBTUSD.价格).toFixed(2)}      `,
                            color: res.color.BTC颜色,
                        }),
                    ]
                },
            ],


            {
                layerList: [
                    layer(ZeroLayer, { color: 0xaaaaaa }),
                    layer(LineLayer, { data: d.bitmex.XBTUSD.买.盘口5档量, color: res.color.买颜色 }),
                    layer(LineLayer, { data: d.bitmex.XBTUSD.卖.盘口5档量_负数, color: res.color.卖颜色 }),
                    layer(LineLayer, { data: d.bitmex.XBTUSD.买.净盘口_均线3, color: res.color.ETH颜色 }),
                    layer(TextLayer, {
                        text:
                            `买1  :${(pure.lastNumber(d.bitmex.XBTUSD.买.盘口1量) / 10000).toFixed(2)}万  ` +
                            `卖1  :${(pure.lastNumber(d.bitmex.XBTUSD.卖.盘口1量) / 10000).toFixed(2)}万   `,
                        color: res.color.BTC颜色,
                    })
                ]
            },



            {
                layerList: [
                    layer(ZeroLayer, { color: 0xaaaaaa }),
                    layer(LineLayer, { data: d.binance.btcusdt.买.盘口5档量, color: res.color.买颜色 }),
                    layer(LineLayer, { data: d.binance.btcusdt.卖.盘口5档量_负数, color: res.color.卖颜色 }),
                    layer(LineLayer, { data: d.binance.btcusdt.买.净盘口_均线3, color: res.color.ETH颜色 }),
                    layer(TextLayer, {
                        text:
                            `买1  :${(pure.lastNumber(d.binance.btcusdt.买.盘口1量)).toFixed(2)}个  ` +
                            `卖1  :${(pure.lastNumber(d.binance.btcusdt.卖.盘口1量)).toFixed(2)}个   `,
                        color: res.color.BTC颜色,
                    })
                ]
            },





        ]
    }), 
    bitmex和币安合约完美版1: d => ({
        heightList: [0.8, 0.15, 0.05],
        时间: d.bitmex.XBTUSD.时间,
        items: [
            [
                {
                    numberColor: res.color.净成交量颜色,
                    numberX: 100,
                    layerList: [
                        layer(LineLayer, { data: d.bitmex.XBTUSD.净OBV, color: 0xfffffff }),
                    ]
                },
                {
                    numberColor:  res.color.LTC颜色,
                    numberX: 100,
                    layerList: [
                        layer(ZeroLayer, { color: 0xfffffff }),
                        layer(LineLayer, { data: d.联动.币安MACD.DEM, color:  res.color.石青 }),
                        layer(LineLayer, { data: d.联动.币安MACD.DIF, color:  res.color.LTC颜色 }),
                        
                    ]
                },
                // {
                //     numberColor:  res.color.石青,
                //     numberX: 100,
                //     layerList: [
                //         layer(LineLayer, { data: d.联动.BTC60s平均差价__减去__360s平均差价, color:  res.color.石青 }),
                //     ]
                // },
                {
                    numberColor: 0x000000,
                    layerList: [
                        layer(LineLayer, { data: d.binance.btcusdt.价格, color: res.color.ETH颜色 }),
                    ]
                },

                {
                    numberColor: res.color.BTC颜色,
                    layerList: [
                        // layer(LineLayer, { data: d.bitmex.XBTUSD.价格, color: config____Color.BTC颜色 }),
                        layer(RBLineLayer, { data: d.bitmex.XBTUSD.价格 }),

                        layer(LeftTextLayer, {
                            text:
                                `binance:${pure.lastNumber(d.binance.btcusdt.价格).toFixed(2)}  ` +
                                `binance:${pure.lastNumber(d.binance.ethusdt.价格).toFixed(2)}  ` +
                                `binance合约:${pure.lastNumber(d.binance.btcusdt合约.价格).toFixed(2)}      `,

                            color: res.color.BTC颜色,
                        }),

                        layer(TextLayer, {
                            text:
                                `期货30秒内成交量:${(pure.lastNumber(d.bitmex.XBTUSD.成交量_累加30) / 10000).toFixed(2)}万   ` +
                                `波动率:${pure.lastNumber(d.bitmex.XBTUSD.波动率_60).toFixed(2)}      ` +
                                `bitmex:${pure.lastNumber(d.bitmex.XBTUSD.价格).toFixed(2)}      `,
                            color: res.color.BTC颜色,
                        }),
                    ]
                },
            ],


            {
                layerList: [
                    layer(ZeroLayer, { color: 0xaaaaaa }),
                    layer(LineLayer, { data: d.bitmex.XBTUSD.买.盘口5档量, color: res.color.买颜色 }),
                    layer(LineLayer, { data: d.bitmex.XBTUSD.卖.盘口5档量_负数, color: res.color.卖颜色 }),
                    layer(LineLayer, { data: d.bitmex.XBTUSD.买.净盘口_均线3, color: res.color.ETH颜色 }),
                    layer(TextLayer, {
                        text:
                            `买1  :${(pure.lastNumber(d.bitmex.XBTUSD.买.盘口1量) / 10000).toFixed(2)}万  ` +
                            `卖1  :${(pure.lastNumber(d.bitmex.XBTUSD.卖.盘口1量) / 10000).toFixed(2)}万   `,
                        color: res.color.BTC颜色,
                    })
                ]
            },



            {
                layerList: [
                    layer(ZeroLayer, { color: 0xaaaaaa }),
                    layer(LineLayer, { data: d.binance.btcusdt.买.盘口5档量, color: res.color.买颜色 }),
                    layer(LineLayer, { data: d.binance.btcusdt.卖.盘口5档量_负数, color: res.color.卖颜色 }),
                    layer(LineLayer, { data: d.binance.btcusdt.买.净盘口_均线3, color: res.color.ETH颜色 }),
                    layer(TextLayer, {
                        text:
                            `买1  :${(pure.lastNumber(d.binance.btcusdt.买.盘口1量)).toFixed(2)}个  ` +
                            `卖1  :${(pure.lastNumber(d.binance.btcusdt.卖.盘口1量)).toFixed(2)}个   `,
                        color: res.color.BTC颜色,
                    })
                ]
            },





        ]
    }), 
} 