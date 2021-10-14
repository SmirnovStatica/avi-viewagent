"use strict"

const { BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const fs = require('fs')
const Store = require('./lib/store')

// app.commandLine.appendSwitch('disable-site-isolation-trials')

class AVIWindow extends BrowserWindow {
    constructor({ appDataPath, channelId, releaseVersion, force }) {

        if (!appDataPath || typeof appDataPath !== 'string') 
            throw new Error('AVIWindow: Invalid appDataPath')
        if (!channelId || typeof channelId !== 'string') 
            throw new Error('AVIWindow: Invalid channelId')
        if (!releaseVersion || typeof releaseVersion !== 'string') 
            throw new Error('AVIWindow: Invalid releaseVersion')
        if (!force || typeof force !== 'boolean') 
            throw new Error('AVIWindow: Invalid force value')

        super({ 
            width: 800, 
            height: 600,
            webPreferences: {
                nodeIntegration: false,
                preload: path.join(__dirname, 'preload.js')
            },
            show: false
        })

        const aviDataPath = path.join(appDataPath, `AVI_${channelId}`)
        if (!fs.existsSync(aviDataPath)) fs.mkdirSync(aviDataPath)

        this.store = this.initStore(path.join(appDataPath, `AVI_${channelId}`))
        
        const params = `channelId=${channelId}` + 
            `&releaseVersion=${releaseVersion}` +
            `&force=${force}` + 
            `&runsCount=${this.store.get('runs_count')}` +
            `&lastReleaseVersion=${this.store.get('last_release_version')}`

        this.loadURL(path.join('file://', __dirname, `index.html?${params}`))

        this.webContents.openDevTools()
    }
    
    initStore(appDataPath) {
        ipcMain.on('store-set', (event, entries) => {
            for (const [key, value] of Object.entries(entries)) {
                this.store.set(key, value);
            }
        })

        return new Store({
            configName: 'config',
            appDataPath,
            defaults: {
                runs_count: 0,
                last_release_version: undefined
            }
        })
    }
}

module.exports = AVIWindow