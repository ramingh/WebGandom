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
        // this.initLayerToggleButton();
        // Add controls
        this.addRulerControl();
        this.addSearchControl();
        this.addlayerlist();
        this.iconservice();
        this.chech_chekbox();
        console.log('111111111');
        // this.servicemap();
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
        if (!L.drawLocal) {
            L.drawLocal = {};
        }

        L.drawLocal = {
            draw: {
                toolbar: {
                    actions: {
                        title: 'لغو ترسیم',
                        text: 'لغو'
                    },
                    finish: {
                        title: 'پایان ترسیم',
                        text: 'پایان'
                    },
                    undo: {
                        title: 'حذف آخرین نقطه ترسیم شده',
                        text: 'حذف آخرین نقطه'
                    },
                    buttons: {
                        polyline: 'ترسیم خط',
                        polygon: 'ترسیم چندضلعی',
                        rectangle: 'ترسیم مستطیل',
                        circle: 'ترسیم دایره',
                        marker: 'ترسیم نشانگر',
                        circlemarker: 'ترسیم نشانگر دایره‌ای'
                    }
                },
                handlers: {
                    circle: {
                        tooltip: {
                            start: 'برای ترسیم دایره کلیک کرده و بکشید'
                        },
                        radius: 'شعاع'
                    },
                    circlemarker: {
                        tooltip: {
                            start: 'برای قرار دادن نشانگر دایره‌ای کلیک کنید'
                        }
                    },
                    marker: {
                        tooltip: {
                            start: 'برای قرار دادن نشانگر کلیک کنید'
                        }
                    },
                    polygon: {
                        tooltip: {
                            start: 'برای شروع ترسیم کلیک کنید',
                            cont: 'برای ادامه ترسیم کلیک کنید',
                            end: 'برای پایان ترسیم روی اولین نقطه کلیک کنید'
                        }
                    },
                    polyline: {
                        error: 'خطا',
                        tooltip: {
                            start: 'برای شروع ترسیم خط کلیک کنید',
                            cont: 'برای ادامه ترسیم خط کلیک کنید',
                            end: 'برای پایان ترسیم خط روی آخرین نقطه دابل کلیک کنید'
                        }
                    },
                    rectangle: {
                        tooltip: {
                            start: 'برای شروع ترسیم مستطیل کلیک کنید و نگه دارید',
                            cont: 'برای ترسیم مستطیل ماوس را حرکت دهید',
                            end: 'برای پایان ترسیم رها کنید'
                        }
                    },
                    simpleshape: {
                        tooltip: {
                            end: 'برای پایان ترسیم رها کنید'
                        }
                    }
                }
            },
            edit: {
                toolbar: {
                    actions: {
                        save: {
                            title: 'ذخیره تغییرات',
                            text: 'ذخیره'
                        },
                        cancel: {
                            title: 'لغو ویرایش و حذف همه تغییرات',
                            text: 'لغو'
                        },
                        clearAll: {
                            title: 'پاک کردن همه لایه‌ها',
                            text: 'پاک کردن همه'
                        }
                    },
                    buttons: {
                        edit: 'ویرایش لایه‌ها',
                        editDisabled: 'لایه‌ای برای ویرایش وجود ندارد',
                        remove: 'حذف لایه‌ها',
                        removeDisabled: 'لایه‌ای برای حذف وجود ندارد'
                    }
                }
            }
        };

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
                            rectangleDrawer.enable();
                        }
                    },
                    {
                        icon: 'fas fa-map-marker-alt',
                        title: 'مسیر دسترسی',
                        action: () => {
                            const markerDrawer = new L.Draw.Marker(map);
                            markerDrawer.enable();

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
                        action: () => console.log('تراکم جمعیت')
                    },
                    {
                        icon: 'fas fa-shopping-cart',
                        title: 'همه کسب و کارها',
                        action: () => {
                            const rectangleDrawer = new L.Draw.Rectangle(map);
                            rectangleDrawer.enable();
                        }
                    },
                    {
                        icon: 'fas fa-envelope',
                        title: 'کد پستی',
                        action: () => console.log('کد پستی')
                    },
                    {
                        icon: 'fas fa-home',
                        title: 'آبادی  ',
                        action: () => console.log('آبادی  ')
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
        console.log(' دریافت دو مختصات نشانگر:', latlng);
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

    // متد جدید برای تبدیل به PDF
    exportToPDF(reportContent) {
        // استفاده از کتابخانه jsPDF
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // تنظیم فونت فارسی (نیاز به لود فونت مناسب دارد)
        doc.setFont("Arial");
        doc.setR2L(true);

        // عنوان گزارش
        const title = "گزارش فروشگاه‌های محدوده";
        const date = new Date().toLocaleDateString('fa-IR');

        // حذف تگ‌های HTML از محتوا
        const cleanContent = reportContent.replace(/<br\/?>/g, '\n').replace(/<\/?[^>]+(>|$)/g, '');

        // افزودن محتوا به PDF
        doc.text(title, 150, 20, { align: 'right' });
        doc.text(`تاریخ: ${date}`, 150, 30, { align: 'right' });
        doc.text(cleanContent, 150, 50, { align: 'right' });

        // ذخیره فایل
        doc.save('store-report.pdf');
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
                    closeOnClick: false
                });

                // نمایش پاپ‌آپ به صورت خودکار
                polygon.openPopup();
            } 
        });
    }

    //این کد را تقییر نده.
    //این درسته باشه

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
                    // title: L.drawLocal.draw.toolbar.buttons.modir
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

} 