# AI Notes

## مشکلات شناسایی شده در NewMap.js

### 1. مشکلات مدیریت حافظه و پاکسازی
- تابع `clearAllMarkers` از متغیر `map` استفاده می‌کند که تعریف نشده است
- وجود دو تابع مشابه `clearMap` و `cclearMap` با عملکرد مشابه که باعث سردرگمی می‌شود
- عدم پاکسازی صحیح event listener‌ها در زمان حذف لایه‌ها

### 2. مشکلات مدیریت Promise‌ها
- استفاده از `async: false` در `Route_find` که با ماهیت async تابع در تضاد است
- عدم مدیریت صحیح خطاها در `fetchAllStores` و `count_other`
- استفاده نادرست از Promise‌ها در `drawDistrict`

### 3. مشکلات API و درخواست‌ها
- عدم بررسی `response.ok` قبل از پردازش داده در `fetchAllStores`
- استفاده از API Key به صورت هاردکد شده
- عدم مدیریت timeout در درخواست‌های API

### 4. مشکلات مدیریت رویدادها
- استفاده از `this` در callback‌های event listener بدون bind مناسب
- عدم پاکسازی event listener‌ها در زمان unmount یا تغییر وضعیت
- تداخل event‌ها در زمان کلیک روی نقشه

### 5. مشکلات ساختاری
- عدم جداسازی منطقی توابع مرتبط (مثلاً توابع مربوط به فروشگاه‌ها، تراکم جمعیت و...)
- تکرار کد در بخش‌های مختلف (مثلاً کد مربوط به popup‌ها)
- عدم استفاده از ثابت‌ها برای مقادیر تکرار شونده

## راه‌حل‌های پیشنهادی

### 1. بهبود مدیریت حافظه
```javascript
clearAllMarkers() {
    try {
        if (this.map) {
            this.clearMap(this.map);
            if (this.gandompoint1) {
                this.map.removeLayer(this.gandompoint1);
            }
        }
    } catch (error) {
        console.error("خطا در حذف نشانگرها:", error);
    }
}
```

### 2. بهبود مدیریت Promise‌ها
```javascript
async Route_find(loc1, loc2, map) {
    try {
        return new Promise((resolve, reject) => {
            $.ajax({
                // ...
                async: true,
                success: (data) => {
                    // پردازش داده
                    resolve(time_all1);
                },
                error: (error) => reject(error)
            });
        });
    } catch (error) {
        console.error('خطا در Route_find:', error);
        return [];
    }
}
```

### 3. بهبود مدیریت API
```javascript
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
        if (!xmlText) {
            throw new Error('No data received');
        }

        // ادامه پردازش...
    } catch (error) {
        console.error('خطا در دریافت فروشگاه‌ها:', error);
        return null;
    }
}
```

### 4. بهبود مدیریت رویدادها
```javascript
iconservice() {
    const self = this;
    // ...
    map.once(L.Draw.Event.CREATED, function(e) {
        self.clearMap(map);
        // ...
    });
}
```

### 5. بهبود ساختار کد
- جداسازی کد به ماژول‌های مجزا
- استفاده از الگوهای طراحی مناسب
- تعریف ثابت‌ها برای مقادیر تکرار شونده

## اقدامات بعدی
1. پیاده‌سازی راه‌حل‌های پیشنهادی
2. تست و اطمینان از عملکرد صحیح
3. مستندسازی تغییرات
4. بهینه‌سازی عملکرد

