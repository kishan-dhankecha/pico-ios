<div align="center">

  <img src="assets/icon.png" alt="App Icon" width="120" />

  <h2>Pocket8 • A native PICO-8 emulator for iOS & Android.</h2>

  <p>
    <a href="https://github.com/jevonlipsey/pico-ios/releases/latest">
      ⬇️ Download the latest build
    </a>
    &nbsp;•&nbsp;
    <a href="https://ko-fi.com/jevonlipsey">
      ☕ Support on Ko-fi
    </a>
  </p>

</div>

https://github.com/user-attachments/assets/ec24f92e-d29a-4319-8293-439487d60b35

## Features

- **Cross-Platform Native**: Runs flawlessly on **iOS** and **Android** with 100% save-state integrity across app restarts.
- **Quick Save & Load**: The **only** PICO-8 experience with instant save states. Freeze time and resume anywhere, across devices.

<p align="center">
  <img src="assets/quickload.gif" width="20%" alt="quickload" />
</p>

- **Adaptive Controls**: Custom Gameboy-esque controls with beautiful haptics. Works in portrait and landscape. Swap to virtual joystick.

<p align="center">
  <img src="assets/xzero-joystick.gif" width="50%" alt="joystick" />
</p>

- **Smart Library**: Automatically extracts cartridge labels and metadata, presenting your collection in a polished grid.

<p align="center">
  <img src="assets/libscroll-new.gif" width="20%" alt="libscroll" />
</p>

## Under the Hood: A Rant

The core engineering challenge was **reconciling the asynchronous nature of mobile file I/O with the synchronous requirements of the Emscripten/WASM virtual file system.**

PICO-8 demands a synchronous file system. Bridging this to mobile required completely reverse-engineering the Emscripten boot sequence.

- **Bootloader Hijacking:** The engine defaults to booting the standard "JELPI" demo cart. To bypass this, I had to intercept the `Module.preRun` lifecycle, manually injecting user code into the WASM heap and forcing the pointer to the correct entry point before the runtime could initialize.
- **True State Persistence:** I architected a system that dumps the _entire simulated RAM_ into a serialized blob. I implemented **GZIP** compression to keep these memory snapshots lightweight, allowing for atomic, instant state restoration.

It’s _not_ a browser wrapper; it’s a custom runtime environment built for native mobile hardware. Enjoy the speeds!

## Tech Stack

![Vue.js](https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D)
![Capacitor](https://img.shields.io/badge/Capacitor-1199EE?style=for-the-badge&logo=capacitor&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white)
![iOS](https://img.shields.io/badge/iOS-000000?style=for-the-badge&logo=apple&logoColor=white)
![Android](https://img.shields.io/badge/Android-3DDC84?style=for-the-badge&logo=android&logoColor=white)

## Installation

### iOS (Sideload)
You can sideload Pocket8 via AltStore, SideStore, or Sideloadly.

**Auto-Update Source (Recommended)**
Add the official source to **SideStore** or **AltStore** to get updates automatically (no computer needed!).

1. Copy this URL: `https://raw.githubusercontent.com/jevonlipsey/pico-ios/main/altstore.json`
2. Open SideStore/AltStore -> **Sources** -> **+** -> **Add Source**.

<p align="center">
  <img src="https://i.imgur.com/IEgMrg6.gif" width="20%" alt="Auto-Update Guide" />
</p>

**Manual IPA Install**
1. Download `Pocket8.ipa` from [Releases](https://github.com/jevonlipsey/pico-ios/releases/latest).
2. Sideload via **AltStore**, **SideStore**, or **Sideloadly**.
3. Enable **Developer Mode** in iOS Settings (Settings > General > Device Management > Your Name).

### Android (APK)
1. Download `Pocket8-Android.apk` from [Releases](https://github.com/jevonlipsey/pico-ios/releases/latest).
2. Open the file on your device.
3. If prompted, allow installation from **Unknown Sources**.
   *(Note: Play Protect may ask for confirmation. Click "More Details" -> "Install Anyway".)*

## Project Status

This is a solo dev project designed to bring the PICO-8 community a beautiful native app for mobile. I'm aiming to submit this to the App Store and Google Play as soon as possible. Check back soon (:

**Update: I've been in contact with Zep, and we are working on making Pocket8 the main way to play PICO-8 games on mobile! Stay tuned.**

### Build from Source
```bash
npm install && npx cap sync
npx cap open ios      # for Xcode
npx cap open android  # for Android Studio
```

## How to Get Games

Pocket8 plays standard `.p8.png` PICO-8 cartridges.

### 1. Find a Game
Tap the **Globe Icon** in the app to open the [Lexaloffle BBS](https://www.lexaloffle.com/bbs/) in your browser. You can also visit [itch.io](https://itch.io/games/tag-pico-8).

### 2. Save the Cartridge
**Important:** You need the **cartridge image file**, not a ZIP or EXE.
1.  Find the small square image that looks like a game cartridge (labelled "Cart").
2.  **Desktop:** Right-click the image -> "Save Image As".
3.  **Mobile:** Long-press the cart image -> "Save to Files" / "Download Image".

### 3. Import
Open Pocket8, tap the `+` icon, and select the `.p8.png` file you just saved.

> **Coming Soon: Tap to Play**
> I am currently collaborating with Zep (Lexaloffle) on an official integration! Soon, you will be able to hit "Play" directly on the BBS website, and it will automatically launch the game inside Pocket8.

## Acknowledgements

- Zep ([Lexaloffle](https://www.lexaloffle.com/)): For creating the fantasy console and being awesome in general. PICO-8 is a masterpiece of design constraints, I'm so excited to bring it to mobile!

- You: For actually reading the documentation. Thanks for the support (:
