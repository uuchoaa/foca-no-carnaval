/**
 * Pipeline runner for executing extraction pipelines
 * Coordinates interactions, snapshots, writers, and readers via IPC
 */

const { ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');
const { createSnapshot } = require('./snapshot');

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

module.exports = {
  runPipeline,
  executeStep
};
