import React, {useEffect, useState} from 'react';

async function getIcon(category) {
    let iconModule;
    try {
        iconModule = await import(`../public/icons/${category}.png`);
    } catch (e) {
        iconModule = { default: '../public/icons/star.png' };
    }
    return iconModule.default;
}

function openMap(latitude, longitude) {
    let isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    let url = '';

    if (isIOS) {
        url = `maps://?saddr=&daddr=${latitude},${longitude}`;
    } else { // Android and others
        url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    }

    window.open(url, '_blank');
}

function openSygicMap(latitude, longitude) {
    // Create a Sygic URL
    const sygicUrl = `com.sygic.aura://coordinate|${longitude}|${latitude}|drive`;
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = sygicUrl;
    // Append link to body
    document.body.appendChild(link);
    // Simulate click on the link
    link.click();
    // Remove the link from the document
    document.body.removeChild(link);
}

const PoiInfo = ({ curPoi, setCurPoi }) => {
    const [iconSource, setIconSource] = useState("");
    const handleButtonClick = (buttonType) => {
        if(buttonType === "Close") {
            setCurPoi(null);
        }
        else if(buttonType === "Map") {
            openMap(curPoi.latitude, curPoi.longitude);
        }
        else if(buttonType === "Sygic") {
            openSygicMap(curPoi.latitude, curPoi.longitude);
        }

    };

    useEffect(() => {
        const fetchIcon = async () => {
            const icon = await getIcon(curPoi.category);
            setIconSource(icon);
        };
        fetchIcon().then(r => console.log("Icon fetched"));
    }, [curPoi]);

    return (
        <div className="PoiInfo">
            <div>
                <img src={iconSource} alt="" />
                <h2>{curPoi.name}</h2>
            </div>
            <p>
                {curPoi.description}
            </p>
            <div>
                <button onClick={() => handleButtonClick("Map")}>Open Map</button>
                <button onClick={() => handleButtonClick("Sygic")}>Navigate with Sygic</button>
                <button onClick={() => handleButtonClick("Close")}>Close</button>
            </div>
        </div>
    );
};

export default PoiInfo;