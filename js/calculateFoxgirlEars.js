function calculateEarHeight(height) {
  // Minimum ear height for toddlers
  if (height < 50) {
      return 10;
  }
  // Linear scaling for other heights
  return Math.max(10, 20 + (height - 150) / 5);
}
