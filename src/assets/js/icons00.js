import L from 'leaflet';

const url_path = '/IMG/';

function createIcon(iconName) {
    return L.icon({
        iconUrl: url_path + iconName,
        iconSize: [20, 30],
        popupAnchor: [0, 0]
    });
}

// تعریف آیکون‌های مورد نیاز
  const icons = {
    vlag01_: createIcon( 'vilage1.png'),
    vilage1_: createIcon('vlag1.png'),
    Loc2_: createIcon('loc2.png'),
    user1_: createIcon('marker-icon.png'),
    antique_: createIcon('antique.png'),
    firm_: createIcon('firm.png'),
    tailor_: createIcon('tailor.png'),
    supermarket_: createIcon('supermarket.png'),
    publictransportation_: createIcon('publictransportation.png'),
    marketplace_: createIcon('marketplace.png'),
    hotel_: createIcon('hotel.png'),
    fuel_: createIcon('fuel.png'),
    mosque_: createIcon('mosque.png'),
    clinic_: createIcon('clinic.png'),
    laboratory_: createIcon('laboratory.png'),
    kindergarten_: createIcon('kindergarten.png'),
    parking_: createIcon('parking.png'),
    hospital_: createIcon('hospital.png'),
    police_: createIcon('police.svg'),
    fruitvegetablestore_: createIcon('fruitvegetablestore.png'),
    bank_: createIcon('bank.png'),
    school_: createIcon('school.png'),
    tradestore_: createIcon('tradestore.png'),
    publictransportbuilding_: createIcon('PublicTransportbuilding.png'),
    highschooll_: createIcon('highschool.png'),
    elementrayschool_: createIcon('elementrayschool.png'),
    Subway_: createIcon('subwayline.png'),
    themepark_: createIcon('themepark.png'),
    Tower_: createIcon('Tower.png'),
    Clinic_: createIcon('Clinic.png'),
    trainstation_: createIcon('trainstation.png'),
    university_: createIcon('university.png'),
    CaravanSite_: createIcon('CaravanSite.png'),
    CampSite_: createIcon('CampSite.png'),
    BusStation_: createIcon('BusStation.png'),
    busline_: createIcon('BusLine.png'),
    Barracks_: createIcon('Barracks.png'),
    Attraction_: createIcon('Attraction.png'),
    busstop_: createIcon('busstop.png'),
    hypermarket_: createIcon('hypermarket.png'),
    atm_: createIcon('Atm.png'),
    bakery_: createIcon('Bakery.png'),
    Amiran_: createIcon('Amiran.png'),
    Yas_: createIcon('Yas.png'),
    Kousar_: createIcon('Kousar.png'),
    Mofid_: createIcon('Mofid.png'),
    Haypermy_: createIcon('Haypermy.png'),
    Shahrvand_: createIcon('Shahrvand.png'),
    Hayperstar_: createIcon('Hayperstar.png'),
    Family_: createIcon('Family.png'),
    Daily_: createIcon('Daily.png'),
    Mohsen_: createIcon('Mohsen.png'),
    WinMarket_: createIcon('WinMarket.png'),
    Vivon_: createIcon('Vivon.png'),
    v1_: createIcon('v1.png'),
    Canbo_: createIcon('Canbo.png'),
    Haft_: createIcon('Haft.png'),
    Sepah_: createIcon('Sepah.png'),
    ofog_: createIcon('OK.png', [17, 20]), // این آیکون سایز متفاوتی دارد
    Refah_: createIcon('Refah.png'),
    Sorena_: createIcon('Sorena.png'),
    Etka_: createIcon('Etka.png'),
    Gandomj_: createIcon('Gandomj.png'),
    Gandomd_: createIcon('Gandome.png'),
    Gandom_: createIcon('Gandom.png'),
    Gandomb_: createIcon('GandomClose.png'),
    greenIcon: createIcon('Location.png'),
    super_: createIcon('Market.png')
};

export default icons;

// تعریف نام‌های فارسی برای همه دسته‌بندی‌ها
export const persianNames = {
    'hospital': 'بیمارستان',
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
    'fruit_vegetable_store': 'میوه و سبزی فروشی',
    'fuel': 'پمپ بنزین',
    'high_school': 'دبیرستان',
    'hospice': 'آسایشگاه',
    'hotel': 'هتل',
    'kindergarten': 'مهدکودک',
    'hyper_market': 'هایپرمارکت',
    'laboratory': 'آزمایشگاه',
    'marketplace': 'بازار',
    'mosque': 'مسجد',
    'parking': 'پارکینگ',
    'parking_space': 'پارکینگ',
    'police': 'کلانتری',
    'public_transport_building': 'ساختمان حمل و نقل عمومی',
    'public_transportation': 'حمل و نقل عمومی',
    'school': 'مدرسه',
    'subway': 'مترو',
    'subway_line': 'خط مترو',
    'supermarket': 'سوپرمارکت',
    'theme_park': 'شهربازی',
    'tower': 'برج',
    'trade_store': 'فروشگاه',
    'train_station': 'ایستگاه قطار',
    'university': 'دانشگاه'
};

// تعریف آیکون‌ها برای هر دسته‌بندی
const icons = {
    'hospital': {
        icon: 'fa-hospital',
        color: '#FF4444'
    },
    'attraction': {
        icon: 'fa-landmark',
        color: '#FFA500'
    },
    'bakery': {
        icon: 'fa-bread-slice',
        color: '#8B4513'
    },
    'bank': {
        icon: 'fa-university',
        color: '#4B0082'
    },
    'bus_station': {
        icon: 'fa-bus',
        color: '#006400'
    },
    'mosque': {
        icon: 'fa-mosque',
        color: '#008080'
    },
    'school': {
        icon: 'fa-graduation-cap',
        color: '#4169E1'
    },
    'supermarket': {
        icon: 'fa-shopping-cart',
        color: '#32CD32'
    },
    'default': {
        icon: 'fa-map-marker-alt',
        color: '#888888'
    }
};

// تابع کمکی برای ایجاد آیکون
export function geticon(category) {
    const iconConfig = icons[category] || icons.default;
    
    const icon = L.divIcon({
        html: `<i class="fas ${iconConfig.icon}" style="color: ${iconConfig.color};"></i>`,
        className: `category-marker ${category}`,
        iconSize: [24, 24],
        iconAnchor: [12, 24],
        popupAnchor: [0, -24]
    });

    // اضافه کردن عنوان فارسی به آیکون
    icon.options.title = persianNames[category] || category;
    
    return icon;
} 