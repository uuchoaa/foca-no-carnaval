/**
 * Snapshot manager for capturing, sanitizing, and saving HTML snapshots
 */

const fs = require('fs');
const path = require('path');
const { cleanHTMLDocument } = require('./sanitizer');
const { countHTMLTokens, formatTokenSummary } = require('./token-counter');

/**
 * Create a snapshot of HTML content
 * @param {string} htmlContent - Raw HTML content
 * @param {string} sitePath - Path to the site directory
 * @param {Object} config - Site configuration
 * @returns {Object} Snapshot metadata
 */
async function createSnapshot(htmlContent, sitePath, config) {
  console.log('[SNAPSHOT] Creating snapshot...');
  
  // Get sanitization options from config
  const sanitizeOptions = config.snapshot?.sanitize || {
    removeScripts: true,
    removeStyles: true,
    removeComments: true,
    removeSVG: true,
    removeIframes: true
  };
  
  // Sanitize HTML
  console.log('[SNAPSHOT] Sanitizing HTML...');
  const cleanedHTML = cleanHTMLDocument(htmlContent, sanitizeOptions);
  
  // Count tokens
  console.log('[SNAPSHOT] Counting tokens...');
  const tokenInfo = countHTMLTokens(cleanedHTML, { includeMarkup: true });
  console.log(`[SNAPSHOT] ${formatTokenSummary(tokenInfo)}`);
  
  // Save to content.html
  const contentPath = path.join(sitePath, 'content.html');
  console.log(`[SNAPSHOT] Saving to ${contentPath}...`);
  fs.writeFileSync(contentPath, cleanedHTML, 'utf-8');
  
  // Update config.json with metadata
  const metadata = {
    tokens: tokenInfo.tokens,
    characters: tokenInfo.characters,
    snapshotDate: new Date().toISOString(),
    estimatedCost: tokenInfo.estimatedCost
  };
  
  const configPath = path.join(sitePath, 'config.json');
  const updatedConfig = {
    ...config,
    metadata
  };
  
  // Remove the _sitePath property before saving (it's internal)
  delete updatedConfig._sitePath;
  
  fs.writeFileSync(configPath, JSON.stringify(updatedConfig, null, 2), 'utf-8');
  console.log('[SNAPSHOT] Config updated with metadata');
  
  return {
    contentPath,
    metadata,
    success: true
  };
}

/**
 * Load a snapshot from disk
 * @param {string} sitePath - Path to the site directory
 * @returns {string|null} HTML content or null if not found
 */
function loadSnapshot(sitePath) {
  const contentPath = path.join(sitePath, 'content.html');
  
  if (!fs.existsSync(contentPath)) {
    return null;
  }
  
  return fs.readFileSync(contentPath, 'utf-8');
}

/**
 * Check if a snapshot exists
 * @param {string} sitePath - Path to the site directory
 * @returns {boolean} True if snapshot exists
 */
function hasSnapshot(sitePath) {
  const contentPath = path.join(sitePath, 'content.html');
  return fs.existsSync(contentPath);
}

/**
 * Get snapshot metadata from config
 * @param {string} sitePath - Path to the site directory
 * @returns {Object|null} Metadata object or null
 */
function getSnapshotMetadata(sitePath) {
  const configPath = path.join(sitePath, 'config.json');
  
  if (!fs.existsSync(configPath)) {
    return null;
  }
  
  try {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    return config.metadata || null;
  } catch (error) {
    console.error('[SNAPSHOT] Error reading metadata:', error.message);
    return null;
  }
}

module.exports = {
  createSnapshot,
  loadSnapshot,
  hasSnapshot,
  getSnapshotMetadata
};
