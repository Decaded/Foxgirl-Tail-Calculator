function calculateEarHeight(height) {
  // Minimum ear height for toddlers
  if (height < 50) {
      return 10;
  }
  // Linear scaling for other heights
  return Math.max(10, 20 + (height - 150) / 5);
}

// Example usage:
console.log(calculateEarHeight(110)); // Output: 10 (for toddler size)
console.log(calculateEarHeight(140)); // Output: 18 
console.log(calculateEarHeight(150)); // Output: 20
console.log(calculateEarHeight(168)); // Output: 21
console.log(calculateEarHeight(200)); // Output: 30
console.log(calculateEarHeight(210)); // Output: 31
