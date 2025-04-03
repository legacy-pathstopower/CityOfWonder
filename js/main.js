/**
 * Main JavaScript file
 * Entry point for the application
 */

// Import modules
import gameState from './models/game-state.js';
import { initCharacterCreation } from './controllers/character-controller.js';
import { initGameController } from './controllers/game-controller.js';
import { showNotification } from './utils/ui-manager.js';

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    try {
        console.log('City of Wonders: Initializing game...');
        
        // Initialize modules
        initializeGame();
        
    } catch (error) {
        console.error('Error during initialization:', error);
        showNotification('There was an error loading the game. Please try refreshing the page.', 'error');
    }
});

/**
 * Initialize all game modules
 */
function initializeGame() {
    // Initialize the game state
    gameState.init();
    
    // Initialize the character creation module
    initCharacterCreation();
    
    // Initialize the game controller
    initGameController();
    
    // Add event listener for the footer donation link
    setupDonationLink();
    
    // Log initialization complete
    console.log('City of Wonders: Initialization complete');
}


// Export any functions that need to be accessed from HTML
window.showNotification = showNotification;