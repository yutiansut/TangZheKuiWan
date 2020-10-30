import * as React from 'react'
import { Switch } from '@material-ui/core'
import { CustomDialog } from './CustomDialog'
import { 预判 } from './预判'
import { 数字选择 } from './数字选择'

const renderItem = (key: string, value: any, set参数: (value: any) => void) => {//<------------------------------------------
    if (typeof value === 'boolean') {
        return <预判 value={value} onChange={set参数} />
    }
    else if (typeof value === 'number') {
        if (key === '止损' || key === '止盈'|| key === '杠杆'|| key === '价差'|| key === '波动率') {
            return <数字选择
                arr={{
                    '止损': [-5, 1, 5, 10, 20, 30, 50,100],
                    '止盈': [-99, 10, 20, 30, 40],
                    '杠杆': [5, 10, 15, 20,25,30,50],
                    '价差': [10, 15, 20, 30,50],
                    '波动率': [50, 80, 120],
                }[key]}
                value={value}
                onChange={set参数}
            />
        }

        return <a
            style={{ fontSize: 28, color: 'yellow' }}
            href='#'
            onClick={() => {
                CustomDialog.showInput({
                    title: key,
                    value: String(value),
                    onOK: v => set参数(Number(v)),
                })
            }}
        >
            {String(value)}
        </a>
    }
    else if (value === 'Sell' || value === 'Buy') {
        return <a
            style={{ fontSize: 28, color: value === 'Sell' ? 'red' : 'green' }}
            href='#'
            onClick={() => set参数(value === 'Sell' ? 'Buy' : 'Sell')}
        >
            {String(value)}
        </a>
    }
    else {
        return String(value)
    }
}

const renderKey = (key: string) => {
    let color = '#ffffff'
    if (key.indexOf('买') !== -1 && key.indexOf('卖') === -1) color = 'green'
    else if (key.indexOf('卖') !== -1 && key.indexOf('买') === -1) color = 'red'
    return <span style={{ color }}> {key} </span>
}


export const 任务遥控器UI = (p: {
    list: {
        id: string
        折叠: boolean
        开关: boolean
        参数: { key: string, value: any }[]
    }[]
    set折叠: (id: string, value: boolean) => void
    set开关: (id: string, value: boolean) => void
    set参数: (id: string, key: string, value: any) => void
}) =>
    <div style={{
        backgroundColor: '#24292d',
        margin: 'auto auto',
        padding: '10px 5px',
        fontFamily: 'SourceHanSansSC-regular',
        color: 'white',
        fontSize: '24px',
        userSelect: 'none',
        cursor: 'default'
    }}>
        {p.list.map(item =>
            <div
                key={item.id}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'left',
                }}>
                <p>
                    <a style={{ fontSize: 28, color: item.折叠 ? '#cc66ff' : '#666666' }} href='#' onClick={() => p.set折叠(item.id, !item.折叠)}>{item.id}</a>
                    <Switch checked={item.开关} onChange={() => p.set开关(item.id, !item.开关)} /></p>
                {item.折叠 ?
                    item.参数.map(param =>
                        <div key={param.key} style={{ opacity: item.开关 ? 1 : 0.25 }}>
                            {renderKey(param.key)}:{renderItem(String(param.key), param.value, v => p.set参数(item.id, param.key, v))}
                        </div>
                    ) : ''
                }
            </div>
        )}
    </div >