// src/components/OutillagePage.js

import React, { useState } from 'react';
import Modal from 'react-modal';
import AddOutillageModal from './AddOutillageModal'; // Import the AddOutillageModal component

// Ensure Modal is properly set up
Modal.setAppElement('#root');

const OutillagePageUser = ({ isOpen, onClose, outillages, caisse }) => {
    const [isAddOutillageModalOpen, setAddOutillageModalOpen] = useState(false);

    const openAddOutillageModal = () => {
        setAddOutillageModalOpen(true);
    };

    const closeAddOutillageModal = () => {
        setAddOutillageModalOpen(false);
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
            <table>
                <thead>
                    <tr>
                        <th>Désignation</th>
                        <th>Marque</th>
                        <th>N° Série</th>
                        <th>Type</th>
                        <th>Affectation</th>
                        <th>Etat</th>
                        <th>Étalonnage</th>
                    </tr>
                </thead>
                <tbody>
                    {outillages.length > 0 ? (
                        outillages.map((outillage) => (
                            <tr key={outillage.nserie}>
                                <td>{outillage.designation}</td>
                                <td>{outillage.marque}</td>
                                <td>{outillage.nserie}</td>
                                <td>{outillage.type}</td>
                                <td>{outillage.mle} - {outillage.person.nom} {outillage.person.prenom}</td>
                                <td>{outillage.etat}</td>
                                <td>{outillage.etalonnage}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7">No outillages found for this caisse.</td>
                        </tr>
                    )}
                </tbody>
            </table>
            <AddOutillageModal
                isOpen={isAddOutillageModalOpen}
                onRequestClose={closeAddOutillageModal}
                refreshList={() => { /* Function to refresh the outillage list */ }}
                isUpdate={false} // Set to true if editing an existing outillage
                caisse={caisse} // Pass the caisse prop here
            />
        </Modal>
    );
};

export default OutillagePageUser;