## یادداشت‌های هوش مصنوعی - پروژه WebGandom
مرور جلسه امروز (بر اساس عملکرد)
۱. نمایش وضعیت فروشگاه‌ها و لیست غیرفعال‌ها
تابع get_solar داده‌های فروشگاه‌ها را از سرور دریافت می‌کند.
وضعیت هر فروشگاه (فعال/غیرفعال/وضعیت ۹) شمارش می‌شود.
فروشگاه‌های غیرفعال در آرایه inactiveStores جمع‌آوری می‌شوند.
جدول وضعیت به‌روزرسانی می‌شود و تعداد فروشگاه‌های فعال و غیرفعال نمایش داده می‌شود.
برای فروشگاه‌های غیرفعال، یک لینک (مشاهده لیست) به صورت dropdown در جدول قرار می‌گیرد که با کلیک روی آن، لیست فروشگاه‌های غیرفعال به صورت اسکرول‌دار و مرتب نمایش داده می‌شود.
۲. مدیریت باز و بسته شدن لیست غیرفعال‌ها (Dropdown)
تابع toggleInactiveStores(event) با کلیک روی لینک، لیست را باز یا بسته می‌کند.
با کلیک خارج از لیست یا کلیک مجدد روی لینک، لیست بسته می‌شود.
۳. نمایش وضعیت پینگ دستگاه‌ها
خروجی وب‌سرویس شامل آبجکت pingResults است که وضعیت هر دستگاه (مانند Router, Server, PC, DVR, Saman, Parsian) را با آدرس و وضعیت (OK/NOT OK) برمی‌گرداند.
ترتیب نمایش نتایج پینگ با آرایه pingOrder کنترل می‌شود. اگر دستگاهی در خروجی نبود، نمایش داده نمی‌شود و ترتیب به هم نمی‌ریزد.
۴. به‌روزرسانی خودکار وضعیت پینگ
تابعی (مثلاً updatePingStatus) هر چند ثانیه یکبار وضعیت پینگ را به‌روزرسانی می‌کند.
با تغییر وضعیت پینگ، رنگ و متن سلول‌های جدول به‌روزرسانی می‌شود.
۵. مدیریت پیام‌ها و آلارم‌ها
تابع showNotification برای نمایش پیام موفقیت یا هشدار به کاربر استفاده می‌شود.
اگر تعداد فروشگاه‌های غیرفعال از حد مجاز بیشتر شود، آلارم نمایش داده می‌شود.
پس از تغییر تنظیمات، بررسی می‌شود که آیا تعداد فروشگاه‌های غیرفعال از مقدار جدید بیشتر است یا نه و فقط در این صورت آلارم نمایش داده می‌شود.
۶. بهبود UI و تجربه کاربری
لیست فروشگاه‌های غیرفعال به صورت dropdown و اسکرول‌دار نمایش داده می‌شود تا اگر تعداد زیاد بود، کاربر بتواند راحت‌تر مشاهده کند.
فونت و رنگ ردیف فروشگاه‌های غیرفعال بهبود یافته تا عدد و متن واضح‌تر و بزرگ‌تر نمایش داده شود.
فاصله بین کلید "به‌روزرسانی" و لیست فروشگاه‌ها تنظیم شد تا ظاهر مرتب‌تر باشد.
۷. نکات مهم درباره ترتیب نمایش پینگ
ترتیب نمایش دستگاه‌ها با آرایه pingOrder کنترل می‌شود و هر تغییری در این آرایه، ترتیب نمایش را تغییر می‌دهد.
اگر یک دستگاه در خروجی نبود (مثلاً Behpardakht)، نمایش داده نمی‌شود و ترتیب به هم نمی‌ریزد.
۸. نکات فنی و مدیریتی
اگر نیاز به ثبت نکته یا جمع‌بندی جدید داشتی، همین فایل (ai-notes.md) را به‌روزرسانی کن.
اگر مشکلی در ذخیره فایل پیش آمد، می‌توانی این متن را دستی کپی و نگهداری کنی تا بعداً دوباره وارد فایل کنی.
پایان یادداشت جلسه امروز

## مرور جلسه امروز (بر اساس عملکرد)

### ۱. نمایش وضعیت فروشگاه‌ها و لیست غیرفعال‌ها
- تابع `get_solar` داده‌های فروشگاه‌ها را از سرور دریافت می‌کند و وضعیت هر فروشگاه را (فعال/غیرفعال/وضعیت ۹) شمارش می‌کند.
- فروشگاه‌های غیرفعال در آرایه `inactiveStores` جمع‌آوری می‌شوند.
- جدول وضعیت به‌روزرسانی می‌شود و تعداد فروشگاه‌های فعال و غیرفعال نمایش داده می‌شود.
- برای فروشگاه‌های غیرفعال، یک لینک (مشاهده لیست) به صورت dropdown در جدول قرار می‌گیرد که با کلیک روی آن، لیست فروشگاه‌های غیرفعال به صورت اسکرول‌دار و مرتب نمایش داده می‌شود.

