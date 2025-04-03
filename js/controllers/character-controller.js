/**
 * Character Controller Module
 * Handles character creation and management
 */

import Character from '../models/character.js';
import gameState from '../models/game-state.js';
import { hideSection, showSection, showNotification, showInputError } from '../utils/ui-manager.js';
import { initGameInterface } from './game-interface-controller.js';

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
    showNotification(`Welcome to the City of Wonders, ${name}!`, 'success');
    
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
    
    // Show the game interface with animation
    showSection('game-interface');
    
    // Initialize the game interface
    initGameInterface();
}

export { initCharacterCreation, createCharacter, showGameInterface };