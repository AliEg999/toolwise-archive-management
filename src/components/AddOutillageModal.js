import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import './AddOutillageModal.css';

const AddOutillageModal = ({ isOpen, onRequestClose, refreshList, initialOutillage, isUpdate }) => {
    const [outillage, setOutillage] = useState({
        nserie: '',
        designation: '',
        type: '',
        marque: '',
        mle: '',
        caisseMatricule: '',
        reference: '',
        etalonnage: '',
        etat: '',
        inventaire: '',
    });

    const [persons, setPersons] = useState([]);
    const [filteredPersons, setFilteredPersons] = useState([]);
    const [caisses, setCaisses] = useState([]);
    const [filteredCaisses, setFilteredCaisses] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isHistoryModalOpen, setHistoryModalOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const personsResponse = await axios.get('/api/persons');
                setPersons(personsResponse.data);

                const caissesResponse = await axios.get('/api/caisses');
                setCaisses(caissesResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (isOpen) {
            if (initialOutillage && isUpdate) {
                setOutillage(initialOutillage);
            } else {
                setOutillage({
                    nserie: '',
                    designation: '',
                    type: '',
                    marque: '',
                    mle: '',
                    caisseMatricule: '',
                    reference: '',
                    etalonnage: '',
                    etat: '',
                    datecreation: '',
                    inventaire: '',
                });
            }
        }
    }, [isOpen, initialOutillage, isUpdate]);

    useEffect(() => {
        if (outillage.type === 'Nouveaux' ) {
            const filteredPersons = persons.filter(person => person.mle === 'admin');
            setFilteredPersons(filteredPersons);

            const filtered = caisses.filter(caisse => caisse.caisseMatricule === 'Caisse Virtuelle');
            setFilteredCaisses(filtered);
        } else {
            setFilteredPersons(persons);

            const filtered = caisses.filter(caisse =>
                (caisse.type === outillage.type || caisse.caisseMatricule === 'Caisse Virtuelle') &&
                (outillage.mle === '' || caisse.mle === outillage.mle)
            );
            setFilteredCaisses(filtered);
        }
    }, [outillage.type, outillage.mle, persons, caisses]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setOutillage({ ...outillage, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = isUpdate ? `/api/outillages/${outillage.nserie}` : '/api/outillages';
        const method = isUpdate ? 'put' : 'post';

        setLoading(true);
        setError('');

        try {
            await axios({ method, url, data: outillage });
            await addOutillageHistory(); // Ensure this line is executed
            refreshList();
            onRequestClose();
        } catch (error) {
            setError('Failed to submit data. Please check the input values.');
            console.error('Error response:', error.response);
        } finally {
            setLoading(false);
        }
    };

    const addOutillageHistory = async () => {
        const historyData = {
            outillageId: generateRandomId(),
            operation: isUpdate ? 'Mis A Jour Outillage' : 'Ajouter Outillage',
            dateOutillageHistory: getCurrentDateTime(),
            person: 'LOGEDIN USER',
            nserie: outillage.nserie,
            designation: outillage.designation,
            type: outillage.type,
            marque: outillage.marque,
            mle: outillage.mle,
            caisseMatricule: outillage.caisseMatricule,
            reference: outillage.reference,
            etalonnage: outillage.etalonnage,
            etat: outillage.etat,
            datecreation: getCurrentDateTime(),
            resultat: '-',
        };

        try {
            await axios.post('/api/outillagehistory', historyData);
            setHistoryModalOpen(true); // Open the history modal
        } catch (error) {
            console.error('Error adding outillage history:', error);
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
            <Modal isOpen={isOpen} onRequestClose={onRequestClose} className="add-outillage-modal">
                <h2>{isUpdate ? 'Mis A Jour Outillage' : 'Ajouter Outillage'}</h2>
                {loading && <p>Loading...</p>}
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleSubmit}>
                    
                    <label>
                        nserie:
                        <input
                            type="text"
                            name="nserie"
                            value={outillage.nserie}
                            onChange={handleChange}
                            required={!isUpdate}
                            disabled={isUpdate}
                        />
                    </label>
                    <label>
                        designation:
                        <input
                            type="text"
                            name="designation"
                            value={outillage.designation}
                            onChange={handleChange}
                            required
                        />
                    </label>


                    <label>
                        type:
                        <select
                            name="type"
                            value={outillage.type}
                            onChange={handleChange}
                        >
                            <option value="">Select Type</option>
                            <option value="Nouveaux">Nouveaux</option>
                            <option value="Individuel">Individuel</option>
                            <option value="InterDepartement">InterDepartement</option>
                            <option value="Commune departement">Commune departement</option>
                            <option value="Commune service">Commune service</option>
                        </select>
                    </label>


                    <label>
                        marque:
                        <input
                            type="text"
                            name="marque"
                            value={outillage.marque}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Affectation:
                        <select
                            name="mle"
                            value={outillage.mle}
                            onChange={handleChange}
                        >
                            <option value="">Select Person</option>
                            {filteredPersons.map(person => (
                                <option key={person.mle} value={person.mle}>
                                    {person.mle} - {person.nom} {person.prenom}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label>
                        Caisse Matricule:
                        <select
                            name="caisseMatricule"
                            value={outillage.caisseMatricule}
                            onChange={handleChange}
                        >
                            <option value="">Select Caisse</option>
                            {filteredCaisses.map(caisse => (
                                <option key={caisse.caisseMatricule} value={caisse.caisseMatricule}>
                                    {caisse.caisseMatricule}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label>
                        reference:
                        <input
                            type="text"
                            name="reference"
                            value={outillage.reference}
                            onChange={handleChange}
                        />
                    </label>




                



                 <label>
                           etalonnage:
                        <select
                            name="etalonnage"
                            value={outillage.etalonnage}
                            onChange={handleChange}
                        >
                      <option value="">Selectionner ETAT</option>
                    <option value="Applicable">Applicable</option>
                    <option value="NON Applicable">NON Applicable</option>
                        </select>
                    </label>


                    <label>
                    Etat:
                    <select
                     name="etat"
                     value={outillage.etat}
                     onChange={handleChange}
                     required
                   >
                    <option value="">Selectionner ETAT</option>
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="NON ACTIVE">INACTIVE</option>
            
                  </select>
                  </label>



                   
                    <button type="submit" disabled={loading}>
                        {isUpdate ? 'Mis A Jour' : 'Ajouter'}
                    </button>
                </form>
                <button onClick={onRequestClose}>X</button>
            </Modal>
         
        </>
    );
};

export default AddOutillageModal;
