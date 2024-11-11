/*
 * SPDX-License-Identifier: GPL-3.0
 * Vesktop, a desktop app aiming to give you a snappier Discord Experience
 * Copyright (c) 2023 Vendicated and Vencord contributors
 */

import "./ipc";

import { app, BrowserWindow, nativeTheme, net, protocol } from "electron";
import { autoUpdater } from "electron-updater";
import { writeFileSync } from "fs";

import { DATA_DIR } from "./constants";
import { createFirstLaunchTour } from "./firstLaunch";
import { socketFile } from "./keybinds";
import { createWindows, mainWin } from "./mainWindow";
import { registerMicrophonePermissionsHandler, registerVideoPermissionsHandler } from "./mediaPermissions";
import { registerScreenShareHandler } from "./screenShare";
import { Settings, State } from "./settings";
import { addSplashLog, createSplashWindow } from "./splash";
import { isDeckGameMode } from "./utils/steamOS";

if (process.platform === "linux") {
    const hasToggleMic = process.argv.includes("--toggle-mic");
    const hasToggleDeafen = process.argv.includes("--toggle-deafen");
    if (hasToggleMic || hasToggleDeafen) {
        const command = hasToggleMic ? "VCD_TOGGLE_SELF_MUTE\n" : "VCD_TOGGLE_SELF_DEAF\n";
        writeFileSync(socketFile, command);
        process.exit(0);
    }
}
if (IS_DEV) {
    require("source-map-support").install();
} else {
    autoUpdater.checkForUpdatesAndNotify();
}

// Make the Vencord files use our DATA_DIR
process.env.EQUICORD_USER_DATA_DIR = DATA_DIR;

function init() {
    const { disableSmoothScroll, hardwareAcceleration, splashAnimationPath, arguments: args } = Settings.store;

    const enabledFeatures = app.commandLine.getSwitchValue("enable-features").split(",");
    const disabledFeatures = app.commandLine.getSwitchValue("disable-features").split(",");

    if (hardwareAcceleration === false) {
        app.disableHardwareAcceleration();
    } else {
        enabledFeatures.push("VaapiVideoDecodeLinuxGL", "VaapiVideoEncoder", "VaapiVideoDecoder");
    }

    if (disableSmoothScroll) {
        app.commandLine.appendSwitch("disable-smooth-scrolling");
    }

    // disable renderer backgrounding to prevent the app from unloading when in the background
    // https://github.com/electron/electron/issues/2822
    // https://github.com/GoogleChrome/chrome-launcher/blob/5a27dd574d47a75fec0fb50f7b774ebf8a9791ba/docs/chrome-flags-for-tools.md#task-throttling
    app.commandLine.appendSwitch("disable-renderer-backgrounding");
    app.commandLine.appendSwitch("disable-background-timer-throttling");
    app.commandLine.appendSwitch("disable-backgrounding-occluded-windows");
    if (process.platform === "win32") {
        disabledFeatures.push("CalculateNativeWinOcclusion");
    }
    if (args) {
        app.commandLine.appendArgument(args);
        console.log("Running with additional arguments:", args);
    }
    // work around chrome 66 disabling autoplay by default
    app.commandLine.appendSwitch("autoplay-policy", "no-user-gesture-required");
    // WinRetrieveSuggestionsOnlyOnDemand: Work around electron 13 bug w/ async spellchecking on Windows.
    // HardwareMediaKeyHandling,MediaSessionService: Prevent Discord from registering as a media service.
    //
    // WidgetLayering (Vencord Added): Fix DevTools context menus https://github.com/electron/electron/issues/38790
    disabledFeatures.push("WinRetrieveSuggestionsOnlyOnDemand", "HardwareMediaKeyHandling", "MediaSessionService");

    // Support TTS on Linux using speech-dispatcher
    app.commandLine.appendSwitch("enable-speech-dispatcher");

    app.commandLine.appendSwitch("enable-features", [...new Set(enabledFeatures)].filter(Boolean).join(","));
    app.commandLine.appendSwitch("disable-features", [...new Set(disabledFeatures)].filter(Boolean).join(","));

    // In the Flatpak on SteamOS the theme is detected as light, but SteamOS only has a dark mode, so we just override it
    if (isDeckGameMode) nativeTheme.themeSource = "dark";

    app.on("second-instance", (_event, _cmdLine, _cwd, data: any) => {
        if (data.IS_DEV) app.quit();
        else if (mainWin) {
            if (mainWin.isMinimized()) mainWin.restore();
            if (!mainWin.isVisible()) mainWin.show();
            mainWin.focus();
        }
    });

    app.whenReady().then(async () => {
        if (process.platform === "win32") app.setAppUserModelId("io.github.pancord.pancord");

        createSplashWindow();
        addSplashLog();

        registerScreenShareHandler();
        registerMicrophonePermissionsHandler();
        registerVideoPermissionsHandler();
        // register file handler so we can load the custom splash animation from the user's filesystem
        protocol.handle("splash-animation", () => {
            return net.fetch("file:///" + splashAnimationPath);
        });
        addSplashLog();

        bootstrap();

        app.on("activate", () => {
            if (BrowserWindow.getAllWindows().length === 0) {
                createWindows();
            }
        });
    });
}

if (!app.requestSingleInstanceLock({ IS_DEV })) {
    if (IS_DEV) {
        console.log("Pancord is already running. Quitting previous instance...");
        init();
    } else {
        console.log("Pancord is already running. Quitting...");
        app.quit();
    }
} else {
    init();
}

async function bootstrap() {
    if (!Object.hasOwn(State.store, "firstLaunch")) {
        createFirstLaunchTour();
        addSplashLog();
    } else {
        createWindows();
        addSplashLog();
    }
}

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});
