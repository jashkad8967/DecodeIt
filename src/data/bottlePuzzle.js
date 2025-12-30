// Bottle Swap Puzzle Generator
// Generates daily target orderings for the bottle swap game

// Generate today's target ordering (5 bottles)
export const generateDailyBottlePuzzle = (seed = null) => {
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
  const puzzleSeed = seed !== null ? seed : dayOfYear;
  
  // Simple seeded random
  class SeededRandom {
    constructor(seed) {
      this.seed = seed;
    }
    next() {
      this.seed = (this.seed * 9301 + 49297) % 233280;
      return this.seed / 233280;
    }
  }
  
  const rng = new SeededRandom(puzzleSeed);
  
  // 5 distinct bottles with different colors (all bottle-shaped)
  const bottles = [
    { id: 0, color: '#FF6B6B', emoji: '🔴' },
    { id: 1, color: '#4ECDC4', emoji: '🔵' },
    { id: 2, color: '#FFE66D', emoji: '🟡' },
    { id: 3, color: '#95E1D3', emoji: '🟢' },
    { id: 4, color: '#FF8B94', emoji: '🟣' },
  ];
  
  // Shuffle bottles to create target order
  const targetOrder = [...bottles];
  for (let i = targetOrder.length - 1; i > 0; i--) {
    const j = Math.floor(rng.next() * (i + 1));
    [targetOrder[i], targetOrder[j]] = [targetOrder[j], targetOrder[i]];
  }
  
  return {
    id: puzzleSeed,
    bottles,
    targetOrder: targetOrder.map(b => b.id), // Just the IDs in target order
    maxGuesses: 5,
  };
};

// Get today's puzzle
export const getTodaysBottlePuzzle = () => {
  return generateDailyBottlePuzzle();
};

// Check how many bottles are in correct position
export const checkBottleOrder = (currentOrder, targetOrder) => {
  let correctCount = 0;
  for (let i = 0; i < currentOrder.length; i++) {
    if (currentOrder[i] === targetOrder[i]) {
      correctCount++;
    }
  }
  return correctCount;
};

// Generate initial order with 0 correct positions
export const generateInitialOrder = (bottles, targetOrder) => {
  // Try different shuffles until we get 0 correct
  let attempts = 0;
  let shuffled;
  
  do {
    shuffled = [...bottles].sort(() => Math.random() - 0.5);
    attempts++;
    // Safety check to avoid infinite loop
    if (attempts > 100) {
      // If we can't find a perfect 0-match, at least ensure it's different
      break;
    }
  } while (checkBottleOrder(shuffled.map(b => b.id), targetOrder) !== 0);
  
  return shuffled.map(b => b.id);
};

