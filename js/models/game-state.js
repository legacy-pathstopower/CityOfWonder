/**
 * Game State Module
 * Manages the overall game state and persistent data
 */

class GameState {
    constructor() {
        this.player = null;
        this.gameTime = 0;
        this.locations = {};
        this.quests = [];
        this.inventory = [];
        this.gameSettings = {
            soundEnabled: true,
            animationsEnabled: true
        };
    }

    /**
     * Initialize the game state
     */
    init() {
        // Try to load saved game if it exists
        this.loadGame();
    }

    /**
     * Save the current game state
     */
    saveGame() {
        try {
            const gameData = {
                player: this.player,
                gameTime: this.gameTime,
                locations: this.locations,
                quests: this.quests,
                inventory: this.inventory,
                gameSettings: this.gameSettings,
                lastSaved: new Date().toISOString()
            };
            
            localStorage.setItem('cityOfWondersSave', JSON.stringify(gameData));
            return true;
        } catch (error) {
            console.error('Error saving game:', error);
            return false;
        }
    }

    /**
     * Load a saved game if available
     */
    loadGame() {
        try {
            const savedGame = localStorage.getItem('cityOfWondersSave');
            
            if (savedGame) {
                const gameData = JSON.parse(savedGame);
                
                // Restore game state from saved data
                this.player = gameData.player;
                this.gameTime = gameData.gameTime;
                this.locations = gameData.locations;
                this.quests = gameData.quests;
                this.inventory = gameData.inventory;
                this.gameSettings = gameData.gameSettings;
                
                return true;
            }
            
            return false;
        } catch (error) {
            console.error('Error loading game:', error);
            return false;
        }
    }

    /**
     * Reset the game state
     */
    resetGame() {
        this.player = null;
        this.gameTime = 0;
        this.locations = {};
        this.quests = [];
        this.inventory = [];
        
        // Remove saved game
        localStorage.removeItem('cityOfWondersSave');
    }

    /**
     * Update game settings
     * @param {Object} settings - New settings values
     */
    updateSettings(settings) {
        this.gameSettings = {...this.gameSettings, ...settings};
        this.saveGame();
    }
}

// Create and export a singleton instance
const gameState = new GameState();
export default gameState;