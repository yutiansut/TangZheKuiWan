const 手续费 = {
    'taker': 7.5 / 10000,
    'maker': -2.5 / 10000,
}

export namespace BitMEX计算器 {

    const get盈利mXBT = (p: {
        开仓价格: number
        开仓类型: 'taker' | 'maker'
        平仓价格: number
        平仓类型: 'taker' | 'maker'
        仓位数量: number
    }) => {
        // * 1000  XBT 转 mXBT
        const 开仓手续费mXBT = Math.abs(p.仓位数量) / p.开仓价格 * 1000 * 手续费[p.开仓类型]
        const 平仓手续费mXBT = Math.abs(p.仓位数量) / p.平仓价格 * 1000 * 手续费[p.平仓类型]
        const 差价盈利mXBT = (1 / p.开仓价格 - 1 / p.平仓价格) * 1000 * p.仓位数量
        return 差价盈利mXBT - 开仓手续费mXBT - 平仓手续费mXBT
    }

    //TODO
    export const get该多少仓位 = (p: {
        开仓价格: number
        止损价格: number
        开仓类型: 'taker' | 'maker'
        最大亏损mXBT: number
    }) => {
        const open = p.开仓价格
        let stop = p.止损价格

        const count = open > stop ? 10000 : -10000

        //最小算5点
        if (stop > open && stop < open + 5) {
            stop = open + 5
        }
        else if (stop < open && stop > open - 5) {
            stop = open - 5
        }

        const value = -get盈利mXBT({
            开仓价格: open,
            开仓类型: p.开仓类型,
            平仓价格: stop,
            平仓类型: 'taker', //<-------------
            仓位数量: count,
        })

        //1张
        return Math.max(1,
            Math.abs(
                Math.floor(p.最大亏损mXBT / value * count)
            )
        )
    }

}