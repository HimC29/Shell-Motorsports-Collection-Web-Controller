export function buildCommand(forward, backward, left, right, turbo) {
    const cmd = new Uint8Array(16);
    cmd[1] = 0x43;            // always
    cmd[2] = 0x54;            // always
    cmd[3] = 0x4c;            // always
    if(forward) cmd[4] = 1;   // forward
    if(backward) cmd[5] = 1;  // backward
    if(left) cmd[6] = 1;      // left
    if(right) cmd[7] = 1;     // right
    cmd[8] = 1;               // lights
    if(turbo) cmd[9] = 0x64;  // turbo
    else cmd[9] = 0x50;

    return cmd;
}