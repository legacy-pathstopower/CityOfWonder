/**
 * Game Controller Module
 * Handles game state transitions and main gameplay logic
 */

import { hideSection, showSection, showNotification } from '../utils/ui-manager.js';

/**
 * Handle the "Enter the City" button click
 * Transitions from welcome to character creation
 */
function startGame() {
    // Hide welcome section
    hideSection('welcome-section');
    
    // Show character creation section
    showSection('character-creation');
}

/**
 * Set up exploration functionality
 */
function setupExploration() {
    const exploreButton = document.getElementById('explore-btn');
    if (exploreButton) {
        exploreButton.addEventListener('click', function () {
            showNotification('Exploration feature coming soon!', 'info');
        });
    } else {
        console.error('Explore button not found in the DOM.');
    }
}

export { startGame, setupExploration };