import icons from '../assets/js/icons.Js';

// Map Component
export class GandomMap {
    constructor(containerId) {
        this.containerId = containerId;
        this.map = null;
        this.initTrashButton();
        this.layers = new Map();
        this.baseLayer = null;
        this.markers = [];
        this.currentBaseLayer = null;
        this.listmaarker = []; // اضافه کردن آرایه برای نگهداری لیست مارکرها
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
        this.addCustomStyles(); // اضافه کردن استایل‌های سفارشی
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
        // this.initLayerToggleButton();
        // Add controls
        this.addRulerControl();
        this.addSearchControl();
        this.addlayerlist();
        this.iconservice();
        this.chech_chekbox();
        
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
        this.map.addLayer(gandompoint1);
        if (visible) {
            // منطق اضافه کردن لایه
            const layer = this.createLayer(layerId);
            if (layer) {
                layer.addTo(this.map);
                this.layers.set(layerId, layer);
            }
        } else {
            GandomMap.clearAllMarkers();
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
  
    clearAllMarkers() {
        try {
            // حذف تمام لایه‌ها از نقشه
            for (let i in this.map._layers) {
                if (this.map._layers[i] instanceof L.Marker ||
                    this.map._layers[i] instanceof L.LayerGroup) {
                    this.map.removeLayer(this.map._layers[i]);
                }
            }

            // حذف لایه‌های خاص
            if (window.gandompoint1) {
                this.map.removeLayer(window.gandompoint1);
            }

            // لغو انتخاب تمام چک‌باکس‌ها
            const layerCheckboxes = document.querySelectorAll('.leaflet-control-layers-selector');
            layerCheckboxes.forEach(checkbox => {
                checkbox.checked = false;
            });

            console.log("تمام لایه‌ها و نشانگرها حذف شدند");
        } catch (error) {
            console.error("خطا در حذف لایه‌ها:", error);
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

        // this.map.addLayer(GanodmEditableLayers);

        L.control.layers(null, drawingLayers, { position: 'topleft', collapsed: false }).addTo(this.map);

    }



    clearMap(map) {
        var i = 0;
        for (i in this.map._layers) {

            if ((map._layers[i]._path != undefined) || (map._layers[i]._icon != undefined)) {
                var lay1 = map._layers[i];

                try { map.removeLayer(map._layers[i]); } catch (e) {
                    console.log("problem with " + e + m._layers[i]);
                }
            }
        }
    }


    chech_chekbox() {
        const self = this;
        const checkboxes = document.querySelectorAll("[class='leaflet-control-layers-selector']");
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function (event) {
                var df = this.parentNode.textContent; // Use textContent instead of .text()  
                if (df == " گندم") {
                    if (this.checked) { // Use this.checked instead of .prop("checked")  
                        console.log("3  addLayer ", df);
                        self.map.addLayer(gandompoint1);
                    } else {
                        console.log("4   removeLayer ", df);
                        self.map.removeLayer(gandompoint1);
                    }
                }
            });
        });
    }
    initTrashButton() {
        const trashButton = document.getElementById('trash-button');
        if (!trashButton) {
            console.error('Trash button not found');
            return;
        }
        trashButton.addEventListener('click', () => {
            // حذف تمام لایه‌های انتخاب شده
            // this.clearAllMarkers();
            this.clearMap(this.map);
            // لغو انتخاب تمام چک‌باکس‌ها
            const layerCheckboxes = document.querySelectorAll('.leaflet-control-layers-selector');
            layerCheckboxes.forEach(checkbox => {
                checkbox.checked = false;
            });
        });
    }

    clearAllMarkers() {
        try {
            // حذف تمام نشانگرهای gandompoint1            
            if (this.map && gandompoint1) {
                this.map.removeLayer(gandompoint1);
                console.log("تمام نشانگرها حذف شدند");
            } else {
                console.warn("نقشه یا نشانگرها موجود نیستند");
            }
        } catch (error) {
            console.error("خطا در حذف نشانگرها:", error);
        }
    }


