import { BaseType } from '../app/BaseType'

export const funcList = {

    取消委托: {
        orderID: [''],
    },

    市价平仓: {
        symbol: '' as BaseType.BitmexSymbol,
    },

    价格挂止损: {
        symbol: '' as BaseType.BitmexSymbol,
        side: '' as BaseType.Side,
        price: 0,
    },


    下单: {
        symbol: '' as BaseType.BitmexSymbol,
        type: '' as 'taker' | 'maker' | 'maker_and_reduceOnly' | 'taker_and_reduceOnly',
        side: '' as BaseType.Side,
        size: 0,
        price: 0,//0 买1 卖1 !!! fuck
    },

    set_任务_开关: {
        名字: '',
        开关: false,
    },

    set_任务_参数: {
        名字: '',
        参数: '',
    },
}
