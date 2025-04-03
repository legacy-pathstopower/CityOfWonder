/**
 * HTML Loader Module
 * Handles loading partial HTML files into the main document
 */

/**
 * Load partial HTML files into placeholders
 * @returns {Promise<void>}
 */
async function loadPartials() {
    // Define the partials and their target elements
    const partials = [
        { url: './partials/header.html', target: '#include-header' },
        { url: './partials/footer.html', target: '#include-footer' },
        { url: './partials/game-screen.html', target: '#include-game-screen' }
    ];

    // Fetch and insert each partial
    const loadPromises = partials.map(async (partial) => {
        try {
            const response = await fetch(partial.url);
            if (!response.ok) {
                throw new Error(`Failed to load ${partial.url}`);
            }
            const html = await response.text();
            document.querySelector(partial.target).innerHTML = html;
        } catch (error) {
            console.error(error);
        }
    });

    // Wait for all partials to load
    await Promise.all(loadPromises);
}

export { loadPartials };