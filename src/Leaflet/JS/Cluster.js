/****************************************Map******************************************************** */
const getMaps = async function() {
    var map = L.map('MapSection').setView([32.287, 52.954], 5);
    L.tileLayer('https://a.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Gandom'
    }).addTo(map);

    /********** MarkerCluster *****/
    var markers = L.markerClusterGroup();
    var sums = [];
    var markersList = [];

    function populate() {
        //console.log(sums)
        for (let i = 0; i < sums.length; i++) {
            // console.log(sums[i][2])
            // var m = new L.Marker([sums[i][0], sums[i][1], sums[i][2]]);
            var a = addressPoints[i];
            console.log(a[2])
                // markersList.push(m);
                // console.log(sums[i][2])
                // markers.addLayer(m);
        }
        return false;
    }

    function populateRandomVector() {
        for (var i = 0, latlngs = [], len = 20; i < len; i++) {
            latlngs.push(getRandomLatLng(map));
        }
        var path = new L.Polyline(latlngs);
        map.addLayer(path);
    }

    function getRandomLatLng(map) {
        var bounds = map.getBounds(),
            southWest = bounds.getSouthWest(),
            northEast = bounds.getNorthEast(),
            lngSpan = northEast.lng - southWest.lng,
            latSpan = northEast.lat - southWest.lat;

        return new L.LatLng(
            southWest.lat + latSpan * Math.random(),
            southWest.lng + lngSpan * Math.random());
    }

    markers.on('clusterclick', function(a) {
        //  alert('cluster ' + "aa");
        //  alert('cluster ' + a.layer.getAllChildMarkers().length);
    });

    markers.on('click', function onClick(e) { 
        // console.log(e)  

    });


    populate();
    map.addLayer(markers);

    /********** Add CheckBox *****/
    var GanodmEditableLayers = new L.FeatureGroup();
    map.addLayer(GanodmEditableLayers);
    var OfoghEditableLayers = new L.FeatureGroup();
    map.addLayer(OfoghEditableLayers);
    var drawingLayers = {
        "گندم": GanodmEditableLayers,
        "افق کوروش": OfoghEditableLayers,
    };
    L.control.layers(null, drawingLayers, { position: 'topleft', collapsed: false }).addTo(map);
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
        },
        edit: {
            featureGroup: GanodmEditableLayers
        }
    };
    var drawControl = new L.Control.Draw(drawOptions);
    map.addControl(drawControl);
    var iconSetting = L.Icon.extend({
        options: {
            iconSize: [25, 25],
            iconAnchor: [20, 35]
        }
    });
    var customIcon = new iconSetting({
        iconUrl: '/IMG/location.png'
    });

    var OfficeIcon = new iconSetting({
        iconUrl: '/IMG/OfficeIcon.png'
    });


    /******* Add Ostan DropDown *****/
    var OstanLayers = L.control({ position: 'topright' });
    OstanLayers.onAdd = function(map) {
        var div = L.DomUtil.create('div', 'info OstanLayers');
        div.innerHTML = '<label>استان</label><select id ="OstanSection" class="form-select" aria-label="Default select example"><option value="">انتخاب نمایید</option></select>';
        div.firstChild.onmousedown = div.firstChild.ondblclick = L.DomEvent.stopPropagation;
        return div;
    };
    OstanLayers.addTo(map);


    /****** Get Data Ostan *****/
    $pnp.sp.web.lists.getByTitle(ListName.Ostan).items.get().then(async(ResultOstan) => {
        $("#ShahrSection").empty().append('<option value="">انتخاب نمایید</option>');
        $("#ShahrdariSection").empty().append('<option value="">انتخاب نمایید</option>');
        for (let i = 0; i < ResultOstan.length; i++) {
            $('#OstanSection').append(`<option value="${ResultOstan[i].ID}">${ResultOstan[i].Title}</option>`);
        }
    })



    /***** Check Dropdown Value */
    $('#OstanSection').change(function() {
        sums = [];
        markersList = [];

        var value = $(this).val();
        //  var Shahr = document.getElementById("ShahrSection").value
        $("#ShahrdariSection").empty().append('<option value="">انتخاب نمایید</option>');
        $('img[src="/IMG/OfficeIcon.png"]').hide()
        if (value !== "") {
            $pnp.sp.web.lists.getByTitle(ListName.Shahr).items.filter(`OstanId eq ${value}`).getAll().then(async(ResultShahr) => {
                $("#ShahrSection").empty().append('<option value="">انتخاب نمایید</option>');
                for (let i = 0; i < ResultShahr.length; i++) {
                    $('#ShahrSection').append(`<option value="${ResultShahr[i].ID}">${ResultShahr[i].Title}</option>`);
                }
            })
            $('img[src="/IMG/location.png"]').hide()
            $pnp.sp.web.lists.getByTitle(ListName.Stores).items
                .select("Latitude", "Longitude", "Title", "StoreCode", "ID", "Shahr/Id", "Shahr/Title", "Ostan/Id", "Ostan/Title")
                .expand("Shahr", "Ostan")
                .filter(`OstanId eq ${value}`).getAll().then(async(OstanMap) => {
                    for (let i = 0; i < OstanMap.length; i++) {
                        markers.clearLayers();
                        sums.push([OstanMap[i].Latitude, OstanMap[i].Longitude, OstanMap[i].Title, OstanMap[i].StoreCode, OstanMap[i].ID, OstanMap[i].Shahr])
                    }
                    populate();
                })
            $pnp.sp.web.lists.getByTitle(ListName.Offices).items.filter(`OstanId eq ${value}`).getAll().then(async(OfficesMap) => {
                for (let i = 0; i < OfficesMap.length; i++) {
                    //  console.log(OfficesMap[i].length);
                    L.marker([OfficesMap[i].Latitude, OfficesMap[i].Longitude], {
                        icon: OfficeIcon
                    }).addTo(map).bindPopup('<b>نام دفتر:</b>' + ' ' + OfficesMap[i].Title);
                }
            })
        } else {
            $("#ShahrSection").empty().append('<option value="">انتخاب نمایید</option>');
            //$("#ShahrdariSection").empty().append('<option value="">انتخاب نمایید</option>');
            $('img[src="/IMG/location.png"]').hide()
        }
    });



}