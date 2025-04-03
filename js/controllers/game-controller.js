/**
 * Game Controller Module
 * Handles game state transitions and main gameplay logic
 */

import { hideSection, showSection, showNotification } from '../utils/ui-manager.js';
import gameState from '../models/game-state.js';

/**
 * Initialize the game controller
 */
function initGameController() {
    // Check if there's a saved game
    if (gameState.player) {
        // If we have a player, setup exploration and show game interface
        setupExploration();
        setupResetButton(); // Setup reset game functionality
        showSection('game-interface');
    } else {
        // Otherwise, show the welcome screen
        showSection('welcome-section');
    }
    
    // Setup welcome screen button
    setupWelcomeScreen();
}

/**
 * Set up the welcome screen functionality
 */
function setupWelcomeScreen() {
    const startButton = document.getElementById('start-game-btn');
    if (startButton) {
        startButton.addEventListener('click', startGame);
    } else {
        console.error('Start game button not found in the DOM.');
    }
}

/**
 * Handle the "Enter the City" button click
 * Transitions from welcome to character creation
 */
function startGame() {
    // Hide welcome section with animation
    hideSection('welcome-section');
    
    // Show character creation section with animation
    setTimeout(() => {
        showSection('character-creation-section');
    }, 500);
}

/**
 * Set up exploration functionality
 */
function setupExploration() {
    const exploreButton = document.getElementById('explore-btn');
    if (exploreButton) {
        exploreButton.addEventListener('click', function() {
            // Simulate exploration with a loading indicator
            showNotification('Exploring the city...', 'info', 1000);
            
            // After a short delay, show another notification with "results"
            setTimeout(() => {
                const events = [
                    'You found some old coins in a fountain! +5 gold',
                    'You encountered a friendly merchant who shared city gossip.',
                    'You discovered a hidden alleyway leading to a mysterious shop.',
                    'You helped a city guard catch a pickpocket and earned their gratitude.',
                    'You found a torn page from an ancient book with cryptic writings.'
                ];
                
                // Select random event
                const randomEvent = events[Math.floor(Math.random() * events.length)];
                
                // Show the event notification
                showNotification(randomEvent, 'success', 3000);
                
                // If it's the gold event, actually add gold to the player
                if (randomEvent.includes('gold')) {
                    gameState.player.modifyGold(5);
                    gameState.saveGame();
                }
            }, 1500);
        });
    } else {
        console.error('Explore button not found in the DOM.');
    }
}

/**
 * Setup reset button functionality
 */
function setupResetButton() {
    const resetButton = document.getElementById('reset-game-btn');
    if (resetButton) {
        resetButton.addEventListener('click', showResetConfirmation);
    } else {
        console.error('Reset button not found in the DOM.');
    }
}

/**
 * Show reset confirmation dialog
 */
function showResetConfirmation() {
    // Create confirmation dialog
    const dialog = document.createElement('div');
    dialog.className = 'confirmation-dialog';
    
    dialog.innerHTML = `
        <div class="confirmation-content">
            <h3>Reset Game</h3>
            <p>Are you sure you want to reset your game? This will delete all progress and cannot be undone.</p>
            <div class="confirmation-actions">
                <button class="confirm-btn">Yes, Reset Game</button>
                <button class="cancel-btn">Cancel</button>
            </div>
        </div>
    `;
    
    // Add to DOM
    document.body.appendChild(dialog);
    
    // Show dialog with animation
    setTimeout(() => {
        dialog.classList.add('active');
    }, 10);
    
    // Setup action buttons
    const confirmButton = dialog.querySelector('.confirm-btn');
    const cancelButton = dialog.querySelector('.cancel-btn');
    
    confirmButton.addEventListener('click', function() {
        // Close dialog first
        dialog.classList.remove('active');
        
        // Then reset game after animation completes
        setTimeout(() => {
            resetGame();
            dialog.remove();
        }, 300);
    });
    
    cancelButton.addEventListener('click', function() {
        // Just close the dialog
        dialog.classList.remove('active');
        
        setTimeout(() => {
            dialog.remove();
        }, 300);
    });
}

/**
 * Reset the game
 */
function resetGame() {
    // Clear game state
    gameState.resetGame();
    
    // Show welcome screen
    hideSection('game-interface');
    setTimeout(() => {
        showSection('welcome-section');
    }, 500);
    
    showNotification('Game has been reset', 'info');
}

export { initGameController, startGame, setupExploration, resetGame };