    iconservice() {
        if (!this.map) return;

        // تنظیم متن‌های فارسی برای ابزار ترسیم
        // if (!L.drawLocal) {
        //     L.drawLocal = {};
        // }

        // L.drawLocal = {
        //     draw: {
        //         toolbar: {
        //             actions: {
        //                 title: 'لغو ترسیم',
        //                 text: 'لغو'
        //             },
        //             finish: {
        //                 title: 'پایان ترسیم',
        //                 text: 'پایان'
        //             },
        //             undo: {
        //                 title: 'حذف آخرین نقطه ترسیم شده',
        //                 text: 'حذف آخرین نقطه'
        //             },
        //             buttons: {
        //                 polyline: 'ترسیم خط',
        //                 polygon: 'ترسیم چندضلعی',
        //                 rectangle: 'ترسیم مستطیل',
        //                 circle: 'ترسیم دایره',
        //                 marker: 'ترسیم نشانگر',
        //                 circlemarker: 'ترسیم نشانگر دایره‌ای'
        //             }
        //         },
        //         handlers: {
        //             circle: {
        //                 tooltip: {
        //                     start: 'برای ترسیم دایره کلیک کرده و بکشید'
        //                 },
        //                 radius: 'شعاع'
        //             },
        //             circlemarker: {
        //                 tooltip: {
        //                     start: 'برای قرار دادن نشانگر دایره‌ای کلیک کنید'
        //                 }
        //             },
        //             marker: {
        //                 tooltip: {
        //                     start: 'برای قرار دادن نشانگر کلیک کنید'
        //                 }
        //             },
        //             polygon: {
        //                 tooltip: {
        //                     start: 'برای شروع ترسیم کلیک کنید',
        //                     cont: 'برای ادامه ترسیم کلیک کنید',
        //                     end: 'برای پایان ترسیم روی اولین نقطه کلیک کنید'
        //                 }
        //             },
        //             polyline: {
        //                 error: 'خطا',
        //                 tooltip: {
        //                     start: 'برای شروع ترسیم خط کلیک کنید',
        //                     cont: 'برای ادامه ترسیم خط کلیک کنید',
        //                     end: 'برای پایان ترسیم خط روی آخرین نقطه دابل کلیک کنید'
        //                 }
        //             },
        //             rectangle: {
        //                 tooltip: {
        //                     start: 'برای شروع ترسیم مستطیل کلیک کنید و نگه دارید',
        //                     cont: 'برای ترسیم مستطیل ماوس را حرکت دهید',
        //                     end: 'برای پایان ترسیم رها کنید'
        //                 }
        //             },
        //             simpleshape: {
        //                 tooltip: {
        //                     end: 'برای پایان ترسیم رها کنید'
        //                 }
        //             }
        //         }
        //     },
        //     edit: {
        //         toolbar: {
        //             actions: {
        //                 save: {
        //                     title: 'ذخیره تغییرات',
        //                     text: 'ذخیره'
        //                 },
        //                 cancel: {
        //                     title: 'لغو ویرایش و حذف همه تغییرات',
        //                     text: 'لغو'
        //                 },
        //                 clearAll: {
        //                     title: 'پاک کردن همه لایه‌ها',
        //                     text: 'پاک کردن همه'
        //                 }
        //             },
        //             buttons: {
        //                 edit: 'ویرایش لایه‌ها',
        //                 editDisabled: 'لایه‌ای برای ویرایش وجود ندارد',
        //                 remove: 'حذف لایه‌ها',
        //                 removeDisabled: 'لایه‌ای برای حذف وجود ندارد'
        //             }
        //         }
        //     }
        // };

        // تعریف کنترل سفارشی
        const CustomDrawControl = L.Control.extend({
            options: {
                position: 'topleft'
            },

            onAdd: (map) => {
                const container = L.DomUtil.create('div', 'leaflet-bar leaflet-draw-toolbar');
                
                // آیکون‌ها و عملکردهای مختلف
                const tools = [
                    { 
                        icon: 'fas fa-square', 
                        title: 'فروشگاه‌ها',
                        action: () => {
                           

                            const rectangleDrawer = new L.Draw.Rectangle(map, {
                                shapeOptions: {
                                    color: '#99b5dccc',
                                    weight: 2
                                }
                            });
                             this.clearMap(map);
                            rectangleDrawer.enable();
                        }
                    },
                    { 
                        icon: 'fas fa-map-marker-alt', 
                        title: 'مسیر دسترسی', 
                        action: () => {
                            const markerDrawer = new L.Draw.Marker(map);
                            markerDrawer.enable();
  this.clearMap(map);
                            // اضافه کردن رویداد برای زمانی که نشانگر قرار می‌گیرد
                            map.once(L.Draw.Event.CREATED, (e) => {
                                const marker = e.layer;
                                const latlng = marker.getLatLng();
                              
                                // درخواست شعاع از کاربر
                                let radius = prompt("              Km" + ": لطفا شعاع را وارد کنید" + "(0.5 تا 2)", "1");

                                if (radius === null || radius === "") {
                                    alert("لطفا شعاع را وارد کنید");
                                    map.removeLayer(marker);
                                    return;
                                }

                                radius = Number(radius);

                                if (isNaN(radius)) {
                                    alert("لطفا یک عدد معتبر وارد کنید");
                                    map.removeLayer(marker);
                                    return;
                                }

                                if (radius < 0.5 || radius > 2) {
                                    alert("شعاع باید بین 0.5 تا 2 باشد");
                                    map.removeLayer(marker);
                                    return;
                                }

                                // نمایش مختصات و شعاع در کنسول
                                console.log('مختصات نقطه:', latlng);
                                console.log('شعاع:', radius);

                                // اینجا می‌توانید کد مربوط به ارسال به سرویس را اضافه کنید
                            });
                        }
                    },
                    { 
                        icon: 'fas fa-user', 
                        title: 'مدیران مناطق', 
                        action: () => {
                            const markerDrawer = new L.Draw.Marker(map);
                            markerDrawer.enable();

                            // اضافه کردن رویداد برای زمانی که نشانگر قرار می‌گیرد
                            map.once(L.Draw.Event.CREATED, (e) => {
                                const marker = e.layer;
                                const latlng = marker.getLatLng();
                                this.clearMap(map);
                                // map.removeLayer(marker);
                                // فراخوانی تابع Draw_modir با استفاده از this
                                this.Draw_modir(latlng.lng, latlng.lat, map);
                            });
                        }
                    },
                    { 
                        icon: 'fas fa-users', 
                        title: 'تراکم جمعیت', 
                        action: () => {

                            const markerDrawer = new L.Draw.Marker(map);
                            markerDrawer.enable();
                            this.clearMap(map);
                            map.once(L.Draw.Event.CREATED, (e) => {

                                const marker = e.layer;
                                const latlng = marker.getLatLng();

                                // محاسبه مختصات مربع 1x1 کیلومتر
                                const degLng = 0.006; // تقریباً برابر با 1 کیلومتر در طول جغرافیایی
                                const degLat = 0.005; // تقریباً برابر با 1 کیلومتر در عرض جغرافیایی
                                const buffer = [
                                    (latlng.lng - degLng).toFixed(6),
                                    (latlng.lat - degLat).toFixed(6),
                                    (latlng.lng + degLng).toFixed(6),
                                    (latlng.lat + degLat).toFixed(6)
                                ].join(',');

                                const [minX, minY, maxX, maxY] = buffer.split(',').map(Number);

                                // ترسیم مربع محدوده
                                const rectangle = L.rectangle([[minY, minX], [maxY, maxX]], {
                                    color: '#2c3e50',
                                    weight: 2,
                                    opacity: 0.7,
                                    fillOpacity: 0.1
                                }).addTo(map);
                                const Url_domain = 'https://gis.gandomcs.com/arcgis/rest/services/';
                                // درخواست اطلاعات تراکم جمعیت
                                const url = `${Url_domain}tara/MapServer/identify?geometryType=esriGeometryEnvelope&layers=id:0&tolerance=1&mapExtent=46.5,34.2,46.6,34.1&imageDisplay=1,1,1&f=json&geometry=${buffer}`;

                                fetch(url)
                                    .then(response => response.json())
                                    .then(data => {
                                        if (!data.results || data.results.length === 0) {
                                            this.showPopulationInfo(rectangle, 0, 0, 0);
                                            return;
                                        }

                                        let totalPopulation = 0;
                                        let totalHouseholds = 0;
                                        let totalArea = 0;
                                        let densities = [];

                                        // پردازش نتایج
                                        data.results.forEach(result => {
                                            const attributes = result.attributes;
                                            totalPopulation += parseFloat(attributes.Population || 0);
                                            totalHouseholds += parseFloat(attributes.Khanevar || 0);
                                            totalArea += parseFloat(attributes.Area_HT || 0);
                                            densities.push(parseFloat(attributes.Tarakom || 0));

                                            // ترسیم چندضلعی منطقه
                                            if (result.geometry && result.geometry.rings) {
                                                result.geometry.rings.forEach(ring => {
                                                    const coordinates = ring.map(point => [point[1], point[0]]);
                                                    const density = parseFloat(attributes.Tarakom || 0);

                                                    // محاسبه رنگ و شفافیت بر اساس تراکم
                                                    let polygonStyle;
                                                    if (density === 0) {
                                                        // مناطق بدون جمعیت
                                                        polygonStyle = {
                                                            color: '#ff0000',
                                                            weight: 1,
                                                            opacity: 0.3,
                                                            fillOpacity: 0.1,
                                                            fillColor: '#ff0000'
                                                        };
                                                    } else {
                                                        // محاسبه شفافیت بر اساس تراکم (بین 0.1 تا 0.8)
                                                        const normalizedDensity = (density / Math.max(...densities)) * 0.7 + 0.1;
                                                        polygonStyle = {
                                                            color: 'transparent',
                                                            weight: 10,
                                                            opacity: 0,
                                                            fillOpacity: normalizedDensity,
                                                            fillColor: '#AA0055'
                                                        };
                                                    }

                                                    L.polygon(coordinates, polygonStyle).addTo(map).bindPopup(`
                                                        <div style="direction: rtl; text-align: right; font-family: Vazir;">
                                                            <h6 style="color: #2c3e50; margin-bottom: 10px;">اطلاعات منطقه</h6>
                                                            <table style="width: 100%; border-collapse: collapse;">
                                                                <tr>
                                                                    <td style="padding: 5px; border-bottom: 1px solid #eee;"><strong>جمعیت:</strong></td>
                                                                    <td style="padding: 5px; border-bottom: 1px solid #eee;">${this.formatNumber(attributes.Population || 0)}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td style="padding: 5px; border-bottom: 1px solid #eee;"><strong>تعداد خانوار:</strong></td>
                                                                    <td style="padding: 5px; border-bottom: 1px solid #eee;">${this.formatNumber(attributes.Khanevar || 0)}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td style="padding: 5px; border-bottom: 1px solid #eee;"><strong>تراکم جمعیت:</strong></td>
                                                                    <td style="padding: 5px; border-bottom: 1px solid #eee;">${this.formatNumber(attributes.Tarakom || 0)} نفر/هکتار  </td>
                                                                </tr>
                                                                <tr>
                                                                    <td style="padding: 5px; border-bottom: 1px solid #eee;"><strong>مساحت:</strong></td>
                                                                    <td style="padding: 5px; border-bottom: 1px solid #eee;">${this.formatNumber(attributes.Area_HT || 0)} هکتار</td>
                                                                </tr>
                                                            </table>
                                                        </div>
                                                    `);
                                                    //   marker.bindPopup('poptext').openPopup();
                                                });
                                            }
                                        });
                                        // نمایش اطلاعات کلی
                                        this.showPopulationInfo(marker, totalPopulation, totalHouseholds, totalArea);
                                    })
                                    .catch(error => {
                                        console.error('خطا در دریافت اطلاعات تراکم جمعیت:', error);
                                        alert('خطا در دریافت اطلاعات تراکم جمعیت');
                                    });                                   
                                  
                            });
                            
                        }
                    },
                    { 
                        icon: 'fas fa-shopping-cart', 
                        title: 'همه کسب و کارها', 
                        action: () => {
                            const markerDrawer = new L.Draw.Marker(map);
                            markerDrawer.enable();
                            this.clearMap(map);
                            map.once(L.Draw.Event.CREATED, async (e) => {
                                const marker = e.layer;
                                const latlng = marker.getLatLng();
                                // const list1 = ['hospital', 'attraction', 'bakery', 'bank', 'barracks', 'bus_line', 'bus_station', 'bus_stop', 'camp_site', 'caravan_site', 'clinic', 'elementray_school', 'fruit_vegetable_store', 'fuel', 'high_school', 'hospice', 'hospital', 'hotel', 'kindergarten', 'hyper_market', 'laboratory', 'marketplace', 'mosque', 'parking', 'parking_space', 'police', 'public_transport_building', 'public_transportation', 'school', 'subway', 'subway_line', 'supermarket', 'theme_park', 'tower', 'trade_store', 'train_station', 'university'];
                                const list1 = [ 'hyper_market'];
                               
                                // اجرای همزمان درخواست‌ها برای همه دسته‌بندی‌ها
                                const promises = list1.map(category => 
                                    this.count_other(latlng.lng, latlng.lat, 1, map, category, 1)
                                );
                                
                                try {
                                    await Promise.all(promises);
                                    console.log('تمام دسته‌بندی‌ها با موفقیت پردازش شدند');
                                } catch (error) {
                                    console.error('خطا در پردازش دسته‌بندی‌ها:', error);
                                }
                            });
                        }
                    },
                    { 
                        icon: 'fas fa-envelope', 
                        title: 'کد پستی', 
                        action: () => {
                            const markerDrawer = new L.Draw.Marker(map);
                            markerDrawer.enable();
                            this.clearMap(map);
                            
                            map.once(L.Draw.Event.CREATED, (e) => {
                                const marker = e.layer;
                                const latlng = marker.getLatLng();
                                this.cod_post(latlng.lng, latlng.lat, map);
                            });
                        }
                    },
                    { 
                        icon: 'fas fa-home', 
                        title: 'آبادی  ', 
                        action: () => {
                            const markerDrawer = new L.Draw.Marker(map);
                            markerDrawer.enable();
                            this.clearMap(map);
                            
                            map.once(L.Draw.Event.CREATED, (e) => {
                                const marker = e.layer;
                                const latlng = marker.getLatLng();
                            this.drawDistrict(latlng.lat, latlng.lng, map);

                                 //    this.Draw_abdi('316', map);
                       
                                
                            });
                        }
                    }
                ];

                tools.forEach(tool => {
                    const toolButton = L.DomUtil.create('a', 'leaflet-draw-toolbar-button', container);
                    toolButton.href = '#';
                    toolButton.title = tool.title;
                    
                    const icon = L.DomUtil.create('i', tool.icon, toolButton);
                    
                    L.DomEvent.on(toolButton, 'click', (e) => {
                        L.DomEvent.preventDefault(e);
                        L.DomEvent.stopPropagation(e);
                        tool.action();
                    });
                });

                return container;
            }
        });

        // اضافه کردن کنترل به نقشه
        this.map.addControl(new CustomDrawControl());

        // تنظیم رویدادهای ترسیم
        this.map.on(L.Draw.Event.CREATED, (e) => {
            const type = e.layerType;
            const layer = e.layer;
            this.map.addLayer(layer);

            switch (type) {
                case 'marker':
                    this.handleMarkerCreation(layer);
                    break;
                case 'rectangle':
                    this.handleRectangleCreation(layer);
                    break;
            }
        });
    }

