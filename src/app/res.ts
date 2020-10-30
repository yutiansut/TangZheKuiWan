export namespace res {

    export const color = {
        ETH颜色: 0xaaaa00,
        BTC颜色: 0xcc66ff,
        LTC颜色: 0x6d3939,

        买颜色: 0x0E6655,
        卖颜色: 0x943126,

        净成交量颜色: 0x424242,
        石青: 0x1685a9,



        UP: 0x16A085,
        DOWN: 0xE74C3C,

        UP_CSS: '#16A085',
        DOWN_CSS: '#E74C3C',
    }

    export const sort = {
        从小到大: (a: number, b: number) => a - b,
        从大到小: (a: number, b: number) => b - a,

        //
        从小到大T: <T extends string>(key: T) => (a: any, b: any) => a[key] - b[key],
        从大到小T: <T extends string>(key: T) => (a: any, b: any) => b[key] - a[key],
    }

}
