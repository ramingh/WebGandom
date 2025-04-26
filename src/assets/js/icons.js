const L = window.L;

const url_path = '/IMG/';

function createIcon(iconName) {
    return L.icon({
        iconUrl: url_path + iconName,
        iconSize: [20, 30],
        popupAnchor: [0, 0]
    });
}

// تعریف آیکون‌های مورد نیاز
export const icons = {
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

// آیکون‌های فروشگاه‌ها
// export const storeIcons = {
//     Gandom_: L.icon({
//         iconUrl: 'https://gis.gandomcs.com/arcgis/rest/services/IR22/MapServer/5/images/icon.png',
//         iconSize: [32, 32],
//         iconAnchor: [16, 32]
//     }),
//     // ... سایر آیکون‌های فروشگاه
// };

// آیکون‌های دسته‌بندی
export const categoryIcons = {
    'hospital': L.divIcon({
        html: '<i class="fas fa-hospital" style="color: #FF4444;"></i>',
        className: 'category-marker hospital',
        iconSize: [20, 20]
    }),
    'attraction': L.divIcon({
        html: '<i class="fas fa-landmark" style="color: #FFA500;"></i>',
        className: 'category-marker attraction',
        iconSize: [20, 20]
    }),
    'bakery': L.divIcon({
        html: '<i class="fas fa-bread-slice" style="color: #8B4513;"></i>',
        className: 'category-marker bakery',
        iconSize: [20, 20]
    }),
    'bank': L.divIcon({
        html: '<i class="fas fa-university" style="color:rgb(168, 10, 220);"></i>',
        className: 'category-marker bank',
        iconSize: [20, 20]
    }),
    'barracks': L.divIcon({
        html: '<i class="fas fa-shield-alt" style="color: #808080;"></i>',
        className: 'category-marker barracks',
        iconSize: [20, 20]
    }),
    'bus_line': L.divIcon({
        html: '<i class="fas fa-route" style="color: #006400;"></i>',
        className: 'category-marker bus-line',
        iconSize: [20, 20]
    }),
    'bus_station': L.divIcon({
        html: '<i class="fas fa-bus" style="color: #006400;"></i>',
        className: 'category-marker bus-station',
        iconSize: [20, 20]
    }),
    'bus_stop': L.divIcon({
        html: '<i class="fas fa-stop-circle" style="color: #006400;"></i>',
        className: 'category-marker bus-stop',
        iconSize: [20, 20]
    }),
    'camp_site': L.divIcon({
        html: '<i class="fas fa-campground" style="color: #228B22;"></i>',
        className: 'category-marker camp-site',
        iconSize: [20, 20]
    }),
    'caravan_site': L.divIcon({
        html: '<i class="fas fa-caravan" style="color: #8B4513;"></i>',
        className: 'category-marker caravan-site',
        iconSize: [20, 20]
    }),
    'clinic': L.divIcon({
        html: '<i class="fas fa-clinic-medical" style="color: #FF69B4;"></i>',
        className: 'category-marker clinic',
        iconSize: [20, 20]
    }),
    'elementray_school': L.divIcon({
        html: '<i class="fas fa-chalkboard-teacher" style="color: #4169E1;"></i>',
        className: 'category-marker elementary-school',
        iconSize: [20, 20]
    }),
    'fruit_vegetable_store': L.divIcon({
        html: '<i class="fas fa-apple-alt" style="color: #FF6347;"></i>',
        className: 'category-marker fruit-store',
        iconSize: [20, 20]
    }),
    'fuel': L.divIcon({
        html: '<i class="fas fa-gas-pump" style="color: #FFD700;"></i>',
        className: 'category-marker fuel',
        iconSize: [20, 20]
    }),
    'high_school': L.divIcon({
        html: '<i class="fas fa-school" style="color: #4169E1;"></i>',
        className: 'category-marker high-school',
        iconSize: [20, 20]
    }),
    'hospice': L.divIcon({
        html: '<i class="fas fa-heartbeat" style="color: #FF69B4;"></i>',
        className: 'category-marker hospice',
        iconSize: [20, 20]
    }),
    'hotel': L.divIcon({
        html: '<i class="fas fa-hotel" style="color: #FFD700;"></i>',
        className: 'category-marker hotel',
        iconSize: [20, 20]
    }),
    'kindergarten': L.divIcon({
        html: '<i class="fas fa-baby" style="color: #FFB6C1;"></i>',
        className: 'category-marker kindergarten',
        iconSize: [20, 20]
    }),
    'hyper_market': L.divIcon({
        html: '<i class="fas fa-shopping-bag" style="color: #32CD32;"></i>',
        className: 'category-marker hyper-market',
        iconSize: [20, 20]
    }),
    'laboratory': L.divIcon({
        html: '<i class="fas fa-flask" style="color: #9370DB;"></i>',
        className: 'category-marker laboratory',
        iconSize: [20, 20]
    }),
    'marketplace': L.divIcon({
        html: '<i class="fas fa-store" style="color: #FF8C00;"></i>',
        className: 'category-marker marketplace',
        iconSize: [20, 20]
    }),
    'mosque': L.divIcon({
        html: '<i class="fas fa-mosque" style="color: #008080;"></i>',
        className: 'category-marker mosque',
        iconSize: [20, 20]
    }),
    'parking': L.divIcon({
        html: '<i class="fas fa-parking" style="color: #808080;"></i>',
        className: 'category-marker parking',
        iconSize: [20, 20]
    }),
    'parking_space': L.divIcon({
        html: '<i class="fas fa-car" style="color: #808080;"></i>',
        className: 'category-marker parking-space',
        iconSize: [20, 20]
    }),
    'police': L.divIcon({
        html: '<i class="fas fa-shield-alt" style="color: #000080;"></i>',
        className: 'category-marker police',
        iconSize: [20, 20]
    }),
    'public_transport_building': L.divIcon({
        html: '<i class="fas fa-building" style="color: #006400;"></i>',
        className: 'category-marker transport-building',
        iconSize: [20, 20]
    }),
    'public_transportation': L.divIcon({
        html: '<i class="fas fa-train" style="color: #006400;"></i>',
        className: 'category-marker public-transport',
        iconSize: [20, 20]
    }),
    'school': L.divIcon({
        html: '<i class="fas fa-graduation-cap" style="color: #4169E1;"></i>',
        className: 'category-marker school',
        iconSize: [20, 20]
    }),
    'subway': L.divIcon({
        html: '<i class="fas fa-subway" style="color: #006400;"></i>',
        className: 'category-marker subway',
        iconSize: [20, 20]
    }),
    'subway_line': L.divIcon({
        html: '<i class="fas fa-route" style="color: #006400;"></i>',
        className: 'category-marker subway-line',
        iconSize: [20, 20]
    }),
    'supermarket': L.divIcon({
        html: '<i class="fas fa-shopping-cart" style="color: #32CD32;"></i>',
        className: 'category-marker supermarket',
        iconSize: [20, 20]
    }),
    'theme_park': L.divIcon({
        html: '<i class="fas fa-theater-masks" style="color: #FF69B4;"></i>',
        className: 'category-marker theme-park',
        iconSize: [20, 20]
    }),
    'tower': L.divIcon({
        html: '<i class="fas fa-building" style="color: #808080;"></i>',
        className: 'category-marker tower',
        iconSize: [20, 20]
    }),
    'trade_store': L.divIcon({
        html: '<i class="fas fa-store-alt" style="color: #FF8C00;"></i>',
        className: 'category-marker trade-store',
        iconSize: [20, 20]
    }),
    'train_station': L.divIcon({
        html: '<i class="fas fa-train" style="color: #006400;"></i>',
        className: 'category-marker train-station',
        iconSize: [20, 20]
    }),
    'university': L.divIcon({
        html: '<i class="fas fa-university" style="color: #4169E1;"></i>',
        className: 'category-marker university',
        iconSize: [20, 20]
    }),
    'default': L.divIcon({
        html: '<i class="fas fa-map-marker-alt" style="color: #888888;"></i>',
        className: 'category-marker default',
        iconSize: [20, 20]
    })
};

export default {
    ...icons,
    // ...storeIcons,
    categoryIcons
}; 