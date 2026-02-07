/**
 * Browser Pool for parallel page processing
 * Singleton pattern with lazy loading
 */

const { BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

class BrowserPool {
  static instance = null;
  
  static getInstance() {
    if (!BrowserPool.instance) {
      BrowserPool.instance = new BrowserPool();
    }
    return BrowserPool.instance;
  }
  
  constructor() {
    if (BrowserPool.instance) {
      throw new Error('BrowserPool is a singleton. Use BrowserPool.getInstance()');
    }
    
    this.windows = [];
    this.available = [];
    this.busy = [];
    this.queue = [];
    this.headless = false;
    this.helpersInjected = new WeakSet();
  }
  
  /**
   * Ensure pool has the specified size
   * Lazy creates windows as needed
   * @param {number} size - Pool size
   * @param {boolean} headless - Run in headless mode
   * @returns {Promise<BrowserPool>} This pool instance
   */
  async ensureSize(size, headless = false) {
    this.headless = headless;
    const needed = size - this.windows.length;
    
    if (needed > 0) {
      console.log(`[POOL] Creating ${needed} new windows (total pool size: ${size})`);
      
      for (let i = 0; i < needed; i++) {
        const window = await this.createWindow(i);
        this.windows.push(window);
        this.available.push(window);
      }
    } else if (needed < 0) {
      // If we need fewer windows, close excess ones
      const excess = Math.abs(needed);
      console.log(`[POOL] Closing ${excess} excess windows`);
      
      for (let i = 0; i < excess; i++) {
        if (this.available.length > 0) {
          const window = this.available.pop();
          const idx = this.windows.indexOf(window);
          this.windows.splice(idx, 1);
          window.destroy();
        }
      }
    }
    
    return this;
  }
  
  /**
   * Create a new browser window
   * @param {number} index - Window index for positioning
   * @returns {Promise<BrowserWindow>} Created window
   */
  async createWindow(index) {
    const window = new BrowserWindow({
      width: 1200,
      height: 800,
      x: 100 + (index * 50),  // Offset windows if visible
      y: 100 + (index * 50),
      show: !this.headless,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        enableRemoteModule: false,
        preload: path.join(__dirname, '..', 'preload.js')
      }
    });
    
    // Load a blank page initially
    await window.loadURL('about:blank');
    
    return window;
  }
  
  /**
   * Execute a function with an available window
   * @param {string} url - URL to load
   * @param {Function} fn - Async function to execute with window
   * @returns {Promise<any>} Result from function
   */
  async execute(url, fn) {
    const window = await this.acquire();
    
    try {
      await window.loadURL(url);
      
      // Wait for page to load
      await window.webContents.executeJavaScript('document.readyState');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const result = await fn(window);
      return result;
    } catch (error) {
      console.error(`[POOL] Error executing on ${url}:`, error.message);
      throw error;
    } finally {
      this.release(window);
    }
  }
  
  /**
   * Acquire a window from the pool
   * @returns {Promise<BrowserWindow>} Available window
   */
  async acquire() {
    if (this.available.length > 0) {
      const window = this.available.pop();
      this.busy.push(window);
      return window;
    }
    
    // Wait for a window to become available
    return new Promise(resolve => {
      this.queue.push(resolve);
    });
  }
  
  /**
   * Release a window back to the pool
   * @param {BrowserWindow} window - Window to release
   */
  release(window) {
    const idx = this.busy.indexOf(window);
    if (idx !== -1) {
      this.busy.splice(idx, 1);
    }
    
    // If there's a queued request, fulfill it
    if (this.queue.length > 0) {
      const resolve = this.queue.shift();
      this.busy.push(window);
      resolve(window);
    } else {
      this.available.push(window);
    }
  }
  
  /**
   * Get pool statistics
   * @returns {Object} Pool stats
   */
  getStats() {
    return {
      total: this.windows.length,
      available: this.available.length,
      busy: this.busy.length,
      queued: this.queue.length
    };
  }
  
  /**
   * Destroy all windows in the pool
   */
  async destroy() {
    console.log('[POOL] Destroying pool...');
    
    [...this.available, ...this.busy].forEach(window => {
      if (window && !window.isDestroyed()) {
        window.destroy();
      }
    });
    
    this.windows = [];
    this.available = [];
    this.busy = [];
    this.queue = [];
    this.helpersInjected = new WeakSet();
    
    BrowserPool.instance = null;
  }
}

module.exports = BrowserPool;
