/**
 * Calculate the tail length, mass, and volume of a foxgirl's tail.
 * @param {number} foxgirlHeight The height of the foxgirl in centimeters.
 * @returns {Object} An object containing calculated tail length, mass, and volume.
 * @example
 * // Example usage:
 * const foxgirlHeight = 160; // Height of the foxgirl in centimeters
 * const { tailLength, tailMass, tailVolumeLiters, tailVolumeCm3 } = calculateFoxgirlTail(foxgirlHeight);
 * console.log('Calculated tail length:', tailLength, 'cm');
 * console.log('Calculated tail mass:', tailMass, 'kg');
 * console.log('Calculated tail volume:', tailVolumeLiters, 'liters (', tailVolumeCm3, 'cm³)');
 */
function calculateFoxgirlTail(foxgirlHeight) {
	// Constants
	const silverFoxDensity = 0.18; // Assumed density of silver fox fur in g/cm^3

	/**
	 * Calculate the length of the tail.
	 * @param {number} height The height of the foxgirl in centimeters.
	 * @param {number} tailLength The length of the tail in centimeters.
	 * @returns {number} The calculated length of the tail.
	 */
	function calculateTailLength(height, tailLength) {
		return height / 2 + 0.25 * tailLength;
	}

	/**
	 * Calculate the mass of the tail.
	 * @param {number} length The length of the tail in centimeters.
	 * @param {number} density The density of the fur in g/cm^3.
	 * @returns {number} The calculated mass of the tail in kilograms.
	 */
	function calculateTailMass(length, density) {
		const radius = length * 0.25;
		const volume = Math.PI * Math.pow(radius, 2) * length;
		return (volume * density) / 1000;
	}

	/**
	 * Calculate the volume of the tail.
	 * @param {number} length The length of the tail in centimeters.
	 * @returns {number} The calculated volume of the tail in cubic centimeters.
	 */
	function calculateTailVolume(length) {
		const radius = length * 0.25;
		return Math.PI * Math.pow(radius, 2) * length;
	}

	// Calculate tail length
	const tailLength = calculateTailLength(foxgirlHeight, 16.5 * 2.54); // Adjusted tail length converted to centimeters

	// Calculate tail mass
	const calculatedTailMass = calculateTailMass(tailLength, silverFoxDensity);

	// Calculate tail volume
	const calculatedTailVolume = calculateTailVolume(tailLength);

	// Return calculated values
	return {
		tailLength: tailLength.toFixed(2),
		tailMass: calculatedTailMass.toFixed(2),
		tailVolumeLiters: (calculatedTailVolume / 1000).toFixed(2),
		tailVolumeCm3: calculatedTailVolume.toFixed(2),
	};
}
