import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ErrorPage.css';

const ErrorPage = () => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate('/');
    };

    return (
        <div className="error-page">
            <h2>Error: Invalid Credentials</h2>
            <button onClick={handleGoBack}>Go Back</button>
        </div>
    );
};

export default ErrorPage;
