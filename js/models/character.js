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
        this.health = 100;
        this.maxHealth = 100;
        this.energy = 50;
        this.maxEnergy = 50;
        this.gold = 0;
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
        
        // Increase health and energy
        this.maxHealth += 20;
        this.health = this.maxHealth;
        this.maxEnergy += 10;
        this.energy = this.maxEnergy;
        
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
     * Modify character's energy
     * @param {number} amount - Amount to change energy by
     */
    modifyEnergy(amount) {
        this.energy = Math.max(0, Math.min(this.maxEnergy, this.energy + amount));
        return this.energy;
    }

    /**
     * Add or remove gold
     * @param {number} amount - Amount of gold to add (negative to remove)
     */
    modifyGold(amount) {
        this.gold = Math.max(0, this.gold + amount);
        return this.gold;
    }
}

// Export the Character class
export default Character;