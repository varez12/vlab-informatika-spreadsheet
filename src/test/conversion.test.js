import { describe, it, expect } from 'vitest'
import {
    getDecToBinSteps,
    getBinToDecSteps,
    binToDecimal,
    decimalToBin
} from '../utils/conversion'

describe('Binary Conversion Utilities', () => {

    describe('decimalToBin', () => {
        it('should convert 0 to "0"', () => {
            expect(decimalToBin(0)).toBe('0')
        })

        it('should convert 5 to "101"', () => {
            expect(decimalToBin(5)).toBe('101')
        })

        it('should convert 255 to "11111111"', () => {
            expect(decimalToBin(255)).toBe('11111111')
        })

        it('should return empty string for negative numbers', () => {
            expect(decimalToBin(-5)).toBe('')
        })

        it('should return empty string for non-integers', () => {
            expect(decimalToBin(3.14)).toBe('')
        })
    })

    describe('binToDecimal', () => {
        it('should convert "0" to 0', () => {
            expect(binToDecimal('0')).toBe(0)
        })

        it('should convert "101" to 5', () => {
            expect(binToDecimal('101')).toBe(5)
        })

        it('should convert "11111111" to 255', () => {
            expect(binToDecimal('11111111')).toBe(255)
        })

        it('should return NaN for invalid binary string', () => {
            expect(binToDecimal('123')).toBeNaN()
        })

        it('should return NaN for empty string', () => {
            expect(binToDecimal('')).toBeNaN()
        })
    })

    describe('getDecToBinSteps', () => {
        it('should return steps for converting 5', () => {
            const steps = getDecToBinSteps(5)
            expect(steps).toHaveLength(3)
            expect(steps[0]).toEqual({ val: 5, q: 2, r: 1 })
            expect(steps[1]).toEqual({ val: 2, q: 1, r: 0 })
            expect(steps[2]).toEqual({ val: 1, q: 0, r: 1 })
        })

        it('should return single step for 0', () => {
            const steps = getDecToBinSteps(0)
            expect(steps).toHaveLength(1)
            expect(steps[0]).toEqual({ val: 0, q: 0, r: 0 })
        })

        it('should return empty array for negative numbers', () => {
            expect(getDecToBinSteps(-5)).toEqual([])
        })
    })

    describe('getBinToDecSteps', () => {
        it('should return steps for "101"', () => {
            const steps = getBinToDecSteps('101')
            expect(steps).toHaveLength(3)
            expect(steps[0]).toEqual({ digit: 1, power: 0, value: 1 })
            expect(steps[1]).toEqual({ digit: 0, power: 1, value: 0 })
            expect(steps[2]).toEqual({ digit: 1, power: 2, value: 4 })
        })

        it('should return empty array for invalid binary', () => {
            expect(getBinToDecSteps('123')).toEqual([])
        })
    })
})
