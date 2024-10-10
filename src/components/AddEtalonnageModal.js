import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import './AddEtalonnageModal.css';

const AddEtalonnageModal = ({ isOpen, onRequestClose, refreshList, initialEtalonnage, isUpdate }) => {
    const [etalonnage, setEtalonnage] = useState({
        numSertif: '',
        nserie: '',
        dateDebutEtalonnage: '',
        dateFinEtalonnage: '',
        etat: '',
        exercice: '',
        notification: ''
    });
    const [outillages, setOutillages] = useState([]);
  
    const [filteredOutillages, setFilteredOutillages] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isHistoryModalOpen, setHistoryModalOpen] = useState(false);

    useEffect(() => {
        const fetchOutillages = async () => {
            setLoading(true);
            try {
                const response = await axios.get('/api/outillages');
                setOutillages(response.data);
            } catch (error) {
                setError('Error fetching outillages');
                console.error('Error fetching outillages:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOutillages();
    }, []);

    useEffect(() => {
        const fetchEtalonnages = async () => {
            setLoading(true);
            try {
                const response = await axios.get('/api/etalonnages');
                const etalonnageNseries = response.data
                    .filter(etalonnage => etalonnage.etat === 'Etalonner')
                    .map(etalonnage => etalonnage.outillage?.nserie);

                setFilteredOutillages(outillages.filter(outillage => outillage.etalonnage === 'Applicable'));
            } catch (error) {
                setError('Error fetching etalonnages');
                console.error('Error fetching etalonnages:', error);
            } finally {
                setLoading(false);
            }
        };

        if (outillages.length > 0) {
            fetchEtalonnages();
        }
    }, [outillages]);

    useEffect(() => {
        if (isOpen) {
            if (initialEtalonnage && isUpdate) {
                setEtalonnage({
                    numSertif: initialEtalonnage.numSertif,
                    nserie: initialEtalonnage.outillage ? initialEtalonnage.outillage.nserie : '',
                    dateDebutEtalonnage: initialEtalonnage.dateDebutEtalonnage || '',
                    dateFinEtalonnage: initialEtalonnage.dateFinEtalonnage || '',
                    etat: initialEtalonnage.etat || '',
                    exercice: initialEtalonnage.exercice || '',
                    notification: initialEtalonnage.notification || ''
                });
            } else {
                setEtalonnage({
                    numSertif: '',
                    nserie: '',
                    dateDebutEtalonnage: '',
                    dateFinEtalonnage: '',
                    etat: '',
                    exercice: '',
                    notification: ''
                });
            }
        }
    }, [isOpen, initialEtalonnage, isUpdate]);

    useEffect(() => {
        if (etalonnage.dateDebutEtalonnage) {
            const startDate = new Date(etalonnage.dateDebutEtalonnage);
            const endDate = new Date(startDate);
            endDate.setFullYear(startDate.getFullYear() + 1);

            setEtalonnage(prevEtalonnage => ({
                ...prevEtalonnage,
                dateFinEtalonnage: endDate.toISOString().split('T')[0]
            }));
        }
    }, [etalonnage.dateDebutEtalonnage]);

    useEffect(() => {
        if (etalonnage.dateFinEtalonnage) {
            const currentDate = new Date();
            const dateFinEtalonnage = new Date(etalonnage.dateFinEtalonnage);

            setEtalonnage(prevEtalonnage => ({
                ...prevEtalonnage,
                etat: dateFinEtalonnage > currentDate ? 'Etalonner' : 'Exercer'
            }));

            const diffTime = dateFinEtalonnage - currentDate;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            let notification = '';
            if (diffDays <= 0) {
                notification = 'Étalonnage expiré';
            } else if (diffDays <= 30) {
                notification = 'Il reste moins d\'un mois';
            } else if (diffDays <= 60) {
                notification = 'Il reste moins de deux mois';
            } else if (diffDays <= 90) {
                notification = 'Il reste moins de trois mois';
            } else {
                notification = 'Pas de notification';
            }

            setEtalonnage(prevEtalonnage => ({
                ...prevEtalonnage,
                notification
            }));
        }
    }, [etalonnage.dateFinEtalonnage]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEtalonnage(prevEtalonnage => ({
            ...prevEtalonnage,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = isUpdate ? `/api/etalonnages/${etalonnage.numSertif}` : '/api/etalonnages';
        const method = isUpdate ? 'put' : 'post';

        setLoading(true);
        setError('');

        try {
            console.log('Submitting etalonnage:', etalonnage);
            await axios({ method, url, data: etalonnage });
            await addEtalonnageHistory(); // Trigger history addition
            await addOutillageHistory();
            refreshList();
            onRequestClose();
        } catch (error) {
            if (error.response) {
                const status = error.response.status;
                const message = error.response.data?.message || error.response.statusText;
                
                if (status === 400) {
                    setError(`Bad request: ${message}`);
                } else if (status === 404) {
                    setError(`Resource not found: ${message}`);
                } else if (status === 500) {
                    setError(`Server error: ${message}`);
                } else {
                    setError(`Unexpected error: ${message}`);
                }
                console.error('Error details:', error.response);
            } else if (error.request) {
                setError('No response received from the server.');
                console.error('Error request:', error.request);
            } else {
                setError('Request setup error: ' + error.message);
                console.error('Error message:', error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const addEtalonnageHistory = async () => {
        const historyData = {
            id: generateRandomId(),
            operation: isUpdate ? 'Mis A Jour Etalonnage' : 'Ajouter Etalonnage',
            dateEtalonnageHistory: getCurrentDateTime(),
            person: etalonnage.outillage ? etalonnage.outillage.mle : 'admin',  // Check if outillage is defined
            numSertif: etalonnage.numSertif,
            nserie: etalonnage.nserie,
            dateDebutEtalonnage: etalonnage.dateDebutEtalonnage,
            dateFinEtalonnage: etalonnage.dateFinEtalonnage,
            etat: etalonnage.etat,
            exercice: etalonnage.exercice,
            notification: etalonnage.notification
        };
    
        try {
            console.log('Adding etalonnage history:', historyData);
            await axios.post('/api/etalonnagehistory', historyData);
            console.log('Etalonnage history added successfully');
            setHistoryModalOpen(true);
        } catch (error) {
            console.error('Error adding etalonnage history:', error);
            setError('Failed to add etalonnage history.');
        }
    };


    const addOutillageHistory =   async () => {
        // Ensure etalonnageData is defined
       
      
        // Find the outillage based on nserie
        const outillage = outillages.find(outillage => outillage.nserie === etalonnage.nserie);
      
        const historyData = {
            outillageId: generateRandomId(), // Generate a unique ID
            operation: isUpdate ? 'Mis A jour Etalonnage' : 'Ajouter Etalonnage',
            dateOutillageHistory: getCurrentDateTime(),
            nserie: etalonnage.nserie,
            designation: outillage ? outillage.designation : '-',
            type: outillage ? outillage.type : '-',
            marque: outillage ? outillage.marque : '-',
            mle: outillage ? outillage.mle : '-',
            caisseMatricule: outillage ? outillage.caisseMatricule : '-',
            reference: outillage ? outillage.reference : '-',
            etalonnage: outillage ? outillage.etalonnage : '-',
            etat: outillage ? outillage.etat : '-',
            resultat: `${isUpdate ? 'Etalonnage' : 'Etalonnage'} ${etalonnage.exercice || '-'}`
        };
        
      
        try {
          console.log('Adding outillage history:', historyData);
          await axios.post('/api/outillagehistory', historyData);
          console.log('Outillage history added successfully');
        } catch (error) {
          console.error('Error adding outillage history:', error);
          setError('Failed to add outillage history.');
          if (error.response) {
            console.error('Server error:', error.response.data);
          }
        }
      };
    
  
    
    const generateRandomId = () => Math.random().toString(36).substring(2, 15);

    const getCurrentDateTime = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
    
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    return (
        <>
            <Modal isOpen={isOpen} onRequestClose={onRequestClose} className="add-etalonnage-modal">
                <h2>{isUpdate ? 'Mis A Jour Etalonnage' : 'Ajouter Etalonnage'}</h2>
                {loading && <p>Loading...</p>}
                {error && <p className="error-message">{error}</p>}
                <form className="forma" onSubmit={handleSubmit}>
                    <div >
                        <label  htmlFor="numSertif">Numéro de Certificat:</label>
                        <input className="for-group"
                            type="text"
                            id="numSertif"
                            name="numSertif"
                            value={etalonnage.numSertif}
                            onChange={handleChange}
                            required
                            disabled={isUpdate}
                        />
                    </div>
                    <div >
                        <label htmlFor="nserie">N° Série:</label>
                        <select className="for-group"
                            id="nserie"
                            name="nserie"
                            value={etalonnage.nserie}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select N° Série</option>
                            {filteredOutillages.map(outillage => (
                                <option key={outillage.nserie} value={outillage.nserie}>
                                    {outillage.nserie}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div >
                        <label htmlFor="dateDebutEtalonnage">Date Début Étalonnage:</label>
                        <input className="for-group"
                            type="date"
                            id="dateDebutEtalonnage"
                            name="dateDebutEtalonnage"
                            value={etalonnage.dateDebutEtalonnage}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div >
                        <label htmlFor="dateFinEtalonnage">Date Fin Étalonnage:</label>
                        <input className="for-group"
                            type="date"
                            id="dateFinEtalonnage"
                            name="dateFinEtalonnage"
                            value={etalonnage.dateFinEtalonnage}
                            onChange={handleChange}
                            required
                        />
                    </div>

                   
                    <div >
                    <label htmlFor="exercice">ETAT:</label>
                     <select className="for-group"

                            name="etat"
                            id="etat"
                            value={etalonnage.etat}
                            onChange={handleChange}
                            readOnly
                        >
                     <option value="">Select ETAT</option>
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                    </select>  
                    </div>

                    <div >
                    <label htmlFor="exercice">Exercice:</label>
                    <select className="for-group"
                        id="exercice"
                        name="exercice"
                        value={etalonnage.exercice}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select an option</option>
                        <option value="Confort">Confort</option>
                        <option value="Inconfort">Inconfort</option>
                    </select>
                </div>

                    <div >
                        <label htmlFor="notification"> Notification:</label>
                        <input className="for-group"
                            type="text"
                            id="notification"
                            name="notification"
                            value={etalonnage.notification}
                            readOnly
                        />
                    </div>
                    <button type="submit" disabled={loading}>{isUpdate ? 'Mis A Jour Etalonnage' : 'Ajouter Etalonnage'}</button>
                    <button type="button" onClick={onRequestClose}>X</button>
                </form>
                
            </Modal>

           
        </>
    );
};

export default AddEtalonnageModal;
