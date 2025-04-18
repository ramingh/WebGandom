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

export default icons; 