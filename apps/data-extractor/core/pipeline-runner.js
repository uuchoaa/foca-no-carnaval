/**
 * Pipeline runner for executing extraction pipelines
 * Coordinates interactions, snapshots, writers, and readers via IPC
 */

const { ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');
const { createSnapshot } = require('./snapshot');
const BrowserPool = require('./browser-pool');

// Get headless flag from main.js
let headless = false;

/**
 * Set headless mode for the pipeline
 * @param {boolean} value - Headless flag
 */
function setHeadless(value) {
  headless = value;
}

/**
 * Run a pipeline for a given site
 * @param {BrowserWindow} window - Electron BrowserWindow instance
 * @param {Object} config - Site configuration with pipeline definition
 * @returns {Promise<Object>} Pipeline execution result
 */
async function runPipeline(window, config) {
  console.log(`[PIPELINE] Starting pipeline for ${config.name}`);
  console.log(`[PIPELINE] Steps: ${config.pipeline.length}`);
  
  const results = {
    site: config.name,
    steps: [],
    success: true,
    error: null
  };
  
  try {
    for (let i = 0; i < config.pipeline.length; i++) {
      const step = config.pipeline[i];
      console.log(`[PIPELINE] Running step ${i + 1}/${config.pipeline.length}: ${step.type}`);
      
      const stepResult = await executeStep(window, step, config);
      results.steps.push(stepResult);
      
      if (!stepResult.success) {
        results.success = false;
        results.error = `Step ${i + 1} (${step.type}) failed: ${stepResult.error}`;
        break;
      }
    }
    
    if (results.success) {
      console.log('[PIPELINE] Pipeline completed successfully');
    } else {
      console.error('[PIPELINE] Pipeline failed:', results.error);
    }
    
  } catch (error) {
    results.success = false;
    results.error = error.message;
    console.error('[PIPELINE] Pipeline error:', error);
  } finally {
    // Cleanup: destroy browser pool if it was used
    const pool = BrowserPool.getInstance();
    if (pool && pool.windows.length > 0) {
      console.log('[PIPELINE] Cleaning up browser pool...');
      await pool.destroy();
    }
  }
  
  return results;
}

/**
 * Execute a single pipeline step
 * @param {BrowserWindow} window - Electron BrowserWindow instance
 * @param {Object} step - Step configuration
 * @param {Object} config - Site configuration
 * @returns {Promise<Object>} Step execution result
 */
async function executeStep(window, step, config) {
  const stepResult = {
    type: step.type,
    success: false,
    error: null,
    data: null
  };
  
  try {
    switch (step.type) {
      case 'interaction':
        stepResult.data = await executeInteraction(window, step, config);
        stepResult.success = true;
        break;
        
      case 'snapshot':
        stepResult.data = await executeSnapshot(window, config);
        stepResult.success = true;
        break;
        
      case 'reader':
        stepResult.data = await executeReader(window, step, config);
        stepResult.success = true;
        break;
        
      case 'writer':
        stepResult.data = await executeWriter(window, step, config);
        stepResult.success = true;
        break;
        
      case 'parallel':
        stepResult.data = await executeParallel(window, step, config);
        stepResult.success = true;
        break;
        
      default:
        throw new Error(`Unknown step type: ${step.type}`);
    }
  } catch (error) {
    stepResult.success = false;
    stepResult.error = error.message;
  }
  
  return stepResult;
}

/**
 * Execute an interaction step
 * @param {BrowserWindow} window - Electron BrowserWindow instance
 * @param {Object} step - Step configuration
 * @param {Object} config - Site configuration
 * @returns {Promise<Object>} Interaction result
 */
async function executeInteraction(window, step, config) {
  console.log(`[PIPELINE] Executing interaction: ${step.module}`);
  
  // Load the interaction module
  const modulePath = path.join(config._sitePath, step.module);
  
  if (!fs.existsSync(modulePath)) {
    throw new Error(`Interaction module not found: ${modulePath}`);
  }
  
  const moduleCode = fs.readFileSync(modulePath, 'utf-8');
  
  // Send to renderer to execute
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('Interaction timeout (60s)'));
    }, 60000);
    
    // Set up one-time listener for completion
    ipcMain.once('pipeline:interaction-done', (event, result) => {
      clearTimeout(timeout);
      if (result.success) {
        resolve(result);
      } else {
        reject(new Error(result.error || 'Interaction failed'));
      }
    });
    
    // Send interaction code to renderer
    window.webContents.send('pipeline:run-interaction', {
      code: moduleCode,
      stepConfig: step
    });
  });
}

