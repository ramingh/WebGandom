// Sidebar Component
export class Sidebar {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.layers = new Map();
        this.init();
    }

    init() {
        // Create sidebar structure
        this.container.innerHTML = `
            <div class="sidebar-header">
                <h3>لایه‌ها</h3>
            </div>
            <div class="sidebar-content">
                <div class="layer-controls">
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="routeType" id="footRoute" value="foot" checked>
                        <label class="form-check-label" for="footRoute">
                            مسیر پیاده
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="routeType" id="carRoute" value="car">
                        <label class="form-check-label" for="carRoute">
                            مسیر خودرو
                        </label>
                    </div>
                </div>
                <div class="layer-list">
                    <!-- Layer items will be added here dynamically -->
                </div>
            </div>
        `;

        // Add event listeners
        this.addEventListeners();
    }

    addEventListeners() {
        // Route type change
        const routeInputs = this.container.querySelectorAll('input[name="routeType"]');
        routeInputs.forEach(input => {
            input.addEventListener('change', (e) => {
                this.onRouteTypeChange(e.target.value);
            });
        });
    }

    addLayer(id, name, visible = false) {
        const layerItem = document.createElement('div');
        layerItem.className = 'layer-item';
        layerItem.innerHTML = `
            <div class="form-check">
                <input class="form-check-input" type="checkbox" id="${id}" ${visible ? 'checked' : ''}>
                <label class="form-check-label" for="${id}">
                    ${name}
                </label>
            </div>
        `;

        // Add event listener
        const checkbox = layerItem.querySelector('input');
        checkbox.addEventListener('change', (e) => {
            this.onLayerToggle(id, e.target.checked);
        });

        this.container.querySelector('.layer-list').appendChild(layerItem);
        this.layers.set(id, { name, visible });
    }

    removeLayer(id) {
        const layerItem = this.container.querySelector(`#${id}`).closest('.layer-item');
        if (layerItem) {
            layerItem.remove();
            this.layers.delete(id);
        }
    }

    onLayerToggle(id, visible) {
        this.layers.get(id).visible = visible;
        this.dispatchEvent('layerToggle', { id, visible });
    }

    onRouteTypeChange(type) {
        this.dispatchEvent('routeTypeChange', { type });
    }

    dispatchEvent(name, detail) {
        const event = new CustomEvent(name, { detail });
        this.container.dispatchEvent(event);
    }
} 