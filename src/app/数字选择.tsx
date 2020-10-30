import * as React from 'react'
import { style } from 'typestyle'

const aStyle = style({
    padding: '8px',
    fontSize: 28,
    $nest: {
        '&:hover': {
            boxShadow: '2px 2px 2px #999 inset'
        }
    }
})

export const 数字选择 = (p: { arr: number[], value: number, onChange: (value: number) => void }) =>
    <span>
        {
            p.arr.map((v, i) =>
                <a
                    key={v}
                    className={aStyle}
                    style={{
                        color: p.value === v ? 'yellow' : 'gray',
                    }}
                    href='#'
                    onClick={() => p.onChange(v)}
                >
                    {String(v).padStart(2, '0')}
                </a>
            )
        }
    </span>