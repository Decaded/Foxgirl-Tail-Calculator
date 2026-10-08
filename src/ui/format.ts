import { presets } from '../state';

export const length = (cm: number, metric: boolean, d = 1) => (metric ? `${cm.toFixed(d)} cm` : `${(cm / 2.54).toFixed(d)} in`);

export const mass = (kg: number, metric: boolean, d = 1) => (metric ? `${kg.toFixed(d)} kg` : `${(kg * 2.20462).toFixed(d)} lb`);

export const volume = (cm3: number, metric: boolean, d = 2) => (metric ? `${(cm3 / 1000).toFixed(d)} L` : `${(cm3 * 0.0610237).toFixed(d)} in³`);

export function loreLabel(legend: number) {
	if (legend >= 0.85) return 'Rule-of-Cool';
	if (legend >= 0.65) return 'Anime Interpretation';
	if (legend >= 0.45) return 'Shrine Canon';
	if (legend >= 0.2) return 'Folklore Accurate';
	return 'Field Biologist';
}

export function rankLabel(tails: number) {
	return presets[Math.min(Math.max(Math.round(tails), 1), 9) - 1].name;
}
