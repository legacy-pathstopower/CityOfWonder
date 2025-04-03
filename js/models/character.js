/**
 * Character Model
 * Basic character creation functionality
 */

class Character {
    /**
     * Create a new character
     * @param {string} name - Character name
     * @param {string} characterClass - Character class ("Urchin" or "Waif")
     */
    constructor(name, characterClass) {
        // Basic character info
        this.name = name;
        this.class = characterClass;
        
        // Base stats - identical for both classes to start
        this.stats = {
            strength: 5,
            dexterity: 5,
            intelligence: 5,
            endurance: 5,
            vitality: 5,
            wisdom: 5
        };

        // Additional character properties
        this.level = 1;
        this.experience = 0;
        this.experienceToNextLevel = 100;
        this.health = this.stats.vitality * 2; // Base health is twice the vitality
        this.maxHealth = this.stats.vitality * 2; // Base health is twice the vitality
        this.stamina = this.stats.endurance * 2; // Base stamina is twice the endurance
        this.maxStamina = this.stats.endurance * 2; // Base stamina is twice the endurance
        this.gold = 0;
        this.maxGold = 10; // Starting gold
    }

    /**
     * Level up the character
     */
    levelUp() {
        this.level++;
        this.experience -= this.experienceToNextLevel;
        this.experienceToNextLevel = Math.floor(this.experienceToNextLevel * 1.5);
        
        // Increase base stats
        for (const stat in this.stats) {
            this.stats[stat] += 1;
        }
        
        // Increase health and stamina
        this.maxHealth = this.stats.vitality * 2;
        this.health = this.maxHealth;
        this.maxStamina = this.stats.endurance * 2;
        this.stamina = this.maxStamina;
        
        return {
            level: this.level,
            stats: this.stats
        };
    }

    /**
     * Add experience to the character
     * @param {number} amount - Amount of experience to add
     * @returns {boolean} - Whether the character leveled up
     */
    addExperience(amount) {
        this.experience += amount;
        
        // Check for level up
        if (this.experience >= this.experienceToNextLevel) {
            this.levelUp();
            return true;
        }
        
        return false;
    }

    /**
     * Modify character's health
     * @param {number} amount - Amount to change health by (positive to heal, negative for damage)
     */
    modifyHealth(amount) {
        this.health = Math.max(0, Math.min(this.maxHealth, this.health + amount));
        return this.health;
    }

    /**
     * Modify character's stamina
     * @param {number} amount - Amount to change stamina by
     */
    modifyStamina(amount) {
        this.stamina = Math.max(0, Math.min(this.maxStamina, this.stamina + amount));
        return this.stamina;
    }

    /**
     * Add or remove gold
     * @param {number} amount - Amount of gold to add (negative to remove)
     */
    modifyGold(amount) {
        this.gold = Math.max(0, this.gold + amount);
        if (this.gold > this.maxGold) {
            this.gold = this.maxGold; // Cap gold at maxGold
        }

        return this.gold;
    }

    /**
     * Increase max gold
     * @param {number} amount - Amount to increase max gold by
     */
    increaseMaxGold(amount) {
        this.maxGold += amount;
        return this.maxGold;
    }
}

// Export the Character class
export default Character;