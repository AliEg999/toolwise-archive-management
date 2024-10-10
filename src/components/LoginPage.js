import React, { useState } from 'react';
import axios from 'axios';
import './LoginPage.css';

const LoginPage = ({ onLogin }) => {
    const [mle, setMle] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (mle === 'admin' && password === 'admin') {
            onLogin({ isAdmin: true, isUser: false }); // Set the authentication status to true for admin
        } else {
            try {
                // Fetch person data from the backend
                const response = await axios.get('/api/persons');
                const persons = response.data;
                const user = persons.find(person => person.mle === mle && person.password === password);
                
                if (user) {
                    // Fetch the related profil data based on nprofil
                    const profilResponse = await axios.get(`/api/profils/${user.nprofil}`);
                    const profil = profilResponse.data;

                    onLogin({ 
                        isAdmin: false, 
                        isUser: true, 
                        user: { 
                            departement: user.departement,
                            service: user.service,
                            prenom: user.prenom, 
                            nom: user.nom, 
                            mle: user.mle,
                            password: user.password,
                            nprofil: profil.nprofil,
                            gcaisse: profil.gcaisse,
                            goutillage: profil.goutillage,
                            ginventaire: profil.ginventaire,
                            gdisposition: profil.gdisposition,
                            getalonnage: profil.getalonnage,
                            gsysteme: profil.gsysteme
                        } 
                    }); // Pass user and profil data on login
                } else {
                    alert("Invalid credentials. Please try again.");
                }
            } catch (error) {
                console.error("There was an error fetching the persons or profil data!", error);
            }
        }
    };

    return (
        <div className="login-page">
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Mle:</label>
                    <input
                        type="text"
                        value={mle}
                        onChange={(e) => setMle(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Mot De Passe:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default LoginPage;
