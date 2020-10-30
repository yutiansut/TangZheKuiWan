import * as React from 'react'
import * as ReactDOM from 'react-dom'
import FlexView from 'react-flexview/lib'
import { WebviewTag } from 'electron'

const arr = [
    {
        //澳元/日元
        URL: 'https://www.tradingview.com/chart/?symbol=FX%3AAUDJPY',
        周期: 5,
    },
    { //欧元/日元
        URL: 'https://www.tradingview.com/chart/?symbol=FX%3AEURJPY',
        周期: 5,
    },
    { //英镑/日元
        URL: 'https://www.tradingview.com/chart/?symbol=FX%3AGBPJPY',
        周期: 5,
    },
    {//新西兰/日元
        URL: 'https://www.tradingview.com/chart/?symbol=FX%3ANZDJPY',
        周期: 5,
    },
    {
         //美元/土耳其里拉
        URL: 'https://www.tradingview.com/chart/?symbol=FX%3AUSDTRY',
        周期: 5,
    },
    {
         //美元/南非兰特
        URL: 'https://www.tradingview.com/chart/?symbol=FX%3AUSDZAR',
        周期: 5,
    },
    {
        //美元/墨西哥比索
        URL: 'https://www.tradingview.com/chart/?symbol=FX%3AUSDMXN',
        周期:5,
    },
    {//美元/巴西雷亚尔
        URL: 'https://www.tradingview.com/chart/?symbol=FX_IDC%3AUSDBRL',
        周期: 5,
    },
    {//美元 卢布
        URL: 'https://www.tradingview.com/chart/?symbol=FOREXCOM%3AUSDRUB',
        周期: 5,
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