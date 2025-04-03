/**
 * Simplified HTML Loader Module
 * All content is now directly in the index.html
 */

/**
 * A safe implementation that resolves immediately without attempting to modify DOM
 * @returns {Promise<void>}
 */
async function loadPartials() {
    // This function now does nothing, as we've moved all content to index.html
    console.log('HTML content is now directly in index.html - no partials to load');
    return Promise.resolve();
}

export { loadPartials };