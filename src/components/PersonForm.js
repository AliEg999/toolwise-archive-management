import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PersonForm.css';

const PersonForm = ({ refreshList, initialPerson, isUpdate, onRequestClose }) => {
    const [person, setPerson] = useState({
        mle: '',
        nom: '',
        prenom: '',
        service: '',
        departement: '',
        password: '',
        nprofil: '' 
    });
    const [error, setError] = useState(null);
    const [profils, setProfils] = useState([]); // State to store the list of profiles

    // Define the options for the dropdowns
    const services = ["INFRA", "Système", "Logistique"];
    const departements = ["IF", "MR", "SI", "ING", "AL"];

    useEffect(() => {
        if (isUpdate && initialPerson) {
            setPerson(initialPerson);
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
        }

        // Fetch the list of profils from the backend
        axios.get('/api/profils')
            .then(response => {
                setProfils(response.data); // Assuming response.data contains the list of profils
            })
            .catch(error => {
                console.error("There was an error fetching the profils!", error);
            });
    }, [initialPerson, isUpdate]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setPerson({ ...person, [name]: value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (validateForm()) {
            if (person.mle === 'admin') {
                setError("L'utilisateur administrateur ne peut pas être ajouté ou mis à jour."); // Set error for admin mle
                return;
            }

            if (isUpdate) {
                // Update form
                axios.put(`/api/persons/${person.mle}`, person)
                    .then(() => {
                        refreshList();
                        setError(null);
                        onRequestClose();  // Close the modal on successful update
                    })
                    .catch(error => {
                        setError(error.message);
                    });
            } else {
                // Add form
                axios.post('/api/persons', person)
                    .then(() => {
                        refreshList();
                        setError(null);
                        onRequestClose();  // Close the modal on successful add
                    })
                    .catch(error => {
                        setError(error.message);
                    });
            }
        }
    };

    const validateForm = () => {
        // Basic validation example
        if (!person.mle || !person.nom || !person.prenom || !person.departement || !person.password) {
            setError('All fields are required');
            return false;
        }
        setError(null);
        return true;
    };

    return (
        <form className="person-form-container" onSubmit={handleSubmit}>
            {/* Other form fields */}
            <div className="form-group">
                <label htmlFor="mle">Mle</label>
                <input
                    type="text"
                    id="mle"
                    name="mle"
                    value={person.mle}
                    onChange={handleChange}
                    placeholder="Entrez Le Mle"
                    disabled={isUpdate}  // Disable the Mle field for updates
                />
            </div>
            <div className="form-group">
                <label htmlFor="nom">Nom</label>
                <input
                    type="text"
                    id="nom"
                    name="nom"
                    value={person.nom}
                    onChange={handleChange}
                    placeholder="Entrez Le Nom"
                />
            </div>
            <div className="form-group">
                <label htmlFor="prenom">Prenom</label>
                <input
                    type="text"
                    id="prenom"
                    name="prenom"
                    value={person.prenom}
                    onChange={handleChange}
                    placeholder="Entrez Le Prenom"
                />
            </div>
            <div className="form-group">
                <label htmlFor="service">Service</label>
                <select
                    id="service"
                    name="service"
                    value={person.service}
                    onChange={handleChange}
                >
                    <option value="">Select Service</option>
                    {services.map((svc, index) => (
                        <option key={index} value={svc}>
                            {svc}
                        </option>
                    ))}
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="departement">Département</label>
                <select
                    id="departement"
                    name="departement"
                    value={person.departement}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select Département</option>
                    {departements.map((dept, index) => (
                        <option key={index} value={dept}>
                            {dept}
                        </option>
                    ))}
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="password">Mot De Passe</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={person.password}
                    onChange={handleChange}
                    placeholder="Entrez Le Mot De Passe"
                    required={!isUpdate}
                />
            </div>
            <div className="form-group">
                <label htmlFor="nprofil">Profil</label>
                <select
                    id="nprofil"
                    name="nprofil"
                    value={person.nprofil}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select Profil</option>
                    {profils.map(profil => (
                        <option key={profil.nprofil} value={profil.nprofil}>
                            {profil.nprofil}
                        </option>
                    ))}
                </select>
            </div>
            {error && <p className="error-message">{error}</p>}
            <button type="submit" className="submit">
                {isUpdate ? 'Mis A Jour Password' : 'Ajouter Person'}
            </button>
        </form>
    );
};

export default PersonForm;
