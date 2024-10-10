import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
//import './AddInventaireModal.css';

const AddInventaireModal = ({ isOpen, onRequestClose, refreshList, initialInventaire, isUpdate }) => {
    const [inventaire, setInventaire] = useState({
        numInventaire: '',
        dateInventaire: '',
        caisseMatricule: '',
        resultats: '',
    });

    const [caisses, setCaisses] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchCaisses = async () => {
            setLoading(true);
            try {
                const response = await axios.get('/api/caisses');
                setCaisses(response.data);
            } catch (error) {
                console.error('Error fetching caisses:', error);
                setError('Failed to fetch caisses.');
            } finally {
                setLoading(false);
            }
        };

        fetchCaisses();
    }, []);

    useEffect(() => {
        if (isOpen) {
            if (initialInventaire && isUpdate) {
                setInventaire({
                    numInventaire: initialInventaire.numInventaire,
                    dateInventaire: initialInventaire.dateInventaire,
                    caisseMatricule: initialInventaire.caisse ? initialInventaire.caisse.caisseMatricule : '',
                    resultats: initialInventaire.resultats,
                });
            } else {
                setInventaire({
                    numInventaire: '',
                    dateInventaire: '',
                    caisseMatricule: '',
                    resultats: '',
                });
            }
        }
    }, [isOpen, initialInventaire, isUpdate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInventaire({ ...inventaire, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = isUpdate ? `/api/inventaires/${inventaire.numInventaire}` : '/api/inventaires';
        const method = isUpdate ? 'put' : 'post';

        setLoading(true);
        setError('');

        try {
            await axios({ method, url, data: {
                numInventaire: inventaire.numInventaire,
                dateInventaire: inventaire.dateInventaire,
                caisse: { caisseMatricule: inventaire.caisseMatricule },  // send only necessary details
                resultats: inventaire.resultats,
            }});
            refreshList();
            onRequestClose();
        } catch (error) {
            setError('Failed to submit data. Please check the input values.');
            console.error('Error response:', error.response);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose} className="add-inventaire-modal">
            <h2>{isUpdate ? 'Mis A Jour Inventaire' : 'Ajouter Inventaire'}</h2>
            {loading && <p>Loading...</p>}
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
                <label>
                    Num Inventaire:
                    <input
                        type="text"
                        name="numInventaire"
                        value={inventaire.numInventaire}
                        onChange={handleChange}
                        required={!isUpdate}
                        disabled={isUpdate}
                    />
                </label>
                <label>
                    Date Inventaire:
                    <input
                        type="date"
                        name="dateInventaire"
                        value={inventaire.dateInventaire}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Caisse Matricule:
                    <select
                        name="caisseMatricule"
                        value={inventaire.caisseMatricule}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Caisse</option>
                        {caisses.map(caisse => (
                            <option key={caisse.caisseMatricule} value={caisse.caisseMatricule}>
                                {caisse.caisseMatricule} - {caisse.caisseName}
                            </option>
                        ))}
                    </select>
                </label>
                <label>
                    Resultats:
                    <input
                        type="text"
                        name="resultats"
                        value={inventaire.resultats}
                        onChange={handleChange}
                        required
                    />
                </label>
                <button type="submit" disabled={loading}>{isUpdate ? 'Mis A Jour' : 'Ajouter'}</button>
                <button type="button" onClick={onRequestClose}>X</button>
            </form>
        </Modal>
    );
};

export default AddInventaireModal;
