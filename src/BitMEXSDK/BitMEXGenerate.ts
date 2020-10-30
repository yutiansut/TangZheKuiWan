import * as fs from 'fs'
import { compose, repeat, last, toPairs, join } from 'ramda'
import { Schema } from 'swagger-schema-official'
import { io } from '../utils/io'

type Item = {
    operationId: string
    parameters: {
        name: string
        required: boolean
        type: string
        description?: string
    }[]
    responses: { 200: { schema: Schema } }
}

type BitmexSwagger = {
    paths: {
        [path: string]: {
            [method: string]: Item
        }
    }
    definitions: {
        [definition: string]: Schema
    }
}

type AllHTTPAPI = {
    [packageName: string]: {
        [funcName: string]: {
            reqType: string
            resType: string
            path: string
            method: string
        }
    }
}

const SWAGGER_JSON_URL = `https://www.bitmex.com/api/explorer/swagger.json`

const repeatS = (s: string) => compose(join(''), repeat(s))
const BR = repeatS('\n')
const TAB = repeatS('    ')
const to_ = (s: string) => s.replace(/\-/, '_') //x-any x_any

const getReq1 = (type: string, description = '') => {
    const arr = description.match(/(Valid options:)([\w, ]+)./)
        || description.match(/(Available options: \[)([\w, ]+)\]./)

    return arr ? arr[2].split(',').map(v => `'${v.replace(' ', '')}'`).join(' | ') : type
}

const getReqType = (obj: Item) =>
    obj.parameters.length === 0 ? '{}' : `{${obj.parameters.map(v => `${BR(1)}${TAB(3)}${v.name}${(v.required ? '' : '?')}: ${getReq1(v.type, v.description)} /* ${v.description || ''} */`).join('')}${BR(1)}${TAB(2)}}`

const getResType = (obj: Schema, tabCount: number): string => {
    const type = obj.type ? obj.type : 'BitMEXMessage.' + to_(last(obj.$ref!.split('/')) || '')
    if (type === 'object') {
        const arr = toPairs(obj.properties!)
        if (tabCount === 0) {
            return arr.length === 0 ? '{}' : `{ ${arr.map(v => v[0] + ': ' + getResType(v[1], tabCount + 1)).join('')} }`
        } else {
            return '{' + arr.map(v => '\n' + TAB(tabCount + 1) + v[0] + ': ' + getResType(v[1], tabCount + 1)).join('') + '\n' + TAB(tabCount) + '}'
        }
    }
    else if (type === 'array') {
        return getResType(obj.items as Schema, tabCount) + '[]'
    }
    else {
        return type
    }
}

const bitmexSwaggerToAllHTTPAPI = (swagger: BitmexSwagger) => {
    let allHTTPAPI: AllHTTPAPI = Object.create(null)
    toPairs(swagger.paths).map(([path, _]) =>
        toPairs(_).map(([method, item]) => {
            const [packageName, funcName] = item.operationId.split('.')
            allHTTPAPI[packageName] = allHTTPAPI[packageName] || Object.create(null)
            allHTTPAPI[packageName][funcName] = {
                reqType: getReqType(item),
                resType: getResType(item.responses['200'].schema, 0),
                path,
                method: method.toUpperCase(),
            }
        })
    )
    return allHTTPAPI
}

const run = async () => {
    const swagger = (await io.JSONRequest<BitmexSwagger>({
        url: SWAGGER_JSON_URL,
        ss: true,
    })).data

    if (swagger === undefined) {
        console.log('swagger is undefined')
        return
    }

    fs.writeFileSync('./BitMEXMessage.ts',
        `export namespace BitMEXMessage {${
        toPairs(swagger.definitions!).map(([definition, item]) =>
            `${BR(2)}${TAB(1)}export interface ${to_(definition)} ${getResType(item, 1)}`
        ).join('')
        }
}`)

    fs.writeFileSync('./BitMEXHTTP.ts',
        `import { BitMEXMessage } from './BitMEXMessage'
import { BitMEXHTTP__call } from './BitMEXHTTP__call'

export const BitMEXHTTP = {${
        toPairs(bitmexSwaggerToAllHTTPAPI(swagger)).map(([packageName, funcDic]) =>
            `${BR(2)}${TAB(1)}${packageName}: {${
            toPairs(funcDic).map(([funcName, func]) =>
                `${BR(2)}${TAB(2)}${funcName}: (cookie: string, req: ${func.reqType}) => BitMEXHTTP__call<${func.resType}>({ cookie, method: '${func.method}', path: '/api/v1${func.path}', req })`
            )}
    }`).join(',')}
}`)
}

run()