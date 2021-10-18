"use strict"

const { BrowserWindow, ipcMain, screen } = require('electron')
const path = require('path')
const fs = require('fs')
const Store = require('./lib/store')

class AVIWindow extends BrowserWindow {
    /*
    * @constructor AVIWindow
    * @param {string} userDataPath
    * @param {string} channelId
    * @param {string} releaseVersion
    * @param {boolean} force
    */
    constructor({ userDataPath, channelId, releaseVersion, force }) {
        try {
            super({ 
                webPreferences: {
                    allowRunningInsecureContent: false,
                    contextIsolation: true,
                    enableRemoteModule: false,
                    nodeIntegration: false,
                    nodeIntegrationInWorker: false,
                    nodeIntegrationInSubFrames: false,
                    preload: path.join(__dirname, "preload.js")
                },
                frame: false,
                show: false,
                thickFrame: true,
                skipTaskbar: true,
                resizable: false,
                alwaysOnTop: true,
                roundedCorners: false
            })
            
            if (!userDataPath || typeof userDataPath !== 'string') 
                throw 'Invalid userDataPath'
            if (!channelId || typeof channelId !== 'string') 
                throw 'Invalid channelId'
            if (!releaseVersion || typeof releaseVersion !== 'string') 
                throw 'Invalid release version'
            if (typeof force !== 'boolean') 
                throw 'Invalid force value'
            
            const aviDataPath = path.join(userDataPath, `AVI_${channelId}`)
            if (!fs.existsSync(aviDataPath)) fs.mkdirSync(aviDataPath)
           
            this.store = this.initStore(aviDataPath)
             
            const params = `channelId=${channelId}` + 
                `&releaseVersion=${releaseVersion}` +
                `&force=${force}` + 
                `&runsCount=${this.store.get('runs_count')}` +
                `&lastReleaseVersion=${this.store.get('last_release_version')}`

            this.loadURL(path.join('file://', __dirname, `index.html?${params}`))
    
            this.webContents.setWindowOpenHandler((e) => {
                require('electron').shell.openExternal(e.url) 
                return { action: "deny" } 
            })

            this.initCommunication()

            // this.webContents.openDevTools()
        } catch (error) {
            this.handleError(error)
        }
    }

    /*
    * @function initStore
    * @param {string} aviDataPath
    * @returns {Store}
    */

    initStore(aviDataPath) {
        ipcMain.on('aviwindow-store-set', (event, entries) => {
            for (const [key, value] of Object.entries(entries)) {
                this.store.set(key, value);
            }
        })

        return new Store({
            aviDataPath,
            defaults: {
                runs_count: 0,
                last_release_version: undefined
            }
        })
    }

    /*
    * @function initCommunication
    * @returns {void}
    */

    initCommunication() {
        ipcMain.on('aviwindow-window-show', (e, bannerSize) => {
            const display = screen.getPrimaryDisplay();
            this.setWindowBounds(bannerSize, display)

            screen.on('display-metrics-changed', (e, display) => {
                this.setWindowBounds(bannerSize, display)
            })

            this.show();
        })

        ipcMain.on('aviwindow-window-close', () => {
            this.closeWindow()
        })

        ipcMain.on('aviwindow-error', (e, error) => {
            this.handleError(error)
        })
    }

    /*
     * @param {object} bannerSize 
     * @param {object} display 
     * @returns {void}
     */

    setWindowBounds(bannerSize, display) {
        const displayWidth = display.bounds.width;
        const displayHeight = display.bounds.height;

        if (process.platform === 'darwin') {
            this.setBounds({
                width: bannerSize.width + 2,
                height: bannerSize.height + 2,
                x: displayWidth - bannerSize.width - 25,
                y: display.workArea.y + (display.workArea.height - bannerSize.height) + 25
            })
        } else {
            this.setBounds({
                width: bannerSize.width + 2,
                height: bannerSize.height + 2,
                x: displayWidth - bannerSize.width - 25,
                y: displayHeight - bannerSize.height - 50
            })
        } 
    }

    /*
    * @function handleError
    * @param {string} error
    * @returns {void}
    */

    handleError(error) {
        console.error(`AVIWindow Error: ${error}`)
        // this.closeWindow()
    }
    
    /*
    * @function closeWindow
    * @returns {void}
    */

    closeWindow() {
        this.destroy()
    }

    /*
    * @function uninstall
    * @returns {void}
    */

    static uninstall({ userDataPath, channelId }) {
        try {
            if (!userDataPath || typeof userDataPath !== 'string')
                throw 'Invalid userDataPath'
            if (!channelId || typeof channelId !== 'string')
                throw 'Invalid channelId'
    
            const aviDataPath = path.join(userDataPath, `AVI_${channelId}`)
            if (fs.existsSync(aviDataPath)) fs.rmSync(aviDataPath, { recursive: true })
        } catch (error) {
            console.error(`AVIWindow uninstall error: ${error}`)
        }
    }
}

module.exports = AVIWindow