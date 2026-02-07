const fs = require('fs');
const path = require('path');

/**
 * Registry for discovering and managing site extractors
 */
class SiteRegistry {
  constructor(sitesDir) {
    this.sitesDir = sitesDir || path.join(__dirname, '..', 'sites');
    this.sites = new Map();
  }

  /**
   * Discover all sites by scanning sites directory for config.json files
   * @returns {Map} Map of site name to config object
   */
  discover() {
    this.sites.clear();

    if (!fs.existsSync(this.sitesDir)) {
      console.warn(`Sites directory not found: ${this.sitesDir}`);
      return this.sites;
    }

    const entries = fs.readdirSync(this.sitesDir, { withFileTypes: true });

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;

      const siteName = entry.name;
      const configPath = path.join(this.sitesDir, siteName, 'config.json');

      if (fs.existsSync(configPath)) {
        try {
          const configContent = fs.readFileSync(configPath, 'utf-8');
          const config = JSON.parse(configContent);
          
          // Add site directory path to config
          config._sitePath = path.join(this.sitesDir, siteName);
          
          this.sites.set(siteName, config);
          console.log(`[REGISTRY] Discovered site: ${siteName}`);
        } catch (error) {
          console.error(`[REGISTRY] Error loading config for ${siteName}:`, error.message);
        }
      }
    }

    console.log(`[REGISTRY] Total sites discovered: ${this.sites.size}`);
    return this.sites;
  }

  /**
   * Get a specific site configuration
   * @param {string} siteName - Name of the site
   * @returns {Object|null} Site configuration or null if not found
   */
  getSite(siteName) {
    if (this.sites.size === 0) {
      this.discover();
    }
    return this.sites.get(siteName) || null;
  }

  /**
   * List all available site names
   * @returns {string[]} Array of site names
   */
  listSites() {
    if (this.sites.size === 0) {
      this.discover();
    }
    return Array.from(this.sites.keys());
  }

  /**
   * Validate if a site exists
   * @param {string} siteName - Name of the site
   * @returns {boolean} True if site exists
   */
  hasSite(siteName) {
    if (this.sites.size === 0) {
      this.discover();
    }
    return this.sites.has(siteName);
  }
}

module.exports = SiteRegistry;
