/**
 * Game Activities Controller
 * Handles game activities like exploration, combat, and trading
 */

import gameState from '../models/game-state.js';
import { flashExpGain, flashStaminaLoss } from '../utils/progress-bar-handler.js';
import { updateResourcesPanel, updateStatsPanel, addToGameLog } from './game-interface-controller.js';
import { showNotification } from '../utils/ui-manager.js';

// Store the current location data
let currentLocation = {
    name: 'City Square',
    description: 'The bustling heart of the City of Wonders, where paths lead to adventure.',
    level: 1,
    options: ['explore', 'rest', 'trade']
};

// Import the updateLocationsUI function
let updateLocationsUI;
import('./game-interface-controller.js').then(module => {
    updateLocationsUI = module.updateLocationsUI;
});

/**
 * Handle explore action with different possible outcomes
 * @returns {Object} The result of the exploration
 */
function handleExplore() {
    const player = gameState.player;
    
    // Check if player has enough stamina
    if (player.stamina < 1) {
        showNotification('Not enough stamina to explore!', 'error');
        addToGameLog('You are too tired to explore. Rest to regain stamina.');
        return { success: false, message: 'Not enough stamina' };
    }
    
    // Spend stamina
    player.modifyStamina(-1);
    flashStaminaLoss();
    addToGameLog(`You spend stamina to explore. (-1 Stamina)`);
    
    // Random exploration events based on current location
    const events = generateExplorationEvents(currentLocation);
    
    // Select random event
    const randomEvent = events[Math.floor(Math.random() * events.length)];
    
    // Apply event effect
    const result = randomEvent.effect();

    // Flash XP bar if we gained experience
    if (result.type === 'experience' || (result.type === 'job' && result.experience)) {
        flashExpGain();
    }
    
    // Add to game log
    addToGameLog(randomEvent.message);
    
    // Small chance to discover a new location
    if (Math.random() < 0.1) {
        const newLocation = discoverNewLocation();
        if (newLocation) {
            addToGameLog(`You discovered a new area: ${newLocation.name}!`);
            showNotification(`New area discovered: ${newLocation.name}!`, 'success');
        }
    }
    
    // Save game state
    gameState.saveGame();
    
    // Update UI
    updateResourcesPanel();
    updateStatsPanel();
    
    return { success: true, message: 'Exploration complete', event: randomEvent };
}

/**
 * Generate exploration events based on current location
 * @param {Object} location - The current location
 * @returns {Array} Array of possible events
 */
function generateExplorationEvents(location) {
    // Base events that can happen anywhere
    const baseEvents = [
        { 
            message: 'You found some old coins in a fountain! +5 gold',
            effect: () => { 
                gameState.player.modifyGold(5);
                return { type: 'gold', amount: 5 };
            }
        },
        { 
            message: 'You encountered a friendly merchant who shared city gossip.',
            effect: () => { return { type: 'gossip' }; }
        }
    ];
    
    // Location-specific events
    let locationEvents = [];
    
    if (location.name === 'City Square') {
        locationEvents = [
            { 
                message: 'You helped a city guard catch a pickpocket and earned their gratitude. +10 XP',
                effect: () => { 
                    const leveledUp = gameState.player.addExperience(10);
                    if (leveledUp) {
                        addToGameLog('You gained a level! Your abilities have improved.');
                        showNotification('Level Up!', 'success');
                    }
                    return { type: 'experience', amount: 10, levelUp: leveledUp };
                }
            },
            { 
                message: 'You found a torn page from an ancient book with cryptic writings. +5 XP',
                effect: () => { 
                    gameState.player.addExperience(5);
                    return { type: 'experience', amount: 5 };
                }
            },
            { 
                message: 'A street performer shared a tale of the city\'s history with you. +8 XP',
                effect: () => { 
                    gameState.player.addExperience(8);
                    return { type: 'experience', amount: 8 };
                }
            }
        ];
    } else if (location.name === 'Market District') {
        locationEvents = [
            { 
                message: 'You found a discarded item that might be valuable! +8 gold',
                effect: () => { 
                    gameState.player.modifyGold(8);
                    return { type: 'gold', amount: 8 };
                }
            },
            { 
                message: 'A merchant offered you a small job delivering a package. +12 gold, +5 XP',
                effect: () => { 
                    gameState.player.modifyGold(12);
                    gameState.player.addExperience(5);
                    return { type: 'job', gold: 12, experience: 5 };
                }
            }
        ];
    } else if (location.name === 'Harbor') {
        locationEvents = [
            { 
                message: 'You helped unload a cargo ship and earned some coin. +15 gold, +8 XP',
                effect: () => { 
                    gameState.player.modifyGold(15);
                    gameState.player.addExperience(8);
                    return { type: 'job', gold: 15, experience: 8 };
                }
            },
            { 
                message: 'A sailor shared tales of the sea with you. +10 XP',
                effect: () => { 
                    gameState.player.addExperience(10);
                    return { type: 'experience', amount: 10 };
                }
            }
        ];
    }
    
    // Combine base events and location events
    return [...baseEvents, ...locationEvents];
}

