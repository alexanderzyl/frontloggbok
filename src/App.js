import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PoiBaseApp from "./PoiBaseApp";
import Login from "./Login";

const App = () => (
    <Router>
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/poibase" element={<PoiBaseApp />} />
        </Routes>
    </Router>
);

export default App;
