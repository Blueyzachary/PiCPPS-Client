const {
    app,
    dialog,
    BrowserWindow,
    Menu,
    MenuItem
} = require('electron')
const path = require('path')
const express = require('express');
const server = express();

let pluginName
switch (process.platform) {
	case 'win32':
		switch(process.arch){
			case 'ia32':
				pluginName = 'flash/pepflashplayer32_32_0_0_303.dll'
				break
			case 'x64':
				pluginName = 'flash/pepflashplayer64_32_0_0_303.dll'
				break
		}
		break
	case 'darwin':
		pluginName = 'flash/PepperFlashPlayer.plugin'
		break
	case 'linux':
		pluginName = 'flash/libpepflashplayer.so'
		break
}
app.commandLine.appendSwitch('ppapi-flash-path', path.join(__dirname, pluginName));

var win
app.on('ready', () => {
    win = new BrowserWindow({
        webPreferences: {
            plugins: true
        }
    })
	makeMenu()
    win.loadURL('https://play.coastalfreeze.net/client');
    Menu.setApplicationMenu(fsmenu);
})

var aboutMessage = `This standalone client for Coastal Freeze was made by Allinol & Random.
					it was made to not let Flash die forever by the end of December 2020`

function makeMenu() { // credits to random
    fsmenu = new Menu();
    if (process.platform == 'darwin') {
        fsmenu.append(new MenuItem({
            label: "Coastal Freeze Client",
            submenu: [{
                    label: 'About',
                    click: () => {
                        dialog.showMessageBox({
                            type: "info",
                            buttons: ["Ok"],
                            title: "About Coastal Freeze",
                            message: aboutMessage
                        });
                    }
                },
                {
                    label: 'Fullscreen (Toggle)',
                    accelerator: 'CmdOrCtrl+F',
                    click: () => {
                        win.setFullScreen(!win.isFullScreen());
                    }
                },
                {
                    label: 'Mute Audio (Toggle)',
                    click: () => {
                        win.webContents.audioMuted = !win.webContents.audioMuted;;
                    }
                },
                {
                    label: 'Log Out',
                    click: () => {
                        clearCache();
                        win.loadURL("https://play.coastalfreeze.net/");
                    }
                }
            ]
        }));
    }
    else {
        fsmenu.append(new MenuItem({
            label: 'About',
            click: () => {
                dialog.showMessageBox({
                    type: "info",
                    buttons: ["Ok"],
                    title: "About Coastal Freeze",
                    message: aboutMessage
                });
            }
        }));
        fsmenu.append(new MenuItem({
            label: 'Fullscreen (Toggle)',
            accelerator: 'CmdOrCtrl+F',
            click: () => {
                win.setFullScreen(!win.isFullScreen());
            }
        }));
        fsmenu.append(new MenuItem({
            label: 'Mute Audio (Toggle)',
            click: () => {
                win.webContents.audioMuted = !win.webContents.audioMuted;
            }
        }));
        fsmenu.append(new MenuItem({
            label: 'Log Out',
            click: () => {
                clearCache();
                win.loadURL("https://play.coastalfreeze.net/");
            }
        }));
    }
}
function clearCache(){
	windows = BrowserWindow.getAllWindows()[0];
	const ses = win.webContents.session;
	ses.clearCache(() => {});
}

app.on('window-all-closed', () => {
    app.quit();
});