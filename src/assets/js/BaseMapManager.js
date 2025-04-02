export class BaseMapManager {
    constructor(gandomMap) {
        this.gandomMap = gandomMap;
        this.map = gandomMap.map;
        this.currentLayer = null;
        this.baseMaps = {
            osm: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '© OpenStreetMap contributors'
            }),
            satellite: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                maxZoom: 19,
                attribution: '© Esri'
            }),
            terrain: L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
                maxZoom: 17,
                attribution: '© OpenTopoMap'
            })
        };

        this.initBaseMapControls();
        this.setBaseMap('osm'); // Set default base map
    }

    initBaseMapControls() {
        // Toggle button click handler
        const toggleButton = document.querySelector('.basemap-toggle');
        const menu = document.querySelector('.basemap-menu');
        
        if (!toggleButton || !menu) {
            console.error('Base map controls not found in DOM');
            return;
        }

        toggleButton.addEventListener('click', (e) => {
            e.stopPropagation();
            menu.classList.toggle('show');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!toggleButton.contains(e.target) && !menu.contains(e.target)) {
                menu.classList.remove('show');
            }
        });

        // Radio button change handler
        const radioButtons = document.querySelectorAll('.basemap-option input[type="radio"]');
        radioButtons.forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.setBaseMap(e.target.value);
                menu.classList.remove('show');
            });
        });
    }

    setBaseMap(type) {
        // Remove current base layer if exists
        if (this.currentLayer) {
            this.map.removeLayer(this.currentLayer);
        }

        // Add new base layer
        this.currentLayer = this.baseMaps[type];
        this.map.addLayer(this.currentLayer);
        
        // Make sure the base layer is at the bottom
        this.currentLayer.bringToBack();
    }
} 