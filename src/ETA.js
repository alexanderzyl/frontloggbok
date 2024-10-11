import React, { useState } from 'react';
import axios from 'axios';

const ETA = ({ start, end }) => {
    const [eta, setEta] = useState(null);

    const getDirections = async (start, end) => {
        const accessToken = process.env.REACT_APP_MAPBOX_TOKEN;
        const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?access_token=${accessToken}`;

        try {
            const response = await axios.get(url);
            const data = response.data;

            if (data.routes.length > 0) {
                const durationInSeconds = data.routes[0].duration;
                const etaInMinutes = Math.ceil(durationInSeconds / 60); // Convert seconds to minutes and round up
                setEta(etaInMinutes);
            }
        } catch (error) {
            console.error('Error fetching directions data: ', error);
        }
    };

    React.useEffect(() => {
        getDirections(start, end).then();
    }, [start, end]);

    return (
        <div>
            { eta !== null ?
                <p>Estimated Time of Arrival: {eta} minutes</p> :
                <p>Calculating ETA...</p>
            }
        </div>
    );
};

export default ETA;