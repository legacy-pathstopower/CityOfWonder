/**
 * Character Controller Module
 * Handles character creation and management
 */

import Character from '../models/character.js';
import gameState from '../models/game-state.js';
import { hideSection, showSection, showNotification, showInputError } from '../utils/ui-manager.js';

/**
 * Initialize character creation functionality
 */
function initCharacterCreation() {
    // Set up character form submission event listener
    const characterForm = document.getElementById('create-character-form');
    if (characterForm) {
        characterForm.addEventListener('submit', handleCharacterFormSubmit);
    } else {
        console.error('Character form not found in the DOM.');
    }
}

/**
 * Handle character form submission
 * @param {Event} event - Form submission event
 */
function handleCharacterFormSubmit(event) {
    // Prevent the form from submitting
    event.preventDefault();
    
    // Get form values
    const name = document.getElementById('character-name')?.value;
    const characterClass = document.querySelector('input[name="character-class"]:checked')?.value;
    
    // Validate input
    if (!name || name.trim() === '') {
        showInputError('character-name', 'Please enter a character name');
        return;
    }
    
    // Create the character
    createCharacter(name, characterClass);
    
    // Show notification
    showNotification(`Character ${name} created successfully!`, 'success');
    
    // Transition to game interface
    hideSection('character-creation-section');
    showGameInterface();
}

/**
 * Create a new character and save to game state
 * @param {string} name - Character name
 * @param {string} characterClass - Character class
 */
function createCharacter(name, characterClass) {
    // Create a new character
    const player = new Character(name, characterClass);
    
    // Store the player character in game state
    gameState.player = player;
    gameState.saveGame();
    
    return player;
}

/**
 * Show the game interface with player data
 */
function showGameInterface() {
    // Get player info
    const player = gameState.player;
    
    if (!player) {
        console.error('Player data not found in game state.');
        return;
    }
    
    // Update player info in the DOM
    document.getElementById('player-name').textContent = player.name;
    document.getElementById('player-class').textContent = player.class;
    
    // Generate stats list
    const statsList = document.getElementById('player-stats');
    statsList.innerHTML = '';
    
    for (const [stat, value] of Object.entries(player.stats)) {
        const listItem = document.createElement('li');
        listItem.textContent = `${stat.charAt(0).toUpperCase() + stat.slice(1)}: ${value}`;
        statsList.appendChild(listItem);
    }
    
    // Show the game interface with animation
    showSection('game-interface');
}

export { initCharacterCreation, createCharacter, showGameInterface };