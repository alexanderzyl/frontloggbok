import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PoiBaseApp from "./PoiBaseApp";
import PublishPoi from "./PublishPoi";
import User from "./User";
import PoiTable from "./PoiTable";
import EditGroup from "./EditGroup";
import withLogin from "./Login";

const App = () => {
    useEffect(() => {
        const isFirstLoad = sessionStorage.getItem('isAppLoaded');
        if (!isFirstLoad) {
            localStorage.clear();
            sessionStorage.setItem('isAppLoaded', 'true');
        }
    }, []);

    const WLUser = withLogin(User);

    return (
        <Router>
            <Routes>
                <Route path="/" element={<WLUser />} />
                <Route path="/p/:shortId" element={<PublishPoi />} />
                {/*<Route path="/g/:shortId" element={<PublishGroup />} />*/}
                {/*<Route path={"/poiingroup/:shortId"} element={<WLPoiTable getPois={getOwnGroupPois} />} />*/}
                {/*<Route path={"/editgroup/:shortId"} element={<WLEditGroup />} />*/}
                <Route path="/poibase" element={<PoiBaseApp />} />
            </Routes>
        </Router>
    );
};

export default App;
