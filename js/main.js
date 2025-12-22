const PHI = 1.618033988749;
let currentTailType = 'bushy';

const tailSpecs = {
	sleek: {
		lengthRatio: 0.32,
		diameterRatio: 0.042,
		furMassFactor: 0.9,
		species: 'Fennec Fox',
		glowClass: 'glow-sleek',
	},
	bushy: {
		lengthRatio: 0.38,
		diameterRatio: 0.048,
		furMassFactor: 1.0,
		species: 'Red Fox',
		glowClass: 'glow-bushy',
	},
	fluffy: {
		lengthRatio: 0.35,
		diameterRatio: 0.062,
		furMassFactor: 1.15,
		species: 'Arctic Fox',
		glowClass: 'glow-fluffy',
	},
};

/* ---------- UI HELPERS ---------- */

function updateTailCount() {
	const count = document.getElementById('tailCount').value;
	document.getElementById('tailCountLabel').textContent = count;
}

function updateLegend() {
	const v = document.getElementById('legend').value;
	document.getElementById('legendLabel').textContent = v;
	updateLoreLabel(parseFloat(v));
}

function updateLoreLabel(legend) {
	let label = 'Field Biologist';

	if (legend >= 0.85) label = 'Rule-of-Cool';
	else if (legend >= 0.65) label = 'Anime Interpretation';
	else if (legend >= 0.45) label = 'Shrine Canon';
	else if (legend >= 0.2) label = 'Folklore Accurate';

	const el = document.getElementById('loreLabel');
	if (el) el.textContent = label;

	const container = document.getElementById('loreLabel')?.parentElement;
	if (!container) return;

	container.className =
		'mt-3 px-4 py-2 rounded-lg border text-center ' +
		(legend >= 0.85
			? 'border-yellow-500 bg-yellow-950/40'
			: legend >= 0.65
			? 'border-pink-500 bg-pink-950/40'
			: legend >= 0.45
			? 'border-red-700 bg-red-950/60'
			: 'border-slate-600 bg-slate-900/60');
}

function setTailType(type) {
	if (!tailSpecs[type]) return;
	currentTailType = type;

	['sleek', 'bushy', 'fluffy'].forEach(t => {
		const btn = document.getElementById(`btn-${t}`);
		btn.className =
			t === type
				? 'py-2 px-4 rounded-lg font-medium transition-colors bg-red-600 text-white'
				: 'py-2 px-4 rounded-lg font-medium transition-colors bg-slate-700 text-red-300 hover:bg-slate-600';
	});

	document.getElementById('speciesLabel').textContent = `Based on ${tailSpecs[type].species}`;

	const foxImg = document.getElementById('foxImage');
	foxImg.className = `w-64 h-64 object-contain transition-all duration-500 ${tailSpecs[type].glowClass}`;

	calculate();
}

function formatValue(value, decimals = 1) {
	return value.toFixed(decimals);
}

function copyShareLink() {
	updateURL();

	navigator.clipboard.writeText(window.location.href).then(() => {
		const btn = document.getElementById('copyLink');
		const original = btn.textContent;

		btn.textContent = 'Copied!';
		btn.classList.add('bg-red-600', 'text-white');

		setTimeout(() => {
			btn.textContent = original;
			btn.classList.remove('bg-red-600', 'text-white');
		}, 1200);
	});
}

/* ---------- URL PARAMS ---------- */

function loadFromURL() {
	const p = new URLSearchParams(window.location.search);

	if (p.has('h')) document.getElementById('height').value = p.get('h');
	if (p.has('u')) document.getElementById('unit').value = p.get('u');
	if (p.has('a')) document.getElementById('age').value = p.get('a');
	if (p.has('t')) document.getElementById('tailCount').value = p.get('t');
	if (p.has('l')) document.getElementById('legend').value = p.get('l');
	if (p.has('tt')) setTailType(p.get('tt'));

	updateTailCount();
	updateLegend();
}

function updateURL() {
	const p = new URLSearchParams({
		h: document.getElementById('height').value,
		u: document.getElementById('unit').value,
		a: document.getElementById('age').value,
		t: document.getElementById('tailCount').value,
		tt: currentTailType,
		l: document.getElementById('legend').value,
	});
	history.replaceState(null, '', `?${p.toString()}`);
}

/* ---------- CORE CALC ---------- */

