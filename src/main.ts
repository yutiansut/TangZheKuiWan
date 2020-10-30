import * as fs from 'fs'
import * as path from 'path'
import { app, Menu, Tray, BrowserWindow, remote } from 'electron'
import { pure } from './utils/pure'
import { userConfig } from './userConfig'

const htmlString = (s: string) => s //居然没有这个现成的函数  这里没实现

const base64URL = (jsPath: string) => `data:text/html;base64,${pure.base64(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * {
      margin: 0;
      padding: 0;
    }    
    html,
    body,#root {
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
  </style>
</head>    
<body><div id="root"></div></body>
<script>  
document.body.ondragenter = document.body.ondragover = document.body.ondrop = e => {
  e.stopPropagation()
  e.preventDefault()
}
require(${htmlString(JSON.stringify(jsPath))})
</script>
</html>`)}`

const showWindow = (title: string) => {
  const CLASS = typeof window === 'undefined' ? BrowserWindow : remote.BrowserWindow
  const win = new CLASS({
    width: 550,
    height: 400,
    minWidth: 100,
    minHeight: 100,
    title,
    webPreferences: {
      nodeIntegration: true,
      webviewTag: true,
    },
  })
  win.loadURL(base64URL(path.join(__dirname, 'app', `app_${title}.js`)))

  //webContents 翻墙 
  const sourceCode = `function FindProxyForURL(url, host) {return "SOCKS5 127.0.0.1:${userConfig.ssPort}"}`
  win.webContents.session.setProxy({
    pacScript: `data:application/javascript;base64,${pure.base64(sourceCode)}`,
    proxyRules: '',
    proxyBypassRules: '',
  })
}


let tray: Tray //防止GC 
app.on('ready', () => {
  const rootPath = path.dirname(__dirname)
  tray = new Tray(path.join(rootPath, 'APP.png'))
  tray.setContextMenu(
    Menu.buildFromTemplate([
      ...fs.readdirSync(path.join(rootPath, 'src', 'app'))
        .filter(v => v.indexOf('app_') === 0)
        .map(v => v.slice(4).split('.')[0])
        .map(v => ({
          label: v,
          click: () => showWindow(v)
        })),
      { type: 'separator' },
      { label: '退出', click: () => app.exit() }
    ])
  )
})





// import * as ts from 'typescript'
// import * as util from 'util'

// //VSCode插件API
// //TypeScript Compiler API 

// const ast = ts.createSourceFile('a.ts',
//     `export function factorial(n): number {
//     if (n <= 1) {
//         return 1;
//     }
//     return n * factorial(n - 1);
// }`, ts.ScriptTarget.ES2018, true)

// console.log('AST:' + util.inspect(ast))  