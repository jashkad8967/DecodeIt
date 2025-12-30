import React, { useState, useEffect, useRef } from "react";
import { getTodaysBottlePuzzle, checkBottleOrder, generateInitialOrder } from "./data/bottlePuzzle";
import { auth, db } from "./firebase/config";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, addDoc, doc, setDoc, getDoc } from "firebase/firestore";
import AuthModal from "./components/AuthModal";
import StatsModal from "./components/StatsModal";
import "./App.css";

const MAX_GUESSES = 5;

function App() {
  const [puzzle, setPuzzle] = useState(null);
  const [bottleOrder, setBottleOrder] = useState([]);
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const [draggedBottle, setDraggedBottle] = useState(null);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [user, setUser] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [darkTheme, setDarkTheme] = useState(true);
  const [highContrast, setHighContrast] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [statsModalOpen, setStatsModalOpen] = useState(false);
  const audioContextRef = useRef(null);
  const audioSourceRef = useRef(null);
  const activeOscillatorsRef = useRef([]);
  const settingsRef = useRef(null);
  const settingsMenuRef = useRef(null);
  const soundEnabledRef = useRef(soundEnabled);

  // Listen for auth changes and load stats on login
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        await loadUserStats(u.uid);
      } else {
        setUserStats(null);
      }
    });
    return unsubscribe;
  }, []);

  // Load puzzle and initial bottle order on mount
  useEffect(() => {
    const todayPuzzle = getTodaysBottlePuzzle();
    setPuzzle(todayPuzzle);
    const initialOrder = generateInitialOrder(todayPuzzle.bottles, todayPuzzle.targetOrder);
    setBottleOrder(initialOrder);
    // Optionally, load guesses from localStorage if needed
  }, []);

  // Keep soundEnabledRef in sync
  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);

  // Initialize audio context and create jingle
  useEffect(() => {
    const stopJingle = () => {
      // Stop all active oscillators immediately
      activeOscillatorsRef.current.forEach(osc => {
        try {
          osc.stop();
        } catch (e) {
          // Oscillator may already be stopped
        }
      });
      activeOscillatorsRef.current = [];
      
      // Clear the interval
      if (audioSourceRef.current?.interval) {
        clearInterval(audioSourceRef.current.interval);
        audioSourceRef.current = null;
      }
    };

    if (soundEnabled) {
      const initAudio = async () => {
        try {
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          if (!audioContextRef.current) {
            audioContextRef.current = new AudioContext();
          }
          if (audioContextRef.current.state === 'suspended') {
            await audioContextRef.current.resume();
          }
          
          const ctx = audioContextRef.current;
          stopJingle(); // Clear any existing audio
          
          // Peaceful ambient melody - longer and more soothing
          const playMelody = (startTime) => {
            // Create a peaceful, flowing melody with longer notes
            const melody = [
              // First phrase - gentle ascent
              { freq: 261.63, time: 0, duration: 0.8, volume: 0.06 },    // C4
              { freq: 293.66, time: 0.9, duration: 0.8, volume: 0.06 }, // D4
              { freq: 329.63, time: 1.8, duration: 1.0, volume: 0.07 }, // E4
              // Second phrase - gentle descent
              { freq: 293.66, time: 2.9, duration: 0.8, volume: 0.06 }, // D4
              { freq: 261.63, time: 3.8, duration: 1.2, volume: 0.06 }, // C4
              // Third phrase - harmony
              { freq: 329.63, time: 5.1, duration: 0.6, volume: 0.05 }, // E4
              { freq: 349.23, time: 5.8, duration: 0.6, volume: 0.05 }, // F4
              { freq: 392.00, time: 6.5, duration: 1.0, volume: 0.06 }, // G4
              // Final phrase - resolution
              { freq: 329.63, time: 7.6, duration: 0.8, volume: 0.05 }, // E4
              { freq: 293.66, time: 8.5, duration: 0.8, volume: 0.05 }, // D4
              { freq: 261.63, time: 9.4, duration: 1.2, volume: 0.06 }, // C4
            ];
            
            melody.forEach((note) => {
              if (!soundEnabledRef.current) return; // Check if still enabled
              
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              
              osc.type = 'sine'; // Soft sine wave for peaceful sound
              osc.frequency.setValueAtTime(note.freq, startTime + note.time);
              
              // Gentle fade in and out
              gain.gain.setValueAtTime(0, startTime + note.time);
              gain.gain.linearRampToValueAtTime(note.volume, startTime + note.time + 0.1);
              gain.gain.linearRampToValueAtTime(note.volume, startTime + note.time + note.duration - 0.2);
              gain.gain.linearRampToValueAtTime(0, startTime + note.time + note.duration);
              
              osc.connect(gain);
              gain.connect(ctx.destination);
              
              // Track oscillator
              activeOscillatorsRef.current.push(osc);
              
              osc.start(startTime + note.time);
              osc.stop(startTime + note.time + note.duration);
              
              // Remove from tracking when stopped
              osc.onended = () => {
                activeOscillatorsRef.current = activeOscillatorsRef.current.filter(o => o !== osc);
              };
            });
          };
          
          playMelody(ctx.currentTime);
          
          // Loop the peaceful melody (about 10.6 seconds per loop)
          const loopInterval = setInterval(() => {
            if (!soundEnabledRef.current || !audioContextRef.current) {
              clearInterval(loopInterval);
              return;
            }
            playMelody(audioContextRef.current.currentTime);
          }, 10600);
          
          audioSourceRef.current = { interval: loopInterval };
        } catch (e) {
          console.error("Audio not supported:", e);
        }
      };
      initAudio();
    } else {
      stopJingle();
    }

    return () => {
      stopJingle();
    };
  }, [soundEnabled]);

  // Drag handlers
  const handleDragStart = (e, bottleId, index) => {
    if (gameOver) return;
    setDraggedBottle(bottleId);
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', bottleId.toString());
    // Use the bottle element, not the event target which might be a child
    const bottleElement = e.currentTarget;
    if (bottleElement) {
      bottleElement.style.opacity = '0.5';
    }
  };

  const handleDragEnd = (e) => {
    const bottleElement = e.currentTarget;
    if (bottleElement) {
      bottleElement.style.opacity = '1';
    }
    setDraggedBottle(null);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDragLeave = (e) => {
    // Only clear dragOverIndex if we're actually leaving the drop zone
    if (!e || !e.currentTarget) {
      setDragOverIndex(null);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setDragOverIndex(null);
    }
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    e.stopPropagation();
    if (draggedIndex === null || draggedIndex === dropIndex || gameOver) {
      setDragOverIndex(null);
      return;
    }

    const newOrder = [...bottleOrder];
    [newOrder[draggedIndex], newOrder[dropIndex]] = [newOrder[dropIndex], newOrder[draggedIndex]];
    setBottleOrder(newOrder);
    setDraggedBottle(null);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleCheck = async () => {
    if (gameOver || !puzzle) return;
    
    const correctCount = checkBottleOrder(bottleOrder, puzzle.targetOrder);
    const newGuess = {
      order: [...bottleOrder],
      correctCount,
      guessNumber: guesses.length + 1,
    };
    
    const updatedGuesses = [...guesses, newGuess];
    setGuesses(updatedGuesses);
    setCurrentGuess(newGuess);

    // Check win condition
    if (correctCount === 5) {
      setGameOver(true);
      setWin(true);
      
      // Save result if user is logged in
      if (user) {
        try {
          await saveResult(true, updatedGuesses.length);
        } catch (error) {
          console.error('Error in handleCheck:', error);
        }
      }
    } else if (updatedGuesses.length >= MAX_GUESSES) {
      setGameOver(true);
      setWin(false);
      
      // Save result if user is logged in
      if (user) {
        try {
          await saveResult(false, MAX_GUESSES);
        } catch (error) {
          console.error('Error in handleCheck:', error);
        }
      }
    }
  };

  // Merge stats instead of overwriting
  const saveResult = async (won, guessesUsed) => {
    if (!user || !puzzle) return;
    try {
      const today = new Date().toISOString().split('T')[0];
      // Save individual result
      const result = {
        userId: user.uid,
        puzzleId: puzzle.id,
        date: today,
        won,
        guessesUsed,
        timestamp: new Date(),
      };
      await addDoc(collection(db, 'results'), result);
      const statsRef = doc(db, 'userStats', user.uid);
      const statsSnap = await getDoc(statsRef);
      let stats;
      if (statsSnap.exists()) {
        stats = statsSnap.data();
      } else {
        stats = {
          totalGames: 0,
          wins: 0,
          losses: 0,
          currentStreak: 0,
          longestStreak: 0,
          successPercentage: 0,
          lastPlayedDate: null,
        };
      }
      const currentTotalGames = (stats.totalGames || 0) + 1;
      let newWins = stats.wins || 0;
      let newLosses = stats.losses || 0;
      let newCurrentStreak = stats.currentStreak || 0;
      let newLongestStreak = stats.longestStreak || 0;
      const lastDate = stats.lastPlayedDate;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      if (won) {
        newWins = newWins + 1;
        if (lastDate === yesterdayStr) {
          newCurrentStreak = (stats.currentStreak || 0) + 1;
        } else {
          newCurrentStreak = 1;
        }
        if (newCurrentStreak > (stats.longestStreak || 0)) {
          newLongestStreak = newCurrentStreak;
        }
      } else {
        newLosses = (stats.losses || 0) + 1;
        newCurrentStreak = 0;
      }
      const newSuccessPercentage = currentTotalGames > 0 
        ? Math.round((newWins / currentTotalGames) * 100) 
        : 0;
      const newStats = {
        totalGames: currentTotalGames,
        wins: newWins,
        losses: newLosses,
        currentStreak: newCurrentStreak,
        longestStreak: newLongestStreak,
        successPercentage: newSuccessPercentage,
        lastPlayedDate: today,
      };
      await setDoc(statsRef, newStats, { merge: true });
      // Force reload stats from Firestore to ensure latest values
      await loadUserStats(user.uid);
    } catch (error) {
      console.error('Error saving result:', error);
    }
  };

  // loadUserStats must update React state
  const loadUserStats = async (uid) => {
    const ref = doc(db, "userStats", uid);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      setUserStats(snap.data());
    } else {
      setUserStats({
        totalGames: 0,
        wins: 0,
        losses: 0,
        currentStreak: 0,
        longestStreak: 0,
        successPercentage: 0,
      });
    }
  };

  const handleRestart = () => {
    const todayPuzzle = getTodaysBottlePuzzle();
    setPuzzle(todayPuzzle);
    const initialOrder = generateInitialOrder(todayPuzzle.bottles, todayPuzzle.targetOrder);
    setBottleOrder(initialOrder);
    setGuesses([]);
    setCurrentGuess(null);
    setGameOver(false);
    setWin(false);
    
    // Clear saved game state
    const today = new Date().toISOString().split('T')[0];
    const savedGameKey = `bottleSwap_${today}`;
    localStorage.removeItem(savedGameKey);
  };

  const handleSignOut = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    try {
      await signOut(auth);
      setSettingsOpen(false);
      setUserStats(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Close settings menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Don't close if clicking within the settings menu
      if (
        settingsMenuRef.current &&
        settingsMenuRef.current.contains(event.target)
      ) {
        return;
      }
      // Don't close if clicking on the settings toggle button
      if (
        event.target.closest('.settings-toggle') ||
        event.target.closest('.top-bar-btn')
      ) {
        return;
      }
      // Close settings if click is outside
      if (settingsOpen) {
        setSettingsOpen(false);
      }
    };

    if (settingsOpen) {
      // Use a slight delay to avoid closing immediately when opening
      const timeoutId = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 0);

      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [settingsOpen]);

  // Always call hooks first, then conditionally render
  if (!puzzle) {
    return (
      <div className="app-container">
        <div className="loading">Loading puzzle...</div>
      </div>
    );
  }

  const getBottleById = (id) => puzzle.bottles.find(b => b.id === id);

  return (
    <>
      <div className={`app-container ${darkTheme ? 'dark-theme' : ''} ${highContrast ? 'high-contrast' : ''}`}>
        {/* Starry background for both themes */}
        <div className={`star-background ${darkTheme ? 'star-bg-dark' : 'star-bg-light'}`}></div>
        {/* Top bar with stats and buttons */}
        <div className="top-bar" ref={settingsRef}>
          {user ? (
            <div className="user-stats">
              <div className="stat-item" onClick={() => setStatsModalOpen(true)} style={{ cursor: 'pointer' }}>
                <div className="stat-value">{userStats ? userStats.wins : 0}</div>
                <div className="stat-label">Wins</div>
              </div>
              <div className="stat-item" onClick={() => setStatsModalOpen(true)} style={{ cursor: 'pointer' }}>
                <div className="stat-value">{userStats ? userStats.currentStreak : 0}</div>
                <div className="stat-label">Streak</div>
              </div>
              <div className="stat-item" onClick={() => setStatsModalOpen(true)} style={{ cursor: 'pointer' }}>
                <div className="stat-value">{userStats ? userStats.successPercentage : 0}%</div>
                <div className="stat-label">Success</div>
              </div>
            </div>
          ) : (
            <div className="user-stats"></div>
          )}
          <div className="top-bar-buttons">
            {user && (
              <button className="view-stats-button top-bar-btn" onClick={() => setStatsModalOpen(true)}>
                View Stats
              </button>
            )}
            <button 
              className="settings-toggle top-bar-btn"
              onClick={() => setSettingsOpen(!settingsOpen)}
              aria-label="Settings"
            >
              ⚙️
            </button>
          </div>
        </div>
        {/* Settings menu overlay */}
        {settingsOpen && (
          <div className="settings-menu" ref={settingsMenuRef}>
            <div className="settings-item">
              <label className="settings-label">
                <input
                  type="checkbox"
                  checked={darkTheme}
                  onChange={(e) => setDarkTheme(e.target.checked)}
                />
                <span>Dark Theme</span>
              </label>
            </div>
            <div className="settings-item">
              <label className="settings-label">
                <input
                  type="checkbox"
                  checked={highContrast}
                  onChange={(e) => setHighContrast(e.target.checked)}
                />
                <span>High Contrast</span>
              </label>
            </div>
            <div className="settings-item">
              <label className="settings-label">
                <input
                  type="checkbox"
                  checked={soundEnabled}
                  onChange={(e) => setSoundEnabled(e.target.checked)}
                />
                <span>Sound</span>
              </label>
            </div>
            <div className="settings-divider"></div>
            {user ? (
              <div className="settings-item">
                <button 
                  type="button"
                  onClick={async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    e.nativeEvent?.stopImmediatePropagation();
                    await handleSignOut(e);
                  }} 
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  className="sign-out-button full-width"
                  style={{ pointerEvents: 'auto', zIndex: 1003, width: '100%' }}
                  aria-label="Sign out"
                >
                  {user.email} — Sign Out
                </button>
              </div>
            ) : (
              <div className="settings-item">
                <button onClick={() => setAuthModalOpen(true)} className="auth-button">
                  Sign In / Sign Up
                </button>
              </div>
            )}
          </div>
        )}

        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          onAuthSuccess={() => setAuthModalOpen(false)}
        />
      
        <StatsModal
          isOpen={statsModalOpen}
          onClose={() => setStatsModalOpen(false)}
          stats={userStats}
        />

        <div className="game-wrapper">
          {/* Title bar at the top */}
          <header className="game-header">
            <h1 className="game-title">Bottle Swap</h1>
            <p className="game-subtitle">Drag bottles to arrange them in the correct order</p>
          </header>
          
          {/* Main game area: bottles on left, check button on right */}
          <div className="main-game-area">
            {/* Bottle arrangement on the left */}
            <div className="bottles-container">
              {[0, 1, 2, 3, 4].map((position) => {
                const bottleId = bottleOrder[position];
                const bottle = bottleId !== undefined ? getBottleById(bottleId) : null;
                const isDragging = draggedIndex === position;
                return (
                  <div
                    key={position}
                    className={`bottle-slot ${dragOverIndex === position ? 'drag-over' : ''}`}
                    onDragOver={(e) => handleDragOver(e, position)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, position)}
                  >
                    <div className="bottle-placeholder"></div>
                    {bottle && (
                      <div
                        className={`bottle ${isDragging ? 'dragging' : ''}`}
                        draggable={!gameOver}
                        onDragStart={(e) => handleDragStart(e, bottleId, position)}
                        onDragEnd={handleDragEnd}
                        style={{ '--bottle-color': bottle.color }}
                      >
                        <div className="bottle-shape">
                          <span className="bottle-emoji">{bottle.emoji}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            {/* Check button and feedback on the right */}
            <div className="side-panel">
              {/* Check button */}
              {!gameOver && (
                <button 
                  className="check-button"
                  onClick={handleCheck}
                  disabled={guesses.length >= MAX_GUESSES}
                >
                  Check
                </button>
              )}

              {/* Current guess feedback */}
              {currentGuess && !gameOver && (
                <div className="feedback-display">
                  <div className="feedback-number">
                    Correct: {currentGuess.correctCount} / 5
                  </div>
                </div>
              )}

              {/* Guesses counter */}
              <div className="guesses-counter">
                Guess {guesses.length} of {MAX_GUESSES}
              </div>
            </div>
          </div>
          
          {/* Guess history below main game area */}
          {guesses.length > 0 && (
            <div className="guesses-history">
              <div className="guesses-title">Your guesses:</div>
              {guesses.map((guess, idx) => (
                <div key={idx} className="guess-item">
                  <div className="guess-bottles">
                    {guess.order.map((bottleId) => {
                      const bottle = getBottleById(bottleId);
                      return (
                        <span key={bottleId} className="guess-bottle-emoji">
                          {bottle.emoji}
                        </span>
                      );
                    })}
                  </div>
                  <div className="guess-count">
                    {guess.correctCount} / 5
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Game result below guesses */}
          {gameOver && (
            <div className="game-over">
              <div className={`game-result ${win ? "result-win" : "result-lose"}`}>
                {win ? (
                  <>
                    <div className="result-icon">🎉</div>
                    <div className="result-text">You win!</div>
                    <div className="result-subtext">
                      You solved it in {guesses.length} {guesses.length === 1 ? 'guess' : 'guesses'}!
                      {user && <div className="save-notice">✓ Result saved</div>}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="result-icon">💔</div>
                    <div className="result-text">Game over!</div>
                    <div className="result-subtext">
                      The correct order was:
                      <div className="target-order">
                        {puzzle.targetOrder.map((bottleId) => {
                          const bottle = getBottleById(bottleId);
                          return (
                            <span key={bottleId} className="target-bottle">
                              {bottle.emoji}
                            </span>
                          );
                        })}
                      </div>
                      {user && <div className="save-notice">✓ Result saved</div>}
                    </div>
                  </>
                )}
              </div>
              <button className="restart-button" onClick={handleRestart}>
                Play Again
              </button>
            </div>
          )}
          
          <footer className="game-footer">
            <p>Drag bottles to swap positions. Click Check to see how many are in the right position.</p>
            {!user && (
              <p className="save-prompt">
                <button onClick={() => setAuthModalOpen(true)} className="save-link">
                  Sign up
                </button> to save your results
              </p>
            )}
          </footer>
        </div>
      </div>
    </>
  );
}

export default App;
