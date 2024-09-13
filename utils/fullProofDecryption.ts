export const fullProofDecryption = (str: string) => {
	let decryptedPass = "";
	let word = "";
	for (let i = 0; i < str.length; i++) {
		if (str[i] == "|") {
			str.slice(i, i + 1);
			const numWord = parseInt(word) - 10;
			decryptedPass += String.fromCharCode(numWord);
			word = "";
		} else word += str[i];
	}

	return decryptedPass;
};
