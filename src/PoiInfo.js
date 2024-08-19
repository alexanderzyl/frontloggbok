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

const PoiInfo = ({ curPoi }) => {
    const [iconSource, setIconSource] = useState("");
    const handleButtonClick = (buttonType) => {
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
                <button onClick={() => handleButtonClick("Action1")}>Action1</button>
                <button onClick={() => handleButtonClick("Action2")}>Action2</button>
                <button onClick={() => handleButtonClick("Close")}>Close</button>
            </div>
        </div>
    );
};

export default PoiInfo;