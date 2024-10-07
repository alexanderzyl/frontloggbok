
export const navigate_options = {
    open_map: false,
    navigate_google: false,
    navigate_sygic: false,
    navigate_apple: false,
    ride_uber: false,
    ride_bolt: false,
}

export const navigate_texts =    {
    open_map: 'Open Map',
    navigate_google: 'Navigate with Google Maps',
    navigate_sygic: 'Navigate with Sygic',
    navigate_apple: 'Navigate with Apple Maps',
    ride_uber: 'Ride with Uber',
    ride_bolt: 'Ride with Bolt',
};

export const setNavigateOptions = (attributes) => {
    const newPopupOptions = {...navigate_options};
    attributes.forEach((attr) => {
        if (attr.key in newPopupOptions) {
            newPopupOptions[attr.key] = attr.value === "1";
        }});
    return newPopupOptions;
};

export const readEventDetails = (poi) => {
    const eventAttribute = poi.attributes.find(attr => attr.key === 'event');
    if (eventAttribute) {
        return new Date(eventAttribute.value);
    } else {
        return null;
    }
}