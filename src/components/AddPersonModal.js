// src/components/AddPersonModal.js
import React from 'react';
import Modal from 'react-modal';
import PersonForm from './PersonForm';
import './AddPersonModal.css';

const AddPersonModal = ({ isOpen, onRequestClose, refreshList, initialPerson, isUpdate }) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            className="modal"
            overlayClassName="modal-overlay"
            contentLabel={isUpdate ? "Mis A Jour Person" : "Ajouter Person"}
        >
            <button className="close-button" onClick={onRequestClose}>
                &times;
            </button>
            <h2>{isUpdate ? "Mis A Jour Person" : "Ajouter Person"}</h2>
            <PersonForm
                refreshList={refreshList}
                initialPerson={initialPerson}
                isUpdate={isUpdate}
                onRequestClose={onRequestClose}  // Pass the onRequestClose function
            />
        </Modal>
    );
};

export default AddPersonModal;