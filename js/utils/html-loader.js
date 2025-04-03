/**
 * Simplified HTML Loader Module
 * We're removing the partial loading system since it's causing issues
 * and all content is now directly in the index.html
 */

/**
 * Mock function to maintain compatibility with existing code
 * @returns {Promise<void>}
 */
async function loadPartials() {
    // This function now does nothing, as we've moved all content to index.html
    console.log('HTML content is now directly in index.html - no partials to load');
    return Promise.resolve();
}

export { loadPartials };