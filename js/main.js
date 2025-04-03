/**
 * Main JavaScript file
 * Handles initial game setup and section transitions
 */

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get reference to the start button
    const startButton = document.getElementById('start-game-btn');
    
    // Ensure the start button exists before adding an event listener
    if (startButton) {
        // Add click event listener to the start button
        startButton.addEventListener('click', startGame);
    } else {
        console.error('Start button not found in the DOM.');
    }
    
    // Initialize the character creation module
    initCharacterCreation();
    
    // Set up explore button event listener
    const exploreButton = document.getElementById('explore-btn');
    if (exploreButton) {
        exploreButton.addEventListener('click', function() {
            showNotification('Exploration feature coming soon!', 'info');
        });
    } else {
        console.error('Explore button not found in the DOM.');
    }
});

/**
 * Handle the "Enter the City" button click
 * Transitions from welcome to character creation
 */
function startGame() {
    // Hide welcome section
    hideSection('welcome-section');
    
    // Show character creation section
    showSection('character-creation');
}

/**
 * Hide a section by ID
 * @param {string} sectionId - The ID of the section to hide
 */
function hideSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.style.display = 'none';
    }
}

/**
 * Show a section by ID 
 * @param {string} sectionId - The ID of the section to show
 */
function showSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.style.display = 'block';
    }
}

/**
 * Show a notification message
 * @param {string} message - The message to display
 * @param {string} type - Notification type (info, success, error)
 */
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = '#333333';
    notification.style.padding = '15px 20px';
    notification.style.borderRadius = '4px';
    notification.style.maxWidth = '300px';
    notification.style.zIndex = '1000';
    
    notification.innerHTML = `
        <div class="notification-content">
            <p>${message}</p>
        </div>
    `;
    
    // Add to the DOM
    document.body.appendChild(notification);
    
    // Auto hide after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

// Export utilities for use in other modules
window.hideSection = hideSection;
window.showSection = showSection;
window.showNotification = showNotification;