import React from 'react';
import './StatsModal.css';

function StatsModal({ isOpen, onClose, stats }) {
  if (!isOpen) return null;
  
  // Show placeholder if stats haven't loaded yet
  const displayStats = stats || {
    wins: 0,
    losses: 0,
    totalGames: 0,
    currentStreak: 0,
    longestStreak: 0,
    successPercentage: 0,
  };

  return (
    <div className="stats-modal-overlay" onClick={onClose}>
      <div className="stats-modal" onClick={(e) => e.stopPropagation()}>
        <button className="stats-modal-close" onClick={onClose}>×</button>
        <h2>Your Statistics</h2>
        
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-card-value">{displayStats.wins || 0}</div>
            <div className="stat-card-label">Total Wins</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-card-value">{displayStats.losses || 0}</div>
            <div className="stat-card-label">Total Losses</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-card-value">{displayStats.totalGames || 0}</div>
            <div className="stat-card-label">Games Played</div>
          </div>
          
          <div className="stat-card highlight">
            <div className="stat-card-value">{displayStats.currentStreak || 0}</div>
            <div className="stat-card-label">Current Streak</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-card-value">{displayStats.longestStreak || 0}</div>
            <div className="stat-card-label">Longest Streak</div>
          </div>
          
          <div className="stat-card highlight">
            <div className="stat-card-value">{displayStats.successPercentage || 0}%</div>
            <div className="stat-card-label">Success Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatsModal;

