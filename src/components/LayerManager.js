import icons from '../assets/js/icons.js';

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
    }

    initToggleButton() {
        // Create toggle button
        const toggleButton = document.createElement('button');
        toggleButton.className = 'toggle-layers';
        toggleButton.innerHTML = `
            <i class="fas fa-check-square"></i>
            <span>انتخاب مسیر</span>
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
                        <span>انتخاب مسیر</span>
                    `;
                } else {
                    layerContainer.classList.add('hidden');
                    toggleButton.innerHTML = `
                        <i class="fas fa-layer-group"></i>
                        <span>انتخاب مسیر</span>
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


        // تابع مشترک که منطق جستجو را انجام می دهد  
        const handleSearch = () => {
            // فرض می‌کنیم searchInput یک عنصر ورودی معتبر است و map یک نمونه از نقشه شما است.  

            const searchValue = searchInput.value.trim();
           
            if (searchValue) {
                // 1. تلاش برای تشخیص ورودی به عنوان مختصات جغرافیایی (شامل کاما)  
                const coordinates = searchValue.split(',');

                if (coordinates.length === 2) {
                    const latStr = coordinates[0].trim();
                    const lonStr = coordinates[1].trim();

                    // بررسی اینکه آیا هر دو بخش عدد (اعشاری یا صحیح) هستند  
                    const lat = parseFloat(latStr);
                    const lon = parseFloat(lonStr);

                    if (!isNaN(lat) && !isNaN(lon)) {
                        // می‌توانید اختیاری بررسی کنید که آیا اعداد در محدوده معقول مختصات هستند.  
                        // مثال: if (lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180) {  
                      
                        const result =    this.map.get_alldata([lat, lon]); // فرض می‌کنیم find_market یک آرایه [lat, lon] می‌پذیرد.  
                     
                    //   console.log(result, 'result -------------ly');
                        // } else {  
                        //    console.warn(`Invalid geographic coordinates: "${searchValue}". Values out of range.`);  
                        //    // پیام خطایی به کاربر نمایش دهید.  
                        // }  
                    } else {
                        searchInput.value="";
                        console.warn(`Invalid coordinate format: "${searchValue}". Both values must be numbers.`);
                        // پیام خطایی به کاربر نمایش دهید.  
                    }

                } else {
                    // 2. ورودی شامل کاما نیست، تلاش برای تشخیص عدد صحیح (integer)  
                    const id = parseInt(searchValue, 10); // استفاده از parseInt برای اعداد صحیح و پایه 10  

                    // بررسی اینکه آیا ورودی یک عدد است و آیا بعد از تبدیل به عدد صحیح  
                    // و سپس دوباره تبدیل به رشته، با ورودی اصلی (بدون اعشار احتمالی) یکسان است.  
                    // این کار برای رد کردن ورودی‌هایی مانند "123.45" که parseInt آنها را به 123 تبدیل می‌کند اما صحیح نیستند، لازم است.  
                    if (!isNaN(id) && id.toString() === searchValue) {
                        // همچنین می‌توانید از Number.isInteger(Number(searchValue)) استفاده کنید  
                        // اما روش بالا مطمئن‌تر است زیرا parseInt ممکن است بخش اعشاری را حذف کند.  
                        console.log(`Searching for integer ID: ${id}`);
                        this.find_market(id); // فرض می‌کنیم   یک شناسه عددی می‌پذیرد.  
                    } else {
                        // 3. ورودی نه مختصات معتبر است و نه عدد صحیح معتبر، آن را به عنوان متن جستجو کنید (اگر لازم است)  
                        searchInput.value="";
                        console.warn(`Input "${searchValue}" is neither valid coordinates nor a valid integer.`);
                        // اگر می‌خواهید برای ورودی‌های دیگر به صورت متنی جستجو انجام دهید، خط زیر را فعال کنید:  
                        // console.log('Searching for text:', searchValue);  
                         // در غیر این صورت، فقط یک پیام خطا به کاربر نمایش دهید.  
                    }
                }

            } else {
                // ورودی خالی است، نقشه را به نمای اولیه بازگردانید  
                console.log("Search input is empty. Resetting map view.");
                this.map.setView([32.287, 52.954], 5.7);
                // فرض می‌کنیم clearMap یک متد معتبر برای پاک کردن لایه‌ها/نشانگرها از نقشه است.  
                if (typeof this.map.clearMap === 'function') {
                    this.map.clearMap();
                } else {
                    console.warn("map.clearMap() is not a function. Cannot clear map.");
                    // شاید باید منطق پاک کردن نقشه را اینجا اضافه کنید.  
                }
            } 
 
        };

        // اضافه کردن event listener برای کلیک  
        searchButton.addEventListener('click', handleSearch);
        // اضافه کردن event listener برای فشردن Enter در فیلد ورودی  
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleSearch(); // فراخوانی تابع مشترک  
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
 
        `;
 
        // Create layers section title
        const layersTitle = document.createElement('div');
        layersTitle.className = 'layers-title';
        // layersTitle.textContent = 'نمایش لایه ها';

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
            // gridContainer.appendChild(item);
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

    getStoreStatusConfig(status) {
        return STORE_STATUS_CONFIG[status] || { color: 'grey', icon: 'user1_' };
    }

    getStoreIcon(status) {
        return icons[this.getStoreStatusConfig(status).icon];
    }
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
                    const markerIcon = this.getStoreIcon(statos);
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
                            latlng, markerIcon,
                            `
                            <div style="direction: rtl; text-align: right;">
                                <strong>${name}</strong><br>
                                منطقه: ${mantag}<br>
                                وضعیت: ${statos}<br>
                                کد فروشگاه: ${storid}
                            </div>
                        `,
                            // map instance
                            this.map
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
    //35.275,51.514