import mapboxgl from "mapbox-gl";

function openNavigation(latitude, longitude) {
    let isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    let url = '';

    if (isIOS) {
        url = `maps://?saddr=&daddr=${latitude},${longitude}`;
    } else { // Android and others
        url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    }

    window.open(url, '_blank');
}

export function createPoiPopup(poi) {
    const div_marker = document.createElement('div');
    const div_name = document.createElement('div');
    div_name.className = 'poi-name';
    div_name.innerHTML = poi.name;
    div_marker.appendChild(div_name);

    const div_description = document.createElement('div');
    div_description.className = 'poi-description';
    div_description.innerHTML = poi.description;
    div_marker.appendChild(div_description);

    // Create a navigate button
    const navigateButton = document.createElement('button');
    navigateButton.className = 'navigate-button';
    navigateButton.innerHTML = 'Navigate';
    navigateButton.onclick = function () {
        openNavigation(poi.latitude, poi.longitude);
    };

    return new mapboxgl.Popup({offset: 25})
        .setHTML(div_marker.outerHTML + navigateButton.outerHTML);
}

export async function createNpMarker(np) {
    const el = document.createElement('div');
    el.className = 'marker-np';

    const iconModule = await import(`../public/icons/_${np.category}.png`);
    el.style.backgroundImage = `url(${iconModule.default})`;
    return el;
}

export async function createPoiMarker(poi) {
    const el = document.createElement('div');
    el.className = 'marker-poi';
    let iconModule;
    try {
        iconModule = await import(`../public/icons/${poi.category}.png`);
    } catch (e) {
        // console.error('Icon not found. Fallback to default icon.', e);
        iconModule = await import(`../public/icons/star.png`);
    }
    el.style.backgroundImage = `url(${iconModule.default})`;
    return el;
}

export async function addNewPoiPopup(lngLat, mbFeature) {
    let properties = mbFeature.properties;

    // Display the feature information
    return new mapboxgl.Popup({offset: 25}).setLngLat(lngLat).setHTML(
        '<h3>' + mbFeature.layer.id + '</h3>' + JSON.stringify(properties, null, 2))
}