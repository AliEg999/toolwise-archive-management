// src/components/CaisseModel.js
import React from 'react';
import CaisseForm from './CaisseForm';

import './CaisseModal.css'; // Include your modal CSS

const CaisseModal = ({ show, onClose, caisseToEdit, refreshCaisseList }) => {
    if (!show) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <button className="close-button" onClick={onClose}>X</button>
                <h2>{caisseToEdit ? 'Mis A Jour Caisse' : 'Ajouter Caisse'}</h2>
                <CaisseForm 
                    caisseToEdit={caisseToEdit} 
                    onSave={() => {
                        refreshCaisseList();
                        onClose();
                    }} 
                />
            </div>
        </div>
    );
};

export default CaisseModal;
