import React, { useState } from 'react';
import LoginPage from './components/LoginPage';
import UserPage from './components/UserPage';
import AdminPage from './components/AdminPage'; 
import Navbar from './components/Navbar'; 
import NavbarAdmin from './components/NavbarAdmin';
import './App.css';

const App = () => {
    const [authStatus, setAuthStatus] = useState({ isAdmin: false, isUser: false, user: null });

    const handleLogin = (status) => {
        setAuthStatus(status);
    };

    const handleLogout = (mle) => {
        console.log(`User with MLE ${mle} is logging out`);
        setAuthStatus({ isAdmin: false, isUser: false, user: null });  
    };

    if (!authStatus.isAdmin && !authStatus.isUser) {
        return <LoginPage onLogin={handleLogin} />;
    }

    return (
        <div className="App">
            {authStatus.isAdmin ? (
                <>
                    <AdminPage />
                    <NavbarAdmin user={authStatus.user} onLogout={handleLogout} />
                </>
            ) : (
                <>
                    <UserPage user={authStatus.user} onLogout={handleLogout} />
                    <Navbar user={authStatus.user} onLogout={handleLogout} />
                </>
            )}
        </div>
    );
};

export default App;
