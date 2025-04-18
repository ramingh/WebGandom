// Layer Manager Component
export class LayerManager {
    constructor(containerId, map) {
        this.container = document.getElementById(containerId);
        this.map = map; // ذخیره نمونه map
        this.L = window.L; // استفاده از L از طریق window
        this.layers = {};
        this.isVisible = true;
        this.initSearchBox();
        this.initToggleButton();
        // this.initTrashButton();

        // تعریف آیکون‌های مختلف
        // this.Gandom_ = this.L.icon({
        //     iconUrl: 'https://gis.gandomcs.com/arcgis/rest/services/IR22/MapServer/5/images/icon.png',
        //     iconSize: [32, 32],
        //     iconAnchor: [16, 32]
        // });

        // this.Gandomb_ = this.L.icon({
        //     iconUrl: 'https://gis.gandomcs.com/arcgis/rest/services/IR22/MapServer/5/images/icon_b.png',
        //     iconSize: [32, 32],
        //     iconAnchor: [16, 32]
        // });

        // this.Gandomj_ = this.L.icon({
        //     iconUrl: 'https://gis.gandomcs.com/arcgis/rest/services/IR22/MapServer/5/images/icon_j.png',
        //     iconSize: [32, 32],
        //     iconAnchor: [16, 32]
        // });

        // this.Gandomd_ = this.L.icon({
        //     iconUrl: 'https://gis.gandomcs.com/arcgis/rest/services/IR22/MapServer/5/images/icon_d.png',
        //     iconSize: [32, 32],
        //     iconAnchor: [16, 32]
        // });

        // this.user1_ = this.L.icon({
        //     iconUrl: 'https://gis.gandomcs.com/arcgis/rest/services/IR22/MapServer/5/images/icon_u.png',
        //     iconSize: [32, 32],
        //     iconAnchor: [16, 32]
        // });
    }

    initToggleButton() {
        // Create toggle button
        const toggleButton = document.createElement('button');
        toggleButton.className = 'toggle-layers';
        toggleButton.innerHTML = `
            <i class="fas fa-check-square"></i>
            <span>انتخاب لایه</span>
        `;
        toggleButton.visible = false;
        // Add click event
        this.isVisible = false;  // Set the initial state to hidden  

        toggleButton.addEventListener('click', () => {
            this.isVisible = !this.isVisible;
            const layerContainer = this.container.querySelector('.layer-container');

            console.log('Searching for:', layerContainer);
            if (layerContainer) {
                if (this.isVisible) {
                    layerContainer.classList.remove('hidden');
                    toggleButton.innerHTML = `
                        <i class="fas fa-check-square"></i>
                        <span>انتخاب لایه</span>
                    `;
                } else {
                    layerContainer.classList.add('hidden');
                    toggleButton.innerHTML = `
                        <i class="fas fa-layer-group"></i>
                        <span>انتخاب لایه</span>
                    `;
                }
            }
        });

        // Add button to document
        document.body.appendChild(toggleButton);
    }

