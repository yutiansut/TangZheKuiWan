import { BitMEXWS } from '../BitMEXSDK/BitMEXWS'

let ws: BitMEXWS | undefined

export const _____temp = () => {
    if (ws === undefined) {
        ws = new BitMEXWS('', [
            //5s
            { theme: 'trade', filter: 'XBTUSD' },
            { theme: 'trade', filter: 'ETHUSD' },
            { theme: 'orderBook10', filter: 'XBTUSD' },
            { theme: 'orderBook10', filter: 'ETHUSD' },
            //
            { theme: 'instrument', filter: 'XBTUSD' },


            // 1min
            { theme: 'tradeBin1m', filter: 'XBTUSD' },
            { theme: 'tradeBin5m', filter: 'XBTUSD' },
            { theme: 'tradeBin1h', filter: 'XBTUSD' },
            { theme: 'tradeBin1d', filter: 'XBTUSD' },
        ])
    }
    return ws
}