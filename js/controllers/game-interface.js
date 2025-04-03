/**
 * Game Interface Controller
 * Handles the game interface and interaction between panels
 */

 import { showNotification } from '../utils/ui-manager.js';
 import gameState from '../models/game-state.js';
 
 /**
  * Initialize the game interface
  */
 function initGameInterface() {
     // Update all UI elements with current player data
     updateResourcesPanel();
     updateStatsPanel();
     
     // Setup action buttons
     setupActionButtons();
     
     // Setup menu buttons
     setupMenuButtons();
     
     // Log initial game start
     addToGameLog('Welcome to the City of Wonders. Your adventure begins now!');
 }
 
 /**
  * Update the resources panel with current player data
  */
 function updateResourcesPanel() {
     const player = gameState.player;
     if (!player) return;
     
     // Update gold
     document.getElementById('player-gold').textContent = player.gold;
     
     // Update energy
     document.getElementById('player-energy').textContent = player.energy;
     document.getElementById('player-max-energy').textContent = player.maxEnergy;
     
     // Additional resources can be added here as they are unlocked
 }
 
 /**
  * Update the stats panel with current player data
  */
 function updateStatsPanel() {
     const player = gameState.player;
     if (!player) return;
     
     // Update basic info
     document.getElementById('player-name').textContent = player.name;
     document.getElementById('player-class').textContent = player.class;
     document.getElementById('player-level').textContent = player.level;
     
     // Update experience
     document.getElementById('player-exp').textContent = player.experience;
     document.getElementById('player-exp-next').textContent = player.experienceToNextLevel;
     
     // Update health
     document.getElementById('player-health').textContent = player.health;
     document.getElementById('player-max-health').textContent = player.maxHealth;
     
     // Update stats list
     const statsList = document.getElementById('player-stats');
     statsList.innerHTML = '';
     
     for (const [stat, value] of Object.entries(player.stats)) {
         const listItem = document.createElement('li');
         
         const statName = document.createElement('span');
         statName.className = 'stat-name';
         statName.textContent = stat.charAt(0).toUpperCase() + stat.slice(1);
         
         const statValue = document.createElement('span');
         statValue.className = 'stat-value';
         statValue.textContent = value;
         
         listItem.appendChild(statName);
         listItem.appendChild(statValue);
         statsList.appendChild(listItem);
     }
 }
 
 /**
  * Set up action buttons in the interaction panel
  */
 function setupActionButtons() {
     // Explore button
     const exploreButton = document.getElementById('explore-btn');
     if (exploreButton) {
         exploreButton.addEventListener('click', handleExploreAction);
     }
     
     // Rest button
     const restButton = document.getElementById('rest-btn');
     if (restButton) {
         restButton.addEventListener('click', handleRestAction);
     }
     
     // Trade button
     const tradeButton = document.getElementById('trade-btn');
     if (tradeButton) {
         tradeButton.addEventListener('click', handleTradeAction);
     }
 }
 
 /**
  * Set up menu buttons in the stats panel
  */
 function setupMenuButtons() {
     // Settings button
     const settingsButton = document.getElementById('settings-btn');
     if (settingsButton) {
         settingsButton.addEventListener('click', showSettingsDialog);
     }
     
     // Reset game button
     const resetButton = document.getElementById('reset-game-btn');
     if (resetButton) {
         resetButton.addEventListener('click', showResetConfirmation);
     }
 }
 
 /**
  * Handle explore action
  */
 function handleExploreAction() {
     const player = gameState.player;
     
     // Check if player has enough energy
     if (player.energy < 5) {
         showNotification('Not enough energy to explore!', 'error');
         addToGameLog('You are too tired to explore. Rest to regain energy.');
         return;
     }
     
     // Spend energy
     player.modifyEnergy(-5);
     
     // Random exploration events
     const events = [
         { 
             message: 'You found some old coins in a fountain! +5 gold',
             effect: () => { player.modifyGold(5); }
         },
         { 
             message: 'You encountered a friendly merchant who shared city gossip.',
             effect: () => { /* No effect */ }
         },
         { 
             message: 'You discovered a hidden alleyway leading to a mysterious shop.',
             effect: () => { /* Future content hook */ }
         },
         { 
             message: 'You helped a city guard catch a pickpocket and earned their gratitude. +10 XP',
             effect: () => { 
                 const leveledUp = player.addExperience(10);
                 if (leveledUp) {
                     addToGameLog('You gained a level! Your abilities have improved.');
                     showNotification('Level Up!', 'success');
                 }
             }
         },
         { 
             message: 'You found a torn page from an ancient book with cryptic writings. +5 XP',
             effect: () => { player.addExperience(5); }
         }
     ];
     
     // Select random event
     const randomEvent = events[Math.floor(Math.random() * events.length)];
     
     // Apply event effect
     randomEvent.effect();
     
     // Show notification and add to log
     addToGameLog(randomEvent.message);
     showNotification('Exploration complete!', 'info');
     
     // Save game state
     gameState.saveGame();
     
     // Update UI
     updateResourcesPanel();
     updateStatsPanel();
 }
 
 /**
  * Handle rest action
  */
 function handleRestAction() {
     const player = gameState.player;
     
     // Check if energy is already full
     if (player.energy >= player.maxEnergy) {
         showNotification('You are already fully rested!', 'info');
         return;
     }
     
     // Restore energy
     player.modifyEnergy(20);
     
     // Show notification and add to log
     addToGameLog('You rested and recovered some energy. (+20 Energy)');
     showNotification('You feel refreshed!', 'success');
     
     // Save game state
     gameState.saveGame();
     
     // Update UI
     updateResourcesPanel();
 }
 
 /**
  * Handle trade action
  */
 function handleTradeAction() {
     // This is a placeholder for future implementation
     showNotification('The market is coming soon!', 'info');
     addToGameLog('You visit the market, but most shops are still being set up.');
 }
 
 /**
  * Show settings dialog
  */
 function showSettingsDialog() {
     // This is a placeholder for future implementation
     showNotification('Settings coming soon!', 'info');
 }
 
 /**
  * Show reset confirmation dialog
  */
 function showResetConfirmation() {
     // Create confirmation dialog
     const dialog = document.createElement('div');
     dialog.className = 'confirmation-dialog';
     
     dialog.innerHTML = `
         <div class="confirmation-content">
             <h3>Reset Game</h3>
             <p>Are you sure you want to reset your game? This will delete all progress and cannot be undone.</p>
             <div class="confirmation-actions">
                 <button class="confirm-btn">Yes, Reset Game</button>
                 <button class="cancel-btn">Cancel</button>
             </div>
         </div>
     `;
     
     // Add to DOM
     document.body.appendChild(dialog);
     
     // Show dialog with animation
     setTimeout(() => {
         dialog.classList.add('active');
     }, 10);
     
     // Setup action buttons
     const confirmButton = dialog.querySelector('.confirm-btn');
     const cancelButton = dialog.querySelector('.cancel-btn');
     
     confirmButton.addEventListener('click', function() {
         // Close dialog first
         dialog.classList.remove('active');
         
         // Then reset game after animation completes
         setTimeout(() => {
             resetGame();
             dialog.remove();
         }, 300);
     });
     
     cancelButton.addEventListener('click', function() {
         // Just close the dialog
         dialog.classList.remove('active');
         
         setTimeout(() => {
             dialog.remove();
         }, 300);
     });
 }
 
 /**
  * Reset the game
  */
 function resetGame() {
     // Clear game state
     gameState.resetGame();
     
     // Reload the page to restart completely fresh
     window.location.reload();
 }
 
 /**
  * Add a message to the game log
  * @param {string} message - Message to add to the log
  */
 function addToGameLog(message) {
     const logContent = document.getElementById('log-content');
     
     // Create new log entry
     const logEntry = document.createElement('p');
     logEntry.textContent = message;
     
     // Add timestamp if needed
     // const timestamp = new Date().toLocaleTimeString();
     // logEntry.textContent = `[${timestamp}] ${message}`;
     
     // Add to the log
     logContent.insertBefore(logEntry, logContent.firstChild);
     
     // Trim log if it gets too long (optional)
     const maxLogEntries = 50;
     while (logContent.children.length > maxLogEntries) {
         logContent.removeChild(logContent.lastChild);
     }
 }
 
 export { 
     initGameInterface, 
     updateResourcesPanel, 
     updateStatsPanel, 
     addToGameLog,
     resetGame
 };