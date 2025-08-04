// Initialize spirit particles
function createParticles() {
	const container = document.body;
	const particleCount = 15;

	for (let i = 0; i < particleCount; i++) {
		const particle = document.createElement('div');
		particle.classList.add('spirit-particle');

		// Random size between 2px and 10px
		const size = Math.random() * 8 + 2;
		particle.style.width = `${size}px`;
		particle.style.height = `${size}px`;

		// Random position
		particle.style.left = `${Math.random() * 100}%`;
		particle.style.top = `${Math.random() * 100}%`;

		// Random color
		const colors = ['var(--primary)', 'var(--secondary)', 'var(--tertiary)'];
		particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

		// Random opacity
		particle.style.opacity = Math.random() * 0.6 + 0.2;

		// Random animation delay
		particle.style.animationDelay = `${Math.random() * 15}s`;

		container.appendChild(particle);
	}
}

// Base BMI calculation adapted for spiritual beings
function calculateBodyWeight(height, tailCount, age) {
	const baseWeight = Math.pow(height / 100, 2) * 19.5;
	const metabolicAdjustment = 1 + Math.log2(tailCount) * 0.02;
	const supportMass = baseWeight * (0.04 * (tailCount - 1));
	const ageFactor = 1 + age / 1000; // Age adds 0.1% per year
	return (baseWeight * metabolicAdjustment * ageFactor + supportMass).toFixed(1);
}

function calculateEarHeight(height, tailCount) {
	let baseEar = height < 50 ? 10 : 20 + (height - 150) / 5;
	const tailBonus = tailCount > 5 ? (tailCount - 5) * 1.5 : 0;
	return Math.max(10, baseEar + tailBonus).toFixed(1);
}

function calculateFoxgirlTail(height, tailCount, tailShape, age) {
	// Tail length now properly incorporates tail shape and age
	const baseLength = height / 2 + height / 4;
	const shapeFactor = tailShape === 'fluffy' ? 1.15 : tailShape === 'sleek' ? 0.85 : 1;
	const ageFactor = 1 + age / 500;
	const tailLength = (baseLength * shapeFactor * ageFactor).toFixed(2);

	const spiritLightness = 1 - Math.min(0.5, tailCount * 0.04);
	const densityFactor = tailShape === 'fluffy' ? 1.2 : tailShape === 'sleek' ? 0.8 : 1;
	const baseDensity = 0.25;
	const density = baseDensity * spiritLightness * densityFactor;

	const sections = 10;
	const taperingFactor = 3.37;
	const sectionLength = tailLength / sections;
	let totalVolume = 0;

	for (let i = 0; i < sections; i++) {
		const sectionLengthAdjusted = (sectionLength * (sections - i)) / sections;
		const radius = sectionLengthAdjusted * 0.5 * taperingFactor;
		const sectionVolume = Math.PI * Math.pow(radius, 2) * sectionLengthAdjusted;
		totalVolume += sectionVolume;
	}

	const tailVolumeLiters = totalVolume / 1000;
	const tailMass = (tailVolumeLiters * density).toFixed(2);

	return {
		tailLength,
		tailMass,
		tailVolumeLiters: tailVolumeLiters.toFixed(2),
		tailVolumeCm3: totalVolume.toFixed(2),
	};
}

function calculateFluffiness(tailCount, tailShape) {
	let fluffiness = tailShape === 'fluffy' ? 60 : tailShape === 'sleek' ? 15 : 30;
	fluffiness += tailCount * 3;
	return Math.min(100, fluffiness);
}

function calculateComplexity(tailCount, fluffiness) {
	const elderBoost = tailCount >= 9 ? 20 : tailCount >= 7 ? 10 : 0;
	return Math.min(100, tailCount * 8 + fluffiness / 2 + elderBoost);
}

// Spiritual power (stronger for more tails and age)
function calculateSpiritPower(tailCount, age) {
	return Math.min(100, Math.log2(tailCount + 1) * 20 + tailCount * 2 + age * 0.05).toFixed(1);
}

