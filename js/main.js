/**
 * Main JavaScript file
 * Entry point for the application
 */

// Import modules
import { loadPartials } from './utils/html-loader.js';
import { hideSection, showSection, showNotification } from './utils/ui-manager.js';
import { startGame, setupExploration } from './controllers/game-controller.js';
import { initCharacterCreation } from './controllers/character-controller.js';
import gameState from './models/game-state.js';

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', async function () {
    try {
        // Load partials first
        await loadPartials();

        // Get reference to the start button
        const startButton = document.getElementById('start-game-btn');

        // Ensure the start button exists before adding an event listener
        if (startButton) {
            // Add click event listener to the start button
            startButton.addEventListener('click', startGame);
        } else {
            console.error('Start button not found in the DOM.');
        }

        // Initialize the game state
        gameState.init();
        
        // Initialize the character creation module
        initCharacterCreation();

        // Set up explore button event listener
        setupExploration();
        
        // Make UI utilities available globally for other scripts
        window.hideSection = hideSection;
        window.showSection = showSection;
        window.showNotification = showNotification;
        
    } catch (error) {
        console.error('Error during initialization:', error);
    }
});