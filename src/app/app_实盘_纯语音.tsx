import { remote } from 'electron'
import { 提醒__realTickClient } from './提醒'

console.log('提醒__realTickClient', 提醒__realTickClient)

remote.getCurrentWindow().setAlwaysOnTop(true)