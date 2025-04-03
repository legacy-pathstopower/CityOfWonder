/**
 * Game Controller Module
 * Handles game state transitions and main gameplay logic
 */

import { hideSection, showSection, showNotification } from '../utils/ui-manager.js';
import gameState from '../models/game-state.js';
import { initGameInterface, resetGame } from './game-interface-controller.js';

/**
 * Initialize the game controller
 */
function initGameController() {
    // Check if there's a saved game
    if (gameState.player) {
        // If we have a player, setup game interface
        showSection('game-interface');
        initGameInterface();
        
        // Ensure locations are properly initialized
        import('./game-activities-controller.js').then(module => {
            module.initLocations();
        });
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

export { initGameController, startGame, showResetConfirmation };