    // متدهای کمکی برای هر نوع شکل
    handleMarkerCreation(layer) {
        const latlng = layer.getLatLng();
        // console.log(' دریافت دو مختصات نشانگر:', latlng);
        // می‌توانید عملیات بیشتری اینجا انجام دهید
    }

    handlePolylineCreation(layer) {
        const latlngs = layer.getLatLngs();
        console.log('مختصات خط:', latlngs);
        // محاسبه طول خط
        const length = L.GeometryUtil.length(latlngs);
        console.log('طول خط:', length);
    }

    handlePolygonCreation(layer) {
        const latlngs = layer.getLatLngs();
        console.log('مختصات چندضلعی:', latlngs);
        // محاسبه مساحت
        const area = L.GeometryUtil.geodesicArea(latlngs[0]);
        console.log('مساحت:', area);
    }

    handleRectangleCreation(layer) {
        // پاکسازی نقاط قبلی
        this.clearAllMarkers();

        const bounds = layer.getBounds();
        const northEast = bounds.getNorthEast();
        const southWest = bounds.getSouthWest();

        // تهیه پارامترهای مورد نیاز برای سرویس
        const buffer = `${northEast.lng},${northEast.lat},${southWest.lng},${southWest.lat}`;

        const url = 'https://gis.gandomcs.com/arcgis/rest/services/IR22/MapServer/identify';
        const params = {
            geometryType: 'esriGeometryEnvelope',
            layers: 'id:0',
            tolerance: 10,
            mapExtent: '46.5,34.2,46.6,34.1',
            imageDisplay: '1,1,1',
            returnGeometry: true,
            f: 'json',
            geometry: buffer
        };

        // تبدیل پارامترها به query string
        const queryString = Object.keys(params)
            .map(key => `${key}=${encodeURIComponent(params[key])}`)
            .join('&');

        const fullUrl = `${url}?${queryString}`;

        // ذخیره شمارنده‌های هر نوع کسب و کار
        const counters = {
            gandom: 0,
            super: 0,
            sorena: 0,
            refah: 0,
            ofog: 0,
            sepah: 0,
            canbo: 0,
            winmarket: 0,
            mohsen: 0,
            daily: 0,
            haft: 0,
            etka: 0,
            family: 0,
            shahrvand: 0,
            hyperstar: 0,
            amiran: 0,
            hypermy: 0,
            mofid: 0,
            kousar: 0,
            yas: 0
        };

        // درخواست به سرویس
        fetch(fullUrl)
            .then(response => response.json())
            .then(json => {
                if (!json.results || json.results.length === 0) {
                    console.log('هیچ نتیجه‌ای یافت نشد');
                    return;
                }

                // پردازش نتایج و نمایش نقاط
                json.results.forEach(result => {
                    const category = result.attributes.Category.trim();
                    const title = result.attributes.Name;
                    const coords = [result.geometry.y, result.geometry.x];

                    // نمایش نقطه بر اساس نوع کسب و کار
                    this.addBusinessMarker(category, title, coords, counters);
                });

                // نمایش گزارش با ارسال layer به عنوان پارامتر دوم
                this.showReport(counters, layer);
            })
            .catch(error => {
                console.error('خطا در دریافت اطلاعات:', error);
            });
    }

