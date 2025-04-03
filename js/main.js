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
        section.classList.remove('active');
    }
}

/**
 * Show a section by ID with animation
 * @param {string} sectionId - The ID of the section to show
 */
function showSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.add('active');
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
    notification.innerHTML = `
        <div class="notification-content">
            <p>${message}</p>
        </div>
    `;
    
    // Add to the DOM
    document.body.appendChild(notification);
    
    // Show with animation
    setTimeout(() => {
        notification.classList.add('show');
        
        // Auto hide after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            
            // Remove from DOM after animation completes
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 500);
        }, 3000);
    }, 10);
}

// Export utilities for use in other modules
window.hideSection = hideSection;
window.showSection = showSection;
window.showNotification = showNotification;