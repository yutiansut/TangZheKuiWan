import * as React from 'react'
import { BaseType } from './BaseType'
import { BitMEXPositionAndOrder } from '../交易/BitMEXPositionAndOrder'
import { OrderClientType } from '../交易/orderClient'
import { 下单Button } from './下单Button'
import { res } from './res'


type XXX = BitMEXPositionAndOrder['jsonSync']['rawData']['market']['bitmex']['XBTUSD']


//TODO
export const Item__temp = (p: { symbol: string, 下单数量: number, orderClient: OrderClientType, data: () => XXX }) => {

    const { orderClient, 下单数量 } = p

    const get仓位 = () => {
        const { 仓位数量, 开仓均价 } = p.data()
        if (仓位数量 !== 0) {
            return <span><span style={{ color: 仓位数量 < 0 ? res.color.DOWN_CSS : res.color.UP_CSS }}>{String(仓位数量)}</span>@<span>{开仓均价.toFixed(2)}</span></span>
        } else {
            return undefined
        }
    }

    const { 仓位数量 } = p.data()
    // 
    const 委托列表 = p.data().委托列表
    const 委托 = {
        id: '',
        side: '' as BaseType.Side,
        cumQty: 0,      //成交数量
        orderQty: 0,    //委托数量
        price: 0,
    }
    const x = 委托列表.find(v => v.type !== '止损')
    if (x === undefined) {
        委托.id = ''
    } else {
        委托.cumQty = x.cumQty
        委托.id = x.id
        委托.orderQty = x.orderQty
        委托.price = x.price
        委托.side = x.side
    }

    let 止损价格 = 0
    const y = 委托列表.find(v => v.type === '止损')
    if (y === undefined) {
        止损价格 = 0
    } else {
        止损价格 = y.price
    }

    const get止损 = () => {
        if (止损价格 === 0) {
            return undefined
        } else {
            return 止损价格
        }
    }

    const get委托 = () => {
        if (委托.id !== '') {
            const { id, side, cumQty, orderQty, price } = 委托
            return <a
                href='#'
                style={{ color: 'white' }}
                onClick={() => orderClient.func.取消委托({ orderID: [id] })}
            >
                <span style={{ color: side === 'Sell' ? res.color.DOWN_CSS : res.color.UP_CSS }}>{cumQty}/{orderQty}</span>
                <span>@{price}</span>
            </a>
        } else {
            return undefined
        }
    }

    return <div>
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'left',
        }}>
            <p style={{ color: '#cc66ff' }}>{p.symbol}{
                仓位数量 !== 0 ? <a
                    href='#'
                    style={{ color: res.color.DOWN_CSS }}
                    onClick={() => orderClient.func.市价平仓({ symbol: p.symbol as BaseType.BitmexSymbol })}
                >市价平仓</a> : undefined
            } </p>
            <p>仓位:{get仓位()}  {p.data().手动下单中 ? '下单中' : ''}</p>
            <p>止损:{get止损()}</p>
            <p>委托:{get委托()}</p>
        </div>

        <div style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center'
        }}>
            <div
                style={{ width: '50%' }}>
                <下单Button
                    bgColor={res.color.UP_CSS}
                    text={下单数量 + ' 买1'}
                    left={() => orderClient.func.下单({
                        symbol: p.symbol as BaseType.BitmexSymbol,
                        type: 'maker',
                        side: 'Buy',
                        size: 下单数量,
                        price: 0,
                    })}
                    right={() => orderClient.func.下单({
                        symbol: p.symbol as BaseType.BitmexSymbol,
                        type: 'taker',
                        side: 'Buy',
                        size: 下单数量,
                        price: 0,
                    })}
                />
            </div>

            <div
                style={{
                    width: '50%'
                }}>
                <下单Button
                    bgColor={res.color.DOWN_CSS}
                    text={-下单数量 + ' 卖1'}
                    left={() => orderClient.func.下单({
                        symbol: p.symbol as BaseType.BitmexSymbol,
                        type: 'maker',
                        side: 'Sell',
                        size: 下单数量,
                        price: 0,
                    })}
                    right={() => orderClient.func.下单({
                        symbol: p.symbol as BaseType.BitmexSymbol,
                        type: 'taker',
                        side: 'Sell',
                        size: 下单数量,
                        price: 0,
                    })}
                />
            </div>
        </div>
    </div >
}
