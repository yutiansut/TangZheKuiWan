import { WebSocketClient } from '../utils/WebSocketClient'
import { BitMEXMessage } from './BitMEXMessage'
import { userConfig } from '../userConfig'
import { BaseType } from '../app/BaseType'
import { FrameData, SubscribeTheme, WSData } from './BitMEXWS__type'

export class BitMEXWS {
    wsData = new WSData()

    private ws: WebSocketClient
    private keysDic = new Map<string, string[]>()
    private hasPartial = new Map<string, boolean>()

    constructor(cookie: string, subscribe: { theme: SubscribeTheme, filter?: string }[]) {

        const ws = this.ws = new WebSocketClient({
            log_tag: `BitMEXWS ${cookie === '' ? 'public' : 'private'}`,
            headers: {
                Cookie: cookie
            },
            ss: userConfig.ss,
            url: 'wss://www.bitmex.com/realtime',
        })

        ws.onStatusChange = () => {
            this.wsData.clearAll()
            this.wsData.subject.isConnected.next(this.ws.isConnected)

            if (ws.isConnected) {
                //有情况发数组 服务器返回不对  只能一次一次的发
                subscribe.map(v =>
                    ws.sendJSON({
                        op: 'subscribe',
                        args: v.filter !== undefined ? v.theme + ':' + v.filter : v.theme
                    })
                )

                this.keysDic = new Map<string, string[]>()
                this.hasPartial = new Map<string, boolean>()
            }
        }

        ws.onData = obj => this.onAction(obj)
    }

    onAction(fd: FrameData) {

        const { table, action, data } = fd

        if (table === undefined) return

        //
        if (this.ws.isConnected === false) return


        //trade只有insert
        if (table === 'trade') {
            this.wsData.subject.frameData.next(fd)
            return
        }
        //没有partial
        else if (this.hasPartial.has(table) === false && action !== 'partial') {
            console.log('table',table,'action',action)
            return
        }



        if (table !== undefined) {

            //keys
            if (fd.keys !== undefined) {
                this.keysDic.set(table, fd.keys)
            }
            const keys = (this.keysDic.get(table) || [])


            //完全替换数据
            if (action === 'partial') {

                this.wsData.clear(fd.table)
                data.forEach((v: any) =>
                    this.wsData.insert({
                        key: JSON.stringify((keys || []).map(k => v[k])),
                        table: fd.table,
                        data: v,
                    })
                )

                this.hasPartial.set(table, true)

                //本地维护仓位数量 初始化
                if (table === 'position') {
                    (data as BitMEXMessage.Position[]).forEach(v => {
                        this.wsData.仓位数量.partial(v.symbol as BaseType.BitmexSymbol, v.currentQty)
                    })
                }
            }

            //insert update
            else if (action === 'insert' || action === 'update') {
                data.forEach((v: any) => {
                    const key = JSON.stringify((keys || []).map(k => v[k]))

                    if (action === 'insert') {
                        this.wsData.insert({
                            key,
                            table: fd.table,
                            data: v,
                        })
                    }
                    else if (action === 'update') {
                        this.wsData.update({
                            key,
                            table: fd.table,
                            data: v,
                        })
                    }

                    //Filled只能插入一次
                    if (table === 'order' && this.wsData.filledOrder.has(key) === false) {
                        const newV = this.wsData.getMap('order').get(key)!
                        this.wsData.onOrder(newV)
                        this.wsData.deleteOrder(newV, key)
                    }

                    //Filled只能插入一次
                    if (table === 'execution' && this.wsData.filledExecution.has(key) === false) {
                        const newV = this.wsData.getMap('execution').get(key)!
                        this.wsData.onExecution(newV)
                        this.wsData.deleteExecution(newV, key)
                    }

                })
            }

            //删除
            else if (action === 'delete') {
                data.forEach((v: any) =>
                    this.wsData.delete({
                        key: JSON.stringify((keys || []).map(k => v[k])),
                        table: fd.table,
                    })
                )
            }
        }

        this.wsData.subject.frameData.next(fd)
    }

}