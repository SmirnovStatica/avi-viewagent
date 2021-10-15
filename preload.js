const { ipcRenderer, contextBridge } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
    "api", {
        send: (channel, data) => {
            // whitelist channels
            // to main
            let validChannels = [
                "aviwindow-window-close",  
                "aviwindow-window-show",
                "aviwindow-store-set",
                "aviwindow-error"
            ];
            if (validChannels.includes(channel)) {
                ipcRenderer.send(channel, data);
            }
        }
    }
);