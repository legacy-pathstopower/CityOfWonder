/**
 * UI Manager Module
 * Handles UI-related functionality such as showing/hiding sections
 * and displaying notifications
 */

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

// Export functions
export { hideSection, showSection, showNotification };