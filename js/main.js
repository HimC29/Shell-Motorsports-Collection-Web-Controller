import { connectQcar, disconnectQcar } from './bluetooth.js';
import { buildCommand } from './command.js';
import { toHex, fromHex, encryptHex } from './crypto.js';

const connectBtn = document.getElementById("connect");
const turboBtn = document.getElementById("turbo");
const controls = document.getElementById("controls");
const batteryContainer = document.getElementById("batteryContainer");
const batteryDisplay = document.getElementById("batteryDisplay");
const batteryFill = document.getElementById("batteryFill");

function setConnectedState(isConnected) {
    connected = isConnected;
    connectBtn.textContent = isConnected ? "Disconnect" : "Connect";
    controls.classList.toggle("disabled", !isConnected);
    turboBtn.classList.toggle("disabled", !isConnected);
    batteryContainer.style.display = isConnected ? "flex" : "none";
}

let server;
let service;

let ctrlChar;
let battChar;

let sending = false;

let connected = false;

const keys = {
    forward: false,
    backward: false,
    left: false,
    right: false
};
let turbo = false;

const keyMap = {
    'ArrowUp': 'forward',
    'ArrowDown': 'backward',
    'ArrowLeft': 'left',
    'ArrowRight': 'right',
    'w': 'forward',
    's': 'backward',
    'a': 'left',
    'd': 'right'
};

function pressKey(key, el) {
    if (!connected) return;
    keys[key] = true;
    el.classList.add('active');
}

function releaseKey(key, el) {
    keys[key] = false;
    el.classList.remove('active');
}

document.querySelectorAll('#controls button').forEach(btn => {
    const key = btn.dataset.key;
    btn.addEventListener('mousedown', () => pressKey(key, btn));
    btn.addEventListener('mouseup', () => releaseKey(key, btn));
    btn.addEventListener('touchstart', e => { e.preventDefault(); pressKey(key, btn); });
    btn.addEventListener('touchend', () => releaseKey(key, btn));
    btn.addEventListener("mouseleave", () => {if(!keys[key]) return; releaseKey(key, btn)});
});

async function sendCommand(forward, backward, left, right, turbo) {
    await ctrlChar.writeValue(fromHex(encryptHex(toHex(buildCommand(forward, backward, left, right, turbo)))));
}

function toggleTurbo() {
    if (!connected) return;
    turbo = !turbo;
    turboBtn.textContent = turbo ? "Turbo ON" : "Turbo OFF";
    turboBtn.classList.toggle("turbo-on", turbo);
}

connectBtn.addEventListener("click", async () => {
    if(connected == false) {
        try {
            const result = await connectQcar((batteryPct) => {
                batteryDisplay.textContent = batteryPct + "%";
                batteryFill.style.width = batteryPct + "%";
                batteryFill.style.background = batteryPct > 60 ? "#16a34a" : batteryPct > 25 ? "#ca8a04" : "#dc2626";
            });

            // wait 500ms before starting to send
            await new Promise(resolve => setTimeout(resolve, 500));

            server = result.server;
            service = result.service;
            ctrlChar = result.ctrlChar;
            battChar = result.battChar;

            server.device.addEventListener('gattserverdisconnected', () => {
                ctrlChar = null;
                server = null;
                setConnectedState(false);
            });
            setConnectedState(true);

            setInterval(async () => {
                if (!ctrlChar || sending) return;
                sending = true;
                await sendCommand(keys.forward, keys.backward, keys.left, keys.right, turbo);
                sending = false;
            }, 100);
        }
        catch(e) {
            setConnectedState(false);
            ctrlChar = null;
            server = null;
            console.error(e);
        }
    }
    else {
        try {
            disconnectQcar(server);
            setConnectedState(false);
        }
        catch(e) {
            setConnectedState(true);
            console.error(e);
        }
    }
});

document.addEventListener('keydown', e => {
    e.preventDefault();
    const key = keyMap[e.key];
    if (!key) return;
    const btn = document.querySelector(`[data-key="${key}"]`);
    pressKey(key, btn);
});

document.addEventListener('keyup', e => {
    e.preventDefault();
    const key = keyMap[e.key];
    if (!key) {
        if(e.key.toUpperCase() == "T") {
            toggleTurbo();
        }
        return
    }
    const btn = document.querySelector(`[data-key="${key}"]`);
    releaseKey(key, btn);
});

turboBtn.addEventListener("click", toggleTurbo);