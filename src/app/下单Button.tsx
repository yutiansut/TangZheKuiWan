import * as React from 'react'
import { style } from 'typestyle'

const buttonStyle = style({
    margin: 'auto auto',
    width: '300px',
    height: '40px',
    lineHeight: '40px',
    borderRadius: '2px 2px 2px 2px',
    fontSize: '18px',
    textAlign: 'center',
    $nest: {
        '&:active': {
            boxShadow: '2px 2px 2px #999 inset'
        }
    }
})

export const 下单Button = (p: {
    style?: React.CSSProperties
    bgColor: string
    text: string
    left?: () => void
    right?: () => void
}) => <div
    className={buttonStyle}
    style={{
        backgroundColor: p.bgColor,
        opacity: 1,
        cursor: 'pointer',
        ...p.style,
    }}
    onMouseDown={e => {
        if (p.left !== undefined) {
            if (e.button === 0) {
                p.left()
            } else if (e.button === 2) {
                (p.right ? p.right : p.left)()
            }
        }
    }}
>{p.text}</div>