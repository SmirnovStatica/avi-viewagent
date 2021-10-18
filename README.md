# AppVersion.info view agent module for Electron.js

You have to have installed Electron.js to use this module. 
Electron.js website - https://www.electronjs.org/

## Installation

To install module use npm: 
```
npm i avi-window
```

## Usage

New instance of module creates AppVersion.info window. In constructor you need to pass object with parameters:
- userDataPath {String}. By default you can get this path by method 'getPath()' from 'app' instance (see example)
- channelId {String}
- releaseVersion {String}
- force {Boolean}

More info about 'channelId', 'releaseVersion' and 'force' ypu can find here - https://appversion.info/views/integration/running-view-agent.html.

You can add event listener to know when AVI window is closed (see example).

### Example:

```
const { app } = require('electron')
const AVIWindow = require('avi-window')

let aviWindow = new AVIWindow({
  userDataPath: app.getPath('userData'),
  channelId: 'sAJ2_QeCP',
  releaseVersion: '1',
  force: true
})
aviWindow.on('closed', () => {
  aviWindow = null
})
```

It will create folder in your user data folder with name: 'AVI_' + channelId. This folder stores configuration file to provide appversion.info user experience logic. You can uninstall this folder with following static method: 

```
AVIWindow.uninstall({
  userDataPath: app.getPath('userData'),
  channelId: 'sAJ2_QeCP'
})
```

AppVersionInfo website - https://appversion.info
