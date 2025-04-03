/**
 * Game Interface Controller
 * Handles the game interface and interaction between panels
 */

import { showNotification } from '../utils/ui-manager.js';
import { updateHealthBar, updateExpBar, initProgressBars } from '../utils/progress-bar-handler.js';
import gameState from '../models/game-state.js';

/**
 * Initialize the game interface
 */
function initGameInterface() {
    // Initialize game time display
    import('./game-time-display.js').then(module => {
        module.initGameTimeDisplay();
    });
    
    // Initialize progress bars
    initProgressBars(gameState.player);
    
    // Update all UI elements with current player data
    updateResourcesPanel();
    updateStatsPanel();
    
    // Setup action buttons
    setupActionButtons();
    
    // Setup menu buttons
    setupMenuButtons();
    
    // Initialize locations
    import('./game-activities-controller.js').then(module => {
        module.initLocations();
    });
    
    // Setup location selector
    setupLocationSelector();
    
    // Start game time
    gameState.startGameTime();
    
    // Log initial game start
    addToGameLog('Welcome to the City of Wonders. Your adventure begins now!');
}

/**
 * Update the resources panel with current player data
 */
function updateResourcesPanel() {
    const player = gameState.player;
    if (!player) return;
    
    // Update gold
    document.getElementById('player-gold').textContent = player.gold;
    
    // Update energy
    document.getElementById('player-energy').textContent = player.energy;
    document.getElementById('player-max-energy').textContent = player.maxEnergy;
    
    // Additional resources can be added here as they are unlocked
}

/**
 * Update the stats panel with current player data
 */
function updateStatsPanel() {
    const player = gameState.player;
    if (!player) return;
    
    // Update basic info
    document.getElementById('player-name').textContent = player.name;
    document.getElementById('player-class').textContent = player.class;
    document.getElementById('player-level').textContent = player.level;
    
    // Update progress bars instead of text
    updateHealthBar(player.health, player.maxHealth);
    updateExpBar(player.experience, player.experienceToNextLevel);
    
    // Update stats list
    const statsList = document.getElementById('player-stats');
    statsList.innerHTML = '';
    
    for (const [stat, value] of Object.entries(player.stats)) {
        const listItem = document.createElement('li');
        
        const statName = document.createElement('span');
        statName.className = 'stat-name';
        statName.textContent = stat.charAt(0).toUpperCase() + stat.slice(1);
        
        const statValue = document.createElement('span');
        statValue.className = 'stat-value';
        statValue.textContent = value;
        
        listItem.appendChild(statName);
        listItem.appendChild(statValue);
        statsList.appendChild(listItem);
    }
}

/**
 * Set up action buttons in the interaction panel
 */
function setupActionButtons() {
    // Explore button
    const exploreButton = document.getElementById('explore-btn');
    if (exploreButton) {
        exploreButton.addEventListener('click', handleExploreAction);
    }
    
    // Rest button
    const restButton = document.getElementById('rest-btn');
    if (restButton) {
        restButton.addEventListener('click', handleRestAction);
    }
    
    // Trade button
    const tradeButton = document.getElementById('trade-btn');
    if (tradeButton) {
        tradeButton.addEventListener('click', handleTradeAction);
    }
}

/**
 * Set up menu buttons in the stats panel
 */
function setupMenuButtons() {
    // Settings button
    const settingsButton = document.getElementById('settings-btn');
    if (settingsButton) {
        settingsButton.addEventListener('click', showSettingsDialog);
    }
    
    // Reset game button
    const resetButton = document.getElementById('reset-game-btn');
    if (resetButton) {
        resetButton.addEventListener('click', showResetConfirmation);
    }
}

/**
 * Handle explore action
 */
function handleExploreAction() {
    // Import needed for circular dependency resolution
    import('./game-activities-controller.js').then(module => {
        const result = module.handleExplore();
        
        if (result.success) {
            showNotification('Exploration complete!', 'info');
        }
    });
}

/**
 * Handle rest action
 */
function handleRestAction() {
    // Import needed for circular dependency resolution
    import('./game-activities-controller.js').then(module => {
        module.handleRest();
    });
}

/**
 * Handle trade action
 */
function handleTradeAction() {
    // Import needed for circular dependency resolution
    import('./game-activities-controller.js').then(module => {
        module.handleTrade();
    });
}

/**
 * Show settings dialog
 */
function showSettingsDialog() {
    // This is a placeholder for future implementation
    showNotification('Settings coming soon!', 'info');
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
    // Stop game time
    gameState.stopGameTime();
    
    // Clear game state
    gameState.resetGame();
    
    // Reload the page to restart completely fresh
    window.location.reload();
}

/**
 * Add a message to the game log
 * @param {string} message - Message to add to the log
 */
function addToGameLog(message) {
    const logContent = document.getElementById('log-content');
    
    // Create new log entry
    const logEntry = document.createElement('p');
    logEntry.textContent = message;
    
    // Add timestamp if needed
    // const timestamp = new Date().toLocaleTimeString();
    // logEntry.textContent = `[${timestamp}] ${message}`;
    
    // Add to the log
    logContent.insertBefore(logEntry, logContent.firstChild);
    
    // Trim log if it gets too long (optional)
    const maxLogEntries = 50;
    while (logContent.children.length > maxLogEntries) {
        logContent.removeChild(logContent.lastChild);
    }
}

/**
 * Setup location selector in the interaction panel
 */
function setupLocationSelector() {
    // Create locations UI element
    const actionOptions = document.querySelector('.action-options');
    
    // Create locations section
    const locationsSection = document.createElement('div');
    locationsSection.className = 'locations-section';
    locationsSection.innerHTML = `
        <h4>Discovered Locations</h4>
        <div id="locations-container" class="locations-container">
            <!-- Locations will be added here -->
        </div>
    `;
    
    // Add to DOM after action options
    actionOptions.parentNode.insertBefore(locationsSection, actionOptions.nextSibling);
    
    // Update the locations UI
    updateLocationsUI();
}

/**
 * Update the locations UI with discovered locations
 */
function updateLocationsUI() {
    const locationsContainer = document.getElementById('locations-container');
    if (!locationsContainer) return;
    
    // Clear existing locations
    locationsContainer.innerHTML = '';
    
    // Get discovered locations
    const locations = gameState.locations || {};
    
    // Create a button for each discovered location
    for (const [id, locationData] of Object.entries(locations)) {
        if (locationData.discovered) {
            const locationButton = document.createElement('button');
            locationButton.className = 'location-btn';
            locationButton.dataset.locationId = id;
            locationButton.textContent = locationData.name;
            
            // Add event listener
            locationButton.addEventListener('click', function() {
                // Import needed for circular dependency resolution
                import('./game-activities-controller.js').then(module => {
                    module.changeLocation(id);
                    
                    // Update button states
                    const allLocationButtons = document.querySelectorAll('.location-btn');
                    allLocationButtons.forEach(btn => {
                        btn.classList.remove('active');
                    });
                    
                    // Mark this button as active
                    locationButton.classList.add('active');
                });
            });
            
            // Mark city square as active by default
            if (id === 'city-square') {
                locationButton.classList.add('active');
            }
            
            locationsContainer.appendChild(locationButton);
        }
    }
    
    // If no locations, show a message
    if (locationsContainer.children.length === 0) {
        locationsContainer.innerHTML = '<p class="no-locations">Explore to discover new locations</p>';
    }
}

export { 
    initGameInterface, 
    updateResourcesPanel, 
    updateStatsPanel, 
    addToGameLog,
    updateLocationsUI,
    resetGame
};