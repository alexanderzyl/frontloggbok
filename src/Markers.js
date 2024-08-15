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

export function createImageMarker(selectedNp, npInfo) {
    const div_marker = document.createElement('div');

    const div_image = document.createElement('div');
    div_image.className = 'image-marker';
    let image_url = "https://via.placeholder.com/150?text=No%20Image%20Available";
    if (npInfo && npInfo.np_images && npInfo.np_images.length > 0) {
        image_url = npInfo.np_images[0].url;
    }
    div_image.style.backgroundImage = `url(${image_url})`;
    div_marker.appendChild(div_image);

    // Create a navigate button
    const navigateButton = document.createElement('button');
    navigateButton.className = 'navigate-button';
    navigateButton.innerHTML = 'Navigate';
    navigateButton.onclick = function () {
        openNavigation(selectedNp.latitude, selectedNp.longitude);
    };
    div_marker.appendChild(navigateButton);
    return div_marker;
}