/**
 * Execute a snapshot step
 * @param {BrowserWindow} window - Electron BrowserWindow instance
 * @param {Object} config - Site configuration
 * @returns {Promise<Object>} Snapshot result
 */
async function executeSnapshot(window, config) {
  console.log('[PIPELINE] Executing snapshot');
  
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('Snapshot timeout (30s)'));
    }, 30000);
    
    // Set up one-time listener for HTML
    ipcMain.once('pipeline:snapshot-data', async (event, htmlContent) => {
      clearTimeout(timeout);
      
      try {
        const result = await createSnapshot(htmlContent, config._sitePath, config);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
    
    // Request snapshot from renderer
    window.webContents.send('pipeline:capture-snapshot');
  });
}

/**
 * Execute a reader step
 * @param {BrowserWindow} window - Electron BrowserWindow instance
 * @param {Object} step - Step configuration
 * @param {Object} config - Site configuration
 * @returns {Promise<Object>} Reader result
 */
async function executeReader(window, step, config) {
  console.log(`[PIPELINE] Executing reader: ${step.module}`);
  
  // Load the reader module
  const modulePath = path.join(config._sitePath, step.module);
  
  if (!fs.existsSync(modulePath)) {
    throw new Error(`Reader module not found: ${modulePath}`);
  }
  
  const moduleCode = fs.readFileSync(modulePath, 'utf-8');
  
  // Send to renderer to execute
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('Reader timeout (30s)'));
    }, 30000);
    
    // Set up one-time listener for data
    ipcMain.once('pipeline:reader-data', (event, result) => {
      clearTimeout(timeout);
      
      if (result.success) {
        // Save output to JSON file
        const outputPath = path.join(config._sitePath, 'output.json');
        fs.writeFileSync(outputPath, JSON.stringify(result.data, null, 2), 'utf-8');
        
        // Log summary
        const eventCount = result.data?.events?.length || 0;
        console.log(`[PIPELINE] Reader extracted ${eventCount} events`);
        console.log(`[PIPELINE] Reader output saved to ${outputPath}`);
        
        resolve({
          ...result,
          outputPath
        });
      } else {
        reject(new Error(result.error || 'Reader failed'));
      }
    });
    
    // Send reader code to renderer
    window.webContents.send('pipeline:run-reader', {
      code: moduleCode,
      stepConfig: step
    });
  });
}

/**
 * Execute a writer step
 * @param {BrowserWindow} window - Electron BrowserWindow instance
 * @param {Object} step - Step configuration
 * @param {Object} config - Site configuration
 * @returns {Promise<Object>} Writer result
 */
async function executeWriter(window, step, config) {
  console.log(`[PIPELINE] Executing writer: ${step.module}`);
  
  // Load the writer module
  const modulePath = path.join(config._sitePath, step.module);
  
  if (!fs.existsSync(modulePath)) {
    throw new Error(`Writer module not found: ${modulePath}`);
  }
  
  const moduleCode = fs.readFileSync(modulePath, 'utf-8');
  
  // Send to renderer to execute
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('Writer timeout (30s)'));
    }, 30000);
    
    // Set up one-time listener for completion
    ipcMain.once('pipeline:writer-done', (event, result) => {
      clearTimeout(timeout);
      
      if (result.success) {
        resolve(result);
      } else {
        reject(new Error(result.error || 'Writer failed'));
      }
    });
    
    // Send writer code to renderer
    window.webContents.send('pipeline:run-writer', {
      code: moduleCode,
      stepConfig: step
    });
  });
}

/**
 * Execute a parallel reader step
 * Loads items from a JSON file and processes them in parallel
 * @param {BrowserWindow} mainWindow - Main window (not used for parallel)
 * @param {Object} step - Step configuration with concurrency, input, itemsPath, urlField
 * @param {Object} config - Site configuration
 * @returns {Promise<Object>} Parallel execution result
 */
