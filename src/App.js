import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PoiBaseApp from "./PoiBaseApp";
import PublishPoi from "./PublishPoi";
import User from "./User";
import withLogin from "./Login";
import EditFlyer from "./EditFlyer";
import LocationTracker from "./LocationTracker";

const App = () => {
    useEffect(() => {
        const isFirstLoad = sessionStorage.getItem('isAppLoaded');
        if (!isFirstLoad) {
            localStorage.clear();
            sessionStorage.setItem('isAppLoaded', 'true');
        }
    }, []);

    const WLUser = withLogin(User);
    const WLEditFlyer = withLogin(EditFlyer);
    const WLLocationTracker = withLogin(LocationTracker);

    return (
        <Router>
            <Routes>
                <Route path="/" element={<WLUser />} />
                <Route path="/p/:shortId" element={<PublishPoi />} />
                <Route path="/edit/:shortId" element={<WLEditFlyer />} />
                <Route path="/locateme/:shortId" element={<WLLocationTracker />} />
                {/*<Route path="/g/:shortId" element={<PublishGroup />} />*/}
                {/*<Route path={"/poiingroup/:shortId"} element={<WLPoiTable getPois={getOwnGroupPois} />} />*/}
                {/*<Route path={"/editgroup/:shortId"} element={<WLEditGroup />} />*/}
                <Route path="/poibase" element={<PoiBaseApp />} />
            </Routes>
        </Router>
    );
};

export default App;
