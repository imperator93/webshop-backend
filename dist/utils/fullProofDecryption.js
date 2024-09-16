"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fullProofDecryption = void 0;
const fullProofDecryption = (str) => {
    let decryptedPass = "";
    let word = "";
    for (let i = 0; i < str.length; i++) {
        if (str[i] == "|") {
            str.slice(i, i + 1);
            const numWord = parseInt(word) - 10;
            decryptedPass += String.fromCharCode(numWord);
            word = "";
        }
        else
            word += str[i];
    }
    return decryptedPass;
};
exports.fullProofDecryption = fullProofDecryption;
