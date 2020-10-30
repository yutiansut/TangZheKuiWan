import { Subject } from 'rxjs'
import { pure } from './pure'

type PATH = (string | number)[]
type OP = { path: PATH, value: any }


type MAPTO<T> = {
    [P in keyof T]:
    T[P] extends number | string | boolean ? {
        ____get: () => T[P]
        ____set: (v: T[P]) => void
    } :
    T[P] extends Array<infer TT> ? {
        ____get: () => Array<TT>
        ____set: (v: Array<TT>) => void
        ____push: (v: TT) => void
        ____updateLast: (v: TT) => void
    } :
    T[P] extends Object ? MAPTO<T[P]> : never
}


export class JSONSync<T>{
    rawData: T

    data: MAPTO<T>

    subject = new Subject<OP>()

    private mapJSON = (path: string[]): any => {
        const v = this.get(path)
        if (typeof v === 'number' || typeof v === 'string' || typeof v === 'boolean') {
            return {
                ____get: () => this.get(path),
                ____set: (value: any) => this.set({ path, value }),
            }
        }
        else if (v instanceof Array) {
            return {
                ____get: () => this.get(path),
                ____set: (value: any) => this.set({ path, value }),
                ____push: (value: any) => {
                    this.set({ path: [...path, '__push__'], value })
                },
                ____updateLast: (value: any) => {
                    this.set({ path: [...path, '__last__'], value })
                }
            }
        } else if (v instanceof Object) {
            return pure.mapKV((_, key) => this.mapJSON([...path, String(key)]), v)
        } else {
            return {}
        }
    }

    constructor(data: T) { //可变数据  会改变传过来的数据
        this.rawData = data
        this.data = this.mapJSON([])
    }

    private setObjKV(obj: any, k: string | number, v: any) {
        if (k === '__push__') {
            obj.push(v)
        }
        else if (k === '__last__') {
            obj[obj.length - 1] = v
        }
        else {
            obj[k] = v
        }
    }

    set({ path, value }: OP) {
        if (path.length === 0) {
            this.rawData = value
        }
        else {
            const key = path[path.length - 1]
            const obj = path.reduce((prev: any, current, i) => i === path.length - 1 ? prev : prev[current], this.rawData)
            this.setObjKV(obj, key, value)
        }
        this.subject.next({ path, value })
    }

    private get(path: PATH) {
        if (path.length === 0) {
            return this.rawData
        }
        else {
            const key = path[path.length - 1]
            const obj = path.reduce((prev: any, current, i) => i === path.length - 1 ? prev : prev[current], this.rawData)
            return obj[key]
        }
    }
}