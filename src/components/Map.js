// Map Component
export class GandomMap {
    constructor(containerId) {
        this.containerId = containerId;
        this.map = null;
        // this.initTrashButton();
        this.layers = new Map();
        this.baseLayer = null;
        this.markers = [];
        this.currentBaseLayer = null;
        this.baseMaps = {
            osm: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 20,
                attribution: '© OpenStreetMap contributors'
            }),
            satellite: L.tileLayer('http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}', {
                maxZoom: 21,
                attribution: '© Esri'
            }),
            terrain: L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
                maxZoom: 17,
                attribution: '© OpenTopoMap'
            })
        };

    }

    init() {
        // Initialize map
        this.map = L.map(this.containerId, {
            center: [32.4279, 53.6880],
            zoom: 6,
            zoomControl: false
        });
        // Add zoom control to top-left
        L.control.zoom({
            position: 'topleft'
        }).addTo(this.map);
        // Set default base layer
        this.setBaseMap('osm');
        // Initialize base map controls
        this.initBaseMapControls();
        // Initialize layer toggle button
        this.initLayerToggleButton();
        // Add controls
        this.addRulerControl();
        this.addSearchControl();
        this.addlayerlist();
        this.addlayermenu();
    }

    initBaseMapControls() {
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

        document.addEventListener('click', (e) => {
            if (!toggleButton.contains(e.target) && !menu.contains(e.target)) {
                menu.classList.remove('show');
            }
        });

        const radioButtons = document.querySelectorAll('.basemap-option input[type="radio"]');
        radioButtons.forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.setBaseMap(e.target.value);
                menu.classList.remove('show');
            });
        });
    }

    setBaseMap(type) {
        if (this.currentBaseLayer) {
            this.map.removeLayer(this.currentBaseLayer);
        }

        this.currentBaseLayer = this.baseMaps[type];
        this.map.addLayer(this.currentBaseLayer);
        this.currentBaseLayer.bringToBack();
    }

    addSearchControl() {
        // Add search control with Persian labels
        const searchControl = new L.Control.Geocoder({
            position: 'topleft', 
            placeholder: 'جستجوی مکان...',
            errorMessage: 'مکانی یافت نشد.',
            defaultMarkGeocode: true,
            geocoder: new L.Control.Geocoder.Nominatim({
                language: 'fa'
            })
        }).addTo(this.map);

        searchControl.on('markgeocode', (e) => {
            const center = e.geocode.center;
            this.map.setView(center, 13);
        });
    }

    initLayerToggleButton() {
        const toggleButton = document.querySelector('.toggle-layers');
        const layerContainer = document.querySelector('.layer-container');

        // console.log(toggleButton, layerContainer);

        if (!toggleButton || !layerContainer) {
            console.error('Layer toggle button or container not found', toggleButton, layerContainer);
            return;
        }

        // Set initial state
        layerContainer.classList.add('hidden');
        toggleButton.innerHTML = '<i class="fas fa-layer-group"></i> انتخاب لایه';

        toggleButton.addEventListener('click', (e) => {
            e.stopPropagation();
            const isHidden = layerContainer.classList.contains('hidden');

            if (isHidden) {
                layerContainer.classList.remove('hidden');
                toggleButton.innerHTML = '<i class="fas fa-layer-group"></i> بستن لایه‌ها';
            } else {
                layerContainer.classList.add('hidden');
                toggleButton.innerHTML = '<i class="fas fa-layer-group"></i> انتخاب لایه';
            }
        });

        // Close layer menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!toggleButton.contains(e.target) && !layerContainer.contains(e.target)) {
                layerContainer.classList.add('hidden');
                toggleButton.innerHTML = '<i class="fas fa-layer-group"></i> انتخاب لایه';
            }
        });
    }

    addRulerControl() {
        // Add ruler control with Persian labels
        const rulerOptions = {
            position: 'topleft',
            circleMarker: {
                color: 'red',
                radius: 2
            },
            lineStyle: {
                color: 'red',
                dashArray: '1,6'
            },
            lengthUnit: {
                display: 'کیلومتر',
                decimal: 2,
                factor: null,
                label: 'فاصله:'
            },
            angleUnit: {
                display: 'درجه',
                decimal: 2,
                factor: null,
                label: 'زاویه:'
            }
        };
        L.control.ruler(rulerOptions).addTo(this.map);
    }

    addLayer(id, layer, options = {}) {
        this.layers.set(id, layer);
        if (options.visible) {
            layer.addTo(this.map);
        }
    }

    removeLayer(id) {
        const layer = this.layers.get(id);
        if (layer) {
            this.map.removeLayer(layer);
            this.layers.delete(id);
        }
    }

    addMarker(latlng) {
        const marker = L.marker(latlng).addTo(this.map);
        this.markers.push(marker);
    }

    removeMarker(id) {
        const marker = this.markers.get(id);
        if (marker) {
            this.map.removeLayer(marker);
            this.markers.delete(id);
        }
    }

    clearMarkers() {
        this.markers.forEach(marker => {
            this.map.removeLayer(marker);
        });
        this.markers.clear();
    }

    fitBounds(bounds) {
        this.map.fitBounds(bounds);
    }

    setView(latlng, zoom) {
        this.map.setView(latlng, zoom);
    }

    async toggleLayer(layerId, visible) {
        console.log(`Toggling layer: ${layerId}, Visible: ${visible}`);

        if (visible) {
            // منطق اضافه کردن لایه
            const layer = this.createLayer(layerId);
            if (layer) {
                layer.addTo(this.map);
                this.layers.set(layerId, layer);
            }
        } else {
            // منطق حذف لایه
            const layer = this.layers.get(layerId);
            if (layer) {
                this.map.removeLayer(layer);
                this.layers.delete(layerId);
            }
        }
    }

    async showLayer(layerId) {
        // Check if layer already exists
        if (this.layers.has(layerId)) {
            const layer = this.layers.get(layerId);
            layer.addTo(this.map);
            return;
        }

        // Fetch layer data from server
        const data = await this.fetchLayerData(layerId);

        // Create and add layer
        const layer = this.createLayer(layerId, data);
        this.layers.set(layerId, layer);
        layer.addTo(this.map);
    }

    hideLayer(layerId) {
        if (this.layers.has(layerId)) {
            const layer = this.layers.get(layerId);
            this.map.removeLayer(layer);
        }
    }

    // getLayerTypeMapping(layerId) {
    //     // Map layer IDs to their corresponding types in the database
    //     const mapping = {
    //         'shop': 'shop',
    //         'park': 'park',
    //         'nutrition_supplements': 'nutrition_supplements',
    //         'bus_station': 'bus_station',
    //         'train_station': 'train_station',
    //         'marketplace': 'marketplace',
    //         'tower': 'tower',
    //         'hospital': 'hospital',
    //         'bus_stop': 'bus_stop',
    //         'university': 'university',
    //         'high_school': 'high_school',
    //         'clinic': 'clinic',
    //         'supermarket': 'supermarket',
    //         'school': 'school',
    //         'elementray_school': 'elementray_school',
    //         'mosque': 'mosque',
    //         'kindergarten': 'kindergarten',
    //         'fruit_vegetable_store': 'fruit_vegetable_store',
    //         'bakery': 'bakery',
    //         'hyper_market': 'hyper_market'
    //     };
    //     return mapping[layerId] || layerId;
    // }

    getMarkerIcon(type) {
        // Define icons for different types
        const icons = {
            'shop': 'store',
            'park': 'tree',
            'nutrition_supplements': 'dumbbell',
            'bus_station': 'bus',
            'train_station': 'train',
            'marketplace': 'shopping-basket',
            'tower': 'building',
            'hospital': 'hospital',
            'bus_stop': 'bus-alt',
            'university': 'university',
            'high_school': 'school',
            'clinic': 'clinic-medical',
            'supermarket': 'shopping-cart',
            'school': 'school',
            'elementray_school': 'chalkboard-teacher',
            'mosque': 'mosque',
            'kindergarten': 'baby',
            'fruit_vegetable_store': 'apple-alt',
            'bakery': 'bread-slice',
            'hyper_market': 'shopping-bag'
        };

        const icon = icons[type] || 'map-marker-alt';

        return L.divIcon({
            html: `<i class="fas fa-${icon}"></i>`,
            className: 'custom-marker-icon',
            iconSize: [30, 30]
        });
    }

    async fetchLayerData(layerId) {
        const layerType = this.getLayerTypeMapping(layerId);
        const parameter = {
            sqlstr: `[steep]=1 and [type]='${layerType}'`
        };

        return new Promise((resolve, reject) => {
            $.ajax({
                type: 'POST',
                url: 'https://gis.gandomcs.com/getdata.asmx/GetData',
                data: parameter,
                contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                dataType: 'text',
                crossDomain: true,
                xhrFields: {
                    withCredentials: false
                },
                success: function (response) {
                    try {
                        const parser = new DOMParser();
                        const xmlDoc = parser.parseFromString(response, "text/xml");
                        const data = xmlDoc.getElementsByTagName("string")[0].textContent;
                        if (data) {
                            try {
                                const geoJson = JSON.parse(data);
                                console.log('دریافت داده‌های لایه:', {
                                    layerType: layerType,
                                    data: geoJson
                                });
                                resolve(geoJson);
                            } catch (e) {
                                console.error('خطا در تبدیل داده به GeoJSON:', e);
                                reject(new Error('داده‌های دریافتی در فرمت GeoJSON نیستند'));
                            }
                        } else {
                            reject(new Error('داده‌ای از سرور دریافت نشد'));
                        }
                    } catch (error) {
                        console.error('خطا در پردازش پاسخ XML:', error);
                        reject(error);
                    }
                },
                error: function (xhr, status, error) {
                    console.error('خطا در درخواست به سرور:', {
                        layerType: layerType,
                        sqlstr: parameter.sqlstr,
                        status: status,
                        error: error,
                        response: xhr.responseText
                    });
                    reject(error);
                }
            });
        });
    }

    createLayer(layerId, data) {
        // Create layer based on type
        switch (layerId) {
            case 'shop':
            case 'hospital':
            case 'school':
            case 'park':
                return this.createMarkerLayer(data);
            default:
                return this.createMarkerLayer(data);
        }
    }

    // createMarkerLayer(data) {
    //     return L.geoJSON(data, {
    //         pointToLayer: (feature, latlng) => {
    //             return L.marker(latlng, {
    //                 icon: this.getMarkerIcon(feature.properties.type)
    //             });
    //         },
    //         onEachFeature: (feature, layer) => {
    //             if (feature.properties) {
    //                 layer.bindPopup(this.createPopupContent(feature.properties));
    //             }
    //         }
    //     });
    // }

    // createPopupContent(properties) {
    //     let content = '<div class="popup-content" style="direction: rtl; text-align: right;">';

    //     // Define Persian labels for properties
    //     const persianLabels = {
    //         'name': 'نام',
    //         'address': 'آدرس',
    //         'phone': 'تلفن',
    //         'type': 'نوع',
    //         'description': 'توضیحات'
    //     };

    //     for (const [key, value] of Object.entries(properties)) {
    //         if (value && key !== 'type') {
    //             const label = persianLabels[key] || key;
    //             content += `<strong>${label}:</strong> ${value}<br>`;
    //         }
    //     }
    //     content += '</div>';
    //     return content;
    // }

    // initTrashButton() {
    //     // اطمینان از وجود نقشه
    //     if (!this.map) return;

    //     const TrashControl = L.Control.extend({
    //         options: {
    //             position: 'topleft'
    //         },
    //         onAdd: (map) => {
    //             const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control trash-control');
    //             const link = L.DomUtil.create('a', 'trash-control-link', container);

    //             link.href = '#';
    //             link.title = 'پاک کردن';
    //             link.innerHTML = '<i class="fas fa-trash"></i>';

    //             L.DomEvent.on(link, 'click', (e) => {
    //                 L.DomEvent.preventDefault(e);
    //                 this.clearAllMarkers();
    //             });

    //             // جلوگیری از انتشار رویداد کلیک به نقشه
    //             L.DomEvent.stopPropagation(link);

    //             return container;
    //         }
    //     });

    //     // اطمینان از وجود نقشه
    //     if (this.map) {
    //         this.map.addControl(new TrashControl());
    //     } else {
    //         console.error('نقشه هنوز ایجاد نشده است');
    //     }
    // }

    clearAllMarkers() {
        // حذف تمام نشانگرها
        this.markers.forEach(marker => this.map.removeLayer(marker));
        this.markers = []; // پاک کردن آرایه
    }

    addlayermenu() {
        if (!this.map) return;

        // بررسی وجود Leaflet.draw
        if (L.Control.Draw) {
            const drawControl = new L.Control.Draw({
                draw: {
                    polygon: {
                        allowIntersection: false,
                        showArea: true
                    },
                    polyline: true,
                    rectangle: true,
                    circle: true,
                    marker: true
                }
            });

            this.map.addControl(drawControl);
        } else {
            console.error('Leaflet.draw بارگذاری نشده است');
        }
    }

    addlayerlist() {
        var GanodmEditableLayers = new L.FeatureGroup();
        var OfoghEditableLayers = new L.FeatureGroup();
        var JamboEditableLayers = new L.FeatureGroup();
        var HyperStarEditableLayers = new L.FeatureGroup();
        var EtkaEditableLayers = new L.FeatureGroup();
        var ShahrvandEditableLayers = new L.FeatureGroup();
        var HaftEditableLayers = new L.FeatureGroup();
        var RefahEditableLayers = new L.FeatureGroup();
        var SorenaEditableLayers = new L.FeatureGroup();
        var HyperMyEditableLayers = new L.FeatureGroup();
        var FamilyEditableLayers = new L.FeatureGroup();
        var DailyEditableLayers = new L.FeatureGroup();
        var AmiranEditableLayers = new L.FeatureGroup();
        var YasEditableLayers = new L.FeatureGroup();
        var KousarEditableLayers = new L.FeatureGroup();
        var WinMarketEditableLayers = new L.FeatureGroup();
        var MofidEditableLayers = new L.FeatureGroup();
        var SepahEditableLayers = new L.FeatureGroup();

        var drawingLayers = {
            "گندم": GanodmEditableLayers,
            "افق کوروش": OfoghEditableLayers,
            "جانبو": JamboEditableLayers,
            "هایپر استار": HyperStarEditableLayers,
            "اتکا": EtkaEditableLayers,
            "شهروند": ShahrvandEditableLayers,
            "هفت": HaftEditableLayers,
            "رفاه": RefahEditableLayers,
            "سورنا": SorenaEditableLayers,
            "هایپرمی": HyperMyEditableLayers,
            "فامیلی": FamilyEditableLayers,
            "دیلی مارکت": DailyEditableLayers,
            "امیران": AmiranEditableLayers,
            "یاس": YasEditableLayers,
            "کوثر": KousarEditableLayers,
            "وین مارکت": WinMarketEditableLayers,
            "مفید": MofidEditableLayers,
            // "محسن": MohsenEditableLayers,
            "سپه": SepahEditableLayers,
        };

        this.map.addLayer(GanodmEditableLayers);

        L.control.layers(null, drawingLayers, { position: 'topleft', collapsed: false }).addTo(this.map);

    }
} 