    initSearchBox() {
        // Create search container
        const searchContainer = document.createElement('div');
        searchContainer.className = 'search-container';

        // Create search input
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.className = 'search-input';
        searchInput.placeholder = 'جستجو مختصات یا کد فروشگاه';

        // Create search button
        const searchButton = document.createElement('button');
        searchButton.className = 'search-button';
        searchButton.innerHTML = `
            <i class="fas fa-search"></i>
            <span>جستجو</span>
        `;

        // Add click event
        searchButton.addEventListener('click', () => {
            const searchValue = searchInput.value.trim();
            if (searchValue) {
                if (!isNaN(searchValue) && Number.isInteger(Number(searchValue))) {
                    this.find_market(searchValue);
                } else {
                    console.log('Searching for:', searchValue);
                }
            } else {
                this.map.setView([32.287, 52.954], 5.7);
                this.map.clearMap();
            }
        });

        // Add keypress event for Enter key
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const searchValue = searchInput.value.trim();
                if (searchValue) {
                    if (!isNaN(searchValue) && Number.isInteger(Number(searchValue))) {
                        this.find_market(searchValue);
                    } else {
                        console.log('Searching for:', searchValue);
                    }
                } else {
                    this.map.setView([32.287, 52.954], 5.7);
                    this.map.clearMap();
                }
            }
        });

        // Append elements
        searchContainer.appendChild(searchInput);
        searchContainer.appendChild(searchButton);
        document.body.appendChild(searchContainer);
    }

    async loadLayers() {

        try {
            const layers = await this.get_sql();
            if (layers && layers.length > 0) {
                await this.renderLayers(layers);
            } else {
                throw new Error('داده‌های لایه‌ها خالی است');
            }
        } catch (error) {
            console.error('Error loading layers:', error);
            alert('خطا در بارگذاری لایه‌ها');
        }
    }

    async get_sql() {
        const parameter = {
            sqlstr: '[steep]=1'
        };

        return new Promise((resolve, reject) => {
            $.ajax({
                type: 'POST',
                url: 'https://gis1.gandomcs.com/getdata.asmx/Layer',
                data: parameter,
                contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                dataType: 'text',
                crossDomain: true,
                success: function (response) {
                    try {
                        const parser = new DOMParser();
                        const xmlDoc = parser.parseFromString(response, "text/xml");
                        const data = xmlDoc.getElementsByTagName("string")[0].textContent;

                        // console.log('Received data:', data); // اضافه کردن لاگ برای بررسی داده‌ها    

                        if (data) {
                            const layerData = data.split("#").filter(item => item.trim() !== '');
                            // console.log('Received layers:', layerData); // اضافه کردن لاگ برای بررسی داده‌ها
                            resolve(layerData);
                        } else {
                            reject(new Error('داده‌های دریافتی نامعتبر است'));
                        }
                    } catch (error) {
                        console.error('خطا در پردازش داده‌ها:', error);
                        reject(error);
                    }
                },
                error: function (e) {
                    console.error('خطا در دریافت لایه‌ها:', e);
                    reject(e);
                }
            });
        });
    }

    async renderLayers(layerData) {
        // Create container for layers
        const layerContainer = document.createElement('div');
        layerContainer.className = 'layer-container';

        // اضافه کردن این خط برای عبور رویدادهای موس
        layerContainer.style.pointerEvents = 'none';

        // Create header section
        const header = document.createElement('div');
        header.className = 'layer-header';
        // فعال کردن رویدادهای موس برای هدر
        header.style.pointerEvents = 'auto';
        header.innerHTML = `
            <div class="header-title">فهرست اطلاعات</div>
            <div class="route-options">
                <label class="route-option">
                    <input type="radio" name="route" value="walking" checked>
                    <span>مسیر پیاده</span>
                </label>
                <label class="route-option">
                    <input type="radio" name="route" value="driving">
                    <span>مسیر خودرو</span>
                </label>
            </div>
            <div class="layer-view-options">
                <label class="view-option">
                    <input type="radio" name="view" value="single" checked>
                    <span>نمایش یک لایه</span>
                </label>
                <label class="view-option">
                    <input type="radio" name="view" value="multiple">
                    <span>نمایش چندلایه</span>
                </label>
            </div>
        `;

        // Create layers section title
        const layersTitle = document.createElement('div');
        layersTitle.className = 'layers-title';
        layersTitle.textContent = 'نمایش لایه ها';

        // Create layers grid container
        const gridContainer = document.createElement('div');
        gridContainer.className = 'layers-grid';
        // فعال کردن رویدادهای موس برای گرید
        gridContainer.style.pointerEvents = 'auto';

        // Create layer items
        layerData.forEach(layer => {
            const [id, name] = layer.split(',');
            const item = document.createElement('div');
            item.className = 'layer-item';
            item.innerHTML = `
                <label class="layer-label">
                    <input type="checkbox" class="layer-checkbox group1" data-layer-id="${id}">
                    <span>${name}</span>
                </label>
            `;
            gridContainer.appendChild(item);
        });

        // Append all elements
        layerContainer.appendChild(header);
        layerContainer.appendChild(layersTitle);
        layerContainer.appendChild(gridContainer);

        // اضافه کردن استایل به CSS
        const style = document.createElement('style');
        style.textContent = `
            .layer-container {
                pointer-events: none;
            }
            .layer-container .layer-header,
            .layer-container .layers-grid,
            .layer-container input,
            .layer-container label {
                pointer-events: auto;
            }
        `;
        document.head.appendChild(style);

        // Clear previous content
        this.container.innerHTML = '';

        // Add to container
        this.container.appendChild(layerContainer);
        layerContainer.classList.add('hidden');
        // Add event listeners
        this.addLayerEventListeners();

        // console.log('Layers rendered:', layerData.length); // اضافه کردن لاگ برای بررسی رندر
    }

    createLayerItem(id, name) {
        console.error('Error loading lay111:', '11111');
        const item = document.createElement('div');
        item.className = 'layer-item';
        item.style.display = 'flex';
        item.style.alignItems = 'center';
        item.style.justifyContent = 'flex-end';
        item.style.gap = '5px';
        item.style.direction = 'rtl';

        const label = document.createElement('label');
        label.textContent = name;
        label.style.margin = '0 0 0 5px';
        label.style.cursor = 'pointer';
        label.style.fontSize = '12px';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'group1';
        checkbox.dataset.layerId = id;
        checkbox.style.margin = '0';
        checkbox.style.cursor = 'pointer';

        item.appendChild(label);
        item.appendChild(checkbox);

        return item;
    }

    addLayerEventListeners() {
        const checkboxes = this.container.querySelectorAll('.group1');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const layerId = e.target.dataset.layerId;
                const isChecked = e.target.checked;

                // Dispatch custom event for layer toggle
                const event = new CustomEvent('layerToggle', {
                    detail: {
                        id: layerId,
                        visible: isChecked
                    }
                });
                this.container.dispatchEvent(event);
            });
        });
    }

    getIcon(stat) {
        console.log(stat, 'مخت++++++++++و ه:', stat, '-----:', stat);
        switch (stat) {
            case "باز":
                return Gandom_;
            case "بسته":
                return Gandomb_;
            case "در حال جمع آوری":
                return Gandomj_;
            case "در حال راه اندازی":
                return Gandomd_;
            default:
                return user1_;
        }
    }
    // TODO: ================================================================================= find_market
    async find_market(marketcode) {
        const Url_domain = 'https://gis.gandomcs.com/arcgis/rest/services/';
        const baseUrl = `${Url_domain}IR22/MapServer/5/query`;
        const queryParams = new URLSearchParams({
            where: `StoreCode like '%${marketcode}%'`,
            outFields: 'Longitude,Latitude,StoreCode,StoreName,StoreStatus,GZone,ModireMantagheTXT',
            returnGeometry: true,
            f: 'pjson'
        });
        const url_mark = `${baseUrl}?${queryParams.toString()}`;
        try {
            const response = await fetch(url_mark);
            if (!response.ok) throw new Error('پاسخ شبکه مناسب نبود');
            const json = await response.json();
            if (json.features && json.features.length > 0) {
                json.features.forEach(async feature => {
                    const {
                        StoreName: name,
                        StoreCode: storid,
                        StoreStatus: statos,
                        GZone: mantag,
                        ModireMantagheTXT: usename,
                        Longitude: long1,
                        Latitude: lat1
                    } = feature.attributes;

                    const latitude = parseFloat(lat1);
                    const longitude = parseFloat(long1);
                    const markerIcon = this.getIcon(statos);
                    var latlng = this.L.latLng(latitude, longitude);

                    this.L.marker(latlng, { icon: markerIcon })
                        .addTo(this.map)
                        .bindPopup(`
                            <div style="direction: rtl; text-align: right;">
                                <strong>${name}</strong><br>
                                منطقه: ${mantag}<br>
                                وضعیت: ${statos}<br>
                                کد فروشگاه: ${storid}
                            </div>
                        `)
                        .openPopup();

                    console.log(markerIcon, 'مخت++++++++++وشگاه:', latlng, '-----:', statos);

                    // فراخوانی متد count_other از NewMap
                    try {

                        const result = await this.map.draw_loc(
                            latlng,markerIcon,

                            // map instance
                            'restaurant'
                        );
                        console.log('نتایج test1:', result);
                    } catch (error) {
                        console.error('خطا در فراخوانی test1:', error);
                    }
                });

                // تغییر دید نقشه به مرکز ایران
                this.map.setView([32.287, 52.954], 5.5);
            } else {
                console.log('هیچ فروشگاهی با این کد یافت نشد');
            }
        } catch (error) {
            console.error('خطا در جستجوی فروشگاه:', error);
            return false;
        }
    }
} 