async function executeParallel(mainWindow, step, config) {
  console.log(`[PIPELINE] Executing parallel reader: ${step.module}`);
  console.log(`[PIPELINE] Concurrency: ${step.concurrency || 5}`);
  
  // 1. Load input file
  const inputFile = step.input || 'output.json';
  const inputPath = path.join(config._sitePath, inputFile);
  
  if (!fs.existsSync(inputPath)) {
    throw new Error(`Input file not found: ${inputPath}`);
  }
  
  const inputData = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));
  const itemsPath = step.itemsPath || 'events';
  const items = inputData[itemsPath];
  
  if (!items || !Array.isArray(items)) {
    throw new Error(`Items not found at path: ${itemsPath}`);
  }
  
  console.log(`[PIPELINE] Processing ${items.length} items from ${inputFile}`);
  
  // 2. Load reader module
  const modulePath = path.join(config._sitePath, step.module);
  if (!fs.existsSync(modulePath)) {
    throw new Error(`Reader module not found: ${modulePath}`);
  }
  
  const moduleCode = fs.readFileSync(modulePath, 'utf-8');
  
  // 3. Initialize browser pool
  const concurrency = step.concurrency || 5;
  const pool = BrowserPool.getInstance();
  await pool.ensureSize(concurrency, headless);
  
  console.log(`[PIPELINE] Browser pool ready with ${concurrency} windows`);
  
  // 4. Process items in parallel
  const results = [];
  let processed = 0;
  const urlField = step.urlField || 'url';
  
  await Promise.all(items.map(async (item, index) => {
    try {
      const url = item[urlField];
      if (!url) {
        console.warn(`[PIPELINE] Item ${index} has no URL field: ${urlField}`);
        return;
      }
      
      const result = await pool.execute(url, async (window) => {
        // Execute reader in this window
        const details = await executeReaderInPoolWindow(window, moduleCode, item);
        
        processed++;
        if (processed % 10 === 0 || processed === items.length) {
          const stats = pool.getStats();
          console.log(`[PIPELINE] Progress: ${processed}/${items.length} (available: ${stats.available}, busy: ${stats.busy}, queued: ${stats.queued})`);
        }
        
        return { ...item, details };
      });
      
      results.push(result);
    } catch (error) {
      console.error(`[PIPELINE] Error processing item ${index}:`, error.message);
      // Continue with other items even if one fails
      results.push({ ...item, details: null, error: error.message });
    }
  }));
  
  // 5. Save results
  const outputFile = step.output || 'output-with-details.json';
  const outputPath = path.join(config._sitePath, outputFile);
  fs.writeFileSync(outputPath, JSON.stringify({ [itemsPath]: results }, null, 2), 'utf-8');
  
  console.log(`[PIPELINE] Parallel reader complete: ${results.length} items processed`);
  console.log(`[PIPELINE] Output saved to ${outputPath}`);
  
  return {
    itemsProcessed: results.length,
    outputPath
  };
}

/**
 * Execute reader in a pool window
 * @param {BrowserWindow} window - Pool window
 * @param {string} moduleCode - Reader module code
 * @param {Object} itemData - Item data to pass to reader
 * @returns {Promise<Object>} Reader result
 */
async function executeReaderInPoolWindow(window, moduleCode, itemData) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('Reader timeout (30s)'));
    }, 30000);
    
    // Create unique channel for this execution
    const channelId = `parallel-reader-${Date.now()}-${Math.random()}`;
    
    // Set up one-time listener for data
    ipcMain.once(channelId, (event, result) => {
      clearTimeout(timeout);
      
      if (result.success) {
        resolve(result.data);
      } else {
        reject(new Error(result.error || 'Reader failed'));
      }
    });
    
    // Send reader code to renderer
    window.webContents.send('pipeline:run-parallel-reader', {
      code: moduleCode,
      itemData: itemData,
      channelId: channelId
    });
  });
}

module.exports = {
  runPipeline,
  executeStep,
  setHeadless
};
