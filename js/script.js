function calculateAndDisplayMeasurements() {
	const foxgirlHeight = parseFloat(document.getElementById('foxgirlHeightInput').value);
	const tailCount = parseInt(document.getElementById('tailCountSelect').value);

	if (!isNaN(foxgirlHeight)) {
		if (foxgirlHeight <= 0) {
			alert('Please enter a valid positive number for foxgirl height.');
			return; // Exit the function if the entered value is invalid
		}
		if (foxgirlHeight < 50) {
			alert('Are you sure the foxgirl is this small? This seems unusually tiny.\nAverage for a newborn is around 50cm.');
			return;
		}

		const { tailLength, tailMass, tailVolumeLiters, tailVolumeCm3 } = calculateFoxgirlTail(foxgirlHeight);
		const earHeight = calculateEarHeight(foxgirlHeight);

		// Display tail measurements
		document.getElementById('tailLength').textContent = ` ${tailLength} cm`;
		document.getElementById('tailMass').textContent = ` ${tailMass} kg`;
		document.getElementById('tailVolume').textContent = ` ${tailVolumeLiters} liters (${tailVolumeCm3} cm³)`;

		// Display ear height
		document.getElementById('earHeight').textContent = ` ${earHeight} cm`;

		if (tailCount === 1) {
			// Calculate and display data for a single tail
			document.getElementById('combinedContainer').style.display = 'none';
			document.getElementById('individualContainer').style.display = 'flex';
		} else {
			// Calculate combined mass and volume for the specified number of tails
			let combinedMass = 0;
			let combinedVolumeCm3 = 0;
			for (let i = 0; i < tailCount; i++) {
				const { tailMass, tailVolumeCm3 } = calculateFoxgirlTail(foxgirlHeight);
				combinedMass += parseFloat(tailMass);
				combinedVolumeCm3 += parseFloat(tailVolumeCm3);
			}

			// Convert combined volume from cubic centimeters to liters
			const combinedVolumeLiters = combinedVolumeCm3 / 1000;

			// Update the HTML elements with the combined mass and volume
			document.getElementById('combinedMass').textContent = ` ${combinedMass.toFixed(2)} kg`;
			document.getElementById('combinedVolume').textContent = ` ${combinedVolumeLiters.toFixed(2)} liters (${combinedVolumeCm3.toFixed(2)} cm³)`;

			// Hide the individual container and display the combined container
			document.getElementById('individualContainer').style.display = 'flex';
			document.getElementById('combinedContainer').style.display = 'flex';
		}

		// Hide the input container and display the result container
		document.getElementById('input-container').style.display = 'none';
		document.getElementById('result-container').style.display = 'flex';
	}
}

document.getElementById('calculateButton').addEventListener('click', calculateAndDisplayMeasurements);

document.getElementById('foxgirlHeightInput').addEventListener('keydown', function (event) {
	if (event.key === 'Enter') {
		calculateAndDisplayMeasurements();
	}
});

function goBack() {
	document.getElementById('input-container').style.display = 'flex';
	document.getElementById('result-container').style.display = 'none';
}
