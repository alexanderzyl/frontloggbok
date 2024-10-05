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