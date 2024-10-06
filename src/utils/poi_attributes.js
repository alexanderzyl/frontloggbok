
export const navigate_options = {
    open_map: false,
    navigate_google: false,
    navigate_sygic: false,
    navigate_apple: false,
}

export const navigate_texts =    {
    open_map: 'Open Map',
    navigate_google: 'Navigate with Google Maps',
    navigate_sygic: 'Navigate with Sygic',
    navigate_apple: 'Navigate with Apple Maps',
};

export const setNavigateOptions = (attributes) => {
    const newPopupOptions = {...navigate_options};
    attributes.forEach((attr) => {
        if (attr.key in newPopupOptions) {
            newPopupOptions[attr.key] = attr.value === "1";
        }});
    return newPopupOptions;
};