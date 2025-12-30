// Strategic Chaos Puzzle Generator
// Creates daily puzzles with hidden variables, derived targets, and trap zones

// Helper functions
const sumOfDigits = (n) => {
  return n.toString().split('').reduce((sum, digit) => sum + parseInt(digit, 10), 0);
};

const isEven = (n) => n % 2 === 0;
const isOdd = (n) => n % 2 === 1;
const isDivisibleBy = (n, divisor) => n % divisor === 0;

// Generate random integer in range [min, max]
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Simple seeded random number generator
class SeededRandom {
  constructor(seed) {
    this.seed = seed;
  }
  
  next() {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }
  
  nextInt(min, max) {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }
}

// Generate a daily strategic puzzle
export const generateDailyPuzzle = (seed = null) => {
  // Use date-based seed for daily consistency
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
  const puzzleSeed = seed !== null ? seed : dayOfYear;
  
  // Create seeded random generator
  const rng = new SeededRandom(puzzleSeed);

  // Generate hidden variables using seeded random
  const X = rng.nextInt(10, 99);
  const Y = rng.nextInt(10, 99);
  const Z = rng.nextInt(10, 99);
  
  // Choose a derived target function (randomly selected)
  const functionTypes = [
    { name: "X + 2*Y - Z", calc: (x, y, z) => x + 2 * y - z },
    { name: "X*Y - Z", calc: (x, y, z) => x * y - z },
    { name: "X + Y + Z", calc: (x, y, z) => x + y + z },
    { name: "2*X + Y - Z", calc: (x, y, z) => 2 * x + y - z },
    { name: "X*2 + Y*3 - Z", calc: (x, y, z) => x * 2 + y * 3 - z },
  ];
  
  const selectedFunction = functionTypes[rng.nextInt(0, functionTypes.length - 1)];
  const derivedTarget = selectedFunction.calc(X, Y, Z);
  
  // Generate trap targets (3-5 traps based on hidden variables)
  const numTraps = 3 + rng.nextInt(0, 2); // 3-5 traps
  const traps = [];
  const trapFunctions = [
    (x, y, z) => x + y + z,
    (x, y, z) => x * y,
    (x, y, z) => x + y,
    (x, y, z) => y + z,
    (x, y, z) => x * 2 + y,
    (x, y, z) => y * 2 + z,
  ];
  
  for (let i = 0; i < numTraps; i++) {
    const trapFunc = trapFunctions[rng.nextInt(0, trapFunctions.length - 1)];
    const trapValue = trapFunc(X, Y, Z);
    if (trapValue !== derivedTarget && trapValue > 0) {
      traps.push(trapValue);
    }
  }
  
  // Remove duplicates and ensure traps are different from target
  let uniqueTraps = [...new Set(traps)].filter(t => t !== derivedTarget);
  
  // Ensure we have at least some traps
  if (uniqueTraps.length === 0) {
    uniqueTraps = [derivedTarget + 1, derivedTarget - 1].filter(t => t > 0);
  }
  
  // Calculate winning zone (within 3% of target, but not exact)
  const winMargin = Math.max(1, Math.floor(derivedTarget * 0.03));
  const minWin = derivedTarget - winMargin;
  const maxWin = derivedTarget + winMargin;
  
  // Generate clues (multi-stage)
  const clues = {
    stage1: [
      `The target is derived from three hidden values: X, Y, and Z`,
      `The target value is between ${Math.max(1, Math.floor(derivedTarget * 0.5))} and ${Math.floor(derivedTarget * 2)}`,
    ],
    stage2: [
      X > Y ? "X is greater than Y" : "Y is greater than or equal to X",
      isEven(Z) ? "Z is an even number" : "Z is an odd number",
      sumOfDigits(X + Z) < 15 ? "The sum of digits of (X + Z) is less than 15" : "The sum of digits of (X + Z) is 15 or more",
    ],
    stage3: [
      isDivisibleBy(X, 3) ? "X is divisible by 3" : "X is not divisible by 3",
      `One of the hidden values is a multiple of ${rng.nextInt(2, 6)}`,
      `The relationship involves: ${selectedFunction.name}`,
    ],
  };
  
  // Probabilistic clues (70% accuracy)
  const probabilisticClues = [
    {
      text: `Higher than ${Math.floor(derivedTarget * 0.7)} about 70% of the time`,
      accuracy: 0.7,
      check: (target) => target > Math.floor(derivedTarget * 0.7),
    },
    {
      text: `Odd/even ratio favors ${isEven(derivedTarget) ? 'even' : 'odd'} numbers 2:1`,
      accuracy: 0.67,
      check: (target) => isEven(derivedTarget) === isEven(target),
    },
  ];
  
  return {
    id: puzzleSeed,
    hiddenVariables: { X, Y, Z },
    derivedTarget,
    derivedFunction: selectedFunction.name,
    traps: uniqueTraps,
    minWin,
    maxWin,
    clues,
    probabilisticClues,
    maxGuesses: 5,
    prompt: "Daily Challenge: Find the hidden derived value",
  };
};

// Get today's puzzle (consistent for the day)
export const getTodaysPuzzle = () => {
  return generateDailyPuzzle();
};

// Check if guess hits a trap
export const isTrap = (guess, traps) => {
  return traps.includes(guess);
};

// Check if guess is in winning zone
export const isInWinningZone = (guess, minWin, maxWin, exactTarget) => {
  return guess >= minWin && guess <= maxWin && guess !== exactTarget;
};

// Get feedback for a guess
export const getGuessFeedback = (guess, puzzle) => {
  const { derivedTarget, traps, minWin, maxWin } = puzzle;
  
  // Check for exact match (instant loss)
  if (guess === derivedTarget) {
    return {
      type: 'exact',
      message: "Exact answer — you hit the target! 💥",
      isWin: false,
      isLoss: true,
    };
  }
  
  // Check for trap (instant loss)
  if (isTrap(guess, traps)) {
    return {
      type: 'trap',
      message: `Trap hit! That's a forbidden value! 🚫`,
      isWin: false,
      isLoss: true,
    };
  }
  
  // Check for winning zone
  if (isInWinningZone(guess, minWin, maxWin, derivedTarget)) {
    return {
      type: 'win',
      message: "Perfectly imperfect! You win! 🎯",
      isWin: true,
      isLoss: false,
    };
  }
  
  // Calculate distance and provide directional feedback
  const distance = Math.abs(guess - derivedTarget);
  const percentage = (distance / derivedTarget) * 100;
  
  let proximity;
  let direction;
  
  if (percentage <= 3) {
    proximity = 'very-close';
  } else if (percentage <= 10) {
    proximity = 'close';
  } else if (percentage <= 25) {
    proximity = 'far';
  } else {
    proximity = 'very-far';
  }
  
  direction = guess < derivedTarget ? 'higher' : 'lower';
  
  return {
    type: 'feedback',
    message: `${direction === 'higher' ? '↑' : '↓'} ${proximity === 'very-close' ? '🔥 Very close' : proximity === 'close' ? '😊 Close' : proximity === 'far' ? '😐 Far' : '❄️ Very far'}`,
    direction,
    proximity,
    percentage: percentage.toFixed(1),
    isWin: false,
    isLoss: false,
  };
};