// Tail colors for 1-9 tails
const tailColors = [
	'#4fd1ff', // Tail 1: Soft Blue
	'#4fff8a', // Tail 2: Light Green
	'#b57edc', // Tail 3: Lavender
	'#ff7f50', // Tail 4: Coral
	'#ffd700', // Tail 5: Gold
	'#ff6b8b', // Tail 6: Pink
	'#00ffff', // Tail 7: Cyan
	'#ffa500', // Tail 8: Orange
	'#ff4f8b', // Tail 9: Crimson Flame
];

// Foxfire names for each tail count
const foxfireNames = [
	'Soft Blue', // Tail 1
	'Light Green', // Tail 2
	'Lavender', // Tail 3
	'Coral', // Tail 4
	'Gold', // Tail 5
	'Pink', // Tail 6
	'Cyan', // Tail 7
	'Orange', // Tail 8
	'Crimson Flame', // Tail 9
];

// Foxfire color based on tails
function getFoxfireColor(tailCount) {
	return tailColors[tailCount - 1] || tailColors[tailColors.length - 1];
}

function getFoxfireName(tailCount) {
	return foxfireNames[tailCount - 1] || foxfireNames[foxfireNames.length - 1];
}

// Max tail span (visual span, not length)
function calculateTailSpan(tailCount, tailLength) {
	return (tailCount * tailLength * 0.3).toFixed(1);
}

// Create aura particles
function createAuraParticles(container, color) {
	container.innerHTML = '';
	const particleCount = 15;

	for (let i = 0; i < particleCount; i++) {
		const particle = document.createElement('div');
		particle.classList.add('aura-particle');
		particle.style.left = `${Math.random() * 100}%`;
		particle.style.top = `${Math.random() * 100}%`;
		particle.style.animationDelay = `${Math.random() * 2}s`;
		particle.style.color = color;
		container.appendChild(particle);
	}
}

function calculateKitsuneProperties() {
	const height = parseFloat(document.getElementById('height').value) || 165;
	const age = parseInt(document.getElementById('age').value) || 30;
	const tailCount = parseInt(document.getElementById('tailCount').value) || 9;
	const tailShape = document.getElementById('tailShape').value;

	// if (height < 50) {
	// 	alert('Height must be at least 50cm');
	// 	return;
	// }

	const bodyWeight = calculateBodyWeight(height, tailCount, age);
	const earHeight = calculateEarHeight(height, tailCount);
	const tailProps = calculateFoxgirlTail(height, tailCount, tailShape, age);
	const fluffiness = calculateFluffiness(tailCount, tailShape);
	const complexity = calculateComplexity(tailCount, fluffiness);
	const spiritPower = calculateSpiritPower(tailCount, age);
	const foxfireColor = getFoxfireColor(tailCount);
	const foxfireName = getFoxfireName(tailCount);
	const tailSpan = calculateTailSpan(tailCount, parseFloat(tailProps.tailLength));

	const totalWeight = (parseFloat(bodyWeight) + tailProps.tailMass * tailCount).toFixed(1);

	let badgeText = '';
	if (tailCount === 1) badgeText = 'Kit (1 Tail)';
	else if (tailCount === 2) badgeText = 'Maiden (2 Tails)';
	else if (tailCount === 3) badgeText = 'Matron (3 Tails)';
	else if (tailCount === 4) badgeText = 'Ascendant (4 Tails)';
	else if (tailCount === 5) badgeText = 'Mythic (5 Tails)';
	else if (tailCount === 6) badgeText = 'Elder (6 Tails)';
	else if (tailCount === 7) badgeText = 'Ancient (7 Tails)';
	else if (tailCount === 8) badgeText = 'Demigod (8 Tails)';
	else badgeText = 'Celestial (9 Tails)';

	// Update aura visual
	const auraVisual = document.querySelector('.aura-visual');
	auraVisual.style.background = `rgba(30, 25, 55, 0.7)`;

	// Update CSS variable for tail color
	document.documentElement.style.setProperty('--current-tail-color', foxfireColor);

	// Create aura particles
	const auraParticles = document.getElementById('auraParticles');
	createAuraParticles(auraParticles, foxfireColor);

	// Update DOM
	document.getElementById('kitsuneBadge').textContent = badgeText;
	document.getElementById('physicalValue').textContent = `${bodyWeight} kg`;
	document.getElementById('earValue').textContent = `${earHeight} cm`;
	document.getElementById('tailLength').textContent = `${tailProps.tailLength} cm`;
	document.getElementById('tailMass').textContent = `${tailProps.tailMass} kg`;
	document.getElementById('tailVolume').textContent = `${tailProps.tailVolumeLiters} liters`;
	document.getElementById('totalWeight').textContent = `${totalWeight} kg`;
	document.getElementById('spiritPower').textContent = `${spiritPower}%`;

	// Update foxfire color with glowing text
	const foxfireElement = document.getElementById('foxfireColor');
	foxfireElement.textContent = foxfireName;
	foxfireElement.className = 'result-value foxfire-glow';
	foxfireElement.style.color = foxfireColor;
	foxfireElement.style.textShadow = `0 0 10px ${foxfireColor}`;

	document.getElementById('ageValue').textContent = `${age} years`;
	document.getElementById('tailSpan').textContent = `${tailSpan} cm`;
	document.getElementById('auraIntensity').style.width = `${fluffiness}%`;
	document.getElementById('tailComplexity').style.width = `${complexity}%`;
	document.getElementById('complexityValue').textContent = complexity > 80 ? 'Very High' : complexity > 60 ? 'High' : complexity > 40 ? 'Medium' : 'Low';

	// Animation for updated values
	// document.querySelectorAll('.result-value').forEach(el => {
	// 	el.style.transform = 'scale(1.1)';
	// 	setTimeout(() => {
	// 		el.style.transform = 'scale(1)';
	// 	}, 300);
	// });
}

