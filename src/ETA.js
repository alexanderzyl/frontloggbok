import React, { useState } from 'react';
import axios from 'axios';
import moment from "moment";
import {red} from "@ant-design/colors";

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
                const eta = moment().add(durationInSeconds, 'seconds').format('YYYY-MM-DD HH:mm:ss'); // Get local time of arrival in 24-hour format
                setEta(eta);
            } else {
                console.error('No routes found');
            }
        } catch (error) {
            console.error('Error fetching directions data: ', error);
        }
    };

    React.useEffect(() => {
        console.log('Getting directions...');
        console.log(start);
        console.log(end);
        getDirections(start, end).then();
    }, [start, end]);

    return (
        <div style={{color: red.primary}}>
            { eta !== null ?
                <p>Estimated Time of Arrival: {eta} minutes</p> :
                <p>Calculating ETA...</p>
            }
        </div>
    );
};

export default ETA;