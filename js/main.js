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
        
        // Initialize game modules
        initializeGame();
        
    } catch (error) {
        console.error('Initialization error:', error);
        showNotification('Failed to load the game. Please refresh the page.', 'error');
    }
});

/**
 * Initialize all game modules
 */
function initializeGame() {
    try {
        // Initialize the game state
        gameState.init();
        
        // Initialize the character creation module
        initCharacterCreation();
        
        // Initialize the game controller
        initGameController();
        
        // Setup donation link if it exists
        const donateLink = document.querySelector('footer a[href*="paypal"]');
        if (donateLink) {
            donateLink.addEventListener('click', function() {
                showNotification('Thank you for supporting the development!', 'success');
            });
        }
        
        // Log initialization complete
        console.log('City of Wonders: Initialization complete');
    } catch (error) {
        console.error('Game initialization failed:', error);
        showNotification('Error setting up the game. Please try again.', 'error');
    }
}

// Export global functions for HTML access
window.resetGame = function() {
    // Dynamic import to avoid circular dependencies
    import('./controllers/game-interface-controller.js').then(module => {
        module.resetGame();
    }).catch(error => {
        console.error('Failed to reset game:', error);
        showNotification('Game reset failed. Please refresh the page.', 'error');
    });
};

// Optional: Export showNotification for global use
window.showNotification = showNotification;