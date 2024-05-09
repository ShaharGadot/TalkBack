import { app, BrowserWindow } from "electron";
import path from "path";

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1400,
    height: 1400,
    icon: "C:/Users/guyga/OneDrive/שולחן העבודה/TalkBack/Backgammon-main/FrontEnd/Desktop-Client/src/assets/icon.ico",
    webPreferences: {
      nodeIntegration: true,
    },
  });
  console.log("C:\Users\guyga\OneDrive\שולחן העבודה\TalkBack\Backgammon-main\FrontEnd\Desktop-Client\src\assets\icon.ico");

  win.loadURL("http://localhost:5173/auth");

}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
