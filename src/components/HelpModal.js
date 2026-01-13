import React from 'react';
import './HelpModal.css';

function HelpModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="help-modal-overlay" onClick={onClose}>
      <div className="help-modal" onClick={(e) => e.stopPropagation()}>
        <button className="help-modal-close" onClick={onClose}>×</button>
        <h2>About Bottle Swap</h2>
        <p>Bottle Swap is a daily puzzle game. Each day, you get one official attempt to solve the bottle order. If you are signed in, your stats are tracked and saved for your first play of the day.</p>
        <ul>
          <li>Drag bottles to swap their positions.</li>
          <li>Click <b>Check</b> to see how many bottles are in the correct spot.</li>
          <li>You have up to 5 guesses per game.</li>
          <li>If signed in, only your first game each day counts toward your stats.</li>
          <li>Extra games are for fun and do not affect your stats.</li>
        </ul>
        <button className="help-modal-close-button" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default HelpModal;