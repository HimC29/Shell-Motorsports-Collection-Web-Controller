const uuid = "0000fff0-0000-1000-8000-00805f9b34fb";
const ctrlUuid = "d44bc439-abfd-45a2-b575-925416129600";
const battUuid = "d44bc439-abfd-45a2-b575-925416129601";

function reqQcar() {
    return navigator.bluetooth.requestDevice({
        filters: [{ namePrefix: "QCAR-" }],
        optionalServices: [uuid]
    });
}

export async function connectQcar() {
    const device = await reqQcar();
    const server = await device.gatt.connect();
    const service = await server.getPrimaryService(uuid);
    const ctrlChar = await service.getCharacteristic(ctrlUuid);
    const battChar = await service.getCharacteristic(battUuid);
    
    return { server, service, ctrlChar, battChar };
}

export function disconnectQcar(server) {
    if (server && server.connected) {
        server.device.gatt.disconnect();
    }
}