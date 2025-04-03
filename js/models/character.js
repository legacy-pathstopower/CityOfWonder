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
    }
}