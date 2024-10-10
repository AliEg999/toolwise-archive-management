import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import './AddDispositionModal.css';

const AddDispositionModal = ({ isOpen, onRequestClose, refreshList, initialDisposition, isUpdate, isUpdateX, isUpdateY, isUpdateZ, loggedInMle, selectedNSerie }) => {
    const [disposition, setDisposition] = useState({
        nmad: '',
        nserie: '',
        mle: '',
        datedisposition: '',
        dateretour: '',
        etat: '',
        remarque: '',
        demande: '',
        specialNote: '',
        additionalInfo: '',
        extraField: '', // For isUpdateY
    });
   
    const [outillages, setOutillages] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const outillagesResponse = await axios.get('/api/outillages');
                const filteredOutillages = outillagesResponse.data.filter(outillage =>
                    outillage.type === 'InterDepartement' || outillage.type === 'Nouveaux'
                );
                setOutillages(filteredOutillages);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to load data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (isOpen) {
            if (initialDisposition && (isUpdate || isUpdateX || isUpdateY || isUpdateZ)) {
                setDisposition(initialDisposition);
            } else {
                const today = new Date().toISOString().split('T')[0];
                const randomNMAD = Math.floor(Math.random() * 10000).toString().padStart(4, '0'); // Generate a 4-digit NMAD
                setDisposition({
                    nmad: randomNMAD,
                    nserie: selectedNSerie || '',  // Use selectedNSerie if provided
                    mle: loggedInMle || '',  // Pre-select the logged-in MLE
                    datedisposition: today,
                    dateretour: '',
                    etat: 'Temporaire',
                    remarque: '',
                    demande: 'Demande MAD', // Set default value for add mode
                    specialNote: '',
                    additionalInfo: '',
                    extraField: '' // Default value for isUpdateY
                });
            }
        }
    }, [isOpen, initialDisposition, isUpdate, isUpdateX, isUpdateY, isUpdateZ, loggedInMle, selectedNSerie]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDisposition({ ...disposition, [name]: value });

        // Clear dateretour if etat is 'Definitive'
        if (name === 'etat' && value === 'Definitive') {
            setDisposition(prevDisposition => ({
                ...prevDisposition,
                dateretour: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = isUpdate || isUpdateX || isUpdateY || isUpdateZ ? `/api/dispositions/${disposition.nmad}` : '/api/dispositions';
        const method = isUpdate || isUpdateX || isUpdateY || isUpdateZ ? 'put' : 'post';

        setLoading(true);
        setError('');

        try {
            await axios({ method, url, data: disposition });
            refreshList();
            onRequestClose();
        } catch (error) {
            setError('Failed to submit data. Please check the input values.');
            console.error('Error response:', error.response);
        } finally {
            setLoading(false);
        }
    };

    const minDateDisposition = new Date().toISOString().split('T')[0];
    const minDateRetour = disposition.datedisposition || minDateDisposition;

    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose} className="add-disposition-modal">
            <h2>
                {isUpdate ? 'Mis A Jour Disposition' : 
                 isUpdateX ? 'Mis A Jour Disposition' : 
                 isUpdateY ? 'Mis A Jour Disposition' :
                 isUpdateZ ? 'Mis A Jour Disposition' : 
                 'vous êtes sûr'}
            </h2>
            {loading && <p>Loading...</p>}
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
                {(isUpdate ) && (
                    <>
                        <label>
                            Date Retour:
                            <input
                                type="date"
                                name="dateretour"
                                value={disposition.dateretour}
                                onChange={handleChange}
                                min={minDateRetour}
                            />
                        </label>
                        
                        <label>
                            Remarque:
                            <input
                                type="text"
                                name="remarque"
                                value={disposition.remarque}
                                onChange={handleChange}
                            />
                        </label>
                        <label>
                            Demande:
                            <select
                                name="demande"
                                value={disposition.demande}
                                onChange={handleChange}
                                required
                            >
                                <option value="Demande MAD">Demande MAD</option>
                                <option value="Acceptation">Accepter</option>
                                <option value="Acceptation">Refuser</option>
                                
                            </select>
                        </label>
                    </>
                )}

                {isUpdateX && (
                    <>
                        <label>
                            Remarque:
                            <input
                                type="text"
                                name="remarque"
                                value={disposition.remarque}
                                onChange={handleChange}
                            />
                        </label>
                        <label>
                            Demande:
                            <select
                                name="demande"
                                value={disposition.demande}
                                onChange={handleChange}
                                required
                            >
                                <option value="Demande re-MAD">Demande re-MAD</option>
                                <option value="Acceptation re-MAD">Acceptation re-MAD</option>
                                <option value="Acceptation">Refuser</option>
                            </select>
                        </label>
                    </>
                )}

                {isUpdateZ && (
                    <>
                        
                        <label>
                            Demande:
                            <select
                                name="demande"
                                value={disposition.demande}
                                onChange={handleChange}
                                required
                            >
                                
                                <option value="Acceptation">Acceptation</option>
                                <option value="Demande re-MAD">Demande re-MAD</option>
                               
                            </select>
                        </label>
                    </>
                )}

                {isUpdateY && (
                    <>
                        
                        <label>
                            Demande:
                            <select
                                name="demande"
                                value={disposition.demande}
                                onChange={handleChange}
                                required
                            >
                                <option value="Acceptation">Acceptation</option>
                                <option value="Demande re-MAD">Demande re-MAD</option>
                            </select>
                        </label>
                    </>
                )}

                <button type="submit" disabled={loading}>
                    {isUpdate || isUpdateX || isUpdateY || isUpdateZ ? 'Mis A Jour' : 'Oui'}
                </button>
                <button type="button" onClick={onRequestClose}>X</button>
            </form>
        </Modal>
    );
};

export default AddDispositionModal;
