import { readFileSync, writeFileSync, unlinkSync } from 'fs'

export class 本地存储<T>{

    constructor(private path: string) {

    }

    clear = () => {
        try {
            unlinkSync(this.path)
        } catch  {

        }
    }

    read = (): T[] => {
        try {
            const str = readFileSync(this.path, { encoding: 'utf-8' })
            const arr: T[] = JSON.parse(`[${str}0]`)
            arr.pop()
            return arr
        } catch  {

        }
        return []
    }

    push = (value: T) => {
        writeFileSync(this.path, JSON.stringify(value) + ',\n', { flag: 'a' })
    }
} 