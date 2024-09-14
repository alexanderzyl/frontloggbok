import React, {useState} from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import AddPoi from "./AddPoi";

const Login = () => {

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const backendUrl = process.env.REACT_APP_BACKEND_URL;

    const login = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                // tokenResponse contains the credential (ID token)
                const res = await axios.post(`${backendUrl}/auth/google`, {
                    token: tokenResponse.access_token,  // Make sure this contains the Google token
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const { access_token } = res.data;
                // console.log('Access Token:', access_token);
                localStorage.setItem('token', access_token);
                window.location.href = '/user';
                // setIsLoggedIn(true);

            } catch (err) {
                console.error('Authentication failed:', err);
            }
        },
        onError: () => {
            console.log('Login Failed');
        },
        scope: 'openid email profile',  // Request the right scopes for OpenID Connect
        flow: 'implicit', // Ensure you're using the right OAuth flow
    });

    // return (
    //     <div>
    //         {isLoggedIn ? (
    //             <AddPoi />   // Render AddPoi component after successful login
    //         ) : (
    //             <button onClick={() => login()}>Sign in with Google</button>
    //         )}
    //     </div>
    // );

    return (
        <div>
            <button onClick={() => login()}>Sign in with Google</button>
        </div>
    );
};

export default Login;
