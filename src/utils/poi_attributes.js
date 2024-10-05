
export const navigate_options = {
    open_map: false,
    navigate_google: false,
    navigate_sygic: false,
    navigate_apple: false,
}

export const setNavigateOptions = (attributes) => {
    const newPopupOptions = {...navigate_options};
    attributes.forEach((attr) => {
        if (attr.key in newPopupOptions) {
            newPopupOptions[attr.key] = attr.value === "1";
        }});
    return newPopupOptions;
}