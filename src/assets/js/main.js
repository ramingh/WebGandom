

// import { GandomMap } from '../../components/Map.js';
// import { LayerManager } from '../../components/LayerManager.js';
import { GandomMap } from '../../components/NewMap1.js';
import { LayerManager } from '../../components/LayerManager1.js';

// Initialize components
const map = new GandomMap('map');
const layerManager = new LayerManager('sidebar');

// Show loading indicator
const loadingIndicator = document.getElementById('loading');
loadingIndicator.style.display = 'flex';

// Initialize application
async function initApp() {
    try {
        // Initialize map
        map.init();
        console.log('Main   111111111');
        // Load layers
        await layerManager.loadLayers();

        // Add event listeners
        addEventListeners();

        // Hide loading indicator
        loadingIndicator.style.display = 'none';
    } catch (error) {
        console.error('Error initializing application:', error);
        loadingIndicator.style.display = 'none';
        alert('خطا در بارگذاری برنامه. لطفاً صفحه را رفرش کنید.');
    }
}

// Add event listeners
function addEventListeners() {
    // Layer toggle events
    layerManager.container.addEventListener('layerToggle', async (e) => {
        const { id, visible } = e.detail;
        try {
            await map.toggleLayer(id, visible);
        } catch (error) {
            console.error(`خطا در تغییر وضعیت لایه ${id}:`, error);
            // Uncheck the checkbox if layer loading fails
            const checkbox = layerManager.container.querySelector(`[data-layer-id="${id}"]`);
            if (checkbox) {
                checkbox.checked = false;
            }
        }
    });

    // Route type change events
    layerManager.container.addEventListener('routeTypeChange', (e) => {
        const { type } = e.detail;
        // TODO: Update route type
        console.log(`Route type changed to: ${type}`);
    });
}

// Start application
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});