import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';

const OutillagePageInventaire = ({ isOpen, onClose, outillages, handleUpdateClick, caisse }) => {
    const [etatSelections, setEtatSelections] = useState({});

    const handleSelectChange = (nserie, value) => {
        setEtatSelections(prevState => ({
            ...prevState,
            [nserie]: value
        }));
    };

    const handleConfirm = async () => {
        try {
            await Promise.all(
                Object.keys(etatSelections).map(async (nserie) => {
                    const inventaire = etatSelections[nserie];

                    if (inventaire) {
                        await axios.put(`/api/outillages/${nserie}`, { inventaire });
                    }
                })
            );
            onClose(); // Close the modal after updating
            handleUpdateClick(); // Refresh the list or handle updates
        } catch (error) {
            console.error('Error updating outillages:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Outillage List"
            className="modal"
            overlayClassName="modal-overlay"
        >
            <div className="modal-header">
                <h2>Outillages dans {caisse.caisseName || 'Caisse Virtuelle'}</h2>
                <button onClick={onClose}>X</button>
                <button onClick={handleConfirm}>Confirm</button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Désignation</th>
                        <th>Marque</th>
                        <th>N° Série</th>
                        <th>Type</th>
                        <th>Affectation MLE</th>
                        <th>Affectation NOM</th>
                        <th>Affectation PRENOM</th>
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
                                <td>{outillage.mle} </td>
                                <td>{outillage.person.nom} </td>
                                <td>{outillage.person.prenom}</td>
                                <td>
                                    <select
                                        value={etatSelections[outillage.nserie] || ''}
                                        onChange={(e) => handleSelectChange(outillage.nserie, e.target.value)}
                                    >
                                        <option value="">Select Etat</option>
                                        <option value="oui">Oui</option>
                                        <option value="non">Non</option>
                                    </select>
                                </td>
                                <td>{outillage.etalonnage}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="9">No outillages found for this caisse.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </Modal>
    );
};

export default OutillagePageInventaire;