function calculate() {
	const heightVal = parseFloat(document.getElementById('height').value);
	const ageVal = parseFloat(document.getElementById('age').value);
	const tailCountVal = parseInt(document.getElementById('tailCount').value);
	const unitVal = document.getElementById('unit').value;
	const legendFactor = parseFloat(document.getElementById('legend').value);

	const heightCm = unitVal === 'metric' ? heightVal : heightVal * 2.54;

	// Age model
	const physicalAge = Math.min(ageVal, 25);
	const maturity = physicalAge / 25;
	const spiritualFactor = Math.log10(ageVal + 1) / Math.log10(9000);

	// Build factor
	const baseBuild = 0.9 + maturity * 0.25;
	const tailLoadFactor = 1 + Math.log2(tailCountVal) * 0.05;
	const buildFactor = baseBuild * (1 + (tailLoadFactor - 1) * (1 - legendFactor));

	// Body weight (cubic scaling)
	const referenceHeight = 165;
	const referenceWeight = 55;

	const bodyWeightKg = referenceWeight * Math.pow(heightCm / referenceHeight, 3) * buildFactor;

	// Tail dimensions
	const specs = tailSpecs[currentTailType];
	const tailVisualBoost = 1 + legendFactor * 0.25;

	const tailLengthBase = heightCm * specs.lengthRatio * (0.95 + maturity * 0.1);

	const tailIndexFactor = Math.max(0.85 + legendFactor * 0.1, 1 - (tailCountVal - 1) * 0.015);

	const tailLength = tailLengthBase * tailIndexFactor * tailVisualBoost;

	const tailBaseDiameter = heightCm * specs.diameterRatio * (1 + spiritualFactor * 0.15) * tailVisualBoost;

	const tailTipDiameter = tailBaseDiameter * 0.3;

	// Tail volume
	const r1 = tailBaseDiameter / 2;
	const r2 = tailTipDiameter / 2;
	const h = tailLength;

	const volumePerTail = (Math.PI * h * (r1 * r1 + r1 * r2 + r2 * r2)) / 3;

	// Tail weight
	const tissueDensity = 1.05;
	const weightPerTail = (volumePerTail * tissueDensity * specs.furMassFactor) / 1000;

	const tailMassForgiveness = 1 - legendFactor * 0.4;
	const totalTailWeight = weightPerTail * tailCountVal * tailMassForgiveness;

	const totalWeight = bodyWeightKg + totalTailWeight;

	// Ears
	const headHeight = heightCm / 7.5;
	const foxEarHeight = headHeight * 0.9 * (0.95 + maturity * 0.1);
	const foxEarBase = foxEarHeight * 0.45;

	// Conversions
	const L = cm => (unitVal === 'metric' ? { value: cm, unit: 'cm' } : { value: cm / 2.54, unit: 'in' });

	const W = kg => (unitVal === 'metric' ? { value: kg, unit: 'kg' } : { value: kg * 2.205, unit: 'lbs' });

	const V = cm3 => (unitVal === 'metric' ? { value: cm3 / 1000, unit: 'L' } : { value: cm3 * 0.0610237, unit: 'in³' });

	// Output
	document.getElementById('bodyWeight').textContent = `${formatValue(W(bodyWeightKg).value, 1)} ${W(bodyWeightKg).unit}`;
	document.getElementById('totalWeight').textContent = `${formatValue(W(totalWeight).value, 1)} ${W(totalWeight).unit}`;
	document.getElementById('buildFactor').textContent = `${formatValue(buildFactor, 2)}×`;
	document.getElementById('buildStatus').textContent = physicalAge < 25 ? `Maturing (${physicalAge}y)` : 'Mature (25y+)';

	document.getElementById('tailWeight').textContent = `${formatValue(W(totalTailWeight).value, 2)} ${W(totalTailWeight).unit}`;
	document.getElementById('tailLength').textContent = `${formatValue(L(tailLength).value, 1)} ${L(tailLength).unit}`;
	document.getElementById('tailDiameter').textContent = `${formatValue(L(tailBaseDiameter).value, 1)} ${L(tailBaseDiameter).unit}`;
	document.getElementById('totalVolume').textContent = `${formatValue(V(volumePerTail * tailCountVal).value, 2)} ${V(volumePerTail * tailCountVal).unit}`;
	document.getElementById('volumeEach').textContent = `${formatValue(V(volumePerTail).value, 2)} ${V(volumePerTail).unit}`;
	document.getElementById('earHeight').textContent = `${formatValue(L(foxEarHeight).value, 1)} ${L(foxEarHeight).unit}`;
	document.getElementById('earWidth').textContent = `${formatValue(L(foxEarBase).value, 1)} ${L(foxEarBase).unit}`;

	updateURL();
}

/* ---------- INIT ---------- */

loadFromURL();
calculate();
