export type ConfigType = {
    ssPort: number
    ss: boolean
    下单ss: boolean
    提醒音量: number
    单位时间: number
    account: {
        [name: string]: {
            cookie: string
            下单数量: number
            orderServerIP: string
        }
    }
} 