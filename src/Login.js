import React, { useEffect, useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import {fetchUser} from "./utils/auth";

const Login = ({onLoggedInChange}) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const backendUrl = process.env.REACT_APP_BACKEND_URL;

    const login = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                const res = await axios.post(`${backendUrl}/auth/google`, {
                    token: tokenResponse.access_token,
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const { access_token } = res.data;
                localStorage.setItem('token', access_token);
                setIsLoggedIn(true);
            } catch (err) {
                console.error('Authentication failed:', err);
            }
        },
        onError: () => {
            console.log('Login Failed');
        },
        scope: 'openid email profile',
        flow: 'implicit',
    });

    useEffect(() => {
        console.log('Checking if user is logged in');
        fetchUser().then(_userData => {
            setIsLoggedIn(true);
        })
            .catch(err => {
                setIsLoggedIn(false);
            });
    }, []);

    useEffect(() => {
        onLoggedInChange(isLoggedIn);
    }, [isLoggedIn]);

    const logout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
    };

    return (
        <div>
            {isLoggedIn ? (
                <div>
                    {/*<h1>Already logged in</h1>*/}
                    <button onClick={logout}>Logout</button>
                </div>
            ) : (
                <div>
                    {/*<h1>Logbok</h1>*/}
                    <button onClick={login}>Login with Google</button>
                </div>
            )}
        </div>
    );
};

const withLogin = (WrappedComponent) => {
    return (props) => {
        const [isLoggedIn, setIsLoggedIn] = useState(false);

        return (
            <div>
                <Login onLoggedInChange={setIsLoggedIn} />
                {isLoggedIn && <WrappedComponent {...props} />}
            </div>
        );
    };
};

export default withLogin;