/**
 * Handle rest action to restore stamina
 * @returns {Object} The result of resting
 */
function handleRest() {
    const player = gameState.player;
    
    // Check if stamina is already full
    if (player.stamina >= player.maxStamina) {
        showNotification('You are already fully rested!', 'info');
        return { success: false, message: 'Already rested' };
    }
    
    // Restore stamina
    const staminaRestored = player.modifyStamina(5);
    const actualStaminaRestored = Math.min(5, player.maxStamina - (player.stamina - 5));
    
    // Show notification and add to log
    addToGameLog(`You rested and recovered some stamina. (+${actualStaminaRestored} Stamina)`);
    showNotification('You feel refreshed!', 'success');
    
    // Save game state
    gameState.saveGame();
    
    // Update UI
    updateResourcesPanel();
    updateStatsPanel();
    
    return { success: true, staminaRestored: actualStaminaRestored };
}

/**
 * Handle trade action to buy/sell items
 * @returns {Object} The result of trading
 */
function handleTrade() {
    // This is a placeholder for future implementation
    showNotification('The market is coming soon!', 'info');
    addToGameLog('You visit the market, but most shops are still being set up.');
    
    return { success: false, message: 'Trading not yet implemented' };
}


/**
 * Handle the beg action for the Waif class
 * @returns {Object} The result of begging
 */
function handleBeg() {
    const player = gameState.player;
    
    // Check if player has enough stamina
    if (player.stamina < 1) {
        showNotification('Not enough stamina to beg!', 'error');
        addToGameLog('You are too tired to beg. Rest to regain stamina.');
        return { success: false, message: 'Not enough stamina' };
    }
    
    // Spend stamina
    player.modifyStamina(-1);
    flashStaminaLoss();
    addToGameLog(`You spend stamina to beg. (-1 Stamina)`);
    
    // Random begging outcome
    const goldFound = Math.floor(Math.random() * 3); // Random between 0 and 3 gold
    player.modifyGold(goldFound);
    
    // Flash XP bar if we gained experience
    const xpGained = Math.floor(Math.random() * 2); // Random between 0 and 2 XP
    if (xpGained > 0) {
        gameState.player.addExperience(xpGained);
        flashExpGain(xpGained);
        // Add to game log
        addToGameLog(`You begged for coins and found ${goldFound} gold and gained ${xpGained} XP from your efforts!`);
    } else {
        addToGameLog(`You begged for coins and found ${goldFound} gold.`);
    }   
    
    // Save game state
    gameState.saveGame();
    
    // Update UI
    updateResourcesPanel();
    updateStatsPanel();
    
    return { success: true, goldFound: goldFound };
}

/**
 * Handle the pick pocket action for the Urchin class
 * @returns {Object} The result of pick pocketing
 */
function handlePickPocket() {
    const player = gameState.player;
    
    // Check if player has enough stamina
    if (player.stamina < 1) {
        showNotification('Not enough stamina to pick pockets!', 'error');
        addToGameLog('You are too tired to pick pockets. Rest to regain stamina.');
        return { success: false, message: 'Not enough stamina' };
    }
    
    // Spend stamina
    player.modifyStamina(-1);
    flashStaminaLoss();
    addToGameLog(`You spend stamina to pick pockets. (-1 Stamina)`);
    
    // Random begging outcome
    const goldFound = Math.floor(Math.random() * 5); // Random between 0 and 3 gold
    player.modifyGold(goldFound);
    
    // Flash XP bar if we gained experience
    const xpGained = Math.floor(Math.random() * 2); // Random between 0 and 2 XP
    if (xpGained > 0) {
        gameState.player.addExperience(xpGained);
        flashExpGain(xpGained);
        // Add to game log
        addToGameLog(`You picked a pocket for coins and found ${goldFound} gold and gained ${xpGained} XP from your efforts!`);
    } else {
        addToGameLog(`You picked a pocket for coins and found ${goldFound} gold.`);
    }   
    
    // Save game state
    gameState.saveGame();
    
    // Update UI
    updateResourcesPanel();
    updateStatsPanel();
    
    return { success: true, goldFound: goldFound };
}

