Loader.load();

function addGps() {
    var center = SMap.Coords.fromWGS84(14.400307, 50.071853);
    var map = new SMap(JAK.gel("map"), center, 5);
    map.addDefaultLayer(SMap.DEF_TURIST).enable();
    map.addDefaultControls();

    var sync = new SMap.Control.Sync();
    map.addControl(sync);
    
    var value = createGpx();
    var xmlDoc = JAK.XML.createDocument(value);
    
    var gpx = new SMap.Layer.GPX(xmlDoc, null, {maxPoints:500, colors:["#ff0000"]});
    map.addLayer(gpx);
    gpx.enable();
    gpx.fit();
}

function createGpx() {
    var gpx = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><gpx><trk><trkseg>";
    run.points.forEach(function(point) {
        var pointGpx = "<trkpt lat=\"" + point.lat.toString() +
        "\" lon=\"" + point.lon.toString() + "\">";
        pointGpx += "</trkpt>";
        gpx += pointGpx;
    });
    gpx += "</trkseg></trk></gpx>"
    return gpx;
}