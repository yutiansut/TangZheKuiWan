import { pure } from './pure'

export class 普通K<T extends { id: number }>{

    private _lastItem?: T
    private _rule: Omit<{ [P in keyof T]: '累加' | '最新' | '开' | '高' | '低' | '收' }, 'id'>
    private 收key = ''

    constructor(rule: Omit<{ [P in keyof T]: '累加' | '最新' | '开' | '高' | '低' | '收' }, 'id'>) {
        this._rule = rule

        for (const key in rule) {
            if ((rule as any)[key] === '收') {
                this.收key = key
                break
            }
        }
    }

    onNew = (item: T) => { }
    onUpdate = (item: T) => { }
    onComplete = (item: T) => { }
    input(item: T) {
        //初始化
        if (this._lastItem === undefined) {
            this._lastItem = item
            this.onNew(this._lastItem)
        }
        //更新最后一个
        else if (this._lastItem.id === item.id) {
            this._lastItem = pure.mapKV((v: any, k) => {
                if (k === 'id') return v

                const type = (this._rule as any)[k] as string
                const v2 = (item as any)[k]

                if (type === '累加') {
                    return v + v2
                }
                else if (type === '开') {
                    return v
                }
                else if (type === '高') {
                    return Math.max(v, v2)
                }
                else if (type === '低') {
                    return Math.min(v, v2)
                }
                else if (type === '收' || type === '最新') {
                    return v2
                }
                else {
                    throw new Error('Sampling 不支持的 type' + type)
                }
            }, this._lastItem)
            this.onUpdate(this._lastItem)
        }
        //
        else if (this._lastItem.id < item.id) {
            //结束上一个
            this.onComplete(this._lastItem)

            //更新空的
            for (let i = this._lastItem.id + 1; i < item.id; i++) {
                this._lastItem = pure.mapKV((v: any, k) => {
                    if (k === 'id') return i

                    const type = (this._rule as any)[k] as string

                    if (type === '累加') {
                        return 0
                    }
                    else if (type === '开' || type === '高' || type === '低') {
                        return (this._lastItem as any)[this.收key]
                    }
                    else if (type === '收' || type === '最新') {
                        return v
                    }
                    else {
                        throw new Error('Sampling 不支持的 type ' + type)
                    }
                }, this._lastItem)
                this.onNew(this._lastItem)
                this.onComplete(this._lastItem)
            }

            //追加 
            this._lastItem = item
            this.onNew(this._lastItem)
        }
    }


} 