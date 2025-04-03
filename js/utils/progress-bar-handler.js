/**
 * Progress Bar Handler Module
 * Handles updating the progress bars for health and experience
 */

/**
 * Update the health progress bar
 * @param {number} current - Current health value
 * @param {number} max - Maximum health value
 */
function updateHealthBar(current, max) {
    const healthBar = document.getElementById('health-bar');
    const healthText = document.getElementById('health-bar-text');
    const healthContainer = document.getElementById('health-progress');
    
    if (!healthBar || !healthText) return;
    
    // Calculate percentage
    const percentage = Math.min(100, Math.max(0, (current / max) * 100));
    
    // Update the bar width
    healthBar.style.width = `${percentage}%`;
    
    // Update text
    healthText.textContent = `${current}/${max}`;
    
    // Add low health indicator if below 25%
    if (percentage < 25) {
        healthContainer.classList.add('low-health');
    } else {
        healthContainer.classList.remove('low-health');
    }
}

/**
 * Update the experience progress bar
 * @param {number} current - Current experience value
 * @param {number} max - Experience needed for next level
 */
function updateExpBar(current, max) {
    const expBar = document.getElementById('exp-bar');
    const expText = document.getElementById('exp-bar-text');
    const expContainer = document.getElementById('exp-progress');
    
    if (!expBar || !expText) return;
    
    // Calculate percentage
    const percentage = Math.min(100, Math.max(0, (current / max) * 100));
    
    // Update the bar width
    expBar.style.width = `${percentage}%`;
    
    // Update text
    expText.textContent = `${current}/${max}`;
}

/**
 * Flash the XP bar to indicate XP gain
 */
function flashExpGain() {
    const expContainer = document.getElementById('exp-progress');
    
    if (!expContainer) return;
    
    // Add the animation class
    expContainer.classList.add('xp-gained');
    
    // Remove the class after animation completes
    setTimeout(() => {
        expContainer.classList.remove('xp-gained');
    }, 800);
}

/**
 * Initialize the progress bars with current values
 * @param {Object} player - The player character object
 */
function initProgressBars(player) {
    if (!player) return;
    
    updateHealthBar(player.health, player.maxHealth);
    updateExpBar(player.experience, player.experienceToNextLevel);
}

// Export functions for use in other modules
export {
    updateHealthBar,
    updateExpBar,
    flashExpGain,
    initProgressBars
};