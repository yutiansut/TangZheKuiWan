import * as querystring from 'querystring'
import { userConfig } from '../userConfig'
import { io } from '../utils/io'

export const BitMEXHTTP__call = async <T>({ method, path, cookie, req }: {
    method: 'GET' | 'DELETE' | 'POST' | 'PUT'
    path: string
    cookie: string
    req: any
}) => {
    const noBody = ['GET', 'DELETE'].some(v => v === method)

    const query = noBody ? `?${querystring.stringify(req)}` : ''

    return await io.JSONRequest<T>({
        ss: userConfig.ss,
        method,
        headers: cookie === '' ? undefined : {
            Cookie: cookie,
            Referer: 'https://www.bitmex.com/app/trade/XBTUSD',
        },
        url: `https://www.bitmex.com${path}${query}`,
        body: noBody ? undefined : req,
    })
}