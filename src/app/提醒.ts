import { io } from '../utils/io'
import { pure } from '../utils/pure'
import { RealData旧 } from '../行情/RealData旧'


const throttle1min = io.throttle(1000 * 60)

export const 提醒__realTickClient = new RealData旧()
const bitmex成交量万 = () => pure.lastNumber(提醒__realTickClient.dataExt.bitmex.XBTUSD.成交量_累加30) / 10000
const 价差 = () => Math.round(Math.abs(pure.lastNumber(提醒__realTickClient.dataExt.联动.BTC60s平均差价__减去__360s平均差价)))
 
 

const 提醒__arr = [
    {
        id: '成交量>=',
        speak: throttle1min(io.speak),
        speakMsg: () => bitmex成交量万() >= 400 ?
            ` ${Math.floor(bitmex成交量万())} 万` : '',
    },
    {
        id: '价差>=',
        speak: throttle1min(io.speak),
        speakMsg: () => 价差() >= 10 ? `     ${价差()} ` : '',
    }, 
] as {
    id: string
    speak: (msg: string) => void
    speakMsg: () => string
}[]




//init
io.addTicker(() => {
    提醒__arr.forEach(v => {
        const msg = v.speakMsg()
        if (msg !== '') {
            console.log(msg)
           
            v.speak(msg)
        }

    })
})