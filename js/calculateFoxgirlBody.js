function calculateBodyWeight(height) {
	// Using adjusted BMI formula for anthropomorphic proportions
	const baseWeight = Math.pow(height / 100, 2) * 19.5; // 19.5 = adjusted BMI constant
	return baseWeight.toFixed(1);
}
