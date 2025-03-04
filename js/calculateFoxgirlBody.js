function calculateBodyWeight(height, tailCount) {
	const baseWeight = Math.pow(height / 100, 2) * 19.5;
	const supportMass = baseWeight * (0.04 * (tailCount - 1));
	const metabolicAdjustment = 1 + tailCount * 0.02;
	return (baseWeight * metabolicAdjustment + supportMass).toFixed(1);
}
