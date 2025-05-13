// import * as L from 'leaflet';
import icons from '../assets/js/icons.js';
import { categoryIcons } from '../assets/js/icons.js';

/**
 * کلاس GandomMap برای مدیریت و نمایش نقشه تعاملی
 * این کلاس شامل توابع مختلف برای مدیریت لایه‌ها، مارکرها و کنترل‌های نقشه است
 */
export class GandomMap1 {
    /**
     * سازنده کلاس GandomMap
     * @param {string} containerId - شناسه المان HTML که نقشه در آن رندر می‌شود
     */
    constructor(containerId) {
        // تنظیمات اولیه نقشه
        // ... existing constructor code ...
        this.userMarker = null; // اضافه کردن متغیر برای ذخیره مارکر کاربر
        this.containerId = containerId;
        this.map = null;
        this.layers = new Map();
        this.baseLayer = null;
        this.markers = [];
        this.currentBaseLayer = null;
        this.listmaarker = []; // آرایه برای نگهداری لیست مارکرها
        this.araypoint1 = [];
        this.API_KEY = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjU4MzE0NjhkZjVkNmFiYTJlNGU5ZDI4OGNiMTNjMTE0ODFiZWE0OGIyMWNkOTk2YTIzYjZiMmVmNzMwNmI5Zjk1ZDhkNWJkNGI2ZmM5YzBlIn0.eyJhdWQiOiIxNTQ3MCIsImp0aSI6IjU4MzE0NjhkZjVkNmFiYTJlNGU5ZDI4OGNiMTNjMTE0ODFiZWE0OGIyMWNkOTk2YTIzYjZiMmVmNzMwNmI5Zjk1ZDhkNWJkNGI2ZmM5YzBlIiwiaWF0IjoxNjM1NjcwODk3LCJuYmYiOjE2MzU2NzA4OTcsImV4cCI6MTYzNjk2Njg5Nywic3ViIjoiIiwic2NvcGVzIjpbImJhc2ljIl19.A0QqpSc1tEdQvS2ns5hdgMUhri9-6zXShhrlqOtE4Ve5gSQ4xk0z-nu1N0bFzfvDhW5LTn6scKf5YVbZ6MeUqSOuc8K7vm2xlH6ywJP4XJrMK4U3NlAT3WG3FL_IieEoetckxtjSEDt_qjkN0iX5GkEEka6EeZuSCJcroYB5VETGAkw14KziZK52zJ9CGHMOaoLUGschBvyHa916o7pDJx96KQrvmH-fHRJqbdz6EUJXkwjO9hS-GXl2acIi_nqCFRoU4iIPoZELVhUnts8qi8Tb9DiO4k0KCitbc9l5A3xTzUikhz8bJtMep24btIgutLS0DQz-nkVvlAc-PPnt1Q';

        this.timeall = [];
        // تعریف لایه‌های پایه نقشه
        this.baseMaps = {
            // لایه OpenStreetMap
            osm: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 20,
                attribution: '© OpenStreetMap contributors'
            }),
            // لایه تصاویر ماهواره‌ای
            satellite: L.tileLayer('http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}', {
                maxZoom: 21,
                attribution: '© Esri'
            }),
            // لایه توپوگرافی
            terrain: L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
                maxZoom: 17,
                attribution: '© OpenTopoMap'
            })
        };

        // راه‌اندازی دکمه حذف و استایل‌های سفارشی
        this.initTrashButton();
        this.addCustomStyles();
        this.gandompoint1 = new L.layerGroup(); // تعریف لایه گروه
    }

    /**
     * راه‌اندازی اولیه نقشه
     * تنظیم موقعیت اولیه، زوم و اضافه کردن کنترل‌های مختلف
     */
    init() {
        // ایجاد نقشه با تنظیمات اولیه
        this.map = L.map(this.containerId, {
            center: [32.4279, 53.6880], // مرکز ایران
            zoom: 6,
            zoomControl: false
        });

        // اضافه کردن کنترل زوم در گوشه بالا سمت چپ
        L.control.zoom({
            position: 'topleft'
        }).addTo(this.map);

        // تنظیم لایه پایه پیش‌فرض
        this.setBaseMap('osm');

        // راه‌اندازی کنترل‌های مختلف
        this.initBaseMapControls();
        this.addRulerControl();
        this.addSearchControl();
        this.addlayerlist();
        this.iconservice();
        this.chech_chekbox();

        // بارگذاری فروشگاه‌های گندم
        this.loadGandomStores();
    }

    /**
     * بارگذاری و نمایش فروشگاه‌های گندم روی نقشه
     */
    async loadGandomStores() {
        const url_rest = 'https://gis.gandomcs.com/arcgis/rest/services/IR22/MapServer/5/query?where=%28Longitude+is+not+null%29+and+%28Latitude+is+not+null%29&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=StoreName%2CStoreStatus%2CLongitude%2CLatitude%2CGZone%2CStoreCode&returnGeometry=true&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&returnTrueCurves=false&resultOffset=&resultRecordCount=&f=pjson';

        try {
            const response = await fetch(url_rest, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                }
            });

            if (!response.ok) {
                throw new Error(`Error fetching data: ${response.statusText}`);
            }

            const data = await response.json();
            const features = data.features;

            await Promise.all(features.map((feature) => {
                const lat = parseFloat(feature.attributes.Latitude);
                const lng = parseFloat(feature.attributes.Longitude);

                // اعتبارسنجی مختصات - فقط نقاط داخل محدوده مجاز
                if (lat < 23 || lat > 41 || lng < 43 || lng > 64) {
                    return; // مختصات خارج از محدوده مجاز
                }

                const storeName = feature.attributes.StoreName;
                const storeStatus = feature.attributes.StoreStatus;
                const maketcode = feature.attributes.StoreCode;
                const mantageh1 = feature.attributes.GZone;

                const icong = this.getStoreIcon(storeStatus);
                const statusConfig = this.getStoreStatusConfig(storeStatus);

                let txt1 = '<div style="text-align: right; direction: rtl;">' +
                    mantageh1 + '</br><b>' + storeName + '</br>کد فروشگاه: ' + maketcode +
                    ' - <span style="color:' + statusConfig.color + ';"> ' + storeStatus + '</span>' +
                    '</div>';

                // اضافه کردن مارکر به لایه گروه gandompoint1
                L.marker([lat, lng], { icon: icong }).bindPopup(`${txt1}`).addTo(this.gandompoint1);
            }));

            // اضافه کردن لایه به نقشه با وضعیت مخفی
            this.addLayer('gandom_stores', this.gandompoint1, { visible: false });

            return data;
        } catch (error) {
            console.error('Error fetching Gandom stores data:', error);
            return [];
        }
    }

    /**
     * راه‌اندازی کنترل‌های نقشه پایه
     * مدیریت دکمه‌های تغییر لایه پایه و منوی مربوطه
     */
    initBaseMapControls() {
        const toggleButton = document.querySelector('.basemap-toggle');
        const menu = document.querySelector('.basemap-menu');

        if (!toggleButton || !menu) {
            console.error('Base map controls not found in DOM');
            return;
        }

        // مدیریت رویداد کلیک روی دکمه تغییر لایه
        toggleButton.addEventListener('click', (e) => {
            e.stopPropagation();
            menu.classList.toggle('show');
        });

        // بستن منو با کلیک خارج از آن
        document.addEventListener('click', (e) => {
            if (!toggleButton.contains(e.target) && !menu.contains(e.target)) {
                menu.classList.remove('show');
            }
        });

        // مدیریت رویداد تغییر لایه پایه
        const radioButtons = document.querySelectorAll('.basemap-option input[type="radio"]');
        radioButtons.forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.setBaseMap(e.target.value);
                menu.classList.remove('show');
            });
        });
    }

    /**
     * تنظیم لایه پایه نقشه
     * @param {string} type - نوع لایه پایه (osm, satellite, terrain)
     */
    setBaseMap(type) {
        // حذف لایه فعلی در صورت وجود
        if (this.currentBaseLayer) {
            this.map.removeLayer(this.currentBaseLayer);
        }

        // اضافه کردن لایه جدید
        this.currentBaseLayer = this.baseMaps[type];
        this.map.addLayer(this.currentBaseLayer);
        this.currentBaseLayer.bringToBack();
    }

    /**
     * اضافه کردن کنترل جستجو به نقشه
     * با پشتیبانی از زبان فارسی
     */
    addSearchControl() {
        const searchControl = new L.Control.Geocoder({
            position: 'topleft',
            placeholder: 'جستجوی مکان...',
            errorMessage: 'مکانی یافت نشد.',
            defaultMarkGeocode: true,
            geocoder: new L.Control.Geocoder.Nominatim({
                language: 'fa'
            })
        }).addTo(this.map);

        // تنظیم رویداد برای نمایش نتیجه جستجو
        searchControl.on('markgeocode', (e) => {
            const center = e.geocode.center;
            this.map.setView(center, 13);
        });
    }

    /**
     * اضافه کردن کنترل خط‌کش به نقشه
     * برای اندازه‌گیری فاصله و زاویه
     */
    addRulerControl() {
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
    initLayerToggleButton() {
        const toggleButton = document.querySelector('.toggle-layers');
        const layerContainer = document.querySelector('.layer-container');
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

    /**
     * اضافه کردن لایه به نقشه
     * @param {string} id - شناسه یکتای لایه
     * @param {L.Layer} layer - لایه مورد نظر
     * @param {Object} options - تنظیمات اضافی
     */
    addLayer(id, layer, options = {}) {
        this.layers.set(id, layer);
        if (options.visible) {
            layer.addTo(this.map);
        }
    }

    /**
     * حذف لایه از نقشه
     * @param {string} id - شناسه لایه
     */
    removeLayer(id) {
        const layer = this.layers.get(id);
        if (layer) {
            this.map.removeLayer(layer);
            this.layers.delete(id);
        }
    }

    /**
     * اضافه کردن مارکر به نقشه
     * @param {L.LatLng} latlng - موقعیت جغرافیایی مارکر
     */
    addMarker(latlng) {
        const marker = L.marker(latlng).addTo(this.map);
        this.markers.push(marker);
    }

    /**
     * حذف مارکر از نقشه
     * @param {string} id - شناسه مارکر
     */
    removeMarker(id) {
        const marker = this.markers.get(id);
        if (marker) {
            this.map.removeLayer(marker);
            this.markers.delete(id);
        }
    }

    /**
     * پاک کردن تمام مارکرها از نقشه
     */
    clearMarkers() {
        this.markers.forEach(marker => {
            this.map.removeLayer(marker);
        });
        this.markers = []; // پاک کردن آرایه مارکرها
    }

    /**
     * تنظیم محدوده دید نقشه
     * @param {L.LatLngBounds} bounds - محدوده جغرافیایی
     */
    fitBounds(bounds) {
        this.map.fitBounds(bounds);
    }

    /**
     * تنظیم مرکز و زوم نقشه
     * @param {L.LatLng} latlng - موقعیت جغرافیایی مرکز
     * @param {number} zoom - سطح زوم
     */
    setView(latlng, zoom) {
        this.map.setView(latlng, zoom);
    }

    /**
     * تغییر وضعیت نمایش لایه
     * @param {string} layerId - شناسه لایه
     * @param {boolean} visible - وضعیت نمایش
     */
    async toggleLayer(layerId, visible) {

        if (layerId === 'gandom_stores') {
            if (visible) {
                // نمایش لایه فروشگاه‌های گندم
                if (this.gandompoint1) {
                    this.gandompoint1.addTo(this.map);
                }
            } else {
                // مخفی کردن لایه فروشگاه‌های گندم
                if (this.gandompoint1) {
                    this.map.removeLayer(this.gandompoint1);
                }
            }
            return;
        }

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
            this.clearMap(map);
            // حذف تمام نشانگرهای gandompoint1            
            if (this.map && this.gandompoint1) {
                this.map.removeLayer(this.gandompoint1);
            } else {
                console.warn("نقشه یا نشانگرها موجود نیستند");
            }
        } catch (error) {
            console.error("خطا در حذف نشانگرها:", error);
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
            "سپه": SepahEditableLayers,
        };

        L.control.layers(null, drawingLayers, { position: 'topleft', collapsed: false }).addTo(this.map);

        var drawControl = new L.Control.Draw({
            // ... rest of the drawing control configuration ...
        });

        // ... rest of the existing code ...
    }

    chech_chekbox() {
        const self = this;
        const checkboxes = document.querySelectorAll("[class='leaflet-control-layers-selector']");
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', async function (event) {
                const layerName = this.parentNode.textContent.trim();
                // گندم همچنان از سرویس قبلی استفاده می‌کند
                if (layerName === "گندم") {
                    if (this.checked) {
                        self.map.addLayer(self.gandompoint1);
                    } else {
                        self.map.removeLayer(self.gandompoint1);
                    }
                    return;
                }

                try {
                    // اگر گروه‌های فروشگاهی هنوز دریافت نشده‌اند
                    if (!self.storeGroups) {
                        self.storeGroups = await self.fetchAllStores();
                        if (!self.storeGroups) {
                            console.error('خطا در دریافت گروه‌های فروشگاهی');
                            return;
                        }
                    }

                    // نمایش یا مخفی کردن لایه مربوطه
                    const group = self.storeGroups[layerName];
                    if (group) {
                        if (this.checked) {
                            self.map.addLayer(group);
                        } else {
                            self.map.removeLayer(group);
                            console.log('لایه حذف شد:', layerName);
                        }
                    } else {
                        console.log('گروه مورد نظر پیدا نشد:', layerName);
                    }
                } catch (error) {
                    console.error('خطا در مدیریت لایه‌ها:', error);
                }
            });
        });
    }

    // تابع جدید برای پاک کردن داده‌های لایه
    clearLayerData(layerId) {
        // پاک کردن داده‌های لایه مربوطه
        if (this.layers.has(layerId)) {
            const layer = this.layers.get(layerId);
            this.map.removeLayer(layer);
            this.layers.delete(layerId);
        }
    }

    initTrashButton() {
        const trashButton = document.getElementById('trash-button');
        if (!trashButton) {
            console.error('Trash button not found');
            return;
        }
        trashButton.addEventListener('click', () => {
            // حذف تمام لایه‌های انتخاب شده
            this.clearAllMarkers();
            this.cclearMap(this.map);

            // لغو انتخاب تمام چک‌باکس‌ها
            const layerCheckboxes = document.querySelectorAll('.leaflet-control-layers-selector');
            layerCheckboxes.forEach(checkbox => {
                checkbox.checked = false;
            });
        });
    }

    cclearMap(map) {
        var i = 0;
        for (i in map._layers) {

            if ((map._layers[i]._path != undefined) || (map._layers[i]._icon != undefined)) {
                var lay1 = map._layers[i];

                try { map.removeLayer(map._layers[i]); } catch (e) {
                    console.log("problem with " + e + m._layers[i]);
                }
            }
        }
    }

    /**
     * پاک کردن تمام لایه‌ها از نقشه
     */
    clearMap() {
        if (this.map) {
            this.map.eachLayer((layer) => {
                if (layer instanceof L.Marker) {
                    this.map.removeLayer(layer);
                }
            });
        }
    }

    iconservice() {
        if (!this.map) return;
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
                        title: 'فروشگاه ها',
                        action: () => {


                            const rectangleDrawer = new L.Draw.Rectangle(map, {
                                shapeOptions: {
                                    color: '#00FF5577',
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
                                this.Draw_buffer(latlng.lng, latlng.lat, radius, map);
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
                                this.cclearMap(map);
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
                            this.cclearMap(map);
                            map.once(L.Draw.Event.CREATED, async (e) => {
                                const marker = e.layer;
                                const latlng = marker.getLatLng();
                                await this.drawPopulationDensity(latlng, this.map);
                                map.removeLayer(marker); // حذف مارکر موقت
                            });
                        }
                    },
                    {
                        icon: 'fas fa-shopping-cart',
                        title: 'همه کسب و کارها',
                        action: () => {

                            let radius = prompt("              m" + ": لطفا شعاع را وارد کنید" + "(متر)", "1000");

                            if (radius === null || radius === "") {
                                // alert("لطفا شعاع را وارد کنید");
                                map.removeLayer(marker);
                                return;
                            }

                            radius = Number(radius);

                            if (isNaN(radius)) {
                                alert("لطفا یک عدد معتبر وارد کنید");
                                map.removeLayer(marker);
                                return;
                            }
                            if (radius < 100 || radius > 3000) {
                                alert("شعاع باید بین 100 تا 3000 متر باشد");
                                map.removeLayer(marker);
                                return;
                            }
                            this.cclearMap(map);
                            const markerDrawer = new L.Draw.Marker(map);
                            markerDrawer.enable();
                            map.once(L.Draw.Event.CREATED, async (e) => {

                                const marker = e.layer;
                                const latlng = marker.getLatLng();
                                let temp1 = await this.allbisinespoint(latlng, radius);
                            });
                        }
                    },
                    {
                        icon: 'fas fa-envelope',
                        title: 'کد پستی',
                        action: () => {
                            const markerDrawer = new L.Draw.Marker(map);
                            markerDrawer.enable();
                            this.cclearMap(map);

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
                            this.cclearMap(map);

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

    // Start help code

    async Draw_buffer(l1, l2, textRadius, map) {
        const Url_domain = 'https://gis.gandomcs.com/arcgis/rest/services/';
        let base_point = [];
        let data = [];
        var buffer = this.calculateBuffer(parseFloat(l1), parseFloat(l2), textRadius);
        base_point.push(parseFloat(l2), parseFloat(l1));
        var url_market = Url_domain + 'IR22/MapServer/identify?geometryType=esriGeometryEnvelope&' +
            'layers=id:0&tolerance=' + textRadius * 3 + '&mapExtent=50,40,55,33&imageDisplay=10000,10000,100&f=json&geometry=' + buffer;

        $.ajax({
            type: 'GET',
            url: url_market,
            data: data,
            async: true,
            beforeSend: (xhr) => {
                if (xhr && xhr.overrideMimeType) {
                    xhr.overrideMimeType('application/json;charset=utf-8');
                }
            },
            dataType: 'json',
            success: (data) => {
                if (data.results.length == 0) {
                    return [1];
                }
                let promises = []; // آرایه‌ای برای نگهداری Promiseها  
                let allPopups = []; // آرایه‌ای برای نگهداری تمام popup1ها  
                let popup1 = []; // ایجاد popup1 بیرون از حلقه  


                for (let i = 0; i < data.results.length; i++) {
                    var sums123 = data.results[i].geometry;
                    let Point_mark = [];
                    Point_mark.push(sums123.y, sums123.x);
                    let name0 = data.results[i].attributes.Name;
                    let category0 = data.results[i].attributes.Category.trim();
                    // let icooo = category0;
                    if (name0 == '0') {
                        name0 = '';
                    }
                    let txt = category0 + '  <br /> ' + name0;


                    if (category0 != 'سوپرمارکت') {
                        // ایجاد Promise و اضافه کردن به آرایه  
                        let promise = this.Route_find(Point_mark, base_point, map)
                            .then(popup2 => {
                                // به جای push کردن به popup2، مقادیر رو به یک آرایه جدید اضافه کنید  
                                let newPopup = [name0, category0, ...popup2]; // ترکیب اطلاعات  
                                popup1.push(newPopup); // اضافه کردن آرایه جدید به popup1  
                                this.createPolyLine(Point_mark, newPopup, map);
                                return popup1; // برگرداندن popup1 برای استفاده در Promise.all  
                            });
                        promises.push(promise);
                    }
                }

                // صبر کردن تا تمام Promiseها انجام بشن  
                Promise.all(promises)
                    .then((results) => {
                        // جمع‌آوری تمام popup1ها در یک آرایه  

                        results.forEach(popup1 => {
                            if (popup1) { // بررسی اینکه popup1 تعریف شده باشه  
                                allPopups = allPopups.concat(popup1);
                            }
                        });
                        this.Draw_popup(base_point, allPopups, map);
                    });
            }
        });
    }

    async Route_find(loc1, loc2, map) {
        // Get the selected route type from radio buttons
        const selectedRoute = document.querySelector('input[name="route"]:checked').value;
        let selrot = selectedRoute === 'walking' ? 'foot' : 'route';
        let xx1 = loc1[1];
        let yy1 = loc1[0];
        let l1 = loc2[1];
        let l2 = loc2[0];
        let time_all1 = [];
        // let this.timeall = []; // تعریف قبل از ایجکس  

        let xxyy = xx1 + ',' + yy1 + ';' + l1 + ',' + l2;

        let utlmap = `https://map.ir/routes/${selrot}/v1/driving/${xxyy}?alternatives=true&steps=true&overview=false`;
        let data = [];
        $.ajax({
            type: 'GET',
            url: utlmap,
            data: data,
            async: false,
            beforeSend: (xhr) => {
                if (xhr && xhr.overrideMimeType) {
                    xhr.overrideMimeType('application/json;charset=utf-8');
                    xhr.setRequestHeader("x-api-key", this.API_KEY);
                    xhr.setRequestHeader("content-type", "application/json");
                }
            },
            dataType: 'json',
            success: (data) => {
                if (typeof data == 'undefined') {
                    console.log('ERRR ----> ', utlmap);
                }
                if (data.length == 0) { return [1] }
                let summary = data.routes[0].legs[0].summary;

                // دسترسی به مراحل مسیر  intersections
                let location1 = [];
                let steps = data.routes[0].legs[0].steps;
                steps.forEach(step => {
                    let loc1 = step.intersections;
                    loc1.forEach(po1 => {
                        location1.push(po1.location);
                    })
                });

                this.timeall = [];
                let Geom = location1;// data.routes[0].geometry.coordinates;

                let timee = (data.routes[0].duration / 60);
                let dist = data.routes[0].distance;
                let timm = timee.toFixed(1);
                dist = dist.toFixed(0);
                this.timeall = [{ timm: timm, dist: dist }]; // این درسته  
                timee = ' زمان ' + timm + ' دقیقه <br /> فاصله ' + dist + ' متر ';
                let araypoint = [];
                Geom.forEach(function (item) {
                    let pnt = new L.LatLng(item[1], item[0]);
                    araypoint.push(pnt);
                });
                this.Draw_line(araypoint, timee, map);


                time_all1 = [{ timm: timm, dist: dist }]; // مقداردهی در داخل success  
            },
            error: (jqXHR, textStatus, errorThrown) => {
                console.error("Error in ajax:", textStatus, errorThrown);
                // در صورت بروز خطا، یک آرایه خالی برگردون  
                time_all1 = [];
            }
        });

        // اگر time_all1 مقداردهی نشده، یک آرایه خالی برگردون  
        if (!time_all1) {
            time_all1 = [];
        }

        return time_all1; // برگرداندن مقدار  
    }


    createPolyLine(loc1, pop0, map) {


        // let dis = 0;
        var er = pop0[2].dist + '&nbsp;  متر فاصله دسترسی ' + '<br />' + pop0[2].timm + '&nbsp;  دقیقه زمان دسترسی   '; //  (dis1 / 1000).toFixed(2);
        // dis += (1 / er);


        let categoryid = ' <center>  <span style=" color: #CC33FF"> ' + ' </span>   ' + pop0[1] + '<br />' + er + '</center>';
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
        this.addBusinessMarker(pop0[1], categoryid, loc1);

    };

    /**
     * نمایش تمام کسب و کارها در یک نقطه مشخص
     * @param {Object} latlng - موقعیت جغرافیایی {lat: number, lng: number}
     * @returns {Promise<Array>} آرایه‌ای از اطلاعات کسب و کارها برای ساخت PDF
     */
    async allbisinespoint(latlng, radius) {

        radius = radius / 1000;
        const list1 = GandomMap1.BUSINESS_CATEGORIES;
        let allBusinessData = [];

        const promises = list1.map(async category => {
            try {
                const businessData = await this.count_other(latlng.lng, latlng.lat, 1, this.map, category, radius);
                if (businessData && businessData.length > 0) {
                    allBusinessData = allBusinessData.concat(businessData);
                }
            } catch (error) {
                console.error(`خطا در دریافت اطلاعات ${category}:`, error);
            }
        });

        try {
            await Promise.all(promises);
            return allBusinessData;
        } catch (error) {
            console.error('خطا در پردازش دسته‌بندی‌ها:', error);
            return [];
        }
    }

    Draw_line(lipoint, txtp, map) {
        var firstpolyline = new L.Polyline(lipoint, {
            color: this.generateRandomColor(),
            weight: 5,
            opacity: 0.9,
            smoothFactor: 1
        });
        firstpolyline.addTo(map).bindPopup(txtp);

    }

    Draw_popup(base_p, arrpop, map) {
        const numberFormatter = Intl.NumberFormat('en-US');

        // حذف داده‌های تکراری و مرتب‌سازی
        const uniqueDataArray = Array.from(new Set(arrpop.map(JSON.stringify))).map(JSON.parse);
        uniqueDataArray.sort((a, b) => a[0].timm - b[0].timm);

        // ساختار HTML با استایل
        let tar = `
            <table class="store-table">
                <thead>
                    <tr>
                        <th>نام فروشگاه</th>
                     
                           <th>زمان  (دقیقه)</th>
                        <th>فاصله (متر)</th>
                    </tr>
                </thead>
                <tbody>
        `;

        uniqueDataArray.forEach(item => {
            const distance = numberFormatter.format(item[2].dist);
            const time = item[2].timm ? item[2].timm : '-';
            const storeName = item[1] || item[0] || '-';

            tar += `
                <tr>
                    <td>${storeName}</td>
                    <td>${time}</td>
                    <td>${distance}</td>
                </tr>
            `;
        });

        tar += '</tbody></table>';

        // ایجاد آیکون و نمایش پاپ‌آپ
        const icon = L.icon({
            iconUrl: '/IMG/marker-icon.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34]
        });
        console.log('MARKER_001: Creating store marker at:', base_p, 'for category:', 'tar');
        L.marker(base_p, { icon })
            .addTo(map)
            .bindPopup(tar, {
                maxWidth: 300,
                maxHeight: 400,
                className: 'custom-popup'
            })
            .openPopup();
    }
    // End help code
    generateRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];

        }
        return color;
    }
    // متدهای کمکی برای هر نوع شکل
    handleMarkerCreation(layer) {
        const latlng = layer.getLatLng();
        // می‌توانید عملیات بیشتری اینجا انجام دهید
    }
    // تابع خروجی PDF
    exportToPDF(reportContent) {
        try {
            if (typeof window.jspdf === 'undefined') {
                console.error('کتابخانه jsPDF لود نشده است');
                return;
            }

            const { jsPDF } = window.jspdf;
            const doc = new jsPDF({
                orientation: 'p',
                unit: 'mm',
                format: 'a4',
                putOnlyUsedFonts: true
            });

            try {
                doc.addFont('Vazir.ttf', 'Vazir', 'normal');
                doc.setFont('Vazir');
            } catch (error) {
                console.error('خطا در لود فونت Vazir:', error);
                doc.setFont('helvetica');
            }

            // تنظیمات صفحه
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const marginRight = 20;
            const marginLeft = 20;
            const marginTop = 20;
            const lineHeight = 10;
            let yPosition = marginTop;

            // اضافه کردن لوگو
            try {
                const logoUrl = '/IMG/logo.png';
                const logoWidth = 30;
                const logoHeight = 15;
                doc.addImage(logoUrl, 'PNG', marginLeft, yPosition, logoWidth, logoHeight);
                yPosition += logoHeight + 10;
            } catch (error) {
                console.error('خطا در اضافه کردن لوگو:', error);
            }

            // عنوان اصلی
            doc.setFontSize(16);
            doc.setTextColor(0, 0, 0);
            doc.text("گزارش فروشگاه‌های محدوده", pageWidth - marginRight, yPosition, { align: 'right' });

            // تاریخ
            yPosition += lineHeight + 3;
            doc.setFontSize(12);
            doc.text(`تاریخ: ${new Date().toLocaleDateString('fa-IR')}`, pageWidth - marginRight, yPosition, { align: 'right' });

            // خط جداکننده
            yPosition += lineHeight;
            doc.setLineWidth(0.5);
            doc.line(marginLeft, yPosition, pageWidth - marginRight, yPosition);

            // عنوان بخش
            yPosition += lineHeight + 3;
            doc.setFontSize(14);
            doc.text("گزارش کلی کسب و کارها", pageWidth - marginRight, yPosition, { align: 'right' });

            // تنظیمات جدول
            yPosition += lineHeight + 5;
            const tableTop = yPosition;
            const colWidth = (pageWidth - marginLeft - marginRight) / 2;
            const rowHeight = 12;

            // پردازش داده‌ها
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = reportContent;
            const rows = tempDiv.querySelectorAll('tr');
            const items = Array.from(rows).map(row => {
                const cells = row.querySelectorAll('td');
                return {
                    title: cells[0].textContent.trim(),
                    count: cells[1].textContent.trim()
                };
            });

            // تعریف رنگ‌های مختلف برای سطرها
            const rowColors = [
                [240, 240, 250],  // آبی روشن
                [250, 240, 240],  // قرمز روشن
                [240, 250, 240],  // سبز روشن
                [250, 250, 240],  // زرد روشن
                [240, 240, 250],  // بنفش روشن
                [250, 240, 250],  // صورتی روشن
                [240, 250, 250],  // فیروزه‌ای روشن
                [250, 250, 250]   // سفید
            ];

            // رسم جدول
            doc.setFontSize(12);
            doc.setLineWidth(0.2);

            items.forEach((item, index) => {
                // بررسی نیاز به صفحه جدید
                if (yPosition > pageHeight - marginTop) {
                    doc.addPage();
                    yPosition = marginTop;
                }

                // انتخاب رنگ بر اساس index
                const colorIndex = index % rowColors.length;
                doc.setFillColor(...rowColors[colorIndex]);
                doc.rect(marginLeft, yPosition, pageWidth - marginLeft - marginRight, rowHeight, 'F');

                // رسم خطوط جدول
                doc.setDrawColor(100, 100, 100);
                doc.line(marginLeft, yPosition, pageWidth - marginRight, yPosition);
                doc.line(marginLeft, yPosition + rowHeight, pageWidth - marginRight, yPosition + rowHeight);
                doc.line(marginLeft, yPosition, marginLeft, yPosition + rowHeight);
                doc.line(pageWidth - marginRight, yPosition, pageWidth - marginRight, yPosition + rowHeight);
                doc.line(marginLeft + colWidth, yPosition, marginLeft + colWidth, yPosition + rowHeight);

                // متن
                doc.setTextColor(0, 0, 0);
                doc.text(item.title, pageWidth - marginRight - 5, yPosition + rowHeight - 3, { align: 'right' });
                doc.text(item.count, marginLeft + colWidth - 5, yPosition + rowHeight - 3, { align: 'right' });

                yPosition += rowHeight;
            });

            // خط نهایی جدول
            doc.line(marginLeft, tableTop, pageWidth - marginRight, tableTop);

            doc.save('گزارش-فروشگاه‌ها.pdf');
        } catch (error) {
            console.error('خطا در ساخت PDF:', error);
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
            hyperstar: 'هایپر استار',
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

    async showPopulationInfo(rectangle, population, households, area) {
        try {
            const coords = rectangle.getBounds().getCenter();
            const nearestStore = await this.findNearestStore([coords.lat, coords.lng]);
            const density1 = area > 0 ? (population / area).toFixed(2) : 0;
            let storeInfo = '';
            if (nearestStore?.nearest) {
                const distance = (nearestStore.nearest.distance / 1000).toFixed(2);
                const status = this.extractStoreStatus(nearestStore.nearest.popup);
                storeInfo = `
                    <div style="margin-top: -1px; border-top: 1px solid #eee; padding-top: 10px;">
                        <strong>نزدیک‌ترین فروشگاه گندم:</strong>
                        <div>وضعیت: <span style="color: ${status === 'باز' ? 'green' : 'red'}">${status}</span></div>
                        <div>فاصله: ${distance} کیلومتر</div>
                        <div>کد فروشگاه: ${nearestStore.storeCode}</div>
                    </div>
                `;

            }
            // tarakomasli

            const popupContent = `
                <div style="direction: rtl; text-align: right; font-family: Vazir;">
                    <h6 style="color:rgba(94, 15, 15, 0.83); margin-bottom: 4px;">&nbsp;&nbsp; &nbsp;&nbsp; اطلاعات کلی منطقه  </h6>
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
                 
                                         <tr>
                            <td style="padding: 5px; border-bottom: 1px solid #eee;"><strong> تراکم جمعیت:</strong></td>
                            <td style="padding: 5px; border-bottom: 1px solid #eee;">${this.formatNumber(density1)} نفر/هکتار  </td>
                        </tr>
                        </table>
                    ${storeInfo}
                </div>`;

            rectangle.bindPopup(popupContent, {
                className: 'custom-popup',
                maxWidth: 300,
                closeButton: true,
                closeOnClick: true
            }).openPopup();

            // ... existing code ...
            window.population = [
                `تراکم جمعیت: ${this.formatNumber(density1)} نفر/هکتار`,
                `تراکم خانوار: ${this.formatNumber(households / area)} خانوار/هکتار`,
                `مساحت: ${this.formatNumber(area)} هکتار`,
                `جمعیت کل: ${this.formatNumber(population)} نفر`,
                `تعداد خانوار: ${this.formatNumber(households)} خانوار`
            ];
            // console.log( '===== ',  window.categoryStatistics);

            // ... existing code ...
            // console.log('DEBUG-5: popupContent');
        } catch (error) {
            console.error('Error in showPopulationInfo:', error);
        }
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
        return new Promise((resolve, reject) => {
            const coordinates = `${longitude},${latitude}`;
            const baseUrl = `https://gis.gandomcs.com/arcgis/rest/services/deh/MapServer/identify?geometry=${coordinates}&geometryType=esriGeometryPoint&sr=&layers=ID%3A1&tolerance=0&mapExtent=45%2C25%2C61%2C40&imageDisplay=800%2C600%2C96&returnGeometry=true&returnZ=false&returnM=false&f=pjson`;

            $.getJSON(baseUrl, (data) => {
                if (!data.results?.length) {
                    resolve(null);
                    return;
                }

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
                    const formattedArea = Math.round(areaInHectares);

                    // محاسبه تراکم جمعیت
                    const actualPopulation = (population === 'Null' || population === null) ? 0 : parseInt(population);
                    const actualHouseholds = (householdCount === 'Null' || householdCount === null) ? 0 : parseInt(householdCount);
                    const populationDensity = areaInHectares > 0 ? (actualPopulation / areaInHectares) : 0;

                    // ساختار داده برای برگرداندن
                    const districtData = {
                        location: {
                            province: provinceName.trim(),
                            city: cityName,
                            district: districtName,
                            villageDistrict: villageDistrictName
                        },
                        statistics: {
                            area: formattedArea,          // هکتار
                            population: actualPopulation,  // نفر
                            households: actualHouseholds,  // تعداد خانوار
                            villageCount: villageCount,    // تعداد آبادی
                            density: Number(populationDensity.toFixed(2))  // نفر در هکتار
                        },
                        id: districtId
                    };

                    // ساخت محتوای پاپ‌آپ برای نمایش
                    const popupContent = `
                        <div class="district-popup" dir="rtl">
                            <div class="location-info">
                                <strong>موقعیت:</strong> ${provinceName.trim()} / ${cityName}
                            </div>
                            <div class="district-info">
                                <strong>دهستان:</strong> ${villageDistrictName}
                            </div>
                            <div class="stats-info">
                                <div><strong>مساحت:</strong> ${new Intl.NumberFormat('fa-IR').format(formattedArea)} هکتار</div>
                                <div><strong>جمعیت:</strong> ${new Intl.NumberFormat('fa-IR').format(actualPopulation)} نفر</div>
                                <div><strong>خانوار:</strong> ${new Intl.NumberFormat('fa-IR').format(actualHouseholds)}</div>
                                <div><strong>تعداد آبادی:</strong> ${villageCount}</div>
                                <div><strong>تراکم جمعیت:</strong> ${new Intl.NumberFormat('fa-IR').format(populationDensity.toFixed(2))} نفر در هکتار</div>
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

                    // برگرداندن داده‌های ساختاریافته
                    resolve(districtData);
                });
            }).fail(error => {
                console.error('خطا در دریافت اطلاعات منطقه:', error);
                reject(error);
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

    async Draw_abdi(idcode, map) {
        const baseUrl = `https://gis.gandomcs.com/arcgis/rest/services/deh/MapServer/find?searchText=${idcode}&contains=false&searchFields=NEAR_FID&sr=&layers=ID%3A2&layerDefs=&returnGeometry=true&maxAllowableOffset=&geometryPrecision=&dynamicLayers=&returnZ=false&returnM=false&gdbVersion=&f=pjson`;

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
    }
    // TODO: ===================نزدیکترین  گندم فروشگاه های گندم طلایی====================================================  

    /**
     * دریافت و جمع‌آوری تمام اطلاعات در قالب آرایه
     * @param {Array} longitude - آرایه [عرض، طول] جغرافیایی
     * @returns {Promise<Array>} آرایه‌ای از تمام اطلاعات جمع‌آوری شده
     */
    async get_alldata(longitude) {
        window.categoryStatistics = [];
        window.population = [];
        try {
            const point = new L.LatLng(longitude[0], longitude[1]);

            const [nearestStore, businessData, densityData] = await Promise.all([
                this.findNearestStore(longitude),
                this.collectBusinessData(point),
                this.collectDensityData(point, longitude)

            ]);

            // Add data to the markers
            // this.markers.forEach(marker => {
            //     marker.bindPopup(window.categoryStatistics);
            // });

            if (this.userMarker && (window.categoryStatistics || window.population)) {
                const currentContent = this.userMarker.getPopup().getContent();

                // استایل جمع‌وجور برای جدول فقط یکبار در ابتدای جدول
                const compactStyle = `
                    <style>
                        td, th { line-height: 0!important;  font-size:10px !important; }
                        input.value-input { width: 26px !important; padding: 1px !important; font-size: 9px !important; }
                        h6 { margin: 2px 0 2px 0 !important; font-size: 12px !important; }
                    </style>
                `;

                // جدول دسته‌بندی کسب‌وکارها
                let categoryTable = '';
                if (window.categoryStatistics && window.categoryStatistics.length > 0) {
                    categoryTable = `
                        <div style="margin-top: 5px; border-top: 1px solid #eee; padding-top: 2px;">
                            <h6 style="color:rgb(20, 21, 110);; text-align: right;">دسته‌ بندی کسب و کارها</h6>
                            <table style="width: 100%; border-collapse: collapse; direction: rtl;text-align:right;">
                                ${compactStyle}
                                <thead >
                                    <tr style="background-color:rgba(164, 227, 142, 0.73); height:18px">
                                        <th style="border-bottom: 1px solid #ddd;">عنوان</th>
                                        <th style="border-bottom: 1px solid #ddd;">تعداد</th>
                                        <th style="border-bottom: 1px solid #ddd;">&nbsp;&nbsp; ارزش  </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${window.categoryStatistics.map(item => `
                                        <tr>
                                            <td style="border-bottom: 0.5px solid #eee;">${item.persianName}</td>
                                            <td style="border-bottom: 0.5px solid #eee; text-align: center;">${item.count}</td>
                                            <td style="border-bottom: 0.5px solid #eee; text-align: center;">
                                                <input type="number"
                                                    class="value-input"
                                                    data-category="${item.persianName}"
                                                    min="1"
                                                    max="100"
                                                    style="border: 1px solid #ddd; border-radius: 2px; text-align: center;">
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    `;
                }

                // جدول اطلاعات جمعیتی (فقط سه ردیف مهم)
                let populationTable = '';
                if (window.population && window.population.length > 0) {
                    // استخراج مقادیر مورد نیاز
                    const popRow = window.population.find(x => x.includes('جمعیت کل')) || '';
                    const famRow = window.population.find(x => x.includes('تعداد خانوار')) || '';
                    const densRow = window.population.find(x => x.includes('تراکم جمعیت')) || '';

                    // استخراج مقدار عددی
                    const popValue = popRow.replace('جمعیت کل: ', '').replace(' نفر', '');
                    const famValue = famRow.replace('تعداد خانوار: ', '').replace(' خانوار', '');
                    const densValue = densRow.replace('تراکم جمعیت: ', '').replace(' نفر/هکتار', '');

                    populationTable = `
                      
    <div style="margin-top: 5px; border-top: 1px solid #eee; padding-top: 2px;">
        <h6 style="color: #2c3e50;text-align:right;">اطلاعات جمعیتی</h6>
        <table style="width: 100%; border-collapse: collapse; direction: rtl; text-align: right;">
            ${compactStyle}
            <thead>
                <tr style="background-color:rgb(234, 236, 176);height:18px">
                    <th style="border-bottom: 1px solid #ddd;">عنوان</th>
                    <th style="border-bottom: 1px solid #ddd;">مقدار</th>
                    <th style="border-bottom: 1px solid #ddd;">ارزش</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style="border-bottom: 0.5px solid #eee;">جمعیت کل</td>
                    <td style="border-bottom: 0.5px solid #eee; text-align: center;">${popValue}</td>
                    <td style="border-bottom: 0.5px solid #eee; text-align: center;">
                        <input type="number" class="value-input" data-category="جمعیت کل" min="1" max="100"
                            style="border: 1px solid #ddd; border-radius: 2px; text-align: center;">
                    </td>
                </tr>
                <tr>
                    <td style="border-bottom: 0.5px solid #eee;">تعداد خانوار</td>
                    <td style="border-bottom: 0.5px solid #eee; text-align: center;">${famValue}</td>
                    <td style="border-bottom: 0.5px solid #eee; text-align: center;">
                        <input type="number" class="value-input" data-category="تعداد خانوار" min="1" max="100"
                            style="border: 1px solid #ddd; border-radius: 2px; text-align: center;">
                    </td>
                </tr>
                <tr>
                    <td style="border-bottom: 0.5px solid #eee;">تراکم جمعیت</td>
                    <td style="border-bottom: 0.5px solid #eee; text-align: center;">${densValue}</td>
                    <td style="border-bottom: 0.5px solid #eee; text-align: center;">
                        <input type="number" class="value-input" data-category="تراکم جمعیت" min="1" max="100"
                            style="border: 1px solid #ddd; border-radius: 2px; text-align: center;">
                    </td>
                </tr>
                <tr>
                    <td style="border-bottom: 0.5px solid #eee; text-align: center; width: 100px;">
                        <button id="sum-values-btn" class="okc">
                            جمع ارزش‌ها
                        </button>
                    </td>
                    <td> ===> </td>
                    <td> <span id="sum-values-result"
                            style="margin-right: 6px; color: #2c3e50; font-weight: bold;"></span>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>`;
                }

                const newContent = currentContent + categoryTable + populationTable;
                this.userMarker.setPopupContent(newContent);


                this.map.on('popupopen', function (e) {
                    const inputs = document.querySelectorAll('.value-input[type="number"]');
                    const sumBtn = document.getElementById('sum-values-btn');
                    const sumResult = document.getElementById('sum-values-result');
                    if (sumBtn) {
                        sumBtn.onclick = function () {
                            let sum = 0;
                            inputs.forEach(input => {
                                const val = parseFloat(input.value);
                                if (!isNaN(val)) sum += val;
                            });
                            sumResult.textContent = sum;
                        };
                    }
                });
            }

            console.log('window.categoryStatistics =', window.categoryStatistics, 'window.population = ', window.population);
            return this.processAllData({
                businesses: businessData.data,
                density: densityData.data?.density,
                district: densityData.data?.district,
                nearestStore: nearestStore.data,
                location: { lat: longitude[0], lng: longitude[1] }
            });
        } catch (error) {
            console.error('Error in get_alldata:', error);
        }
    }

    // توابع کمکی
    isValidCoordinates(coords) {
        return Array.isArray(coords) &&
            coords.length === 2 &&
            typeof coords[0] === 'number' &&
            typeof coords[1] === 'number' &&
            coords[0] >= -90 && coords[0] <= 90 &&
            coords[1] >= -180 && coords[1] <= 180;
    }

    async setMapView(point) {
        return new Promise((resolve) => {
            this.map.once('moveend', resolve);
            this.map.setView(point, 10);
        });
    }

    /**
     * جمع‌آوری اطلاعات کسب و کارها
     * @param {L.LatLng} point - نقطه مورد نظر
     */
    async collectBusinessData(point) {
        try {
            this.cclearMap(this.map);
            const businessData = await this.allbisinespoint(point, 1000);

            return businessData || [];
        } catch (error) {
            console.error('خطا در دریافت اطلاعات کسب و کارها:', error);
            return [];
        }
    }

    /**
     * جمع‌آوری اطلاعات تراکم و منطقه
     * @param {L.LatLng} point - نقطه مورد نظر
     * @param {Array} coords - مختصات [عرض، طول]
     */
    async collectDensityData(point, coords) {
        try {
            const density = await this.drawPopulationDensity(point, this.map);

            if (!density) {
                const district = await this.drawDistrict(coords[0], coords[1], this.map);
                return { density: null, district };
            }

            return { density, district: null };
        } catch (error) {
            console.error('Error in collectDensityData:', error);
            return { density: null, district: null };
        }
    }

    /**
     * یافتن نزدیک‌ترین فروشگاه گندم
     * @param {Array} coords - مختصات [عرض, طول]
     */
    async findNearestStore(coords) {
        try {
            let minDistOpen = Infinity;
            let minDistAny = Infinity;
            let nearestOpen = null;
            let nearestAny = null;
            let storeCode = null;
            this.gandompoint1.eachLayer(layer => {
                if (layer.getLatLng) {
                    const latlng = layer.getLatLng();
                    const dist = this.map.distance([coords[0], coords[1]], [latlng.lat, latlng.lng]);
                    const popupContent = layer.getPopup()?.getContent() || '';
                    const status = this.extractStoreStatus(popupContent);

                    // بررسی فروشگاه‌های باز        window.categoryStatistics = [];
                    if (status === 'باز' && dist < minDistOpen) {
                        storeCode = this.extractStoreCode(popupContent);
                        minDistOpen = dist;
                        nearestOpen = {
                            location: latlng,
                            distance: dist,
                            popup: popupContent,
                            icon: layer.options.icon
                        };
                    }

                    // بررسی همه فروشگاه‌ها
                    if (dist < minDistAny) {
                        minDistAny = dist;
                        nearestAny = {
                            location: latlng,
                            distance: dist,
                            popup: popupContent,
                            icon: layer.options.icon
                        };
                    }
                }
            });

            // نمایش نزدیک‌ترین فروشگاه روی نقشه
            const nearest = nearestOpen || nearestAny;
            if (nearest) {
                this.displayNearestStore(nearest, coords);
            }

            // console.log('اطلاعات فروشگاه:',  storeCode);
            return {
                storeCode: storeCode,
                nearest: nearest,
                distanceKm: (minDistAny / 1000).toFixed(2)
            };

        } catch (error) {
            console.error('خطا در یافتن نزدیک‌ترین فروشگاه:', error);
            return null;
        }
    }

    /**
     * استخراج وضعیت فروشگاه از محتوای پاپ‌آپ
     * @param {string} popupContent - محتوای HTML پاپ‌آپ
     */
    extractStoreStatus(popupContent) {
        const regex = /<span[^>]*>([\s\S]*?)<\/span>/;
        const match = popupContent.match(regex);
        return match && match[1] ? match[1].trim() : '';
    }

    /**
     * استخراج کد فروشگاه از محتوای پاپ‌آپ
     * @param {string} popupContent - محتوای HTML پاپ‌آپ
     * @returns {string} کد فروشگاه
     */
    extractStoreCode(popupContent) {
        const regex = /کد فروشگاه:\s*(\d+)/;
        const match = popupContent.match(regex);
        return match && match[1] ? match[1].trim() : '';
    }

    /**
     * نمایش نزدیک‌ترین فروشگاه روی نقشه
     * @param {Object} store - اطلاعات فروشگاه
     * @param {Array} userCoords - مختصات کاربر
     */
    displayNearestStore(store, userCoords) {
        // پاک کردن مارکرهای قبلی
        this.clearMarkers?.();

        // نمایش فروشگاه
        const marker = L.marker([store.location.lat, store.location.lng], { icon: store.icon })
            .addTo(this.map)
            .bindPopup(store.popup)
            .openPopup();

        this.markers = [marker];
        this.map.setView(userCoords, 16);

        // نمایش موقعیت کاربر
        const distanceKm = (store.distance / 1000).toFixed(2);
        const userPopup = `<span style="color: red; font-size: 12px;">  فاصله از فروشگاه گندم: ${distanceKm} کیلومتر</span>`;

        // console.log('MARKER_12: Creatin at:', userCoords, 'for category:', 'userPopup');

        this.userMarker = L.marker(userCoords).addTo(this.map).bindPopup(userPopup);


    }

    async draw_loc(longitude, icon1, textRadius, map) {
        try {
            const url_path = '/IMG/';
            //  var url_path = 'https://portal.gandomcs.com/gandom/SiteAssets/IMG/';
            // const Gandomd_ = L.icon({
            //     iconUrl: url_path + 'Gandome.png',
            //     iconSize: [20, 30],
            //     popupAnchor: [0, 0]
            // });

            //   L.marker([32.287, 52.954], { super_}).addTo(this.map);
            L.marker(longitude, { icon: icon1 }).addTo(this.map).bindPopup(textRadius);



        } catch (error) {
            console.error('Error in test1:', error);
        }
    }


    // تابع بهینه‌سازی شده برای شمارش و نمایش مکان‌های نزدیک
    async count_other(longitude, latitude, textRadius, map, subcategory, radius) {
        try {

            const url = `https://map.ir/places/count?$filter=lat eq ${latitude} and lon eq ${longitude} and subcategory eq ${subcategory} and buffer eq ${radius}km`;
            const response = await $.ajax({
                type: 'GET',
                url: url,
                headers: {
                    'x-api-key': this.API_KEY,
                    'content-type': 'application/json'
                }
            });
            if (!response?.data?.count) {
                console.log("داده‌ای برای این موقعیت یافت نشد.");
                return [];
            }
            const totalCount = response.data.count;
            window.locationCounts = {};
            const batchSize = 20;
            let allLocations = [];
            for (let offset = 0; offset < totalCount; offset += batchSize) {
                const locations = await this.fetchLocationDetails(longitude, latitude, offset, map, subcategory, radius);
                if (locations && locations.length > 0) {
                    allLocations = allLocations.concat(locations);
                }
            }
            return allLocations;
        } catch (error) {
            if (error.status === 404) {
                console.log("داده‌ای برای این موقعیت یافت نشد.");
            } else if (error.status === 401) {
                console.error('خطای اعتبارسنجی - لطفا API key را بررسی کنید');
            } else if (error.status === 500) {
                console.error('خطای سرور - لطفاً بعداً تلاش کنید');
            } else {
                console.error('خطا در دریافت اطلاعات مکان‌ها:', error);
            }
            return [];
        }
    }


    async fetchLocationDetails(longitude, latitude, offset, map, subcategory, radius) {
        const url = `https://map.ir/places/list?$top=20&$skip=${offset}&$filter=lat eq ${latitude} and lon eq ${longitude} and subcategory eq ${subcategory} and buffer eq ${radius}km and sort eq true`;

        try {
            const response = await $.ajax({
                type: 'GET',
                url: url,
                headers: {
                    'x-api-key': this.API_KEY,
                    'content-type': 'application/json'
                }
            });

            if (!response?.value) return [];

            // ایجاد یا به‌روزرسانی شمارنده‌های جهانی اگر وجود ندارند
            if (!window.locationCounts) {
                window.locationCounts = {};
            }

            // افزایش شمارنده برای این دسته‌بندی
            if (!window.locationCounts[subcategory]) {
                window.locationCounts[subcategory] = 0;
            }
            window.locationCounts[subcategory] += response.value.length;

            let locations = [];
            // پردازش و نمایش نتایج
            Object.values(response.value).forEach(location => {
                if (!location?.location?.coordinates) return;

                const [lng, lat] = location.location.coordinates;
                const name = location.name || subcategory;
                const address = location.address || 'آدرس موجود نیست';
                const distance = location.distance?.amount ? `${Math.round(location.distance.amount)} متر` : 'نامشخص';
                const province = location.province || '';
                const county = location.county || '';
                const district = location.district || '';
                const city = location.city || '';
                const region = location.region || '';
                const neighborhood = location.neighborhood || '';
                const village = location.village || '';

                // ذخیره اطلاعات برای PDF
                locations.push({
                    name,
                    address,
                    distance,
                    province,
                    county,
                    district,
                    city,
                    region,
                    neighborhood,
                    village,
                    category: subcategory,
                    coordinates: { lat, lng }
                });

                // افزودن مارکر به نقشه
                L.marker([lat, lng], {
                    icon: this.getCategoryIcon(subcategory)
                }).addTo(map)
                    .bindPopup(`
                    <div style="direction: rtl; text-align: right; font-family: IRANSans;">
                        <h5 style="color: #2c3e50; margin-bottom: 10px;">${name}</h5>
                        <div style="border-bottom: 1px solid #eee; padding-bottom: 5px; margin-bottom: 5px;">
                            <strong>آدرس:</strong> ${address}
                        </div>
                        <div style="margin-bottom: 5px;">
                            <strong>منطقه:</strong> ${region || 'نامشخص'}
                        </div>
                        <div style="margin-bottom: 5px;">
                            <strong>محله:</strong> ${neighborhood || 'نامشخص'}
                        </div>
                        <div style="color: #27ae60;">
                            <strong>فاصله:</strong> ${distance}
                        </div>
                    </div>
                `);
            });

            // نمایش گزارش کلی پس از اتمام همه درخواست‌ها
            this.showSummaryReport(latitude, longitude, map);

            return locations;

        } catch (error) {
            console.error(`خطا در دریافت جزئیات برای ${subcategory}:`, error);
            return [];
        }
    }

    //start popup 1
    handleRectangleCreation(layer) {
        // پاکسازی نقاط قبلی
        this.clearAllMarkers();

        const bounds = layer.getBounds();
        const northEast = bounds.getNorthEast();
        const southWest = bounds.getSouthWest();
        // تهیه پارامترهای مورد نیاز برای سرویس
        const url = `https://gis.gandomcs.com/arcgis/rest/services/IR22/MapServer/identify?geometryType=esriGeometryEnvelope&layers=id:0&tolerance=1&mapExtent=46.5,34.2,46.6,34.1&imageDisplay=1,1,1&f=json&geometry=${southWest.lng},${southWest.lat},${northEast.lng},${northEast.lat}`;
        console.log(url);
        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (!data.results || data.results.length === 0) {
                    return;
                }
                data.results.forEach(result => {
                    const attributes = result.attributes;
                    const geometry = result.geometry;
                    let name0 = attributes.Name;
                    let category0 = attributes.Category.trim();
                    if (category0 != 'سوپرمارکت') {
                        let txt = `${attributes.Category.trim()}<br/>${attributes.Name === '0' ? '' : attributes.Name}`;

                        const icon1 = this.addAllMarker(
                            category0,
                            name0,
                            undefined,
                        );

                        L.marker([geometry.y, geometry.x], { icon: icon1 }).addTo(this.map).bindPopup(txt);
                    }
                });
            })
            .catch(error => {
                console.error('خطا در دریافت اطلاعات:', error);
            });
    }

    showReport(counters, layer) {
        let report = '<table style="width: 100%; border-collapse: collapse; direction: rtl;">';
        Object.entries(counters).forEach(([key, value]) => {
            if (value > 0) {
                report += `
                    <tr>
                        <td style="padding: 5px; border-bottom: 1px solid #eee; text-align: right;">${this.getPersianName(key)}</td>
                        <td style="padding: 5px; border-bottom: 1px solid #eee; text-align: left;">${value} عدد</td>
                    </tr>`;
            }
        });
        report += '</table>';

        // نمایش گزارش در یک پنجره popup متصل به مستطیل
        if (report) {
            const bounds = layer.getBounds();
            const center = bounds.getCenter();

            // اضافه کردن دکمه Export به PDF در پایین گزارش
            const popupContent = `
                <div class="report-popup" style="direction: rtl; text-align: right;">
                    <strong>گزارش فروشگاه‌های محدوده:</strong>
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
    //ent popup  1

    //start popup 2
    /**
     * نمایش گزارش خلاصه از کسب و کارهای اطراف نقطه انتخابی
     * @param {number} latitude - عرض جغرافیایی
     * @param {number} longitude - طول جغرافیایی
     * @param {L.Map} map - نقشه
     */
    showSummaryReport(latitude, longitude, map) {
        if (!window.locationCounts) return;

        // ایجاد محتوای گزارش
        let reportContent = '<div style="direction: rtl; text-align: right; font-family: Vazir; font-size: 10px;">';
        reportContent += '<h6 style="color:rgb(4, 123, 2); margin-bottom: 7px; font-size: 12px;"> گزارش کلی کسب و کارها</h6>';
        reportContent += '<table style="width: 100%; border-collapse: collapse;">';

        // تعریف نام‌های فارسی برای انواع کسب و کارها
        const persianNames = {
            'attraction': 'جاذبه گردشگری',
            'bakery': 'نانوایی',
            'bank': 'بانک',
            'barracks': 'پادگان',
            'bus_line': 'خط اتوبوس',
            'bus_station': 'ایستگاه اتوبوس',
            'bus_stop': 'ایستگاه اتوبوس',
            'camp_site': 'اردوگاه',
            'caravan_site': 'کاروانسرا',
            'clinic': 'درمانگاه',
            'elementray_school': 'مدرسه ابتدایی',
            'fruit_vegetable_store': 'میوه فروشی',
            'fuel': 'پمپ بنزین',
            'high_school': 'دبیرستان',
            'hospice': 'آسایشگاه سالمندان',
            'hospital': 'بیمارستان',
            'hotel': 'هتل',
            'hyper_market': 'فروشگاه بزرگ',
            'kindergarten': 'مهد کودک',
            'laboratory': 'آزمایشگاه',
            'marketplace': 'بازار',
            'mosque': 'مسجد',
            'parking': 'پارکینگ',
            'parking': 'پارکینگ',
            'parking_space': 'محل پارک',
            'police': 'پلیس',
            'public_transport_building': 'ساختمان حمل و نقل عمومی',
            'public_transportation': 'حمل و نقل عمومی',
            'school': 'مدرسه',
            'subway': 'مترو',
            'subway_line': 'خط مترو',
            'supermarket': 'سوپرمارکت',
            'theme_park': 'شهربازی',
            'tower': 'برج',
            'trade_store': 'فروشگاه تجاری',
            'train_station': 'ایستگاه قطار',
            'university': 'دانشگاه'
        };

        // ساخت آرایه از اطلاعات دسته‌بندی‌ها
        const categoryStats = Object.entries(window.locationCounts)
            .sort(([keyA], [keyB]) => (persianNames[keyA] || keyA).localeCompare(persianNames[keyB] || keyB))
            .map(([category, count]) => ({
                persianName: persianNames[category] || category,
                count: count
            }));

        // ذخیره آرایه در متغیر گلوبال برای استفاده بعدی
        window.categoryStatistics = categoryStats;

        // ساخت HTML از آرایه (اگر هنوز نیاز به نمایش فوری هست)
        categoryStats.forEach(({ persianName, count }) => {
            reportContent += `
                <tr>
                    <td style="padding: 3px; border-bottom: 1px solid #eee;"><strong>${persianName}:</strong></td>
                    <td style="padding: 3px; border-bottom: 1px solid #eee;">${count} مورد</td>
                </tr>`;
        });
        // console.log(categoryStatistics.length , ' ===reportContent');
        reportContent += '</table>';

        // اضافه کردن دکمه خروجی PDF
        reportContent += `
            <div style="margin-top: 7px; text-align: center;">
                <button onclick="window.exportToPDF('${encodeURIComponent(reportContent)}')" class="export-btn" style="font-size: 11px;">
                    <i class="fas fa-file-pdf"></i> خروجی PDF
                </button>
            </div>
        </div>`;
        // تنظیم تابع خروجی PDF در window
        window.exportToPDF = (reportData) => {
            this.exportToPDF(decodeURIComponent(reportData));
        };
        // نمایش مارکر موقعیت انتخاب شده با پاپ‌آپ گزارش
        this.addLocationMarker(longitude, latitude, map, reportContent);
    }
    //End  popup 2

    // اضافه کردن استایل‌های جدید
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
            .export-btn, .report-btn {
                background-color: #4CAF50;
                color: white;
                border: none;
                padding: 5px 10px;
                border-radius: 4px;
                cursor: pointer;
                font-family: Vazir;
                font-size: 0.9em;
                margin: 2px;
                transition: background-color 0.3s;
            }
            .export-btn:hover, .report-btn:hover {
                background-color: #45a049;
            }
            .report-btn {
                background-color: #2196F3;
            }
            .report-btn:hover {
                background-color: #1976D2;
            }
        `;
        document.head.appendChild(style);
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
        console.log('MARKER_5: Creatin : : ', [lat, lng], 'for category:', location.title);
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
    getCategoryIcon(category) {
        return categoryIcons[category] || categoryIcons.default;
    }

    addLocationMarker(longitude, latitude, map, textpop) {
        const icon = L.divIcon({
            html: '<i class="fas fa-map-marker-alt" style="color: #FF0000; font-size: 24px;"></i>',
            className: 'location-marker',
            iconSize: [24, 24],
            iconAnchor: [52, 54]
        });
        // console.log('MARKER_00:   0000:', 'for category:', textpop);
        L.marker([latitude, longitude], { icon })
            .addTo(map).bindPopup(textpop);

    }

    drawTableRow(doc, config, item, y, colWidth, index) {
        // تعریف رنگ‌های مختلف برای سطرها
        const rowColors = [
            [240, 240, 250],  // آبی روشن
            [250, 240, 240],  // قرمز روشن
            [240, 250, 240],  // سبز روشن
            [250, 250, 240],  // زرد روشن
            [240, 240, 250],  // بنفش روشن
            [250, 240, 250],  // صورتی روشن
            [240, 250, 250],  // فیروزه‌ای روشن
            [250, 250, 250]   // سفید
        ];

        // انتخاب رنگ بر اساس index
        const colorIndex = index % rowColors.length;
        doc.setFillColor(...rowColors[colorIndex]);
        doc.rect(config.marginLeft, y, config.width - config.marginLeft - config.marginRight, config.rowHeight, 'F');

        // رسم خطوط جدول
        this.drawTableBorders(doc, config, y);

        // متن
        doc.setTextColor(0, 0, 0);
        doc.text(item.title, config.width - config.marginRight - 5, y + config.rowHeight - 3, { align: 'right' });
        doc.text(item.count, config.marginLeft + colWidth - 5, y + config.rowHeight - 3, { align: 'right' });
    }

    getStoreStatusConfig(status) {
        const STORE_STATUS_CONFIG = {
            "باز": {
                color: 'green',
                icon: 'Gandom_'
            },
            "بسته": {
                color: 'red',
                icon: 'Gandomb_'
            },
            "در حال جمع آوری": {
                color: 'blue',
                icon: 'Gandomj_'
            },
            "در حال راه اندازی": {
                color: '#AA00CC',
                icon: 'Gandomd_'
            }
        };
        return STORE_STATUS_CONFIG[status] || { color: 'grey', icon: 'user1_' };
    }

    getStoreIcon(status) {
        return icons[this.getStoreStatusConfig(status).icon];
    }

    // تعریف لایه‌های فروشگاه‌های زنجیره‌ای
    static STORE_LAYERS = {
        "گندم": new L.FeatureGroup(),
        "افق کوروش": new L.FeatureGroup(),
        "جانبو": new L.FeatureGroup(),
        "هایپر استار": new L.FeatureGroup(),
        "اتکا": new L.FeatureGroup(),
        "شهروند": new L.FeatureGroup(),
        "هفت": new L.FeatureGroup(),
        "رفاه": new L.FeatureGroup(),
        "سورنا": new L.FeatureGroup(),
        "هایپرمی": new L.FeatureGroup(),
        "فامیلی": new L.FeatureGroup(),
        "دیلی مارکت": new L.FeatureGroup(),
        "امیران": new L.FeatureGroup(),
        "یاس": new L.FeatureGroup(),
        "کوثر": new L.FeatureGroup(),
        "وین مارکت": new L.FeatureGroup(),
        "مفید": new L.FeatureGroup(),
        "سپه": new L.FeatureGroup(),
        "سورن": new L.FeatureGroup(),
        "محسن": new L.FeatureGroup(),
        "ویوان": new L.FeatureGroup(),
        "شهر خرید": new L.FeatureGroup()
    };

    // مدیریت لایه‌های نقشه
    initStoreLayers() {
        // ایجاد کنترل لایه‌ها
        this.layerControl = L.control.layers(null, GandomMap1.STORE_LAYERS, {
            position: 'topleft',
            collapsed: false
        }).addTo(this.map);

        // اضافه کردن کنترل برای لایه‌های ترسیمی
        L.control.layers(null, this.drawingLayers, {
            position: 'topleft',
            collapsed: false
        }).addTo(this.map);

        // بازیابی وضعیت لایه‌های ذخیره شده
        this.loadLayerStates();

        // اضافه کردن event listener برای ذخیره تغییرات
        this.map.on('overlayadd overlayremove', (e) => {
            this.saveLayerStates();
        });
    }

    // ذخیره وضعیت لایه‌ها در localStorage
    saveLayerStates() {
        const layerStates = {};
        // ذخیره وضعیت لایه‌های فروشگاه‌ها
        Object.keys(GandomMap1.STORE_LAYERS).forEach(layerName => {
            const layer = GandomMap1.STORE_LAYERS[layerName];
            layerStates[layerName] = this.map.hasLayer(layer);
        });
        // ذخیره وضعیت لایه‌های ترسیمی
        Object.keys(this.drawingLayers).forEach(layerName => {
            const layer = this.drawingLayers[layerName];
            layerStates[`drawing_${layerName}`] = this.map.hasLayer(layer);
        });
        localStorage.setItem('gandomMapLayerStates', JSON.stringify(layerStates));
    }

    // بازیابی و اعمال وضعیت لایه‌ها از localStorage
    loadLayerStates() {
        try {
            const savedStates = JSON.parse(localStorage.getItem('gandomMapLayerStates'));
            if (savedStates) {
                // بازیابی وضعیت لایه‌های فروشگاه‌ها
                Object.keys(GandomMap1.STORE_LAYERS).forEach(layerName => {
                    const layer = GandomMap1.STORE_LAYERS[layerName];
                    if (layer && savedStates[layerName] !== undefined) {
                        if (savedStates[layerName]) {
                            this.map.addLayer(layer);
                        } else {
                            this.map.removeLayer(layer);
                        }
                    }
                });
                // بازیابی وضعیت لایه‌های ترسیمی
                Object.keys(this.drawingLayers).forEach(layerName => {
                    const layer = this.drawingLayers[layerName];
                    const savedState = savedStates[`drawing_${layerName}`];
                    if (layer && savedState !== undefined) {
                        if (savedState) {
                            this.map.addLayer(layer);
                        } else {
                            this.map.removeLayer(layer);
                        }
                    }
                });
            }
        } catch (error) {
            console.warn('خطا در بازیابی وضعیت لایه‌ها:', error);
        }
    }

    // دریافت اطلاعات همه فروشگاه‌ها
    async fetchAllStores() {
        try {
            const response = await fetch('https://gis1.gandomcs.com/getdata.asmx/ReadMarket', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const xmlText = await response.text();

            // تبدیل XML به JSON
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlText, "text/xml");
            const jsonString = xmlDoc.getElementsByTagName("string")[0].textContent;
            const stores = JSON.parse(jsonString);
            const storeGroups = {};

            // ایجاد گروه‌های خالی برای همه دسته‌بندی‌های تعریف شده
            Object.keys(GandomMap1.STORE_LAYERS).forEach(category => {
                storeGroups[category] = new L.FeatureGroup();
            });

            // پردازش فروشگاه‌ها
            stores.forEach(store => {
                const category = store.Category;

                // فقط اگر این دسته‌بندی در گروه‌های ما تعریف شده باشد
                if (storeGroups[category]) {
                    const marker = this.addAllMarker(
                        category,
                        category,
                        [store.y, store.x]
                    );
                    if (marker) {
                        marker.bindPopup(`
                            <div style="text-align: right; direction: rtl;">
                                <strong>${store.Name || category}</strong><br>
                                ${store.Addres ? `آدرس: ${store.Addres}<br>` : ''}
                                کد: ${store.Id}
                            </div>
                        `);
                        storeGroups[category].addLayer(marker);
                    } else {
                        console.error('خطا در ایجاد مارکر برای:', category);
                    }
                } else {
                    console.error('دسته‌بندی تعریف نشده:', category);
                }
            });

            // ذخیره گروه‌ها در نقشه
            this.storeGroups = storeGroups;
            return storeGroups;

        } catch (error) {
            console.error('خطا در دریافت فروشگاه‌ها:', error);
            return null;
        }
    }
    // متد جدید برای اضافه کردن مارکر کسب و کارها
    addBusinessMarker(category, title, coords, counters) {
        let icon;

        if (counters) {
            switch (category) {
                case 'گندم':
                    icon = icons.Gandom_;
                    counters.gandom = (counters.gandom || 0) + 1;
                    break;
                case 'سورنا':
                    icon = icons.Sorena_;
                    counters.sorena = (counters.sorena || 0) + 1;
                    break;
                case 'رفاه':
                    icon = icons.Refah_;
                    counters.refah = (counters.refah || 0) + 1;
                    break;
                case 'افق کوروش':
                    icon = icons.ofog_;
                    counters.ofog = (counters.ofog || 0) + 1;
                    break;
                case 'سپه':
                    icon = icons.Sepah_;
                    counters.sepah = (counters.sepah || 0) + 1;
                    break;
                case 'جانبو':
                    icon = icons.Canbo_;
                    counters.canbo = (counters.canbo || 0) + 1;
                    break;
                case 'وین مارکت':
                    icon = icons.WinMarket_;
                    counters.winmarket = (counters.winmarket || 0) + 1;
                    break;
                case 'محسن':
                    icon = icons.Mohsen_;
                    counters.mohsen = (counters.mohsen || 0) + 1;
                    break;
                case 'دیلی مارکت':
                    icon = icons.Daily_;
                    counters.daily = (counters.daily || 0) + 1;
                    break;
                case 'هفت':
                    icon = icons.Haft_;
                    counters.haft = (counters.haft || 0) + 1;
                    break;
                case 'اتکا':
                    icon = icons.Etka_;
                    counters.etka = (counters.etka || 0) + 1;
                    break;
                case 'فامیلی':
                    icon = icons.Family_;
                    counters.family = (counters.family || 0) + 1;
                    break;
                case 'شهروند':
                    icon = icons.Shahrvand_;
                    counters.shahrvand = (counters.shahrvand || 0) + 1;
                    break;
                case 'هایپر استار':
                    icon = icons.Hayperstar_;
                    counters.hyperstar = (counters.hyperstar || 0) + 1;
                    break;
                case 'امیران':
                    icon = icons.Amiran_;
                    counters.amiran = (counters.amiran || 0) + 1;
                    break;
                case 'هایپرمی':
                    icon = icons.Haypermy_;
                    counters.hypermy = (counters.hypermy || 0) + 1;
                    break;
                case 'مفید':
                    icon = icons.Mofid_;
                    counters.mofid = (counters.mofid || 0) + 1;
                    break;
                case 'کوثر':
                    icon = icons.Kousar_;
                    counters.kousar = (counters.kousar || 0) + 1;
                    break;
                case 'یاس':
                    icon = icons.Yas_;
                    counters.yas = (counters.yas || 0) + 1;
                    break;
                case 'سوپرمارکت':
                    icon = icons.super_;
                    counters.super = (counters.super || 0) + 1;
                    break;
                default:
                    icon = icons.super_; // Default icon for unknown business types
                    counters.other = (counters.other || 0) + 1;
                    break;
            }
        } else {
            // If no counters object is provided, just set the icon without counting
            switch (category) {
                case 'گندم': icon = icons.Gandom_; break;
                case 'سورنا': icon = icons.Sorena_; break;
                case 'رفاه': icon = icons.Refah_; break;
                case 'افق کوروش': icon = icons.ofog_; break;
                case 'سپه': icon = icons.Sepah_; break;
                case 'جانبو': icon = icons.Canbo_; break;
                case 'وین مارکت': icon = icons.WinMarket_; break;
                case 'محسن': icon = icons.Mohsen_; break;
                case 'دیلی مارکت': icon = icons.Daily_; break;
                case 'هفت': icon = icons.Haft_; break;
                case 'اتکا': icon = icons.Etka_; break;
                case 'فامیلی': icon = icons.Family_; break;
                case 'شهروند': icon = icons.Shahrvand_; break;
                case 'هایپر استار': icon = icons.Hayperstar_; break;
                case 'امیران': icon = icons.Amiran_; break;
                case 'هایپرمی': icon = icons.Haypermy_; break;
                case 'مفید': icon = icons.Mofid_; break;
                case 'کوثر': icon = icons.Kousar_; break;
                case 'یاس': icon = icons.Yas_; break;
                case 'سوپرمارکت': icon = icons.super_; break;
                default:
                    icon = icons.super_; // Default icon for unknown business types
                    break;
            }
        }

        // اگر مختصات معتبر نیستند، مارکر ایجاد نکن
        if (!coords || !coords[0] || !coords[1]) {
            return null;
        }

        // Always use super_ icon as fallback if no icon was set
        if (!icon) {
            icon = icons.super_;
        }
        let categoryid2 = ' <center>  <span style=" color: #CC33FF"> ' + category + ' </span>  <br />' + title + '<br />' + '</center>';
        // Create the marker

        // Add popup without adding to map
        // marker.bindPopup(categoryid2, { opacity: 0.1 });

        console.log('MARKER_102: Creating store marker at:', coords, 'for category:', categoryid2);
        L.marker(coords, { icon: icon })
            .addTo(this.map)
            .bindPopup(categoryid2, { opacity: 0.1 });
    }

    addAllMarker(category, title, coords) {
        let icon;
        switch (category) {
            case 'گندم':
                icon = icons.Gandom_;
                break;
            case 'سورنا':
                icon = icons.Sorena_;
                break;
            case 'رفاه':
                icon = icons.Refah_;
                break;
            case 'افق کوروش':
                icon = icons.ofog_;
                break;
            case 'سپه':
                icon = icons.Sepah_;
                break;
            case 'جانبو':
                icon = icons.Canbo_;
                break;
            case 'وین مارکت':
                icon = icons.WinMarket_;
                break;
            case 'محسن':
                icon = icons.Mohsen_;
                break;
            case 'دیلی مارکت':
                icon = icons.Daily_;
                break;
            case 'هفت':
                icon = icons.Haft_;
                break;
            case 'اتکا':
                icon = icons.Etka_;
                break;
            case 'فامیلی':
                icon = icons.Family_;
                break;
            case 'شهروند':
                icon = icons.Shahrvand_;
                break;
            case 'هایپر استار':
                icon = icons.Hayperstar_;
                break;
            case 'امیران':
                icon = icons.Amiran_;
                break;
            case 'هایپرمی':
                icon = icons.Haypermy_;
                break;
            case 'مفید':
                icon = icons.Mofid_;
                break;
            case 'کوثر':
                icon = icons.Kousar_;
                break;
            case 'یاس':
                icon = icons.Yas_;
                break;
            case 'سوپرمارکت':
                icon = icons.super_;
                break;
            default:
                icon = icons.super_; // آیکون پیش‌فرض
                break;
        }

        if (!coords || !coords[0] || !coords[1]) {
            console.log(icon, '=== === O  K  O  K  ===:', category);
            return icon;
        }

        console.log(title, 'MARKER_012: :', icon, 'for category:', category);

        let categoryid2 = ' <center>  <span style=" color: #CC33FF"> ' + category + ' </span>  <br />' + title + '<br />' + '</center>';
        const marker = L.marker(coords, { icon });
        marker.bindPopup(categoryid2, { opacity: 0.1 });

        console.log('POPUP_2:  :', title);
        return marker;
    }

    // تعریف لیست دسته‌بندی‌ها به صورت گلوبال
    static BUSINESS_CATEGORIES = [
        'hospital', 'attraction', 'bakery', 'bank', 'barracks', 'bus_station', 'bus_stop',
        'camp_site', 'caravan_site', 'clinic', 'elementray_school', 'fruit_vegetable_store', 'fuel',
        'high_school', 'hospice', 'hotel', 'kindergarten', 'hyper_market', 'laboratory', 'marketplace',
        'mosque', 'parking', 'parking_space', 'police', 'public_transport_building', 'public_transportation',
        'school', 'subway', 'subway_line', 'supermarket', 'theme_park', 'tower', 'trade_store',
        'train_station', 'university'
    ];

    async drawPopulationDensity(latlng, map) {
        try {
            // محاسبه مختصات مربع 1x1 کیلومتر
            const degLng = 0.006;
            const degLat = 0.005;
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
            const url = `${Url_domain}tara/MapServer/identify?geometryType=esriGeometryEnvelope&layers=id:0&tolerance=1&mapExtent=46.5,34.2,46.6,34.1&imageDisplay=1,1,1&f=json&geometry=${buffer}`;

            const response = await fetch(url);
            const data = await response.json();

            if (!data.results || data.results.length === 0) {
                await this.showPopulationInfo(rectangle, 0, 0, 0);
                return;
            }

            let totalPopulation = 0;
            let totalHouseholds = 0;
            let totalArea = 0;
            let densities = [];

            data.results.forEach(result => {
                const attributes = result.attributes;
                totalPopulation += parseFloat(attributes.Population || 0);
                totalHouseholds += parseFloat(attributes.Khanevar || 0);
                totalArea += parseFloat(attributes.Area_HT || 0);
                densities.push(parseFloat(attributes.Tarakom || 0));

                if (result.geometry && result.geometry.rings) {
                    result.geometry.rings.forEach(ring => {
                        const coordinates = ring.map(point => [point[1], point[0]]);
                        const density = parseFloat(attributes.Tarakom || 0);

                        let polygonStyle;
                        if (density === 0) {
                            polygonStyle = {
                                color: '#ff0000',
                                weight: 1,
                                opacity: 0.3,
                                fillOpacity: 0.1,
                                fillColor: '#ff0000'
                            };
                        } else {
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
                                <h6 style="color: #2c3e50; margin-bottom: 10px;">اطلاعات بلوک شهری</h6>
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
                                        <td style="padding: 5px; border-bottom: 1px solid #eee;">${this.formatNumber(attributes.Tarakom || 0)} نفر/هکتار</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px; border-bottom: 1px solid #eee;"><strong>مساحت:</strong></td>
                                        <td style="padding: 5px; border-bottom: 1px solid #eee;">${this.formatNumber(attributes.Area_HT || 0)} هکتار</td>
                                    </tr>
                                </table>
                            </div>
                        `);
                    });
                }
            });
            await this.showPopulationInfo(rectangle, totalPopulation, totalHouseholds, totalArea);
            const density = totalArea > 0 ? (totalPopulation / totalArea).toFixed(2) : 0;
            // console.log(density, '=-=-=-', totalPopulation, '---', totalPopulation, '===', ' ===totalPopulation', totalArea);

            return { population: totalPopulation, households: totalHouseholds, area: totalArea, tarakom: density };

            // return totalPopulation + ',' + totalHouseholds + ',' + totalArea;

        } catch (error) {
            console.error('Error in    tionDensity:', error);
            return null;
        }
    }

    /**
     * پردازش اطلاعات کسب و کارها
     * @param {Array} businesses - آرایه کسب و کارها
     * @returns {Object} اطلاعات پردازش شده
     */
    processBusinessData(businesses) {
        if (!Array.isArray(businesses)) return [];

        // دسته‌بندی کسب و کارها بر اساس نوع
        const categorized = businesses.reduce((acc, business) => {
            const category = business.category || 'other';
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(business);
            return acc;
        }, {});

        // محاسبه آمار
        const stats = {
            total: businesses.length,
            byCategory: Object.entries(categorized).map(([category, items]) => ({
                category,
                count: items.length,
                items: items
            }))
        };

        return stats;
    }

    /**
     * پردازش اطلاعات تراکم جمعیتی
     * @param {string} density - رشته تراکم جمعیتی
     * @returns {Object} اطلاعات پردازش شده
     */
    processDensityData(density) {
        if (!density) return null;

        const [population, households, area] = density.split(',').map(Number);
        return {
            population: population || 0,
            households: households || 0,
            area: area || 0,
            density: area > 0 ? (population / area).toFixed(2) : 0
        };
    }

    /**
     * پردازش اطلاعات دهستان
     * @param {Object} district - اطلاعات دهستان
     * @returns {Object} اطلاعات پردازش شده
     */
    processDistrictData(district) {
        if (!district) return null;

        return {
            location: district.location || {},
            statistics: district.statistics || {},
            summary: {
                name: district.location?.villageDistrict || '',
                totalVillages: district.statistics?.villageCount || 0,
                totalPopulation: district.statistics?.population || 0
            }
        };
    }

    /**
     * پردازش اطلاعات نزدیک‌ترین فروشگاه
     * @param {Object} store - اطلاعات فروشگاه
     * @returns {Object} اطلاعات پردازش شده
     */
    processNearestStoreData(store) {
        if (!store?.nearest) return null;

        return {
            distance: {
                meters: store.nearest.distance,
                kilometers: parseFloat(store.distanceKm)
            },
            location: {
                lat: store.nearest.location.lat,
                lng: store.nearest.location.lng
            },
            status: this.extractStoreStatus(store.nearest.popup)
        };
    }


    /**
     * پردازش تمام داده‌ها
     * @param {Object} allData - تمام داده‌های دریافتی
     * @returns {Object} داده‌های پردازش شده
     */
    processAllData(allData) {
        return {
            businesses: this.processBusinessData(allData.businesses),
            density: this.processDensityData(allData.density),
            district: this.processDistrictData(allData.district),
            nearestStore: this.processNearestStoreData(allData.nearestStore),
            location: allData.location
        };
    }
} 