import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PoiBaseApp from "./PoiBaseApp";
import Login from "./Login";
import PublishPoi from "./PublishPoi";
import User from "./User";
import PublishGroup from "./PublishGroup";

const App = () => {
    useEffect(() => {
        const isFirstLoad = sessionStorage.getItem('isAppLoaded');
        if (!isFirstLoad) {
            localStorage.clear();
            sessionStorage.setItem('isAppLoaded', 'true');
        }
    }, []);

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/user" element={<User />} />
                <Route path="/p/:shortId" element={<PublishPoi />} />
                <Route path="/g/:shortId" element={<PublishGroup />} />
                <Route path="/poibase" element={<PoiBaseApp />} />
            </Routes>
        </Router>
    );
};

export default App;
