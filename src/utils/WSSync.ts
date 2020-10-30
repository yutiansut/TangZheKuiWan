import { pure } from './pure'
import { JSONSync } from './JSONSync'
import * as WebSocket from 'ws'
import * as querystring from 'querystring'
import * as url from 'url'
import { WebSocketClient } from './WebSocketClient'

export namespace WSSync {

    export class Server<T, FuncList extends { [funcName: string]: any }> {

        func: { [P in keyof FuncList]?: (cookie: string, req: FuncList[P]) => void } = Object.create(null)
        funcList: FuncList

        private online = new Map<WebSocket, { unsubscribe: () => void }>()
        private wss = new WebSocket.Server({ port: 4567 })

        private getJSONSync: (cookie: string) => JSONSync<T> | undefined

        constructor(getJSONSync: (cookie: string) => JSONSync<T> | undefined, funcList: FuncList) {
            this.getJSONSync = getJSONSync
            this.funcList = funcList
        }

        run() {
            const { online, wss } = this

            wss.on('connection', (ws, req) => {

                online.set(ws, { unsubscribe: () => { } })

                const { cookie } = pure.toType({ cookie: '' })(
                    querystring.parse(url.parse(req.url || '').query || '')
                )

                const jsonSync = this.getJSONSync(cookie)

                if (jsonSync !== undefined) {
                    try {
                        ws.send(
                            JSON.stringify({
                                path: [],
                                value: jsonSync.rawData
                            })
                        )
                    } catch (err) { }

                    online.set(ws,
                        jsonSync.subject.subscribe(op => {
                            try {
                                ws.send(JSON.stringify(op))
                            } catch (err) {

                            }
                        })
                    )
                }

                ws.onmessage = async d => {
                    try {
                        const [funcName, funcParam] = pure.safeJSONParse(String(d.data))
                        const f = this.func[funcName]
                        if (f !== undefined) {
                            await f(cookie, pure.toType(this.funcList[funcName])(funcParam))
                        }
                    } catch (e) {
                        console.log('f error ', e)
                    }
                }

                ws.onerror = ws.onclose = () => {
                    const f = online.get(ws)
                    if (f !== undefined) {
                        f.unsubscribe()
                        online.delete(ws)
                    }
                }
            })
        }
    }

    export class Client<T, FuncList extends { [funcName: string]: any }>{

        jsonSync: JSONSync<T>

        func: { [P in keyof FuncList]: (req: FuncList[P]) => void }

        private ws: WebSocketClient

        private 收到了消息 = false

        constructor(p: { ss?: boolean, url: string, getJSONSync: () => JSONSync<T>, funcList: FuncList }) {

            this.jsonSync = p.getJSONSync()
            this.func = pure.mapKV(
                (req, funcName) => (p: any) => {
                    if (this.ws.isConnected) {
                        // console.log(JSON.stringify([funcName, pure.toType(req)(p)], null, 4))
                        this.ws.sendJSON([funcName, pure.toType(req)(p)])
                    }
                },
                p.funcList,
            ) as any

            this.ws = new WebSocketClient({
                log_tag: 'WSSync.Client',
                url: p.url,
                ss: p.ss,
            })

            this.ws.onStatusChange = () => {
                this.收到了消息 = false
            }

            this.ws.onData = obj => {
                this.收到了消息 = true
                this.jsonSync.set(pure.deepMapNullToNaN(obj))
                this.onData()
            }
        }

        onData = () => { }

        get isConnected() {
            return this.ws.isConnected && this.收到了消息
        }
    }
}