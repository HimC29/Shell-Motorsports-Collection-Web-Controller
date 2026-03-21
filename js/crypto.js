const AES_KEY = "34522a5b7a6e492c08090a9d8d2a23f8";

export function toHex(uint8arr) {
    return [...uint8arr].map(b => b.toString(16).padStart(2, '0')).join('');
}

export function encryptHex(hexString) {
    const data = CryptoJS.enc.Hex.parse(hexString);
    const key = CryptoJS.enc.Hex.parse(AES_KEY);

    const encrypted = CryptoJS.AES.encrypt(data, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.NoPadding
    });

    return encrypted.ciphertext.toString();
}

export function fromHex(hexString) {
    return Uint8Array.from(
        hexString.match(/.{1,2}/g).map(b => parseInt(b, 16))
    );
}