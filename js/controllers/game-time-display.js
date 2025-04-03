/**
 * Game Time Display Component
 * Handles the display and animation of the game time
 */

import gameState from '../models/game-state.js';

/**
 * Initialize the game time display
 */
function initGameTimeDisplay() {
    // Create the game time element
    createGameTimeUI();
    
    // Update time display
    updateTimeDisplay();
    
    // Listen for time updates
    document.addEventListener('gameTimeUpdate', updateTimeDisplay);
}

/**
 * Create the game time UI element
 */
function createGameTimeUI() {
    // Check if header exists
    const gameHeader = document.querySelector('.game-header');
    if (!gameHeader) return;
    
    // Create time display element
    const timeDisplay = document.createElement('div');
    timeDisplay.id = 'game-time-display';
    timeDisplay.className = 'game-time-display';
    
    // Create structure
    timeDisplay.innerHTML = `
        <div class="time-icon">🕰️</div>
        <div class="time-text">
            <span id="game-day">Day 1</span>
            <span id="game-time">8:00 AM</span>
        </div>
    `;
    
    // Add to the header
    gameHeader.appendChild(timeDisplay);
}

/**
 * Update the time display with current game time
 */
function updateTimeDisplay() {
    const gameDay = document.getElementById('game-day');
    const gameTime = document.getElementById('game-time');
    
    if (!gameDay || !gameTime) return;
    
    // Get current time
    const { day, hour, minute } = gameState.gameTime;
    
    // Update day
    gameDay.textContent = `Day ${day}`;
    
    // Format time
    const formattedHour = hour % 12 || 12; // Convert to 12-hour format
    const amPm = hour < 12 ? 'AM' : 'PM';
    const formattedMinute = String(minute).padStart(2, '0');
    
    // Update time
    gameTime.textContent = `${formattedHour}:${formattedMinute} ${amPm}`;
    
    // Apply styling based on time of day
    updateTimeStyleBasedOnDaylight();
}

/**
 * Update the UI styling based on the time of day
 */
function updateTimeStyleBasedOnDaylight() {
    const { hour } = gameState.gameTime;
    const timeDisplay = document.getElementById('game-time-display');
    const gameInterface = document.getElementById('game-interface');
    
    if (!timeDisplay || !gameInterface) return;
    
    // Remove all time classes
    timeDisplay.classList.remove('dawn', 'day', 'dusk', 'night');
    
    // Apply appropriate class based on time
    if (hour >= 5 && hour < 8) {
        // Dawn (5am-8am)
        timeDisplay.classList.add('dawn');
        gameInterface.dataset.timeOfDay = 'dawn';
    } else if (hour >= 8 && hour < 18) {
        // Day (8am-6pm)
        timeDisplay.classList.add('day');
        gameInterface.dataset.timeOfDay = 'day';
    } else if (hour >= 18 && hour < 21) {
        // Dusk (6pm-9pm)
        timeDisplay.classList.add('dusk');
        gameInterface.dataset.timeOfDay = 'dusk';
    } else {
        // Night (9pm-5am)
        timeDisplay.classList.add('night');
        gameInterface.dataset.timeOfDay = 'night';
    }
}

export { initGameTimeDisplay };