    // متد جدید برای اضافه کردن مارکر کسب و کارها
    addBusinessMarker(category, title, coords, counters) {
        let icon;
        switch (category) {
            case 'گندم':
                icon = icons.Gandom_;
                counters.gandom++;
                break;
            case 'سورنا':
                icon = icons.Sorena_;
                counters.sorena++;
                break;
            case 'رفاه':
                icon = icons.Refah_;
                counters.refah++;
                break;
            case 'افق کوروش':
                icon = icons.ofog_;
                counters.ofog++;
                break;
            case 'سپه':
                icon = icons.Sepah_;
                counters.sepah++;
                break;
            case 'جانبو':
                icon = icons.Canbo_;
                counters.canbo++;
                break;
            case 'وین مارکت':
                icon = icons.WinMarket_;
                counters.winmarket++;
                break;
            case 'محسن':
                icon = icons.Mohsen_;
                counters.mohsen++;
                break;
            case 'دیلی مارکت':
                icon = icons.Daily_;
                counters.daily++;
                break;
            case 'هفت':
                icon = icons.Haft_;
                counters.haft++;
                break;
            case 'اتکا':
                icon = icons.Etka_;
                counters.etka++;
                break;
            case 'فامیلی':
                icon = icons.Family_;
                counters.family++;
                break;
            case 'شهروند':
                icon = icons.Shahrvand_;
                counters.shahrvand++;
                break;
            case 'هایپراستار':
                icon = icons.Hayperstar_;
                counters.hyperstar++;
                break;
            case 'امیران':
                icon = icons.Amiran_;
                counters.amiran++;
                break;
            case 'هایپرمی':
                icon = icons.Haypermy_;
                counters.hypermy++;
                break;
            case 'مفید':
                icon = icons.Mofid_;
                counters.mofid++;
                break;
            case 'کوثر':
                icon = icons.Kousar_;
                counters.kousar++;
                break;
            case 'یاس':
                icon = icons.Yas_;
                counters.yas++;
                break;
            case 'سوپرمارکت':
                icon = icons.super_;
                counters.super++;
                break;
            default:
                console.log('نوع کسب و کار ناشناخته:', category);
                break;
        }

        if (icon) {
            L.marker(coords, { icon: icon })
                .addTo(this.map)
                .bindPopup(`${category}<br/>${title}`, { opacity: 0.1 });
        }
    }

    // متد نمایش گزارش را به‌روزرسانی کنید
    showReport(counters, layer) {
        let report = '';
        Object.entries(counters).forEach(([key, value]) => {
            if (value > 0) {
                report += `${this.getPersianName(key)}: ${value} عدد<br/>`;
            }
        });

        // نمایش گزارش در یک پنجره popup متصل به مستطیل
        if (report) {
            const bounds = layer.getBounds();
            const center = bounds.getCenter();

            // اضافه کردن دکمه Export به PDF در پایین گزارش
            const popupContent = `
                <div class="report-popup" style="direction: rtl; text-align: right;">
                <br/>    <strong>گزارش فروشگاه‌های محدوده:</strong>
                    ${report}
                    <div style="text-align: center; margin-top: 10px; border-top: 1px solid #eee; padding-top: 10px;">
                        <button onclick="window.exportToPDF('${encodeURIComponent(report)}')" class="export-pdf-btn">
                            <i class="fas fa-file-pdf"></i>
                            Export to PDF
                        </button>
                    </div>
                </div>`;

                // اضافه کردن متد exportToPDF به window
                window.exportToPDF = (reportData) => {
                    this.exportToPDF(decodeURIComponent(reportData));
                };

                layer.bindPopup(popupContent, {
                    className: 'custom-popup',
                    offset: L.point(0, -10),
                    closeButton: true,
                    closeOnClick: true,
                    autoClose: true
                }).openPopup();
        }
    }

    // تابع خروجی PDF
    exportToPDF(reportContent) {
        try {
            // بررسی وجود کتابخانه jsPDF
            if (typeof window.jspdf === 'undefined') {
                console.error('کتابخانه jsPDF لود نشده است');
                return;
            }

            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();

            try {
                // اضافه کردن فونت فارسی
                doc.addFont('Vazir.ttf', 'Vazir', 'normal');
                doc.setFont('Vazir');
            } catch (error) {
                console.error('خطا در لود فونت Vazir:', error);
                // استفاده از فونت پیش‌فرض
                doc.setFont('helvetica');
            }

            // تنظیم اندازه فونت
            doc.setFontSize(12);

            // عنوان گزارش
            const title = "گزارش فروشگاه‌های محدوده";
            const date = new Date().toLocaleDateString('fa-IR');

            // حذف تگ‌های HTML از محتوا
            const cleanContent = reportContent.replace(/<br\/?>/g, '\n').replace(/<\/?[^>]+(>|$)/g, '');

            // محاسبه موقعیت متن
            const marginRight = 10;
            const pageWidth = doc.internal.pageSize.getWidth();
            const xPosition = pageWidth - marginRight;

            // افزودن محتوا به PDF
            doc.text(title, xPosition, 10, { align: 'right' });
            doc.text(`تاریخ: ${date}`, xPosition, 20, { align: 'right' });
            
            // تقسیم محتوا به خطوط
            const lines = cleanContent.split('\n');
            let y = 30;
            
            lines.forEach(line => {
                if (y > 280) { // اگر به انتهای صفحه نزدیک شدیم
                    doc.addPage();
                    y = 10;
                }
                doc.text(line, xPosition, y, { align: 'right' });
                y += 10;
            });

            // ذخیره فایل
            doc.save('store-report.pdf');
        } catch (error) {
            console.error('خطا در ایجاد PDF:', error);
        }
    }

    // تابع خروجی PDF برای استفاده در HTML
    static initPDFExport() {
        window.exportToPDF = (reportContent) => {
            const mapInstance = document.querySelector('#map').__vue__;
            if (mapInstance) {
                mapInstance.exportToPDF(reportContent);
            }
        };
    }

    getPersianName(key) {
        const persianNames = {
            gandom: 'گندم',
            super: 'سوپرمارکت',
            sorena: 'سورنا',
            refah: 'رفاه',
            ofog: 'افق کوروش',
            sepah: 'سپه',
            canbo: 'جانبو',
            winmarket: 'وین مارکت',
            mohsen: 'محسن',
            daily: 'دیلی مارکت',
            haft: 'هفت',
            etka: 'اتکا',
            family: 'فامیلی',
            shahrvand: 'شهروند',
            hyperstar: 'هایپراستار',
            amiran: 'امیران',
            hypermy: 'هایپرمی',
            mofid: 'مفید',
            kousar: 'کوثر',
            yas: 'یاس'
        };
        return persianNames[key] || key;
    }

