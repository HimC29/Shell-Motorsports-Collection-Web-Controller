import { connectQcar, disconnectQcar } from './bluetooth.js';
import { buildCommand } from './command.js';
import { toHex, fromHex, encryptHex } from './crypto.js';

const connectBtn = document.getElementById("connect");
const turboBtn = document.getElementById("turbo");
const controls = document.getElementById("controls");

function setConnectedState(isConnected) {
    connected = isConnected;
    connectBtn.textContent = isConnected ? "Disconnect" : "Connect";
    controls.classList.toggle("disabled", !isConnected);
    turboBtn.classList.toggle("disabled", !isConnected);
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
});

async function sendCommand(forward, backward, left, right, turbo) {
    await ctrlChar.writeValue(fromHex(encryptHex(toHex(buildCommand(forward, backward, left, right, turbo)))));
}

connectBtn.addEventListener("click", async () => {
    if(connected == false) {
        try {
            const result = await connectQcar();
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

turboBtn.addEventListener("click", () => {
    if (!connected) return;
    turbo = !turbo;
    turboBtn.textContent = turbo ? "Turbo ON" : "Turbo OFF";
    turboBtn.classList.toggle("turbo-on", turbo);
});