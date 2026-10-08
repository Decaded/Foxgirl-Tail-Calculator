import { describe, expect, it } from 'vitest';
import { calculate, type Input, type Results } from '../src/model';

const base: Input = {
	heightCm: 165,
	age: 800,
	tails: 1,
	tailType: 'bushy',
	legend: 0.5,
	form: 'humanoid',
};

const allNumbers = (r: Results) => Object.values(r).filter(v => typeof v === 'number');

describe('calculate', () => {
	it('returns finite values for a typical input', () => {
		const r = calculate(base);
		expect(allNumbers(r).every(Number.isFinite)).toBe(true);
		expect(r.bodyWeightKg).toBeGreaterThan(0);
		expect(r.tailLengthCm).toBeGreaterThan(0);
		expect(r.earHeightCm).toBeGreaterThan(0);
		expect(r.totalWeightKg).toBeGreaterThan(r.bodyWeightKg);
	});

	it('never lets NaN or infinity escape', () => {
		const r = calculate({
			heightCm: Number.NaN,
			age: Number.POSITIVE_INFINITY,
			tails: Number.NaN,
			tailType: 'bushy',
			legend: Number.NaN,
			form: 'humanoid',
		});
		expect(allNumbers(r).every(Number.isFinite)).toBe(true);
		expect(r.heightCm).toBe(165);
		expect(r.age).toBe(1);
		expect(r.volumeTotalCm3).toBeCloseTo(r.volumeEachCm3);
	});

	it('scales weight with height and tails', () => {
		const short = calculate({ ...base, heightCm: 150 });
		const tall = calculate({ ...base, heightCm: 190 });
		const many = calculate({ ...base, tails: 9 });
		expect(tall.bodyWeightKg).toBeGreaterThan(short.bodyWeightKg);
		expect(many.totalWeightKg).toBeGreaterThan(calculate(base).totalWeightKg);
	});

	it('plateaus build factor at physical maturity', () => {
		expect(calculate({ ...base, age: 25 }).mature).toBe(true);
		expect(calculate({ ...base, age: 5000 }).buildFactor).toBe(calculate({ ...base, age: 25 }).buildFactor);
	});

	it('legend factor lengthens tails', () => {
		const real = calculate({ ...base, legend: 0 });
		const myth = calculate({ ...base, legend: 1 });
		expect(myth.tailLengthCm).toBeGreaterThan(real.tailLengthCm);
		expect(myth.tailDiameterCm).toBeGreaterThan(real.tailDiameterCm);
	});

	it('covers every tail type and body form', () => {
		for (const tailType of ['sleek', 'bushy', 'fluffy'] as const) {
			for (const form of ['humanoid', 'hybrid', 'animal'] as const) {
				const r = calculate({ ...base, tailType, form });
				expect(allNumbers(r).every(Number.isFinite)).toBe(true);
			}
		}
	});
});