    // تابع Draw_modir برای نمایش مرز مدیران مناطق
    Draw_modir(l1, l2, map) {
        const Url_domain1 = 'https://gis.gandomcs.com/arcgis/rest/services/';
        let base_point = [];
        base_point.push(parseFloat(l1), parseFloat(l2));
        let dd3 = Url_domain1 + 'IR22/MapServer/identify?geometryType=esriGeometryPoint&' +
            'layers=ID:1&tolerance=0&mapExtent=46.5,34.2,46.6,34.1&imageDisplay=1,1,1&f=json&geometry=' + base_point;

        $.getJSON(dd3, (data) => {
            if (data.results.length == 0) { return [-1] };

            let ar2 = [];
            let managerInfo = data.results[0].attributes;

            for (let yy = 0; yy < data.results[0].geometry.rings.length; yy++) {
                var sums123 = data.results[0].geometry.rings[yy];
                for (let val of sums123) {
                    var li1 = [val[1], val[0]];
                    ar2.push(li1);
                }
                console.log(data.results, "Find_Gandom مرز مدیران ---->", dd3);

                // ایجاد چندضلعی با رنگ آبی
                const polygon = L.polygon(ar2, {
                    opacity: 0.5,
                    fillOpacity: 0.4,
                    weight: 1,
                    color: '#5050FF'
                }).addTo(map);

                // ایجاد محتوای پاپ‌آپ با اطلاعات مدیر از سرویس
                const popupContent = `
                    <div style="direction: rtl; text-align: right; font-family: Vazir;">
                        <h6 style="color: #2c3e50; margin-bottom: 10px;">اطلاعات مدیر منطقه</h6>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 5px; border-bottom: 1px solid #eee;"><strong>کد منطقه:</strong></td>
                                <td style="padding: 5px; border-bottom: 1px solid #eee;">${managerInfo.GandomDistrictIdO || 'نامشخص'}</td>
                            </tr>
                            <tr>
                                <td style="padding: 5px; border-bottom: 1px solid #eee;"><strong>نام استان:</strong></td>
                                <td style="padding: 5px; border-bottom: 1px solid #eee;">${managerInfo.ostn_name || 'نامشخص'}</td>
                            </tr>
                            <tr>
                                <td style="padding: 5px; border-bottom: 1px solid #eee;"><strong>شناسه کاربر منطقه:</strong></td>
                                <td style="padding: 5px; border-bottom: 1px solid #eee;">${managerInfo.GZoneUser_ID || 'نامشخص'}</td>
                            </tr>
                            <tr>
                                <td style="padding: 5px; border-bottom: 1px solid #eee;"><strong>نام مدیر منطقه:</strong></td>
                                <td style="padding: 5px; border-bottom: 1px solid #eee;">${managerInfo.ModireMantagheTXT || 'نامشخص'}</td>
                            </tr>
                            <tr>
                                <td style="padding: 5px; border-bottom: 1px solid #eee;"><strong>آدرس:</strong></td>
                                <td style="padding: 5px; border-bottom: 1px solid #eee;">${managerInfo.Address || 'نامشخص'}</td>
                            </tr>
                            <tr>
                                <td style="padding: 5px; border-bottom: 1px solid #eee;"><strong>منطقه:</strong></td>
                                <td style="padding: 5px; border-bottom: 1px solid #eee;">${managerInfo.GZone || 'نامشخص'}</td>
                            </tr>
                        </table>
                    </div>`;

                // اضافه کردن پاپ‌آپ به چندضلعی
                polygon.bindPopup(popupContent, {
                    className: 'custom-popup',
                    maxWidth: 400,
                    closeButton: true,
                    closeOnClick: true
                });

                // نمایش پاپ‌آپ به صورت خودکار
                polygon.openPopup();
            }
        });
    }

    // تابع cod_post برای نمایش اطلاعات کد پستی
    cod_post(l1, l2, map) {
        let base_point = [];
        base_point.push(parseFloat(l1), parseFloat(l2));

        let codepo1 = [];
        const Url_domainPost = 'https://gis.gandomcs.com/arcgis/rest/services/';
        let urlpost = `${Url_domainPost}IR26/MapServer/identify?geometryType=esriGeometryPoint&` + 'layers=ID:6' +
            '&tolerance=1&mapExtent=46.5,34.2,46.6,34.1&imageDisplay=80,80,80&f=json&geometry=' + base_point;
        console.log("prosti >>>>>>. ", urlpost);
        $.getJSON(urlpost, (data) => {

            if (data.results.length == 0) {
                alert('خارج از محدوده');
                return [1];
            }

            for (let i = 0; i < data.results.length; i++) {
                let post2 = data.results[i].attributes.gasht_name;
                let cname = data.results[i].attributes.cname;
                let costan = data.results[i].attributes.cshrs;
                let area1 = data.results[i].attributes.Shape_Area;
                let c = (area1 / 10000).toFixed(2);
                let costn = data.results[i].attributes.costn;
                let ccode = data.results[i].attributes.ccode;

                var sums123 = data.results[i].geometry.rings[0];
                let ar2 = [];
                for (let val of sums123) {
                    var li1 = [val[1], val[0]];
                    ar2.push(li1);
                }

                var bulletRedMarker = L.polygon(ar2, {
                    fillColor: "#321ee4",
                    fillOpacity: 0.2,
                    opacity: 0.4,
                    weight: 3,
                    color: "#000"
                }).addTo(map).bindPopup(`
                    <div style="direction: rtl; text-align: right; font-family: Vazir;">
                        <h6 style="color: #2c3e50; margin-bottom: 10px;">اطلاعات کد پستی</h6>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 5px; border-bottom: 1px solid #eee;"><strong>کد پستی:</strong></td>
                                <td style="padding: 5px; border-bottom: 1px solid #eee;">${post2}</td>
                            </tr>
                            <tr>
                                <td style="padding: 5px; border-bottom: 1px solid #eee;"><strong>نام منطقه:</strong></td>
                                <td style="padding: 5px; border-bottom: 1px solid #eee;">${cname}</td>
                            </tr>
                            <tr>
                                <td style="padding: 5px; border-bottom: 1px solid #eee;"><strong>استان:</strong></td>
                                <td style="padding: 5px; border-bottom: 1px solid #eee;">${costan}</td>
                            </tr>
                            <tr>
                                <td style="padding: 5px; border-bottom: 1px solid #eee;"><strong>شهر:</strong></td>
                                <td style="padding: 5px; border-bottom: 1px solid #eee;">${costn}</td>
                            </tr>
                            <tr>
                                <td style="padding: 5px; border-bottom: 1px solid #eee;"><strong>کد شهر:</strong></td>
                                <td style="padding: 5px; border-bottom: 1px solid #eee;">${ccode}</td>
                            </tr>
                            <tr>
                                <td style="padding: 5px; border-bottom: 1px solid #eee;"><strong>مساحت:</strong></td>
                                <td style="padding: 5px; border-bottom: 1px solid #eee;">${c} هکتار</td>
                            </tr>
                        </table>
                    </div>
                `);
            }
        });
    }

    // اضافه کردن متدهای کمکی به کلاس
    calculateBuffer(lng, lat, radius) {
        // تبدیل شعاع به درجه (تقریبی)
        const deg = radius * 0.01;
        return [
            (lng - deg).toFixed(6),
            (lat - deg).toFixed(6),
            (lng + deg).toFixed(6),
            (lat + deg).toFixed(6)
        ].join(',');
    }

