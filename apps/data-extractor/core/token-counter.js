/**
 * Token counter for estimating LLM token usage of HTML content
 */

/**
 * Estimate the number of tokens in a text string
 * Uses a simple character-based estimation (1 token ≈ 4 characters for English text)
 * This is a rough approximation suitable for cost estimation
 * 
 * @param {string} text - The text to count tokens for
 * @returns {number} Estimated token count
 */
function estimateTokens(text) {
  if (!text || typeof text !== 'string') {
    return 0;
  }

  // Remove extra whitespace and normalize
  const normalized = text.replace(/\s+/g, ' ').trim();
  
  // Rough estimation: 1 token ≈ 4 characters
  // This is based on OpenAI's approximation for English text
  const charCount = normalized.length;
  const estimatedTokens = Math.ceil(charCount / 4);
  
  return estimatedTokens;
}

/**
 * Count tokens in HTML content
 * Optionally strip HTML tags to count only text content
 * 
 * @param {string} html - HTML content
 * @param {Object} options - Counting options
 * @param {boolean} options.includeMarkup - Include HTML tags in count (default: true)
 * @returns {Object} Token count information
 */
function countHTMLTokens(html, options = {}) {
  const { includeMarkup = true } = options;
  
  let textToCount = html;
  
  if (!includeMarkup) {
    // Strip HTML tags to count only text content
    textToCount = html.replace(/<[^>]*>/g, ' ');
  }
  
  const tokens = estimateTokens(textToCount);
  const chars = textToCount.length;
  
  return {
    tokens,
    characters: chars,
    includeMarkup,
    estimatedCost: {
      gpt4: (tokens / 1000) * 0.03, // $0.03 per 1K tokens (input)
      gpt35: (tokens / 1000) * 0.0015, // $0.0015 per 1K tokens (input)
      claude: (tokens / 1000) * 0.008 // $0.008 per 1K tokens (input)
    }
  };
}

/**
 * Get a formatted summary of token count
 * @param {Object} tokenInfo - Token count information from countHTMLTokens
 * @returns {string} Formatted summary
 */
function formatTokenSummary(tokenInfo) {
  return `Tokens: ${tokenInfo.tokens.toLocaleString()} | ` +
    `Chars: ${tokenInfo.characters.toLocaleString()} | ` +
    `Est. Cost: GPT-4 $${tokenInfo.estimatedCost.gpt4.toFixed(4)}, ` +
    `GPT-3.5 $${tokenInfo.estimatedCost.gpt35.toFixed(4)}, ` +
    `Claude $${tokenInfo.estimatedCost.claude.toFixed(4)}`;
}

module.exports = {
  estimateTokens,
  countHTMLTokens,
  formatTokenSummary
};
