

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import AddOutillageModal from './AddOutillageModal';
import OutillageHistoryList from './OutillageHistoryList';
import './OutillagePage.css';

// Ensure Modal is properly set up
Modal.setAppElement('#root');

const OutillagePagex = ({ isOpen, onClose, outillages, caisse, handleUpdateClick }) => {
    const [outillageData, setOutillageData] = useState({});
    const [isAddOutillageModalOpen, setAddOutillageModalOpen] = useState(false);
    const [isHistoryModalOpen, setHistoryModalOpen] = useState(false);
    const [selectedNserie, setSelectedNserie] = useState(null);

    // Initialize outillageData with the current outillages
    useEffect(() => {
        const initialData = {};
        outillages.forEach(outillage => {
            initialData[outillage.nserie] = outillage;
        });
        setOutillageData(initialData);
    }, [outillages]);

    const closeAddOutillageModal = () => {
        setAddOutillageModalOpen(false);
    };

    const closeHistoryModal = () => {
        setHistoryModalOpen(false);
    };

    const handleActionChange = (nserie, field, value) => {
        setOutillageData(prevState => ({
            ...prevState,
            [nserie]: {
                ...prevState[nserie],
                [field]: value
            }
        }));
    };

    const handleConfirm = async () => {
        try {
            // Create CaisseHistory only once
            const caisseHistoryResponse = await axios.post('/api/caissehistories', {
                caisseId: generateUniqueId(),
                operation: 'invantaire',
                dateCaisseHistory: getCurrentDateTime(),
                caisseName: caisse.caisseName,
                mle: caisse.mle,
                type: caisse.type,
                etat: caisse.etat,
                caisseMatricule: caisse.caisseMatricule,
            });
            console.log('Caisse history saved:', caisseHistoryResponse.data);
    
            // Now update each Outillage and create corresponding OutillageHistory
            await Promise.all(
                Object.values(outillageData).map(async (outillage) => {
                    const { nserie } = outillage;
    
                    // Update outillage data
                    await axios.put(`/api/outillages/${nserie}`, outillage);
    
                    // Save to outillagehistory
                    const outillageHistoryResponse = await axios.post('/api/outillagehistory', {
                        outillageId: generateUniqueId(),
                        operation: 'invantaire',
                        dateOutillageHistory: getCurrentDateTime(),
                        person: outillage.person.nom + ' ' + outillage.person.prenom,
                        nserie: outillage.nserie,
                        designation: outillage.designation,
                        type: outillage.type,
                        marque: outillage.marque,
                        mle: outillage.mle,
                        caisseMatricule: caisse.caisseMatricule,
                        reference: outillage.reference,
                        etalonnage: outillage.etalonnage,
                        etat: outillage.etat,
                        datecreation: outillage.datecreation,
                        inventaire: outillage.inventaire,
                        resultat: outillage.inventaire,
                    });
                    console.log('Outillage history saved:', outillageHistoryResponse.data);
                })
            );
    
            onClose();
            handleUpdateClick();
        } catch (error) {
            console.error('Error updating outillages and saving history:', error);
        }
    };
    
    
    
    // Function to generate unique ID for history records (you may need to adjust this)
    const generateUniqueId = () => {
        return '_' + Math.random().toString(36).substr(2, 9);
    };
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
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Outillage List"
            className="modal"
            overlayClassName="modal-overlay"
        >
            <div className="modal-header">
                <h2>Outillage List pour {caisse.caisseMatricule} </h2>
                <button onClick={onClose} className="modal-close-button">X</button>
            </div>
            <table className="model">
                <thead>
                    <tr>
                        <th>Désignation</th>
                        <th>Marque</th>
                        <th>N° Série</th>
                        <th>Type</th>
                        <th>MLE</th>
                        <th>NOM</th>
                        <th>PRENOM</th>
                        <th>Etat</th>
                        <th>Étalonnage</th>
                        <th>Inventaire</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.values(outillageData).length > 0 ? (
                        Object.values(outillageData).map((outillage) => (
                            <tr key={outillage.nserie}>
                                <td>{outillage.designation}</td>
                                <td>{outillage.marque}</td>
                                <td>{outillage.nserie}</td>
                                <td>{outillage.type}</td>
                                <td>{outillage.mle}</td>
                                <td>{outillage.person.nom}</td>
                                <td>{outillage.person.prenom}</td>
                                <td>{outillage.etat}</td>
                                <td>{outillage.etalonnage}</td>
                                <td>
                                    <select
                                        value={outillage.inventaire || ''}
                                        onChange={(e) => handleActionChange(outillage.nserie, 'inventaire', e.target.value)}
                                    >
                                        <option value="">Sélectionner</option>
                                        <option value="OUI">OUI</option>
                                        <option value="NON">NON</option>
                                    </select>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="10">No outillages found for this caisse.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            <button onClick={handleConfirm} className="confirm-button">Confirm</button>

            <AddOutillageModal
                isOpen={isAddOutillageModalOpen}
                onRequestClose={closeAddOutillageModal}
                refreshList={() => { /* Function to refresh the outillage list */ }}
                isUpdate={false}
                caisse={caisse}
            />

            <OutillageHistoryList
                isOpen={isHistoryModalOpen}
                onRequestClose={closeHistoryModal}
                selectedNserie={selectedNserie}
            />
        </Modal>
    );
};

export default OutillagePagex;

