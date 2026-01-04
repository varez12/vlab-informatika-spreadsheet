/**
 * Binary Conversion Utilities
 * Extracted for unit testing
 */

/**
 * Convert decimal to binary with step-by-step explanation
 * @param {number} num - Decimal number to convert
 * @returns {Array} Steps array with value, quotient, remainder
 */
export function getDecToBinSteps(num) {
    if (num < 0 || !Number.isInteger(num)) return [];
    if (num === 0) return [{ val: 0, q: 0, r: 0 }];

    const steps = [];
    let current = num;
    while (current > 0) {
        steps.push({
            val: current,
            q: Math.floor(current / 2),
            r: current % 2
        });
        current = Math.floor(current / 2);
    }
    return steps;
}

/**
 * Convert binary string to decimal with step-by-step explanation
 * @param {string} binStr - Binary string (e.g., "1010")
 * @returns {Array} Steps array with digit, power, value
 */
export function getBinToDecSteps(binStr) {
    if (!/^[01]+$/.test(binStr)) return [];

    return binStr.split('').reverse().map((digit, i) => ({
        digit: parseInt(digit),
        power: i,
        value: parseInt(digit) * Math.pow(2, i)
    }));
}

/**
 * Calculate decimal value from binary string
 * @param {string} binStr - Binary string
 * @returns {number} Decimal value
 */
export function binToDecimal(binStr) {
    if (!/^[01]+$/.test(binStr)) return NaN;
    return parseInt(binStr, 2);
}

/**
 * Calculate binary string from decimal
 * @param {number} num - Decimal number
 * @returns {string} Binary string
 */
export function decimalToBin(num) {
    if (num < 0 || !Number.isInteger(num)) return '';
    return num.toString(2);
}
