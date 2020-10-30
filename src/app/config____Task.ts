import { BitMEXPositionAndOrderTask } from '../交易/BitMEXPositionAndOrder'
import { Task__Stop } from '../交易/Task__Stop'
import { Task__BTC预判开仓 } from '../交易/Task__BTC预判开仓'
import { Task__Close } from '../交易/Task__Close'

export const config____Task = (): { name: string, task: BitMEXPositionAndOrderTask }[] => [
    { name: 'BTC预判开仓', task: Task__BTC预判开仓() },
    { name: 'BTC_止损', task: Task__Stop('XBTUSD') },
    { name: 'BTC_止盈', task: Task__Close('XBTUSD') },
    { name: 'BTC_止盈平一半', task: Task__Close('XBTUSD') },
]