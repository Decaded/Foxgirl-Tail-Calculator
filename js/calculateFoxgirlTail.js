/**
 * Calculate the tail length, mass, and volume of a foxgirl's tail.
 * @param {number} foxgirlHeight The height of the foxgirl in centimeters.
 * @returns {Object} An object containing calculated tail length, mass, and volume.
 * @example
 * const foxgirlHeight = 160; // Height of the foxgirl in centimeters
 * const { tailLength, tailMass, tailVolumeLiters, tailVolumeCm3 } = calculateFoxgirlTail(foxgirlHeight);
 * console.log('Calculated tail length:', tailLength, 'cm');
 * console.log('Calculated tail mass:', tailMass, 'kg');
 * console.log('Calculated tail volume:', tailVolumeLiters, 'liters (', tailVolumeCm3, 'cm³)');
 */
function calculateFoxgirlTail(foxgirlHeight) {
	/**
	 * Calculate the length of the foxgirl's tail.
	 * @param {number} height The height of the foxgirl in centimeters.
	 * @returns {number} The calculated length of the foxgirl's tail in centimeters.
	 */
	function calculateTailLength(height) {
		const A = height / 2; // Half of the foxgirl's height
		const B = (1 / 4) * height; // One fourth of the foxgirl's height
		return A + B; // Total length of the foxgirl's tail
	}

	/**
	 * Calculate the mass of the foxgirl's tail.
	 * @param {number} length The length of the foxgirl's tail in centimeters.
	 * @returns {number} The calculated mass of the foxgirl's tail in kilograms.
	 */
	function calculateTailMass(length) {
		// Assumption: Density of the tail fur is 0.05 g/cm³
		const density = 0.05; // g/cm³ (adjusted to achieve a tail mass within 2-3 kg range)
		const radius = length * 0.25; // Assuming a uniform thickness of the tail
		const volume = Math.PI * Math.pow(radius, 2) * length; // Volume of the tail
		return (volume * density) / 1000; // Convert mass from grams to kilograms
	}

	/**
	 * Calculate the volume of the foxgirl's tail.
	 * @param {number} length The length of the foxgirl's tail in centimeters.
	 * @returns {number} The calculated volume of the foxgirl's tail in cubic centimeters.
	 */
	function calculateTailVolume(length) {
		const sections = 10; // Number of sections to divide the tail into
		const taperingFactor = 1.2; // Adjust the tapering factor as needed
		let totalVolume = 0;

		// Calculate the length and volume of each section of the tail
		const sectionLength = length / sections; // Length of each tail section
		for (let i = 0; i < sections; i++) {
			const sectionLengthAdjusted = (sectionLength * (sections - i)) / sections; // Tapering factor
			const radius = sectionLengthAdjusted * 0.5 * taperingFactor; // Adjusted radius for tapering
			const sectionVolume = Math.PI * Math.pow(radius, 2) * sectionLengthAdjusted; // Volume of the tail section
			totalVolume += sectionVolume; // Accumulate total volume
		}

		return totalVolume; // Total volume of the foxgirl's tail
	}

	// Calculate the length of the foxgirl's tail
	const tailLength = calculateTailLength(foxgirlHeight);

	// Calculate the mass of the foxgirl's tail
	const calculatedTailMass = calculateTailMass(tailLength);

	// Calculate the volume of the foxgirl's tail
	const calculatedTailVolume = calculateTailVolume(tailLength);

	// Return the calculated values
	return {
		tailLength: tailLength.toFixed(2),
		tailMass: calculatedTailMass.toFixed(2),
		tailVolumeLiters: (calculatedTailVolume / 1000).toFixed(2),
		tailVolumeCm3: calculatedTailVolume.toFixed(2),
	};
}
