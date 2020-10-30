import * as R from 'ramda'

export namespace pure {

    export const base64 = (str: string) =>
        Buffer.from(str).toString('base64')


    //闰秒？？！！
    export namespace timeID {

        export const xx_ms = (ms: number) => ({
            toID: (timestamp: number) => Math.floor(timestamp / ms),
            toTimestamp: (id: number) => id * ms, //>=id  <id+1
        })

        export const _500ms = xx_ms(500)
    }


    export const toRange = ({ min, max, value }: {
        min: number
        max: number
        value: number
    }) => {
        if (value < min) {
            return min
        }
        else if (value > max) {
            return max
        }
        else {
            return value
        }
    }

    export const fixFloat = (n: number) => Number(n.toFixed(5))

    export const formatDate = (
        date: Date,
        f: (
            v: {
                年: string
                月: string
                日: string

                时: string
                分: string
                秒: string
                毫秒: string
            }
        ) => string
    ) =>
        f({
            年: date.getFullYear().toString(),
            月: (date.getMonth() + 1).toString().padStart(2, '0'),
            日: date.getDate().toString().padStart(2, '0'),
            时: date.getHours().toString().padStart(2, '0'),
            分: date.getMinutes().toString().padStart(2, '0'),
            秒: date.getSeconds().toString().padStart(2, '0'),
            毫秒: date.getMilliseconds().toString().padStart(3, '0')
        })


    export const lastNumber = (arr: ArrayLike<number>) => {
        for (let i = arr.length - 1; i >= 0; i--) {
            if (isNaN(arr[i]) === false) {
                return arr[i]
            }
        }
        return NaN
    }


    export const mapKV = R.mapObjIndexed as { //修复ramda的类型 啥都没干   可以用Curry<T>简化
        <In, Out, T>(
            f: (value: In, key: keyof T, obj: T) => Out,
            obj: T & { [key: string]: In }
        ): { [P in keyof T]: Out }

        <In, Out, T>(
            f: (value: In, key: keyof T, obj: T) => Out
        ): (obj: T & { [key: string]: In }) => { [P in keyof T]: Out }
    }


    //只支持 number boolean string object array(相同类型 可以多维)
    //sample 不支持 key 是 __prototype__
    export const toType = <T>(sample: T) =>
        (data: any): T => {
            if (typeof sample === 'number' || typeof sample === 'boolean' || typeof sample === 'string') {
                if (typeof sample === 'number' && data === null) {
                    return NaN as any //支持一下 NaN
                } else {
                    return (typeof data === typeof sample) ? data : sample
                }
            }
            else if (sample instanceof Array) {
                const arr = data instanceof Array ? data : []
                return arr.map(toType(sample[0])) as any
            }
            else if (typeof sample === 'object') {
                const obj = (typeof data === 'object') && (data instanceof Array === false) ? data : {}
                return mapKV((value, key) => toType(value)(obj[key]), sample as any) as any
            }
            else {
                return {} as any
            }
        }


    export const safeJSONParse = (str: string) => {
        try {
            return JSON.parse(str)
        } catch (e) {
            return undefined
        }
    }


    export const deepMapNullToNaN = (obj: any): any => {
        if (obj === null) {
            return NaN
        }
        else if (typeof obj === 'number' || typeof obj === 'string' || typeof obj === 'boolean') {
            return obj
        }
        else if (obj instanceof Array) {
            return obj.map(deepMapNullToNaN)
        }
        else if (obj instanceof Object) {
            return pure.mapKV(deepMapNullToNaN, obj)
        }
    }


    export const keys = Object.keys as <T>(x: T) => Array<keyof T>

}