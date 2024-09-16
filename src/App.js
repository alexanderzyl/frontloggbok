import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PoiBaseApp from "./PoiBaseApp";
import Login from "./Login";
import Poi from "./Poi";
import User from "./User";

const App = () => (
    <Router>
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/user" element={<User />} />
            <Route path="/poi/:shortId" element={<Poi />} />
            <Route path="/poibase" element={<PoiBaseApp />} />
        </Routes>
    </Router>
);

export default App;