### ۲. مدیریت باز و بسته شدن لیست غیرفعال‌ها (Dropdown)
- تابع `toggleInactiveStores(event)` با کلیک روی لینک، لیست را باز یا بسته می‌کند.
- با کلیک خارج از لیست یا کلیک مجدد روی لینک، لیست بسته می‌شود.
- لیست به صورت dropdown نمایش داده می‌شود و با کلیک روی هر فروشگاه، اطلاعات آن در جدول به‌روزرسانی می‌شود.

### ۳. به‌روزرسانی جدول وضعیت
- تابع `updateStatusTable` جدول وضعیت را به‌روزرسانی می‌کند و تعداد فروشگاه‌های فعال و غیرفعال را نمایش می‌دهد.
- اگر فروشگاه‌های غیرفعال وجود داشته باشند، یک لینک (مشاهده لیست) به صورت dropdown در جدول قرار می‌گیرد.
- اگر فروشگاه‌های غیرفعال وجود نداشته باشند، لینک (مشاهده لیست) حذف می‌شود.

### ۴. مدیریت خطاها
- تابع `get_solar` در صورت بروز خطا، پیام خطا را نمایش می‌دهد و جدول وضعیت را به‌روزرسانی می‌کند.
- تابع `toggleInactiveStores` در صورت بروز خطا، پیام خطا را نمایش می‌دهد و لیست را بسته می‌کند.

### ۵. UI و UX
- جدول وضعیت به صورت responsive طراحی شده و در همه دستگاه‌ها به درستی نمایش داده می‌شود.
- لیست غیرفعال‌ها به صورت dropdown نمایش داده می‌شود و با کلیک روی هر فروشگاه، اطلاعات آن در جدول به‌روزرسانی می‌شود.
- پیام‌های خطا به صورت toast نمایش داده می‌شوند و بعد از چند ثانیه خودکار بسته می‌شوند.

---

## نکات مهم
- اگر یک دستگاه در خروجی نبود (مثلاً Behpardakht)، نمایش داده نمی‌شود و ترتیب به هم نمی‌ریزد.
- ترتیب نمایش نتایج پینگ در خروجی دقیقاً مطابق با ترتیب آرایه `pingOrder` است.
- اگر فروشگاه‌های غیرفعال وجود نداشته باشند، لینک (مشاهده لیست) حذف می‌شود.

---

## جمع‌بندی
- عملکرد توابع و UI به درستی پیاده‌سازی شده و نیازهای کاربر را برآورده می‌کند.
- مدیریت خطاها به درستی انجام می‌شود و پیام‌های خطا به صورت toast نمایش داده می‌شوند.
- UI و UX به صورت responsive طراحی شده و در همه دستگاه‌ها به درستی نمایش داده می‌شود.

---

## اقدامات بعدی
- تست نهایی و رفع خطاهای احتمالی
- بهینه‌سازی کد و بهبود عملکرد
- اضافه کردن قابلیت‌های جدید در صورت نیاز

## مشکلات جدید شناسایی شده در NewMap.js (1402/12/27)

### 1. مشکلات اساسی در Route_find
```javascript
async Route_find(loc1, loc2, map) {
    // مشکل 1: استفاده از متغیر گلوبال time_all1 
    // مشکل 2: استفاده از async: false در $.ajax
    // مشکل 3: عدم مدیریت صحیح Promise
    $.ajax({
        async: false, // این مورد با async/await تداخل دارد
        success: (data) => {
            time_all1 = [{ timm: timm, dist: dist }]; // استفاده از متغیر گلوبال
        }
    });
    return time_all1; // برگرداندن متغیر گلوبال
}
```

