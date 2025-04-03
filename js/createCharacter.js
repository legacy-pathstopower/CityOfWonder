/**
 * Character Creation Module
 * Handles character creation form and related functionality
 */

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
    
    // Transition to game interface
    hideSection('character-creation');
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
    
    // Store the player character for game use
    window.gameState = window.gameState || {};
    window.gameState.player = player;
    
    return player;
}

/**
 * Show the game interface with player data
 */
function showGameInterface() {
    // Show loading indicator
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'loading-indicator';
    loadingIndicator.innerHTML = '<div class="spinner"></div><p>Loading your adventure...</p>';
    
    document.querySelector('main').appendChild(loadingIndicator);
    
    // Simulate loading time
    setTimeout(() => {
        // Remove loading indicator
        document.querySelector('main').removeChild(loadingIndicator);
        
        // Get player info
        const player = window.gameState?.player;
        
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
        
        // Show the game interface
        document.getElementById('game-interface').classList.add('active');
    }, 1000);
}

/**
 * Show an input error message
 * @param {string} inputId - ID of the input field
 * @param {string} message - Error message to display
 */
function showInputError(inputId, message) {
    const input = document.getElementById(inputId);
    input.classList.add('error');
    
    // Create error message element
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.textContent = message;
    
    // Check if an error message already exists
    const existingError = input.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add error message after the input
    input.parentNode.insertBefore(errorMessage, input.nextSibling);
    
    // Remove error after 3 seconds
    setTimeout(() => {
        input.classList.remove('error');
        if (errorMessage.parentNode) {
            errorMessage.parentNode.removeChild(errorMessage);
        }
    }, 3000);
}

/**
 * Hide a section by ID
 * @param {string} sectionId - The ID of the section to hide
 */
function hideSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.remove('active');
    }
}

// Make the initialization function available globally
window.initCharacterCreation = initCharacterCreation;