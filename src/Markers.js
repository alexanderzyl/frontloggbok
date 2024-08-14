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

export function createImageMarker(selectedImage) {
    const div_marker = document.createElement('div');

    const div_image = document.createElement('div');
    div_image.className = 'image-marker';
    div_image.style.backgroundImage = `url(${selectedImage.url})`;
    div_marker.appendChild(div_image);

    // Create a navigate button
    const navigateButton = document.createElement('button');
    navigateButton.className = 'navigate-button';
    navigateButton.innerHTML = 'Navigate';
    navigateButton.onclick = function () {
        openNavigation(selectedImage.latitude, selectedImage.longitude);
    };
    div_marker.appendChild(navigateButton);
    return div_marker;
}