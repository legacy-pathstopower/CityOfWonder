/**
 * UI Manager Module
 * Handles UI-related functionality such as showing/hiding sections
 * and displaying notifications
 */

/**
 * Hide a section by ID and remove active class
 * @param {string} sectionId - The ID of the section to hide
 */
function hideSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.remove('active');
        section.classList.add('fade-out');
        
        // After the animation completes, hide the element
        setTimeout(() => {
            section.style.display = 'none';
        }, 500);
    }
}

/**
 * Show a section by ID and add active class with animation
 * @param {string} sectionId - The ID of the section to show
 */
function showSection(sectionId) {
    // First, hide all game sections
    const allSections = document.querySelectorAll('.game-section');
    allSections.forEach(section => {
        section.classList.remove('active');
        section.style.display = 'none';
    });
    
    // Then show the requested section
    const section = document.getElementById(sectionId);
    if (section) {
        section.style.display = 'flex';
        
        // Trigger reflow for animation to work
        void section.offsetWidth;
        
        section.classList.add('active');
        section.classList.remove('fade-out');
        section.classList.add('fade-in');
    }
}

/**
 * Show a notification message
 * @param {string} message - The message to display
 * @param {string} type - Notification type (info, success, error)
 * @param {number} duration - How long to show the notification in ms
 */
function showNotification(message, type = 'info', duration = 3000) {
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
    
    // Show animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Auto hide after specified duration
    setTimeout(() => {
        notification.classList.remove('show');
        
        // Remove from DOM after animation completes
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, duration);
}

/**
 * Show an input error message
 * @param {string} inputId - ID of the input field
 * @param {string} message - Error message to display
 */
function showInputError(inputId, message) {
    const input = document.getElementById(inputId);
    if (!input) return;
    
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

// Export functions
export { hideSection, showSection, showNotification, showInputError };