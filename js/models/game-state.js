/**
 * Game State Module
 * Manages the overall game state and persistent data
 */

// Import Character class directly for proper serialization/deserialization
import Character from './character.js';

class GameState {
    constructor() {
        this.player = null;
        this.gameTime = {
            day: 1,
            hour: 8, // Start at 8am
            minute: 0,
            totalMinutes: 0 // Total minutes elapsed since game start
        };
        this.locations = {};
        this.quests = [];
        this.inventory = [];
        this.gameSettings = {
            soundEnabled: true,
            animationsEnabled: true,
            autosaveEnabled: true
        };
        this.events = []; // Store game events/history
        this.lastSaved = null;
        this._gameTimeInterval = null;
    }

    /**
     * Initialize the game state
     */
    init() {
        // Try to load saved game if it exists
        const loaded = this.loadGame();
        
        // If a game was loaded, start game time
        if (loaded && this.player) {
            this.startGameTime();
        }
        
        return loaded;
    }

    /**
     * Start the game time progression
     */
    startGameTime() {
        // Clear any existing interval
        if (this._gameTimeInterval) {
            clearInterval(this._gameTimeInterval);
        }

        // Validate game time before starting
        if (!this.gameTime || typeof this.gameTime.day !== 'number') {
            this.gameTime = {
                day: 1,
                hour: 8,
                minute: 0,
                totalMinutes: 0
            };
        }
        
        // Set up interval to advance game time (1 game minute every 3 seconds)
        this._gameTimeInterval = setInterval(() => {
            this.advanceTime(1);
            
            // Auto-save every hour of game time
            if (this.gameTime.minute === 0 && this.gameSettings.autosaveEnabled) {
                this.saveGame();
            }
            
            // Dispatch a custom event that other components can listen for
            const event = new CustomEvent('gameTimeUpdate', { 
                detail: { ...this.gameTime }
            });
            document.dispatchEvent(event);
            
        }, 3000); // 3 seconds = 1 game minute
    }
    
    /**
     * Stop the game time progression
     */
    stopGameTime() {
        if (this._gameTimeInterval) {
            clearInterval(this._gameTimeInterval);
            this._gameTimeInterval = null;
        }
    }

    /**
     * Advance the game time by a specified number of minutes
     * @param {number} minutes - Number of minutes to advance
     */
    advanceTime(minutes) {
        // Update total minutes
        this.gameTime.totalMinutes += minutes;
        
        // Update time components
        this.gameTime.minute += minutes;
        
        // Roll over minutes to hours
        while (this.gameTime.minute >= 60) {
            this.gameTime.minute -= 60;
            this.gameTime.hour += 1;
            
            // Trigger hourly events
            this._triggerHourlyEvents();
        }
        
        // Roll over hours to days
        while (this.gameTime.hour >= 24) {
            this.gameTime.hour -= 24;
            this.gameTime.day += 1;
            
            // Trigger daily events
            this._triggerDailyEvents();
        }
    }
    
    /**
     * Trigger events that happen every hour
     * @private
     */
    _triggerHourlyEvents() {
        // Player energy regeneration (small amount each hour)
        if (this.player) {
            // Regenerate 1 energy point per hour
            this.player.modifyEnergy(1);
        }
        
        // NPC schedules and other hourly events can be added here
    }
    
    /**
     * Trigger events that happen every day
     * @private
     */
    _triggerDailyEvents() {
        // Reset player energy each morning
        if (this.player && this.gameTime.hour === 6) {
            this.player.energy = this.player.maxEnergy;
        }
        
        // City events, quest updates, and other daily events can be added here
    }

    /**
     * Format the current game time as a readable string
     * @returns {string} Formatted time string
     */
    getFormattedTime() {
        const hour = this.gameTime.hour % 12 || 12; // Convert to 12-hour format
        const amPm = this.gameTime.hour < 12 ? 'AM' : 'PM';
        const minute = String(this.gameTime.minute).padStart(2, '0');
        return `Day ${this.gameTime.day}, ${hour}:${minute} ${amPm}`;
    }

