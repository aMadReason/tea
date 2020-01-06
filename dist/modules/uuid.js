export const uuid = () => {
    const cryptoObj = window.crypto || window.msCrypto;
    const uuid = ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c => (c ^
        (cryptoObj.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16));
    return uuid;
};
export function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c => (c ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16));
}
export const genId = () => {
    return (new Date().getTime().toString(36) +
        "_" +
        (Date.now() + Math.random().toString()).split(".").join("_"));
};
