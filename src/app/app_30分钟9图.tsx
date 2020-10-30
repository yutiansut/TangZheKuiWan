import * as React from 'react'
import * as ReactDOM from 'react-dom'
import FlexView from 'react-flexview/lib'
import { WebviewTag } from 'electron'

const arr = [
    {
        URL: 'https://www.tradingview.com/chart/?symbol=OANDA%3ASPX500USD',
        周期: 30,
    },
    {
        URL: 'https://www.tradingview.com/chart/?symbol=FX%3ANZDUSD',
        周期: 30,
    },
    {
        URL: 'https://www.tradingview.com/chart/?symbol=BINANCE%3ABTCUSDT',
        周期: 30,
    },
    {
        URL: 'https://www.tradingview.com/chart/?symbol=OANDA%3AXAUUSD',
        周期: 30,
    },
    {
        URL: 'https://www.tradingview.com/chart/?symbol=OANDA%3AXAGUSD',
        周期: 30,
    },
    {
        URL: 'https://www.tradingview.com/chart/?symbol=FX%3AUKOIL',
        周期: 30,
    },
    {
        URL: 'https://www.tradingview.com/chart/?symbol=FX%3AUSDJPY',
        周期: 30,
    },
    {
        URL: 'https://www.tradingview.com/chart/?symbol=FX%3AEURUSD',
        周期: 30,
    },
    {
        URL: 'https://www.tradingview.com/chart/?symbol=FX%3AGBPJPY',
        周期: 30,
    },
]



ReactDOM.render(
    <FlexView width='100%' height='100%' wrap={true}>
        {arr.map((v, i) =>
            <webview
                key={i}
                style={{ width: '33.3%', height: '33.3%' }}
                data-周期={v.周期}
                src={v.URL}
            />
        )}
    </FlexView>
    ,
    document.querySelector('#root'),
)

const code = (n: string) => `

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const ____ = async (selectors, func) => {
    while (true) {
        const el = document.querySelector(selectors)
        if (el) {
            func(el)
            return
        }
        await sleep(100)
    }
}

const ____一直调用 = async (selectors, func) => {
    while (true) {
        const arr = [...document.querySelectorAll(selectors)]
        arr.forEach(func)
        await sleep(100)
    }
}


//小窗口
____('#tv-toasts', el => el.style.display = 'none')  

//浮动买卖面板
____('.tv-floating-toolbar', el => el.style.display = 'none') 

//打开周期
____('#header-toolbar-intervals', el => {
    el.children[0].click()

    //调周期 ${n}m
    ____('div[data-value="${n}"]', el => el.click()) 

    //全屏
    ____('#header-toolbar-fullscreen', el => el.click()) 
    ____('.tv-exit-fullscreen-button', el => el.style.display = 'none') 
}) 

//登录面板
____一直调用('.tv-dialog__modal-body', el => el.style.display = 'none') 
____一直调用('.wrap-3axdIL2R', el => el.style.display = 'none') 
____一直调用('#overlap-manager-root', el => el.style.display = 'none') 
____一直调用('.toast-wrapper-1bVS8UQ3 compact-18KspX5F', el => el.style.display = 'none') 
____一直调用('.toast-305jedKL', el => el.style.display = 'none') 
____一直调用('.toast-positioning-wrapper-1beCTfHO compact-3YQ4-rS1', el => el.style.display = 'none') 
        
`
//modal-GUK9cvUQ  overlap-manager-root
setTimeout(() => {
    const webviewList = [...(document.querySelectorAll('webview') as any as WebviewTag[])]
    webviewList.forEach(webview => webview.executeJavaScript(code(webview.dataset['周期'] || '')))
}, 1000)  