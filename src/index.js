import React, {StrictMode} from 'react';
import {createRoot} from "react-dom/client";
import App from "./App";
import {GoogleOAuthProvider} from "@react-oauth/google";

const clientId = '488970297051-dqhmrvfbg3huoicbecc7mh5rp7f7031a.apps.googleusercontent.com';

const root = createRoot(document.getElementById('root'));
root.render(
    <StrictMode>
        <GoogleOAuthProvider clientId={clientId}>
            <App />
        </GoogleOAuthProvider>
    </StrictMode>
);
