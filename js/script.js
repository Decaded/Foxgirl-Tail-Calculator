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

		// Update foxgirl height in the results container
		document.getElementById('foxgirlHeight').textContent = ` ${foxgirlHeight} cm`;

		// Update selected number of tails in the results container
		document.getElementById('tailCount').textContent = ` ${tailCount}`;

		const { tailLength, tailMass, tailVolumeLiters, tailVolumeCm3 } = calculateFoxgirlTail(foxgirlHeight);
		const earHeight = calculateEarHeight(foxgirlHeight);

		// Display tail measurements
		document.getElementById('tailLength').textContent = ` ${tailLength} cm`;
		document.getElementById('tailMass').textContent = ` ${tailMass} kg`;
		// Select the #tailVolume element
		const tailVolumeElement = document.getElementById('tailVolume');

		// Create a new span element for the liters value
		const litersElement = document.createElement('span');
		litersElement.textContent = `${tailVolumeLiters} liters`;

		// Create a new span element for the cm³ value
		const cm3Element = document.createElement('span');
		cm3Element.textContent = `${tailVolumeCm3} cm³`;

		// Append the elements to the #tailVolume element
		tailVolumeElement.innerHTML = '';
		tailVolumeElement.appendChild(litersElement);
		tailVolumeElement.appendChild(document.createElement('br'));
		tailVolumeElement.appendChild(cm3Element);

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
			// Select the #combinedVolume element
			const combinedVolumeElement = document.getElementById('combinedVolume');

			// Create a new span element for the liters value
			const litersElement = document.createElement('span');
			litersElement.textContent = `${combinedVolumeLiters.toFixed(2)} liters`;

			// Create a new span element for the cm³ value
			const cm3Element = document.createElement('span');
			cm3Element.textContent = `${combinedVolumeCm3.toFixed(2)} cm³`;

			// Append the elements to the #combinedVolume element
			combinedVolumeElement.innerHTML = '';
			combinedVolumeElement.appendChild(litersElement);
			combinedVolumeElement.appendChild(document.createElement('br'));
			combinedVolumeElement.appendChild(cm3Element);

			// Hide the individual container and display the combined container
			document.getElementById('individualContainer').style.display = 'flex';
			document.getElementById('combinedContainer').style.display = 'flex';
		}

		// Calculate body weight and total weight
		const bodyWeight = calculateBodyWeight(foxgirlHeight, tailCount);
		document.getElementById('bodyWeight').textContent = ` ${bodyWeight} kg`;

		// Get combined mass properly
		const combinedMass = tailCount === 1 ? parseFloat(tailMass) : parseFloat(document.getElementById('combinedMass').textContent.replace(/[^\d.]/g, ''));

		document.getElementById('totalWeight').textContent = ` ${(parseFloat(bodyWeight) + combinedMass).toFixed(1)} kg`;

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