    formatNumber(num) {
        return new Intl.NumberFormat('fa-IR').format(num);
    }

    showPopulationInfo(rectangle, population, households, area) {
        const popupContent = `
            <div style="direction: rtl; text-align: right; font-family: Vazir;">
                <h6 style="color: #2c3e50; margin-bottom: 10px;">اطلاعات کلی منطقه</h6>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 5px; border-bottom: 1px solid #eee;"><strong>جمعیت کل:</strong></td>
                        <td style="padding: 5px; border-bottom: 1px solid #eee;">${this.formatNumber(population)}</td>
                    </tr>
                    <tr>
                        <td style="padding: 5px; border-bottom: 1px solid #eee;"><strong>تعداد خانوار کل:</strong></td>
                        <td style="padding: 5px; border-bottom: 1px solid #eee;">${this.formatNumber(households)}</td>
                    </tr>
                    <tr>
                        <td style="padding: 5px; border-bottom: 1px solid #eee;"><strong>مساحت کل:</strong></td>
                        <td style="padding: 5px; border-bottom: 1px solid #eee;">${this.formatNumber(area)} هکتار مربع</td>
                    </tr>
                </table>
            </div>`;

        rectangle.bindPopup(popupContent, {
            className: 'custom-popup',
            maxWidth: 300,
            closeButton: true,
            closeOnClick: true
        }).openPopup();
    }

    servicemap() {//این درسته باشه
  
        L.Draw.codeposti = L.Draw.Marker.extend({
            statics: {
                TYPE: 'codeposti',
                title: "Draw a marker"
            },
            options: {
                repeatMode: false,
                zIndexOffset: 1000,
                title: 'post',
                marker: {
                    iconUrl: '/IMG/PopulationDensity.png',
                },
                iconSize: new L.Point(30, 30)
            },
            initialize: function (map, options) {
                this.type = L.Draw.codeposti.TYPE;
                L.Draw.Feature.prototype.initialize.call(this, map, options);
                this.title = 'as'
            }
        });
        L.Draw.abadi = L.Draw.Marker.extend({
            statics: {
                TYPE: 'abadi',
                title: "Draw a marker"
            },
            options: {
                repeatMode: false,
                zIndexOffset: 1000,
                title: 'post',
                // marker: {
                //     iconUrl: '/IMG/PopulationDensity.png',
                // },
                // iconSize: new L.Point(50, 30)
            },
            initialize: function (map, options) {
                this.type = L.Draw.abadi.TYPE;
                L.Draw.Feature.prototype.initialize.call(this, map, options);
                this.title = 'as'
            }
        });
        /*********** test */
        L.Draw.Modir = L.Draw.Marker.extend({
            statics: {
                TYPE: 'modir',
                title: "Draw a marker"
            },
            options: {
                repeatMode: false,
                zIndexOffset: 1000,
                title: 'modir',
            },
            initialize: function (map, options) {
                this.type = L.Draw.Modir.TYPE;
                L.Draw.Feature.prototype.initialize.call(this, map, options);
                this.title = 'as'
            }
    
        });
        L.Draw.Tarakom = L.Draw.Marker.extend({
            statics: {
                TYPE: 'tarakom',
                title: 'tarakom',
            },
            options: {
                repeatMode: false,
                zIndexOffset: 1000,
                title: 'tarakom',
            },
            initialize: function (map, options) {
                this.type = L.Draw.Tarakom.TYPE;
                L.Draw.Feature.prototype.initialize.call(this, map, options);
            }
        });
    
        L.Draw.OtherService = L.Draw.Marker.extend({
            statics: {
                TYPE: 'otherService',
                title: 'otherService',
            },
            options: {
                repeatMode: false,
                zIndexOffset: 1000,
                title: 'otherService',
            },
    
            initialize: function (map, options) {
                this.type = L.Draw.OtherService.TYPE;
                L.Draw.Feature.prototype.initialize.call(this, map, options);
            }
    
        });
    
        L.DrawToolbar.prototype.options = {
            marker: {},
            modir: {}, codeposti: {}, abadi: {},
            tarakom: {},
            OtherService: {}
        };
    
        L.DrawToolbar.prototype.getModeHandlers = function (map) {
            return [
                {
                enabled: this.options.rectangle,
                handler: new L.Draw.Rectangle(map, this.options.rectangle),
                title: 'فروشگاههای'
            },
            {
                enabled: this.options.marker,
                handler: new L.Draw.Marker(map, this.options.marker),
                title: 'مسیر دسترسی '
            },
            {
                enabled: this.options.modir,
                handler: new L.Draw.Modir(map, this.options.modir),
                title: 'مدیران مناطق'
            
            },
            {
                enabled: this.options.tarakom,
                handler: new L.Draw.Tarakom(map, this.options.tarakom),
                title: 'تراکم جمعیت',
            },
            {
                enabled: this.options.OtherService,
                handler: new L.Draw.OtherService(map, this.options.OtherService),
                title: 'همه کسب و کارها',
                // title: L.drawLocal.draw.toolbar.buttons.supermarket
            },
            {
                enabled: this.options.codeposti,
                handler: new L.Draw.codeposti(map, this.options.codeposti),
                title: 'کد پستی',
                // title: L.drawLocal.draw.toolbar.buttons.modir
            },
            {
                enabled: this.options.abadi,
                handler: new L.Draw.abadi(map, this.options.abadi),
                title: 'آبادی  ',
                // title: L.drawLocal.draw.toolbar.buttons.modir
            }
            ];
        };
    
        /********** Old */
    
        var drawOptions = {
            position: 'topleft',
            draw: {
                polygon: {
                    shapeOptions: {
                        color: '#564638'
                    }
                },
                polyline: true,
                circle: true,
                marker: true,
                rectangle: true
            }
        };
        var drawControl = new L.Control.Draw(drawOptions);
        this.map.addControl(drawControl);
    }

