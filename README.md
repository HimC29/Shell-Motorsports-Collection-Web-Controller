<div align="center">

# 🏎️ Shell Motorsports Collection Web Controller

### A Custom Web Bluetooth Controller for Shell Motorsports RC Cars

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Web Bluetooth](https://img.shields.io/badge/Web%20Bluetooth-API-0082FC?style=for-the-badge&logo=googlechrome&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge)](http://makeapullrequest.com)

**A custom web-based controller for Shell Motorsports Collection RC cars — replacing the bloated official app with a lightweight, no-install web UI that works on any device with a browser and Bluetooth.**

[Features](#-features) • [Quick Start](#-quick-start) • [Compatibility](#-compatibility) • [How It Works](#-how-it-works) • [Contributing](#-contributing)

</div>

---

## ✨ Features

<table>
<tr>
<td>

🎮 **Custom Controls**  
WASD button layout optimized for mobile

🔋 **Battery Indicator**  
Real-time battery level display from the car

🔵 **Web Bluetooth**  
Connects directly from your browser, no app needed

🔒 **AES-128 Encryption**  
Handles the car's encrypted BLE protocol automatically

</td>
<td>

⚡ **Turbo Mode**  
Toggle between normal and full speed

📱 **Mobile Friendly**  
Designed for touch with multi-button support

🔌 **Connect / Disconnect**  
Clean connection management with status feedback

</td>
</tr>
</table>

---

## 🤔 Why This Project?

The official Shell Racing app works, but where's the fun in that?

### The Motivation
- 🗑️ **No bloat** — The official Shell app includes games and extra content you don't need just to drive your car
- 📦 **No installation** — Just open the URL in Chrome, no app store, no downloads
- 🌐 **Works everywhere** — Any device with Chrome and Bluetooth works, unlike the official app which is limited to iOS and Android app stores
- 🛠️ **Build something yourself** — Learn Web Bluetooth API by doing
- 🎨 **Custom UI** — Design your own controller layout
- 🔓 **Open source** — Understand exactly how BLE RC car control works
- 🚀 **Extendable** — Add your own features the official app doesn't have

This project reverse engineers the BLE protocol used by Shell Motorsports Collection RC cars and reimplements it as a clean, open web app. 🏁

---

## 🚀 Quick Start

### Prerequisites

**Hardware:**
- Shell Motorsports Collection RC car (micro-USB model)
- Any device with Chrome browser and Bluetooth

### Usage

**1. Open the controller**

Visit: **[https://himc29.github.io/Shell-Motorsports-Collection-Web-Controller](https://himc29.github.io/Shell-Motorsports-Collection-Web-Controller)**

No installation needed — just open the link in Chrome!

**2. Connect your car**
- Turn on your RC car
- Click **Connect** and select your `QCAR-XXXXXX` device from the Bluetooth picker

**3. Drive!**
- Use the WASD buttons to control the car
- Toggle **Turbo** for full speed

> ⚠️ **Important:** Web Bluetooth requires Chrome browser. Firefox, Safari, and iOS browsers are not supported.

---

## 📱 Compatibility

| Platform | Browser | Status |
|----------|---------|--------|
| Android | Chrome | ✅ Supported |
| Windows | Chrome | ✅ Supported |
| Linux | Chrome | ✅ Supported |
| macOS | Chrome | ✅ Supported |
| iOS | Any | ❌ Not supported (Web Bluetooth unavailable) |
| Firefox | Any | ❌ Not supported |
| Safari | Any | ❌ Not supported |

### Supported RC Cars

| Model | Connector | Status |
|-------|-----------|--------|
| Shell Motorsports Collection (micro-USB) | Micro-USB | ✅ Tested |
| Shell Motorsports Collection (USB-C) | USB-C | ⚠️ Untested (different protocol byte offset) |

---

## 🔧 How It Works

### BLE Protocol

The car communicates over Bluetooth Low Energy (BLE) using the following:

```
Service UUID:        0000fff0-0000-1000-8000-00805f9b34fb
Control Char UUID:   d44bc439-abfd-45a2-b575-925416129600
Battery Char UUID:   d44bc439-abfd-45a2-b575-925416129601
```

### Command Structure

Each command is a 16-byte packet sent every 100ms:

```
Byte  Value   Description
────────────────────────────
[1]   0x43    Fixed header
[2]   0x54    Fixed header
[3]   0x4c    Fixed header
[4]   0/1     Forward
[5]   0/1     Backward
[6]   0/1     Left
[7]   0/1     Right
[8]   1       Lights (untested and set to 1 because my car doesn't have lights)
[9]   0x50    Normal speed / 0x64 for turbo
```

Before sending, the packet is **encrypted with AES-128 ECB** using a fixed key.

### Project Structure

```
Shell-Motorsports-Collection-Web-Controller/
├── index.html          — Main UI
├── LICENSE             — MIT License
├── README.md           — Project documentation
├── styles/
│   └── styles.css      — Styling
└── js/
    ├── main.js         — UI logic, key handling, send loop
    ├── bluetooth.js    — BLE connection and disconnection
    ├── command.js      — Command byte building
    └── crypto.js       — AES-128 encryption utilities
```

---

## 🎮 Controls

| Button | Action |
|--------|--------|
| **W** | Forward |
| **A** | Left |
| **S** | Backward |
| **D** | Right |
| **Turbo** | Toggle turbo mode |
| **Connect** | Connect / Disconnect |

> 💡 **Tip:** Multiple buttons can be held simultaneously for diagonal movement!

---

## 📝 Changelog

### v1.2.0
- ⌨️ Added WASD and arrow key support

### v1.1.0
- 🔋 Battery indicator with real-time updates
- 🏗️ Modular file structure (bluetooth.js, command.js, crypto.js)
- 🔌 Improved connection and disconnection handling

### v1.0.0
- 🎉 Initial release
- Basic forward, backward, left, right controls
- Turbo mode
- Connect / Disconnect

---

## 🤝 Contributing

Contributions are welcome! If you have a different Shell RC car model and want to test compatibility, open an issue or PR.

### How to Contribute

1. **Fork the Project**
2. **Create your Feature Branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit your Changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push to the Branch**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request**

### Ideas for Contributions

- 🎨 Better UI / themes
- 📳 Haptic feedback on mobile
- 🕹️ Virtual joystick instead of buttons
- 🚗 USB-C model support
- 🌐 PWA support for offline use

---

## 🐛 Troubleshooting

### Bluetooth picker doesn't appear
- Make sure you're using **Chrome** browser
- Make sure you're on **HTTPS or localhost**, not `file://`
- Enable Web Bluetooth in `chrome://flags`

### Car not showing in picker
- Make sure the car is **turned on**
- The car should appear as `QCAR-XXXXXX`
- Try turning the car off and on again

### Car connects but doesn't move
- Make sure commands are being sent (check console for errors)
- Reconnect the car
---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 🙏 Acknowledgments

- **[DarkNikGr](https://gist.github.com/DarkNikGr)** — Original HTML controller proof of concept
- **[scrool/qcar-docs](https://github.com/scrool/qcar-docs)** — BLE protocol documentation

---

<div align="center">

### ⭐ Star this repo if you found it useful!

**Made with ❤️ by [HimC29](https://github.com/HimC29)**

[Report Bug](https://github.com/HimC29/Shell-Motorsports-Collection-Web-Controller/issues) • [Request Feature](https://github.com/HimC29/Shell-Motorsports-Collection-Web-Controller/issues)

</div>