# WebGandom - سیستم GIS فروشگاه‌های زنجیره‌ای گندم

## توضیحات پروژه
این پروژه یک سیستم GIS برای نمایش و مدیریت فروشگاه‌های زنجیره‌ای گندم است. از Leaflet برای نمایش نقشه و jQuery برای درخواست‌های AJAX استفاده شده است.

## ساختار پروژه
```
src/
├── components/         # کامپوننت‌های اصلی
│   ├── LayerManager.js # مدیریت لایه‌ها
│   ├── Map.js         # مدیریت نقشه
│   └── Sidebar.js     # مدیریت نوار کناری
├── assets/            # فایل‌های استاتیک
│   ├── css/          # فایل‌های CSS
│   ├── js/           # فایل‌های JavaScript
│   └── images/       # تصاویر
└── index.html        # صفحه اصلی
```

## مراحل انجام شده

### 1. راه‌اندازی پروژه
- ایجاد ساختار اولیه پروژه
- تنظیم فایل index.html
- اضافه کردن وابستگی‌های اصلی (Bootstrap, Leaflet, jQuery)

### 2. پیاده‌سازی LayerManager
- ایجاد کلاس LayerManager برای مدیریت لایه‌ها
- پیاده‌سازی متدهای اصلی:
  - `loadLayers`: بارگذاری لایه‌ها
  - `fetchLayers`: دریافت داده‌ها از سرور
  - `renderLayers`: نمایش لایه‌ها در رابط کاربری
  - `createLayerItem`: ایجاد آیتم‌های لایه
  - `addLayerEventListeners`: مدیریت رویدادها

### 3. رفع مشکلات CORS
- تغییر آدرس سرور به `gis1.gandomcs.com`
- تنظیم درست درخواست‌های AJAX
- پیاده‌سازی پردازش پاسخ XML

### 4. بهبود رابط کاربری
- اضافه کردن استایل‌های RTL
- بهبود نمایش لایه‌ها در دو ستون
- اضافه کردن انیمیشن‌ها و افکت‌های بصری

## نحوه اجرا
1. نصب Live Server در VS Code
2. باز کردن پروژه در VS Code
3. کلیک راست روی `index.html` و انتخاب "Open with Live Server"

## نکات فنی
- استفاده از ES6+ برای کد JavaScript
- پشتیبانی از RTL
- استفاده از Promise و async/await برای مدیریت درخواست‌ها
- پیاده‌سازی سیستم رویداد سفارشی برای مدیریت لایه‌ها

## وابستگی‌ها
- Bootstrap 5.3.0 (RTL)
- Leaflet 1.9.4
- jQuery 3.7.0
- Font Awesome 6.0.0

## پیکربندی
فایل `.env.example` را کپی کرده و به `.env` تغییر نام دهید:
```env
API_KEY=your_api_key_here
DATABASE_URL=your_db_url
SECRET_KEY=your_secret_key
```

## استفاده
[توضیحات نحوه استفاده از پروژه را اینجا بنویسید]
```javascript
// مثال کد
const webGandom = require('webgandom');
webGandom.init(config);
```

## مشارکت
1. Issue جدید ایجاد کنید
2. ریپازیتوری را فورک کنید
3. برنچ جدید ایجاد کنید (`git checkout -b feature/AmazingFeature`)
4. کامیت کنید (`git commit -m 'Add some AmazingFeature'`)
5. Push کنید (`git push origin feature/AmazingFeature`)
6. Pull Request باز کنید

## مجوز
[نوع مجوز را اینجا مشخص کنید] - برای جزئیات کامل فایل [LICENSE](LICENSE) را مطالعه کنید.

## تماس
- ایمیل: your.email@example.com
- [صفحه گیتهاب](https://github.com/your-username)#   g i s _ h y d r o l i c  
 