### 2. مشکلات در iconservice
```javascript
action: () => {
    // مشکل 1: استفاده از prompt برای UI
    let radius = prompt("لطفا شعاع را وارد کنید");
    
    // مشکل 2: دسترسی به marker قبل از تعریف
    map.removeLayer(marker); // marker هنوز تعریف نشده
    
    // مشکل 3: عدم cleanup مناسب event listener
    map.once(L.Draw.Event.CREATED, async (e) => {
        // این event listener در صورت unmount پاک نمی‌شود
    });
}
```

### 3. مشکلات در Draw_modir
```javascript
Draw_modir(l1, l2, map) {
    // مشکل 1: استفاده از jQuery.getJSON بدون error handling
    $.getJSON(dd3, (data) => {
        // مشکل 2: عدم بررسی data.results[0] قبل از استفاده
        let managerInfo = data.results[0].attributes;
        
        // مشکل 3: تکرار کد HTML در template string
        const popupContent = `...`;
    });
}
```

### 4. مشکلات در showPopulationInfo
```javascript
async showPopulationInfo(rectangle, population, households, area) {
    // مشکل 1: console.log در کد production
    console.log(nearestStore, ' === nearestStore');
    
    // مشکل 2: تکرار استایل‌های HTML
    const popupContent = `
        <div style="direction: rtl; text-align: right; font-family: Vazir;">
        ...
    `;
}
```

### 5. مشکلات در count_other و fetchLocationDetails
```javascript
async count_other(longitude, latitude, textRadius, map, subcategory, radius) {
    // مشکل 1: استفاده از window.locationCounts
    window.locationCounts = {};
    
    // مشکل 2: عدم مدیریت صحیح pagination
    for (let offset = 0; offset < totalCount; offset += batchSize) {
        // ممکن است به مشکل rate limiting بخورد
    }
}

async fetchLocationDetails() {
    // مشکل 1: استفاده مجدد از window.locationCounts
    if (!window.locationCounts) {
        window.locationCounts = {};
    }
}
```

## راه‌حل‌های پیشنهادی

### 1. بهبود Route_find
```javascript
async Route_find(loc1, loc2, map) {
    return new Promise((resolve, reject) => {
        $.ajax({
            async: true,
            success: (data) => {
                const result = this.processRouteData(data);
                resolve(result);
            },
            error: reject
        });
    });
}
```

### 2. بهبود iconservice
```javascript
async action() {
    try {
        const radius = await this.showRadiusDialog(); // استفاده از modal به جای prompt
        if (!radius) return;
        
        const marker = await this.createMarker(map);
        this.setupMarkerListeners(marker);
    } catch (error) {
        this.handleError(error);
    }
}
```

### 3. بهبود Draw_modir
```javascript
async Draw_modir(l1, l2, map) {
    try {
        const data = await this.fetchManagerData(l1, l2);
        if (!data?.results?.length) return;
        
        const managerInfo = data.results[0].attributes;
        this.renderManagerPolygon(managerInfo, map);
    } catch (error) {
        this.handleError(error);
    }
}
```

### 4. بهبود مدیریت استایل‌ها
```javascript
// تعریف استایل‌های مشترک
const SHARED_STYLES = {
    popup: 'direction: rtl; text-align: right; font-family: Vazir;',
    table: 'width: 100%; border-collapse: collapse;',
    // ...
};

// استفاده از استایل‌های مشترک
const popupContent = `
    <div style="${SHARED_STYLES.popup}">
    ...
`;
```

### 5. بهبود مدیریت state
```javascript
class GandomMap1 {
    constructor() {
        this.locationCounts = new Map(); // استفاده از Map به جای window
        this.markers = new Set(); // مدیریت بهتر مارکرها
    }
    
    cleanup() {
        this.locationCounts.clear();
        this.markers.clear();
        // پاکسازی event listener‌ها
    }
}
```

## اقدامات فوری مورد نیاز
1. حذف استفاده از متغیرهای گلوبال (window.locationCounts)
2. بهبود مدیریت خطاها در تمام API calls
3. استفاده از modal به جای prompt
4. پاکسازی صحیح event listener‌ها
5. جداسازی استایل‌ها به یک فایل مجزا