    /**
     * Save the game state to localStorage
     */
    saveGame() {
        try {
            // Create a clean save object without methods or circular references
            const saveData = {
                player: this.player ? {
                    name: this.player.name,
                    class: this.player.class,
                    stats: { ...this.player.stats },
                    level: this.player.level,
                    experience: this.player.experience,
                    experienceToNextLevel: this.player.experienceToNextLevel,
                    health: this.player.health,
                    maxHealth: this.player.maxHealth,
                    energy: this.player.energy,
                    maxEnergy: this.player.maxEnergy,
                    gold: this.player.gold
                } : null,
                gameTime: { ...this.gameTime },
                locations: { ...this.locations },
                quests: [...this.quests],
                inventory: [...this.inventory],
                gameSettings: { ...this.gameSettings },
                // Only store the last 50 events to save space
                events: this.events.slice(-50),
                savedAt: new Date().toISOString()
            };
            
            localStorage.setItem('cityOfWondersSave', JSON.stringify(saveData));
            this.lastSaved = new Date();
            
            console.log('Game saved successfully at ' + this.lastSaved.toLocaleTimeString());
            return true;
        } catch (error) {
            console.error('Failed to save game:', error);
            return false;
        }
    }

    /**
     * Load the game state from localStorage
     * @returns {boolean} Whether the game was loaded successfully
     */
    loadGame() {
        try {
            const saveData = localStorage.getItem('cityOfWondersSave');
            
            if (!saveData) {
                console.log('No saved game found');
                return false;
            }
            
            const parsedData = JSON.parse(saveData);
            
            // Restore game state from saved data
            if (parsedData.player) {
                // Create a new Character instance with the saved properties
                this.player = new Character(
                    parsedData.player.name, 
                    parsedData.player.class
                );
                
                // Copy all the saved properties to the new player object
                this.player.stats = parsedData.player.stats || this.player.stats;
                this.player.level = parsedData.player.level || 1;
                this.player.experience = parsedData.player.experience || 0;
                this.player.experienceToNextLevel = parsedData.player.experienceToNextLevel || 100;
                this.player.health = parsedData.player.health || 100;
                this.player.maxHealth = parsedData.player.maxHealth || 100;
                this.player.energy = parsedData.player.energy || 50;
                this.player.maxEnergy = parsedData.player.maxEnergy || 50;
                this.player.gold = parsedData.player.gold || 0;
            }
            
            // Restore other game state properties
            this.gameTime = parsedData.gameTime || {
                day: 1,
                hour: 8,
                minute: 0,
                totalMinutes: 0
            };
            
            this.locations = parsedData.locations || {};
            this.quests = parsedData.quests || [];
            this.inventory = parsedData.inventory || [];
            this.gameSettings = parsedData.gameSettings || {
                soundEnabled: true,
                animationsEnabled: true,
                autosaveEnabled: true
            };
            this.events = parsedData.events || [];
            
            console.log('Game loaded successfully from ' + new Date(parsedData.savedAt).toLocaleString());
            return true;
        } catch (error) {
            console.error('Failed to load game:', error);
            return false;
        }
    }

    /**
     * Reset the game state
     */
    resetGame() {
        try {
            localStorage.removeItem('cityOfWondersSave');
            
            // Reset all state
            this.player = null;
            this.gameTime = {
                day: 1,
                hour: 8,
                minute: 0,
                totalMinutes: 0
            };
            this.locations = {};
            this.quests = [];
            this.inventory = [];
            this.gameSettings = {
                soundEnabled: true,
                animationsEnabled: true,
                autosaveEnabled: true
            };
            this.events = [];
            this.lastSaved = null;
            
            // Stop game time
            this.stopGameTime();
            
            console.log('Game reset successfully');
            return true;
        } catch (error) {
            console.error('Failed to reset game:', error);
            return false;
        }
    }

    /**
     * Add a new event to the event log
     * @param {Object} event - Event data
     */
    addEvent(event) {
        this.events.push({
            ...event,
            timestamp: {
                real: new Date().toISOString(),
                game: { ...this.gameTime }
            }
        });
        
        // Limit events array length to prevent memory issues
        if (this.events.length > 100) {
            this.events = this.events.slice(-100);
        }
    }
}

// Create and export a singleton instance
const gameState = new GameState();
export default gameState;