// Help button
document.getElementById('helpBtn').addEventListener('click', function () {
	const modal = document.getElementById('helpModal');
	modal.style.display = 'block';
});

document.querySelector('.close').addEventListener('click', function () {
	document.getElementById('helpModal').style.display = 'none';
});

window.addEventListener('click', function (event) {
	const modal = document.getElementById('helpModal');
	if (event.target === modal) {
		modal.style.display = 'none';
	}
});

// Preset buttons
document.querySelectorAll('.preset-btn').forEach(btn => {
	btn.addEventListener('click', function () {
		const preset = this.dataset.preset;
		const presets = {
			kit: { tails: 1, age: 8, height: 100, shape: 'fluffy' },
			teen: { tails: 2, age: 25, height: 150, shape: 'bushy' },
			young3: { tails: 3, age: 60, height: 155, shape: 'bushy' },
			young4: { tails: 4, age: 115, height: 160, shape: 'bushy' },
			adult5: { tails: 5, age: 200, height: 165, shape: 'sleek' },
			adult6: { tails: 6, age: 325, height: 168, shape: 'sleek' },
			elder7: { tails: 7, age: 500, height: 170, shape: 'sleek' },
			elder8: { tails: 8, age: 750, height: 172, shape: 'fluffy' },
			celestial: { tails: 9, age: 1200, height: 175, shape: 'fluffy' },
		};

		const p = presets[preset];
		document.getElementById('height').value = p.height;
		document.getElementById('age').value = p.age;
		document.getElementById('tailCount').value = p.tails;
		document.getElementById('tailShape').value = p.shape;

		// Visual feedback
		document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
		this.classList.add('active');

		// Immediately calculate with new values
		calculateKitsuneProperties();
	});
});

// Initialize and set up event listeners
document.addEventListener('DOMContentLoaded', function () {
	createParticles();
	calculateKitsuneProperties();

	// Set up input event listeners
	document.getElementById('height').addEventListener('input', calculateKitsuneProperties);
	document.getElementById('age').addEventListener('input', calculateKitsuneProperties);
	document.getElementById('tailCount').addEventListener('change', calculateKitsuneProperties);
	document.getElementById('tailShape').addEventListener('change', calculateKitsuneProperties);

	// Initial aura animation
	setTimeout(() => {
		document.getElementById('auraIntensity').style.width = '50%';
	}, 500);
});
