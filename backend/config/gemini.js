const { GoogleGenAI } = require('@google/genai');

/**
 * Initialize the Google Gemini AI client instance.
 * Gracefully handles missing API keys to prevent application crashes during startup.
 */
let geminiClient = null;

try {
    const apiKey = process.env.GEMINI_API_KEY;

    // Implement a strict check for the required environment variable
    if (!apiKey) {
        console.error('[AI Config Error] Gemini API Key is missing!');
    } else {
        // Instantiate the GoogleGenAI client using the validated API key
        geminiClient = new GoogleGenAI({ apiKey });
    }
} catch (error) {
    // Catch any unexpected errors during initialization
    console.error('[AI Config Error] Failed to initialize Gemini client:', error.message);
}

// Export the initialized client instance so it can be reused across backend controllers
module.exports = geminiClient;
