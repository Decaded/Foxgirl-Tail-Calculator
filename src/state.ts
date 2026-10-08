import type { BodyForm, TailType } from './model';

export type EntryUnit = 'cm' | 'in';
export type Theme = 'dark' | 'light';

export type State = {
	heightCm: number;
	entryUnit: EntryUnit;
	age: number;
	tails: number;
	tailType: TailType;
	legend: number;
	form: BodyForm;
	theme: Theme;
};

export const defaultState: State = {
	heightCm: 165,
	entryUnit: 'cm',
	age: 800,
	tails: 1,
	tailType: 'bushy',
	legend: 0.5,
	form: 'humanoid',
	theme: 'dark',
};

const CM_PER_IN = 2.54;

export type Preset = {
	name: string;
	heightCm: number;
	age: number;
	tails: number;
	tailType: TailType;
	legend: number;
	form: BodyForm;
};

export const presets: Preset[] = [
	{
		name: 'Kit',
		heightCm: 100,
		age: 8,
		tails: 1,
		tailType: 'fluffy',
		legend: 0.05,
		form: 'humanoid',
	},
	{
		name: 'Maiden',
		heightCm: 150,
		age: 25,
		tails: 2,
		tailType: 'bushy',
		legend: 0.16,
		form: 'humanoid',
	},
	{
		name: 'Matron',
		heightCm: 155,
		age: 60,
		tails: 3,
		tailType: 'bushy',
		legend: 0.28,
		form: 'humanoid',
	},
	{
		name: 'Ascendant',
		heightCm: 160,
		age: 115,
		tails: 4,
		tailType: 'bushy',
		legend: 0.39,
		form: 'humanoid',
	},
	{
		name: 'Mythic',
		heightCm: 165,
		age: 200,
		tails: 5,
		tailType: 'sleek',
		legend: 0.5,
		form: 'humanoid',
	},
	{
		name: 'Elder',
		heightCm: 168,
		age: 325,
		tails: 6,
		tailType: 'sleek',
		legend: 0.61,
		form: 'humanoid',
	},
	{
		name: 'Ancient',
		heightCm: 170,
		age: 500,
		tails: 7,
		tailType: 'sleek',
		legend: 0.73,
		form: 'humanoid',
	},
	{
		name: 'Demigod',
		heightCm: 172,
		age: 750,
		tails: 8,
		tailType: 'fluffy',
		legend: 0.84,
		form: 'humanoid',
	},
	{
		name: 'Celestial',
		heightCm: 175,
		age: 1200,
		tails: 9,
		tailType: 'fluffy',
		legend: 0.95,
		form: 'humanoid',
	},
];

export const presetPatch = (preset: Preset): Partial<State> => ({
	heightCm: preset.heightCm,
	age: preset.age,
	tails: preset.tails,
	tailType: preset.tailType,
	legend: preset.legend,
	form: preset.form,
});

export function randomPatch(): Partial<State> {
	const pick = <T>(values: readonly T[]): T => values[Math.floor(Math.random() * values.length)];
	return {
		heightCm: Math.round((90 + Math.random() * 100) * 10) / 10,
		age: Math.round(5 + Math.random() ** 2 * 1995),
		tails: 1 + Math.floor(Math.random() * 9),
		tailType: pick(['sleek', 'bushy', 'fluffy'] as const),
		legend: Math.round(Math.random() * 100) / 100,
		form: pick(['humanoid', 'hybrid', 'animal'] as const),
	};
}

export const displayHeight = (heightCm: number, unit: EntryUnit) => (unit === 'cm' ? heightCm : heightCm / CM_PER_IN);

export const toHeightCm = (value: number, unit: EntryUnit) => (unit === 'cm' ? value : value * CM_PER_IN);

export function stateFromUrl(search: string): State {
	const p = new URLSearchParams(search);

	const num = (key: string, fallback: number, min: number, max: number) => {
		const raw = p.get(key);
		const v = Number(raw);
		return raw !== null && raw !== '' && Number.isFinite(v) ? Math.min(Math.max(v, min), max) : fallback;
	};

	const oneOf = <T extends string>(key: string, values: readonly T[], fallback: T) => {
		const raw = p.get(key);
		return (values as readonly string[]).includes(raw ?? '') ? (raw as T) : fallback;
	};

	return {
		heightCm: num('h', defaultState.heightCm, 10, 500),
		entryUnit: oneOf('u', ['cm', 'in'] as const, defaultState.entryUnit),
		age: num('a', defaultState.age, 1, 9999),
		tails: num('t', defaultState.tails, 1, 9),
		tailType: oneOf('tt', ['sleek', 'bushy', 'fluffy'] as const, defaultState.tailType),
		legend: num('l', defaultState.legend, 0, 1),
		form: oneOf('form', ['humanoid', 'hybrid', 'animal'] as const, defaultState.form),
		theme: defaultState.theme,
	};
}

export function urlFromState(state: State): string {
	const p = new URLSearchParams({
		h: String(Number(state.heightCm.toFixed(2))),
		u: state.entryUnit,
		a: String(state.age),
		t: String(state.tails),
		tt: state.tailType,
		l: String(state.legend),
		form: state.form,
	});
	return `?${p}`;
}

export function loadTheme(): Theme {
	return localStorage.getItem('theme') === 'light' ? 'light' : 'dark';
}

export function saveTheme(theme: Theme) {
	localStorage.setItem('theme', theme);
	document.documentElement.dataset.theme = theme;
}
