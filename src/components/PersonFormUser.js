import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PersonFormUser.css';

const PersonFormUser = ({ refreshList, initialPerson, isUpdate, onRequestClose, onUpdateSuccess }) => {
    const [person, setPerson] = useState({
        mle: '',
        nom: '',
        prenom: '',
        service: '',
        departement: '',
        password: '',
        nprofil: '' 
    });
    const [currentPassword, setCurrentPassword] = useState(''); // State to store current password
    const [verifyPassword, setVerifyPassword] = useState(''); // State for verifying the password
    const [error, setError] = useState(null);
    const [profils, setProfils] = useState([]); 

    useEffect(() => {
        if (isUpdate && initialPerson) {
            setPerson(initialPerson);
            setCurrentPassword(initialPerson.password); // Assuming the initialPerson object contains the current password
        } else {
            setPerson({
                mle: '',
                nom: '',
                prenom: '',
                service: '',
                departement: '',
                password: '',
                nprofil: '' 
            });
            setCurrentPassword('');
        }

        axios.get('/api/profils')
            .then(response => {
                setProfils(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the profils!", error);
            });
    }, [initialPerson, isUpdate]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setPerson({ ...person, [name]: value });
    };

    const handleVerifyPasswordChange = (event) => {
        setVerifyPassword(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (validateForm()) {
            if (person.mle === 'admin') {
                setError("The admin user cannot be added or updated.");
                return;
            }

            if (isUpdate) {
                axios.put(`/api/persons/${person.mle}`, person)
                    .then(() => {
                        refreshList();
                        setError(null);
                        onRequestClose();
                        onUpdateSuccess(person);  // Call this function to refresh the navbar details
                    })
                    .catch(error => {
                        setError(error.message);
                    });
            } else {
                axios.post('/api/persons', person)
                    .then(() => {
                        refreshList();
                        setError(null);
                        onRequestClose();
                        onUpdateSuccess(person);  // Call this function to refresh the navbar details
                    })
                    .catch(error => {
                        setError(error.message);
                    });
            }
        }
    };

    const validateForm = () => {
        if (!person.password || person.password !== verifyPassword) {
            setError('Verifier les deux le mot de passe.');
            return false;
        }
        setError(null);
        return true;
    };

    const isPasswordMatch = person.password === verifyPassword;

    return (
        <form className="person-form-container" onSubmit={handleSubmit}>
            {isUpdate && (
                <div className="form-group">
                    <label htmlFor="currentPassword">Mot De Passe Actuel</label>
                    <input
                        type="text"
                        id="currentPassword"
                        name="currentPassword"
                        value={currentPassword}
                        readOnly
                    />
                </div>
            )}
            <div className="form-group">
                <label htmlFor="password">Nouveau Mot De Passe</label>
                <input
                    type="text"
                    id="password"
                    name="password"
                    onChange={handleChange}
                    placeholder="saisir le nouveau mot de passe"
                    required={!isUpdate}
                />
            </div>
            <div className="form-group">
                <label htmlFor="verifyPassword">Verification Mot De Passe</label>
                <input
                    type="text"
                    id="verifyPassword"
                    name="verifyPassword"
                    value={verifyPassword}
                    onChange={handleVerifyPasswordChange}
                    placeholder="Verification"
                    style={{
                        borderColor: isPasswordMatch ? 'green' : 'red',
                        borderWidth: '2px',
                    }}
                />
            </div>
            {error && <p className="error-message">{error}</p>}
            <button type="submit" className="submit">
                {isUpdate ? 'Mis A Jour Password' : 'Ajouter Person'}
            </button>
        </form>
    );
};

export default PersonFormUser;
