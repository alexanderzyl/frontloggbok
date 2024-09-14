import React, {StrictMode} from 'react';
import {createRoot} from "react-dom/client";
import App from "./App";
import {GoogleOAuthProvider} from "@react-oauth/google";

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

const root = createRoot(document.getElementById('root'));
root.render(
    <StrictMode>
        <GoogleOAuthProvider clientId={clientId}>
            <App />
        </GoogleOAuthProvider>
    </StrictMode>
);
