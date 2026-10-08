export const PHI = 1.618033988749;
export const REF_HEIGHT_CM = 165;
export const REF_WEIGHT_KG = 55;
export const FUR_DENSITY_G_CM3 = 1.05;
export const MATURITY_AGE = 25;
export const HEAD_RATIO = 7.5;
export const SPIRIT_REFERENCE_AGE = 9000;

export type TailType = "sleek" | "bushy" | "fluffy";
export type BodyForm = "humanoid" | "hybrid" | "animal";

export type Input = {
	heightCm: number;
	age: number;
	tails: number;
	tailType: TailType;
	legend: number;
	form: BodyForm;
};

export type Results = {
	heightCm: number;
	headHeightCm: number;
	age: number;
	maturity: number;
	mature: boolean;
	spiritualFactor: number;
	buildFactor: number;
	bodyWeightKg: number;
	tailWeightKg: number;
	totalWeightKg: number;
	tailLengthCm: number;
	tailDiameterCm: number;
	tailTipDiameterCm: number;
	volumeEachCm3: number;
	volumeTotalCm3: number;
	earHeightCm: number;
	earWidthCm: number;
};

export const tailSpecs: Record<
	TailType,
	{
		lengthRatio: number;
		diameterRatio: number;
		furMassFactor: number;
		species: string;
	}
> = {
	sleek: {
		lengthRatio: 0.32,
		diameterRatio: 0.042,
		furMassFactor: 0.9,
		species: "Fennec Fox",
	},
	bushy: {
		lengthRatio: 0.38,
		diameterRatio: 0.048,
		furMassFactor: 1,
		species: "Red Fox",
	},
	fluffy: {
		lengthRatio: 0.35,
		diameterRatio: 0.062,
		furMassFactor: 1.15,
		species: "Arctic Fox",
	},
};

export const formProfiles: Record<
	BodyForm,
	{ label: string; heightScale: number; earScale: number }
> = {
	humanoid: { label: "Humanoid", heightScale: 1, earScale: 1 },
	hybrid: { label: "Hybrid", heightScale: 1.08, earScale: 1.15 },
	animal: { label: "Animal", heightScale: 1.25, earScale: 1.25 },
};

const clamp = (v: number, min: number, max: number) =>
	Math.min(Math.max(v, min), max);
const finite = (v: number, fallback: number) =>
	Number.isFinite(v) ? v : fallback;

export function calculate(input: Input): Results {
	const heightCm =
		clamp(finite(input.heightCm, REF_HEIGHT_CM), 10, 500) *
		formProfiles[input.form].heightScale;
	const age = clamp(finite(input.age, 1), 1, 9999);
	const tails = Math.round(clamp(finite(input.tails, 1), 1, 9));
	const legend = clamp(finite(input.legend, 0.5), 0, 1);

	const physicalAge = Math.min(age, MATURITY_AGE);
	const maturity = physicalAge / MATURITY_AGE;
	const spiritualFactor =
		Math.log10(age + 1) / Math.log10(SPIRIT_REFERENCE_AGE);

	const baseBuild = 0.9 + maturity * 0.25;
	const tailLoadFactor = 1 + Math.log2(tails) * 0.05;
	const buildFactor = baseBuild * (1 + (tailLoadFactor - 1) * (1 - legend));

	const bodyWeightKg =
		REF_WEIGHT_KG * (heightCm / REF_HEIGHT_CM) ** 3 * buildFactor;

	const specs = tailSpecs[input.tailType];
	const visualBoost = 1 + legend * 0.25;
	const tailLengthBase = heightCm * specs.lengthRatio * (0.95 + maturity * 0.1);
	const indexFactor = Math.max(0.85 + legend * 0.1, 1 - (tails - 1) * 0.015);
	const tailLengthCm = tailLengthBase * indexFactor * visualBoost;
	const tailDiameterCm =
		heightCm * specs.diameterRatio * (1 + spiritualFactor * 0.15) * visualBoost;
	const tailTipDiameterCm = tailDiameterCm / PHI;

	const r1 = tailDiameterCm / 2;
	const r2 = tailTipDiameterCm / 2;
	const volumeEachCm3 =
		(Math.PI * tailLengthCm * (r1 * r1 + r1 * r2 + r2 * r2)) / 3;

	const weightPerTailKg =
		(volumeEachCm3 * FUR_DENSITY_G_CM3 * specs.furMassFactor) / 1000;
	const tailWeightKg = weightPerTailKg * tails * (1 - legend * 0.4);

	const headHeightCm = heightCm / HEAD_RATIO;
	const earHeightCm =
		headHeightCm *
		0.9 *
		(0.95 + maturity * 0.1) *
		formProfiles[input.form].earScale;
	const earWidthCm = earHeightCm * (0.45 + (1 / PHI - 0.45) * legend);

	return {
		heightCm,
		headHeightCm,
		age,
		maturity,
		mature: physicalAge >= MATURITY_AGE,
		spiritualFactor,
		buildFactor,
		bodyWeightKg,
		tailWeightKg,
		totalWeightKg: bodyWeightKg + tailWeightKg,
		tailLengthCm,
		tailDiameterCm,
		tailTipDiameterCm,
		volumeEachCm3,
		volumeTotalCm3: volumeEachCm3 * tails,
		earHeightCm,
		earWidthCm,
	};
}
