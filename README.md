# Pancord [<img src="/static/icon.png" width="225" align="right" alt="Pancord">](https://github.com/Pancord/Pancord)

[![Equicord](https://img.shields.io/badge/Equicord-grey?style=flat)](https://github.com/Equicord/Equicord)
[![Tests](https://github.com/Pancord/Pancord/actions/workflows/test.yml/badge.svg?branch=main)](https://github.com/Pancord/Pancord/actions/workflows/test.yml)

Pancord is a fork of [Equibop](https://github.com/Equicord/Equibop).

## Main features

-   Much more lightweight and faster than the official Discord app
-   Linux Screenshare with sound & wayland

**Extra included changes**

-   Equicord preinstalled
-   Custom Splash animations from [this PR](https://github.com/Vencord/Vesktop/pull/355)
-   Tray Customization & Voice detection and Badge from [this PR](https://github.com/Vencord/Vesktop/pull/517)
-   Global Keybind to Toggle voice status from [this PR](https://github.com/Vencord/Vesktop/pull/609)
-   Custom Arguments from [this PR](https://github.com/Equicord/Equibop/pull/46)
-   Remove (#) title prefix when Notification Badge option is toggled from [this PR](https://github.com/Vencord/Vesktop/pull/686)

**Linux Note**:
-   You can use the `--toggle-mic` & `--toggle-deafen` flags to toggle your microphone and deafen status from the terminal.

**Not fully Supported**:
<!-- not supported on windows yet lol-->
-   Global Keybinds

## Installing

### Windows

If you don't know the difference, pick the Installer.

- Installer
  - [Universal](https://github.com/Equicord/Equibop/releases/latest/download/Equibop-win.exe)
  - [x64 / amd64](https://github.com/Equicord/Equibop/releases/latest/download/Equibop-win-x64.exe)
  - [Arm® 64](https://github.com/Equicord/Equibop/releases/latest/download/Equibop-win-arm64.exe)
- Portable
  - [x64 / amd64](https://github.com/Equicord/Equibop/releases/latest/download/Equibop-win-x64.zip)
  - [Arm® 64](https://github.com/Equicord/Equibop/releases/latest/download/Equibop-win-arm64.zip)

### Mac

These work on both M Series and Intel Series Macs
-   [DMG](https://github.com/Equicord/Equibop/releases/latest/download/Equibop-mac-universal.dmg)
-   [ZIP](https://github.com/Equicord/Equibop/releases/latest/download/Equibop-mac-universal.zip)

### Linux
[![equibop](https://img.shields.io/badge/AVAILABLE_ON_THE_AUR-333232?style=for-the-badge&logo=arch-linux&logoColor=0F94D2&labelColor=%23171717)](https://aur.archlinux.org/packages?O=0&K=equibop)
<br>
<a href="https://flathub.org/apps/io.github.equicord.equibop">
  <img src="https://flathub.org/api/badge?svg" alt="Download on Flathub" style="width:220px; height:auto;">
</a>

## Building from Source

Packaging will create builds in the dist/ folder

> [!NOTE]
> On Windows, if you run the test script, you will get test errors about venmic, you can ignore these as it's a linux only module.

```sh
git clone https://github.com/Equicord/Equibop
cd Equibop

# Install Dependencies
pnpm i

# Either run it without packaging
pnpm start

# Or package
pnpm package

# Or only build the pacman target
pnpm package --linux pacman

# Or package to a directory only
pnpm package:dir
```
