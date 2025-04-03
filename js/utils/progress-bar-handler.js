/**
 * Progress Bar Handler Module
 * Handles updating the progress bars for health, stamina, and experience
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
 * Update the stamina progress bar
 * @param {number} current - Current stamina value
 * @param {number} max - Maximum stamina value
 */
function updateStaminaBar(current, max) {
    const staminaBar = document.getElementById('stamina-bar');
    const staminaText = document.getElementById('stamina-bar-text');
    const staminaContainer = document.getElementById('stamina-progress');
    
    if (!staminaBar || !staminaText) return;
    
    // Calculate percentage
    const percentage = Math.min(100, Math.max(0, (current / max) * 100));
    
    // Update the bar width
    staminaBar.style.width = `${percentage}%`;
    
    // Update text
    staminaText.textContent = `${current}/${max}`;
    
    // Add low stamina indicator if below 25%
    if (percentage < 25) {
        staminaContainer.classList.add('low-stamina');
    } else {
        staminaContainer.classList.remove('low-stamina');
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
 * Flash the stamina bar to indicate stamina loss
 */
function flashStaminaLoss() {
    const staminaContainer = document.getElementById('stamina-progress');
    
    if (!staminaContainer) return;
    
    // Add a quick flash class
    staminaContainer.classList.add('stamina-change');
    
    // Remove the class after animation completes
    setTimeout(() => {
        staminaContainer.classList.remove('stamina-change');
    }, 800);
}

/**
 * Initialize the progress bars with current values
 * @param {Object} player - The player character object
 */
function initProgressBars(player) {
    if (!player) return;
    
    updateHealthBar(player.health, player.maxHealth);
    updateStaminaBar(player.stamina, player.maxStamina);
    updateExpBar(player.experience, player.experienceToNextLevel);
}

// Export functions for use in other modules
export {
    updateHealthBar,
    updateStaminaBar,
    updateExpBar,
    flashExpGain,
    flashStaminaLoss,
    initProgressBars
};