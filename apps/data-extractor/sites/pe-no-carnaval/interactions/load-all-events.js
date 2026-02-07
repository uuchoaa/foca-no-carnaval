/**
 * Interaction: Load all events by clicking "Carregar mais eventos" button
 * This interaction repeatedly clicks the "load more" button until it's no longer present
 */

module.exports = function loadAllEvents(document, done) {
  console.log('[INTERACTION] Starting load-all-events...');
  
  let clickCount = 0;
  const maxClicks = 50; // Safety limit
  
  function clickLoadMoreButton() {
    // Search for the "Carregar mais eventos" button
    const buttons = document.querySelectorAll('button, a, div[role="button"], span[role="button"]');
    let loadMoreButton = null;

    for (let button of buttons) {
      const text = button.textContent.trim();
      if (text.includes('Carregar mais eventos') || text.includes('carregar mais eventos')) {
        loadMoreButton = button;
        break;
      }
    }

    if (loadMoreButton && clickCount < maxClicks) {
      clickCount++;
      console.log(`[INTERACTION] Found "Carregar mais eventos" button, clicking... (${clickCount})`);
      loadMoreButton.click();
      
      // Wait for content to load, then check again
      setTimeout(() => {
        console.log('[INTERACTION] Waiting for new events to load...');
        clickLoadMoreButton();
      }, 3000);
    } else {
      if (clickCount >= maxClicks) {
        console.log(`[INTERACTION] Reached maximum clicks (${maxClicks})`);
      } else {
        console.log('[INTERACTION] "Carregar mais eventos" button not found. All events loaded!');
      }
      console.log(`[INTERACTION] Total clicks: ${clickCount}`);
      console.log('[INTERACTION] Interaction completed successfully');
      done();
    }
  }
  
  // Start the process after a short delay to ensure page is ready
  setTimeout(() => {
    clickLoadMoreButton();
  }, 2000);
};
