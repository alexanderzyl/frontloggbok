// src/components/Login.js
import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

const Login = () => {
    const login = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                // tokenResponse contains the credential (ID token)
                // console.log('Test Login: ', tokenResponse);
                const res = await axios.post('http://localhost:8000/api/v1/auth/google', {
                    token: tokenResponse.access_token,  // Make sure this contains the Google token
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                // console.log('Response: ', res.data);

                const { access_token } = res.data;
                // console.log('Access Token:', access_token);
                localStorage.setItem('token', access_token);
                window.location.href = '/dashboard';

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

    return <button onClick={() => login()}>Sign in with Google</button>;
};

export default Login;
