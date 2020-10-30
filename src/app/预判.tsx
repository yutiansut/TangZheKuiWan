import * as React from 'react'

export const 预判 = (p: {
    value: boolean
    onChange: (value: boolean) => void
}) =>
    <div style={{ display: 'inline' }}>
        <span
            style={{
                width: '50px',
                margin: '0 10px',
                cursor: 'pointer',
                fontFamily: 'SourceHanSansSC-regular',
                color: p.value ? 'yellow' : 'gray',
                fontSize: '24px',
            }} onClick={() => p.onChange(true)}>
            执行
        </span>
        <span
            style={{
                cursor: 'pointer',
                fontFamily: 'SourceHanSansSC-regular',
                color: 'gray',
                fontSize: '24px',
            }} onClick={() => p.onChange(false)}>
            取消
        </span>
    </div> 