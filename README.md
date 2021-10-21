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

More info about these parameters - https://appversion.info/views/integration/running-view-agent.html.

You can add event listener to know when AVI window is closed (see example).

### Example:

```javascript
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

// AppVersion.info window will be shown if the below conditions are met:
// - channel with id = channel_id exists,
// - banner with id = app_version exists in this channel,
// - this is not the first run of AppVersionInfo.exe,
// - previous run was with a diffrent app_version number.
// So basically, for the first time, you shouldn't expect anything to happen, and it's o.k.
// If you want to see something:
// - run your code with_appversion = "1",
// - prepare banner for release version = 2,
// - run your code with_appversion = "2".
```

On first run of module it tries to open welcome banner. Welcome banner is a banner which has '0' release version. If banner with '0' release version does not exists nothing will happen on first run of AVIWindow.

AVIWindow creates folder in your user data folder with name: 'AVI_' + channelId. This folder stores configuration file to provide appversion.info user experience logic.
You can uninstall this folder with following static method: 

```javascript
AVIWindow.uninstall({
  userDataPath: app.getPath('userData'),
  channelId: 'sAJ2_QeCP'
})
```

AppVersionInfo website - https://appversion.info.
