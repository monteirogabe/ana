function validateCPF(cpf) {
    try {
        const digits = cpf.split("").map(Number);

        let multiplier = 2;
        let sumOfFirstDigit = 0;

        for (let i = 8; i >= 0; i--) {
            sumOfFirstDigit += digits[i] * multiplier;
            multiplier++;
        }

        let firstRemainder = sumOfFirstDigit % 11;
        let firstDigit = firstRemainder < 2 ? 0 : 11 - firstRemainder;

        if (firstDigit !== digits[9]) {
            throw new Error("Primeiro dígito verificador do CPF inválido.");
        }

        multiplier = 2;
        let sumOfSecondDigit = 0;

        for (let i = 9; i >= 0; i--) {
            sumOfSecondDigit += digits[i] * multiplier;
            multiplier++;
        }

        let secondRemainder = sumOfSecondDigit % 11;
        let secondDigit = secondRemainder < 2 ? 0 : 11 - secondRemainder;

        if (secondDigit !== digits[10]) {
            throw new Error("Segundo dígito verificador do CPF inválido.");
        }

        const cpfComplete = digits.join("");
        return cpfComplete;

    } catch (error) {
        throw new Error("CPF inválido." + " " + error.message);
    }
}

module.exports = {
    validateCPF,
};