import * as fs from 'fs'

import * as request from 'request'
import { pure } from './pure'
import { userConfig } from '../userConfig'
const Agent = require('socks5-https-client/lib/Agent')

export namespace io {

    export const get北京时间 = () => {
        const date = new Date(Date.now() + 8 * 60 * 60 * 1000)
        const 月 = (date.getUTCMonth() + 1).toString().padStart(2, '0')
        const 日 = date.getUTCDate().toString().padStart(2, '0')
        const 时 = date.getUTCHours().toString().padStart(2, '0')
        const 分 = date.getUTCMinutes().toString().padStart(2, '0')
        const 秒 = date.getUTCSeconds().toString().padStart(2, '0')
        const 毫秒 = date.getUTCMilliseconds().toString().padStart(3, '0')
        return `${月}/${日} ${时}:${分}:${秒}/${毫秒}`
    }

    export const logToFile = (path: string) => (text: string) =>
        fs.writeFileSync(path, get北京时间() + ' ' + text + '  \n', { flag: 'a' })

    export const log = (text: string) =>
        console.log(get北京时间() + ' ' + text)

    export const speak = (msg: string) => {
        let a = new SpeechSynthesisUtterance(msg)
        a.lang = 'zh-TW';
        a.volume = userConfig.提醒音量 === undefined ? 1 : userConfig.提醒音量
        speechSynthesis.speak(a)
    }


    export const waitFor = <T>(ms: number, ret?: T) =>
        new Promise(resolve => setTimeout(resolve, ms, ret))


    export const addTicker = (f: () => void) => {
        let stop = false

        const onTicker = () => {
            if (stop === false) {
                requestAnimationFrame(onTicker)
                f()
            }
        }
        onTicker()

        return () => stop = true
    }

    export const debouce = (ms: number) => <F extends (...p: any) => any>(f: F) => {
        let timer: any
        return ((...p: any) => {
            clearTimeout(timer)
            timer = setTimeout(f, ms, p)
        }) as F
    }

    export const throttle = (ms: number) => <F extends (...p: any) => any>(f: F) => {
        let n: number | undefined = undefined
        let ret: any
        return ((...p: any) => {
            if (n !== undefined && Date.now() - n < ms) {
                return ret
            } else {
                n = Date.now()
                ret = f(...p)
                return ret
            }
        }) as F
    }




    export const JSONRequest = <T>({
        url,
        method = 'GET',
        body,
        ss = false,
        headers = {}
    }: {
        url: string
        method?: string
        body?: any
        ss?: boolean
        headers?: { [key: string]: string }
    }) => new Promise<{
        error?: '网络错误' | '服务器返回错误'
        data?: T
        msg?: string
    }>(resolve => {

        const requestOptions: request.OptionsWithUrl = {
            timeout: 1000 * 60,//超时1分钟
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                ...headers
            },
            url,
            method,
        }

        if (ss) {
            requestOptions.agentClass = Agent
            requestOptions.agentOptions = {
                socksHost: '127.0.0.1',
                socksPort: userConfig.ssPort,
            } as any
        }

        if (body !== undefined) {
            requestOptions.body = JSON.stringify(body)
        }

        request(requestOptions, (error, response) => {
            if (response === undefined) {
                resolve({
                    error: '网络错误',
                    msg: String(error),
                })
            }
            else if (response.statusCode !== 200) {
                resolve({
                    error: '服务器返回错误',
                    msg: String(response.body),
                })
            }
            else {
                resolve({ data: pure.safeJSONParse(response.body) })
            }
        })

    })

}