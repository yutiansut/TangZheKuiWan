import { pure } from './pure'

import * as ws_client from 'ws'
import { userConfig } from '../userConfig'
const SocksProxyAgent = require('socks-proxy-agent')

class WS {
    private ws: ws_client | WebSocket

    constructor(url: string, options: ws_client.ClientOptions) {
        this.ws = typeof window === 'undefined' ? new ws_client(url, options) : new WebSocket(url)
    }

    send(str: string) {
        this.ws.send(str)
    }

    set onopen(f: () => void) { this.ws.onopen = f }
    set onerror(f: () => void) { this.ws.onerror = f }
    set onclose(f: () => void) { this.ws.onclose = f }

    set onmessage(f: (e: { data: any }) => void) { this.ws.onmessage = f }

    close() {
        this.ws.close()
    }

    terminate() {
        if ((this.ws as ws_client).terminate !== undefined) {
            (this.ws as ws_client).terminate()
        }
    }
}

// const pingTimeout = 10 * 1000 //ws10秒超时

export class WebSocketClient {

    onStatusChange = () => { }
    onData = (obj: any) => { }

    private ws?: WS
    private createWS: () => WS
    private _isConnected = false
    private readonly name: string

    constructor(p: {
        log_tag: string
        url: string
        ss?: boolean
        headers?: { [key: string]: string }
    }) {
        this.name = p.log_tag
        const options: ws_client.ClientOptions = {}

        if (p.ss) {
            options.agent = new SocksProxyAgent(`socks://127.0.0.1:${userConfig.ssPort}`)
        }

        if (p.headers !== undefined) {
            options.headers = p.headers
        }

        this.createWS = () => new WS(p.url, options)
        this.connect()
    }

    sendJSON(obj: any) {
        if (this.ws !== undefined && this.isConnected) {
            try {
                this.ws.send(JSON.stringify(obj))
            } catch (error) {

            }
        }
    }

    get isConnected() {
        return this._isConnected
    }

    private connect = () => {
        this.ws = this.createWS()
        console.log('ws 连接中 ' + this.name)
        this.ws.onopen = () => {
            console.log('ws 连接成功 ' + this.name)
            if (this._isConnected === false) {
                this._isConnected = true
                this.onStatusChange()
            }
            // this.pingPong()
        }

        this.ws.onerror = this.ws.onclose = this.reconnect

        this.ws.onmessage = e => this.onData(pure.safeJSONParse(e.data + ''))
    }

    private reconnect = () => {
        console.log('ws 断开重连 ' + this.name)

        //destroy
        if (this.ws !== undefined) {
            this.ws.onopen = this.ws.onerror = this.ws.onclose = this.ws.onmessage = () => { }
            // this.ws.removeAllListeners('pong')
            this.ws.close()
            this.ws.terminate()
            this.ws = undefined
        }

        if (this._isConnected) {
            this._isConnected = false
            this.onStatusChange()
        }

        //connect
        setTimeout(this.connect, 1000)
    }


    // private pingPong() {
    //     const { ws } = this
    //     if (ws === undefined) return

    //     let pong = true

    //     ws.addEventListener('pong', () => pong = true)

    //     const f = () => {
    //         if (ws === this.ws) {
    //             if (pong === false) {
    //                 this.reconnect()
    //             } else {
    //                 pong = false
    //                 try {
    //                     ws.ping()
    //                 } catch (error) {

    //                 }
    //                 setTimeout(f, pingTimeout)
    //             }
    //         }
    //     }
    //     f()
    // }
} 