    // تابع ترسیم محدوده دهستان و دریافت اطلاعات آن
    drawDistrict(latitude, longitude, map) {
        const coordinates = `${longitude},${latitude}`;
        const baseUrl = `https://gis.gandomcs.com/arcgis/rest/services/deh/MapServer/identify?geometry=${coordinates}&geometryType=esriGeometryPoint&sr=&layers=ID%3A1&tolerance=0&mapExtent=45%2C25%2C61%2C40&imageDisplay=800%2C600%2C96&returnGeometry=true&returnZ=false&returnM=false&f=pjson`;

        $.getJSON(baseUrl, (data) => {
            if (!data.results?.length) return;

            data.results.forEach(result => {
                const {
                    F_AREA: area,
                    ostan: provinceName,
                    shahrestan: cityName,
                    bakhsh: districtName,
                    shrdeh: villageDistrictName,
                    COUNT_: villageCount,
                    FID: districtId,
                    Household: householdCount = 0,
                    Population: population = 0
                } = result.attributes;

                // فراخوانی تابع نمایش آبادی‌ها
                this.drawVillages(districtId, map);

                // تبدیل و فرمت‌بندی مساحت به هکتار
                const areaInHectares = area / 10000;
                const formattedArea = new Intl.NumberFormat('fa-IR').format(Math.round(areaInHectares));

                // محاسبه و فرمت‌بندی تراکم جمعیت
                const actualPopulation = (population === 'Null' || population === null) ? 0 : population;
                const populationDensity = areaInHectares > 0 ? (actualPopulation / areaInHectares) : 0;
                const formattedDensity = new Intl.NumberFormat('fa-IR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }).format(populationDensity);

                // متن پاپ‌آپ دهستان
                const popupContent = `
                    <div class="district-popup" dir="rtl">
                        <div class="location-info">
                            <strong>موقعیت:</strong> ${provinceName.trim()} / ${cityName}
                        </div>
                        <div class="district-info">
                            <strong>دهستان:</strong> ${villageDistrictName}
                        </div>
                        <div class="stats-info">
                            <div><strong>مساحت:</strong> ${formattedArea} هکتار</div>
                            <div><strong>جمعیت:</strong> ${actualPopulation} نفر</div>
                            <div><strong>خانوار:</strong> ${householdCount}</div>
                            <div><strong>تعداد آبادی:</strong> ${villageCount}</div>
                            <div><strong>تراکم جمعیت:</strong> ${formattedDensity} نفر در هکتار</div>
                        </div>
                    </div>
                `;

                // ترسیم محدوده دهستان
                const polygonCoordinates = result.geometry.rings.map(ring =>
                    ring.map(([x, y]) => [y, x])
                );

                polygonCoordinates.forEach(coords => {
                    L.polygon(coords, {
                        color: '#5050FF',
                        weight: 1,
                        opacity: 0.5,
                        fillOpacity: 0.4
                    })
                    .bindPopup(popupContent)
                    .addTo(map);
                });
            });
        });
    }

    // تابع نمایش آبادی‌های دهستان
    drawVillages(districtId, map) {
        const baseUrl = `https://gis.gandomcs.com/arcgis/rest/services/deh/MapServer/find?searchText=${districtId}&contains=false&searchFields=NEAR_FID&layers=ID:2&returnGeometry=true&f=pjson`;

        $.getJSON(baseUrl, (data) => {
            if (!data.results?.length) return;

            const url_path = '/IMG/';
                
            const icons = {
                populated: L.icon({
                    iconUrl: url_path + 'vilage1.png',
                    iconSize: [15, 20],
                    popupAnchor: [0, 0]
                }),
                empty: L.icon({
                    iconUrl: url_path + 'vlag1.png',
                    iconSize: [12, 16],
                    popupAnchor: [0, 0]
                })
            };

            data.results.forEach(result => {
                const {
                    "بقالي": groceryCount,
                    "فروشگاه تعاوني": coopStoreCount,
                    "نانوايي": bakeryCount,
                    "گوشت فروشي": butcheryCount,
                    "خانوار": householdCount = 0,
                    "جمعيت": population = 0
                } = result.attributes;

                // انتخاب آیکون بر اساس جمعیت
                const icon = (population === 'Null' || population === null) ? icons.empty : icons.populated;

                // متن پاپ‌آپ آبادی
                const popupContent = `
                    <div class="village-popup" dir="rtl">
                        <div class="facilities">
                            <div><strong>فروشگاه تعاونی:</strong> ${coopStoreCount}</div>
                            <div><strong>بقالی:</strong> ${groceryCount}</div>
                            <div><strong>نانوایی:</strong> ${bakeryCount}</div>
                            <div><strong>گوشت فروشی:</strong> ${butcheryCount}</div>
                        </div>
                        <div class="population-info">
                            <div><strong>جمعیت:</strong> ${population === 'Null' ? 0 : population}</div>
                            <div><strong>خانوار:</strong> ${householdCount === 'Null' ? 0 : householdCount}</div>
                        </div>
                    </div>
                `;

                // ایجاد مارکر آبادی
                const { x, y } = result.geometry;
                L.marker([y, x], { icon })
                    .bindPopup(popupContent)
                    .addTo(map);
            });
        });
    }

    async   Draw_abdi(idcode, map) {
        const baseUrl = `https://gis.gandomcs.com/arcgis/rest/services/deh/MapServer/find?searchText=${idcode}&contains=false&searchFields=NEAR_FID&sr=&layers=ID%3A2&layerDefs=&returnGeometry=true&maxAllowableOffset=&geometryPrecision=&dynamicLayers=&returnZ=false&returnM=false&gdbVersion=&f=pjson`;
        console.log('---Abadi---', baseUrl);
        let total_khan = 0, total_pop = 0;
    
        try {
            let icons;
            try {

                const url_path = '/IMG/';
                
                icons = {
                    populated: L.icon({
                        iconUrl: url_path + 'vlag01.png',
                        iconSize: [15, 20],
                        popupAnchor: [0, 0]
                    }),
                    empty: L.icon({
                        iconUrl: url_path + 'vlag1.png',
                        iconSize: [12, 16],
                        popupAnchor: [0, 0]
                    })
                };
            } catch (error) {
                console.error('خطا در ایجاد آیکون‌ها:', error);
            }
    
            const response = await fetch(baseUrl);
            if (!response.ok) throw new Error('پاسخ شبکه مناسب نبود');
    
            const json = await response.json();
            if (json.results?.length > 0) {
                json.results.forEach(result => {
                    var { "بقالي": bagali, "فروشگاه تعاوني": tavon, "نانوايي": nanva, "گوشت فروشي": gosht, "خانوار": Khanevar = 0, "جمعيت": Populat = 0 } = result.attributes;
                    let icon = (Populat === 'Null' || Populat == null) ? icons.empty : icons.populated;
                    if (Populat == 'Null') {
                        Populat = 0;
                        Khanevar = 0;
                        icon = icons.empty;
                    }
                    const txt1 = `<span style="color: blue; font-size: 10px;">   فروشگاه تعاوني: ${tavon}  <br /> بقالي: ${bagali} <br /> نانوايي: ${nanva}  <br /> گوشت فروشي: ${gosht}</span> <br /> <span style="color: red; font-size: 12px;"> جمعیت :  ${Populat} </span> <br /> خانوار: ${Khanevar}`;
    
                    let po1 = result.geometry;
                    const swapped = [po1.y, po1.x];
                    L.marker(swapped, { icon }).addTo(map).bindPopup(txt1);
    
                });
            }
        } catch (error) {
            console.error('خطای Fetch:', error);
            return false;
        }
        // console.log(total_khan, '-------------------', total_pop);
    }

    // تابع بهینه‌سازی شده برای شمارش و نمایش مکان‌های نزدیک
    async count_other(longitude, latitude, textRadius, map, subcategory, radius) {
        const API_KEY = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjU4MzE0NjhkZjVkNmFiYTJlNGU5ZDI4OGNiMTNjMTE0ODFiZWE0OGIyMWNkOTk2YTIzYjZiMmVmNzMwNmI5Zjk1ZDhkNWJkNGI2ZmM5YzBlIn0.eyJhdWQiOiIxNTQ3MCIsImp0aSI6IjU4MzE0NjhkZjVkNmFiYTJlNGU5ZDI4OGNiMTNjMTE0ODFiZWE0OGIyMWNkOTk2YTIzYjZiMmVmNzMwNmI5Zjk1ZDhkNWJkNGI2ZmM5YzBlIiwiaWF0IjoxNjM1NjcwODk3LCJuYmYiOjE2MzU2NzA4OTcsImV4cCI6MTYzNjk2Njg5Nywic3ViIjoiIiwic2NvcGVzIjpbImJhc2ljIl19.A0QqpSc1tEdQvS2ns5hdgMUhri9-6zXShhrlqOtE4Ve5gSQ4xk0z-nu1N0bFzfvDhW5LTn6scKf5YVbZ6MeUqSOuc8K7vm2xlH6ywJP4XJrMK4U3NlAT3WG3FL_IieEoetckxtjSEDt_qjkN0iX5GkEEka6EeZuSCJcroYB5VETGAkw14KziZK52zJ9CGHMOaoLUGschBvyHa916o7pDJx96KQrvmH-fHRJqbdz6EUJXkwjO9hS-GXl2acIi_nqCFRoU4iIPoZELVhUnts8qi8Tb9DiO4k0KCitbc9l5A3xTzUikhz8bJtMep24btIgutLS0DQz-nkVvlAc-PPnt1Q'; 
        try {
            // نمایش مارکر موقعیت انتخاب شده
            this.addLocationMarker(longitude, latitude, map);
            
            // ساخت URL درخواست
            const url = `https://map.ir/places/count?$filter=lat eq ${latitude} and lon eq ${longitude} and subcategory eq ${subcategory} and buffer eq ${radius}km`;
            
            // انجام درخواست با استفاده از jQuery
            const response = await $.ajax({
                type: 'GET',
                url: url,
                headers: {
                    'x-api-key': API_KEY,
                    'content-type': 'application/json'
                },
                error: function(xhr, status, error) {
                    if (xhr.status === 401) {
                        console.error(`خطای اعتبارسنجی برای ${subcategory}:`, error);
                        return;
                    }
                    if (xhr.status === 500) {
                        console.error(`خطای سرور برای ${subcategory}:`, error);
                        return;
                    }
                    console.log(`خطای ناشناخته برای ${subcategory}:`, error);
                }
            });

            if (!response?.data?.count) {
                console.log(`هیچ نتیجه‌ای برای ${subcategory} یافت نشد`);
                return;
            }

            // دریافت تعداد کل نتایج
            const totalCount = response.data.count;

            // دریافت نتایج به صورت صفحه‌بندی شده
            const batchSize = 20;
            for (let offset = 0; offset < totalCount; offset += batchSize) {
                await this.fetchLocationDetails(longitude, latitude, offset, map, subcategory, radius, API_KEY);
            }
            
            console.log(`تمام ${totalCount} مکان برای دسته ${subcategory} با موفقیت نمایش داده شد`);

        } catch (error) {
            // مدیریت خطاها به صورت جداگانه
            if (error.status === 401) {
                console.error('خطای اعتبارسنجی - لطفا API key را بررسی کنید');
            } else if (error.status === 500) {
                console.error('خطای سرور - لطفا بعداً تلاش کنید');
            } else {
                console.log('خطا در دریافت اطلاعات مکان‌ها:', error);
            }
        }
    }

    // تابع کمکی برای دریافت جزئیات مکان‌ها
    async fetchLocationDetails(longitude, latitude, offset, map, subcategory, radius, API_KEY) {
        try {
            const url = `https://map.ir/places/list?$top=20&$skip=${offset}&$filter=lat eq ${latitude} and lon eq ${longitude} and subcategory eq ${subcategory} and buffer eq ${radius}km and sort eq true`;
            console.log('-ط--', url);
            const response = await $.ajax({
                type: 'GET',
                url: url,
                headers: {
                    'x-api-key': API_KEY,
                    'content-type': 'application/json'
                }
            });

            if (!response?.value) return;

            // پردازش و نمایش نتایج
            Object.values(response.value).forEach(location => {
                if (!location?.location?.coordinates) return;

                const [lng, lat] = location.location.coordinates;
                const name = location.name || subcategory;
                const address = location.address || 'آدرس موجود نیست';
                const distance = location.distance?.[0] ? `${location.distance[0].toFixed(0)} متر` : 'نامشخص';

                // افزودن مارکر به نقشه
                L.marker([lat, lng], { 
                    icon: this.geticon(subcategory)
                })
                .addTo(map)
                .bindPopup(`
                    <div style="direction: rtl; text-align: right;">
                        <strong>${name}</strong><br>
                        ${address}<br>
                        فاصله: ${distance}
                    </div>
                `);
            });

        } catch (error) {
            console.error(`خطا در دریافت جزئیات برای ${subcategory}:`, error);
        }
    }

    // تابع کمکی برای نمایش مکان روی نقشه
    addLocationToMap(location, map) {
        if (!location.location?.coordinates) return;

        const icon = L.divIcon({
            html: '<i class="fas fa-building" style="color: #4444FF; font-size: 18px;"></i>',
            className: 'location-marker',
            iconSize: [18, 18],
            iconAnchor: [9, 18]
        });

        const [lng, lat] = location.location.coordinates;
        
        L.marker([lat, lng], { icon })
            .addTo(map)
            .bindPopup(`
                <div style="direction: rtl; text-align: right;">
                    <strong>${location.title || 'بدون نام'}</strong><br>
                    ${location.address || 'آدرس موجود نیست'}<br>
                    فاصله: ${(location.distance || 0).toFixed(2)} متر
                </div>
            `);
    }

    // تابع کمکی برای تعیین آیکون بر اساس دسته‌بندی
    geticon(category) {
        const icons = {
            'hospital': L.divIcon({
                html: '<i class="fas fa-hospital" style="color: #FF4444;"></i>',
                className: 'category-marker hospital',
                iconSize: [24, 24]
            }),
            'school': L.divIcon({
                html: '<i class="fas fa-school" style="color: #4444FF;"></i>',
                className: 'category-marker school',
                iconSize: [24, 24]
            }),
            'bus_station': L.divIcon({
                html: '<i class="fas fa-bus" style="color: #44FF44;"></i>',
                className: 'category-marker bus',
                iconSize: [24, 24]
            }),
            'mosque': L.divIcon({
                html: '<i class="fas fa-mosque" style="color: #44FF44;"></i>',
                className: 'category-marker mosque',
                iconSize: [24, 24]
            }),
            'bank': L.divIcon({
                html: '<i class="fas fa-university" style="color: #FFFF44;"></i>',
                className: 'category-marker bank',
                iconSize: [24, 24]
            }),
            'supermarket': L.divIcon({
                html: '<i class="fas fa-shopping-cart" style="color: #FF44FF;"></i>',
                className: 'category-marker supermarket',
                iconSize: [24, 24]
            }),
            'default': L.divIcon({
                html: '<i class="fas fa-map-marker-alt" style="color: #888888;"></i>',
                className: 'category-marker default',
                iconSize: [24, 24]
            })
        };

        return icons[category] || icons.default;
    }

    // اضافه کردن CSS برای پاپ‌آپ‌ها
    addCustomStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .custom-popup {
                direction: rtl;
                font-family: Vazir, sans-serif;
            }
            .custom-popup .leaflet-popup-content {
                margin: 8px 10px;
            }
            .category-marker {
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .category-marker i {
                font-size: 24px;
                text-shadow: 2px 2px 2px rgba(0,0,0,0.2);
            }
        `;
        document.head.appendChild(style);
    }

    addLocationMarker(longitude, latitude, map) {
        const icon = L.divIcon({
            html: '<i class="fas fa-map-marker-alt" style="color: #FF0000; font-size: 24px;"></i>',
            className: 'location-marker',
            iconSize: [24, 24],
            iconAnchor: [12, 24]
        });

        L.marker([latitude, longitude], { icon })
            .addTo(map)
            .bindPopup(`
                <div style="direction: rtl; text-align: right;">
                    <strong>موقعیت انتخاب شده</strong><br>
                    عرض جغرافیایی: ${latitude}<br>
                    طول جغرافیایی: ${longitude}
                </div>
            `);
    }
} 