/**
 * Discover a new location (random chance)
 * @returns {Object|null} The new location or null if no discovery
 */
function discoverNewLocation() {
    // Get current discovered locations
    gameState.locations = gameState.locations || {};
    
    // Potential new locations
    const potentialLocations = [
        {
            id: 'market',
            name: 'Market District',
            description: 'A bustling marketplace with vendors from across the realm.',
            level: 2,
            options: ['explore', 'rest', 'trade']
        },
        {
            id: 'harbor',
            name: 'Harbor',
            description: 'Ships from distant lands dock here, bringing exotic goods and tales.',
            level: 3,
            options: ['explore', 'rest', 'trade']
        },
        {
            id: 'gardens',
            name: 'Hanging Gardens',
            description: 'A peaceful oasis in the city, with plants from around the world.',
            level: 2,
            options: ['explore', 'rest']
        },
        {
            id: 'academy',
            name: 'Arcane Academy',
            description: 'Where the city\'s scholars study the mysteries of magic and science.',
            level: 4,
            options: ['explore', 'rest', 'study']
        }
    ];
    
    // Filter out already discovered locations
    const undiscoveredLocations = potentialLocations.filter(
        location => !gameState.locations[location.id]
    );
    
    // If all locations discovered, return null
    if (undiscoveredLocations.length === 0) {
        return null;
    }
    
    // Discover a random new location
    const newLocation = undiscoveredLocations[Math.floor(Math.random() * undiscoveredLocations.length)];
    
    // Add to discovered locations
    gameState.locations[newLocation.id] = {
        discovered: true,
        visited: false,
        name: newLocation.name,
        level: newLocation.level
    };
    
    // Update locations UI
    if (updateLocationsUI) {
        updateLocationsUI();
    }
    
    return newLocation;
}

/**
 * Change the current location
 * @param {string} locationId - The ID of the location to change to
 * @returns {boolean} Whether the location change was successful
 */
function changeLocation(locationId) {
    // Check if location exists and is discovered
    if (!gameState.locations[locationId] || !gameState.locations[locationId].discovered) {
        return false;
    }
    
    // Get location data
    const locationData = getLocationById(locationId);
    if (!locationData) {
        return false;
    }
    
    // Update current location
    currentLocation = locationData;
    
    // Mark as visited
    gameState.locations[locationId].visited = true;
    
    // Update location display
    document.getElementById('current-location').textContent = currentLocation.name;
    document.getElementById('location-description').textContent = currentLocation.description;
    
    // Add to game log
    addToGameLog(`You travel to ${currentLocation.name}.`);
    
    // Save game state
    gameState.saveGame();
    
    return true;
}

/**
 * Get location data by ID
 * @param {string} locationId - The ID of the location
 * @returns {Object|null} The location data or null if not found
 */
function getLocationById(locationId) {
    // Map of all locations
    const allLocations = {
        'city-square': {
            name: 'City Square',
            description: 'The bustling heart of the City of Wonders, where paths lead to adventure.',
            level: 1,
            options: ['explore', 'rest', 'trade']
        },
        'market': {
            name: 'Market District',
            description: 'A bustling marketplace with vendors from across the realm.',
            level: 2,
            options: ['explore', 'rest', 'trade']
        },
        'harbor': {
            name: 'Harbor',
            description: 'Ships from distant lands dock here, bringing exotic goods and tales.',
            level: 3,
            options: ['explore', 'rest', 'trade']
        },
        'gardens': {
            name: 'Hanging Gardens',
            description: 'A peaceful oasis in the city, with plants from around the world.',
            level: 2,
            options: ['explore', 'rest']
        },
        'academy': {
            name: 'Arcane Academy',
            description: 'Where the city\'s scholars study the mysteries of magic and science.',
            level: 4,
            options: ['explore', 'rest', 'study']
        }
    };
    
    return allLocations[locationId] || null;
}

/**
 * Get the current location data
 * @returns {Object} The current location data
 */
function getCurrentLocation() {
    return currentLocation;
}

/**
 * Initialize locations
 */
function initLocations() {
    // Always start with city square discovered
    gameState.locations = gameState.locations || {};
    gameState.locations['city-square'] = {
        discovered: true,
        visited: true,
        name: 'City Square',
        level: 1
    };
    
    // Update current location display
    document.getElementById('current-location').textContent = currentLocation.name;
    document.getElementById('location-description').textContent = currentLocation.description;
}

export {
    handleExplore,
    handleRest,
    handleTrade,
    handleBeg,
    handlePickPocket,
    changeLocation,
    getCurrentLocation,
    initLocations
};