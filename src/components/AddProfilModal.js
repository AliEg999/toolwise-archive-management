import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import './AddProfilModal.css';


const AddProfilModal = ({ isOpen, onRequestClose, refreshList, initialProfil, isUpdate }) => {
    const [profil, setProfil] = useState({
        nprofil: '',
        gcaisse: '',
        goutillage: '',
        ginventaire: '',
        gdisposition: '',
        getalonnage: '',
        gsysteme: ''
    });

    useEffect(() => {
        if (isOpen) {
            if (isUpdate && initialProfil) {
                setProfil(initialProfil);
            } else {
                // Reset to default values for adding new profile
                setProfil({
                    nprofil: '',
                    gcaisse: '',
                    goutillage: '',
                    ginventaire: '',
                    gdisposition: '',
                    getalonnage: '',
                    gsysteme: ''
                });
            }
        }
    }, [isOpen, initialProfil, isUpdate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfil(prevState => ({ ...prevState, [name]: value }));
    };

    
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Submitting Profil:", profil);  // Debugging line
        if (isUpdate) {
            axios.put(`/api/profils/${profil.nprofil}`, profil)
                .then(() => {
                    refreshList();
                    onRequestClose();
                })
                .catch(error => {
                    console.error("There was an error updating the profil!", error);
                });
        } else {
            axios.post('/api/profils', profil)
                .then(() => {
                    refreshList();
                    onRequestClose();
                })
                .catch(error => {
                    console.error("There was an error adding the profil!", error);
                });
        }
    };

    

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            className="modal"
            overlayClassName="modal-overlay"
            contentLabel={isUpdate ? "Mis A Jour Profil" : "Ajouter Profil"}
        >
            <button className="close-button" onClick={onRequestClose}>
                &times;
            </button>
            <h2>{isUpdate ? "Mis A Jour Profil" : "Ajouter Profil"}</h2>
            <form className="person-form-container" onSubmit={handleSubmit}>
                <label className="form-group">
                    Nom Profil:
                    <input
                        type="text"
                        name="nprofil"
                        value={profil.nprofil}
                        onChange={handleChange}
                        disabled={isUpdate}  // Disable editing the primary key during update
                        required
                    />
                </label>
                <label className="form-group">
                    Gestion caisse:
                    <select
                        name="gcaisse"
                        value={profil.gcaisse}
                        onChange={handleChange}
                    >
                        <option value="">Select Access</option>
                        <option value="Lecture">Lecture</option>
                        <option value="Ecriture">Ecriture</option>
                        <option value="No Acces">No Accès</option>
                    </select>
                </label>
                <label className="form-group">
                    Gestion outillage:
                    <select
                        name="goutillage"
                        value={profil.goutillage}
                        onChange={handleChange}
                    >
                        <option value="">Select Access</option>
                        <option value="Lecture">Lecture</option>
                        <option value="Ecriture">Ecriture</option>
                        <option value="No Acces">No Accès</option>
                    </select>
                </label>
                <label className="form-group">
                    Inventaire:
                    <select
                        name="ginventaire"
                        value={profil.ginventaire}
                        onChange={handleChange}
                    >
                        <option value="">Select Access</option>
                        <option value="Lecture">Lecture</option>
                        <option value="Ecriture">Ecriture</option>
                        <option value="No Acces">No Accès</option>
                    </select>
                </label>
                <label className="form-group">
                    Mis A Disposition:
                    <select
                        name="gdisposition"
                        value={profil.gdisposition}
                        onChange={handleChange}
                    >
                        <option value="">Select Access</option>
                        <option value="Lecture">Lecture</option>
                        <option value="Ecriture">Ecriture</option>
                        <option value="No Acces">No Accès</option>
                    </select>
                </label>
                <label className="form-group">
                    Gestion Etalonnage:
                    <select 
                        name="getalonnage"
                        value={profil.getalonnage}
                        onChange={handleChange}
                    >
                        <option value="">Select Access</option>
                        <option value="Lecture">Lecture</option>
                        <option value="Ecriture">Ecriture</option>
                        <option value="No Acces">No Accès</option>
                    </select>
                </label>
                <label className="form-group">
                    Systeme:
                    <select
                        name="gsysteme"
                        value={profil.gsysteme}
                        onChange={handleChange}
                    >
                        <option value="">Select Access</option>
                        <option value="Lecture">Lecture</option>
                        <option value="Ecriture">Ecriture</option>
                        <option value="No Acces">No Accès</option>
                    </select>
                </label>
                <button type="submit">{isUpdate ? "Mis A Jour" : "Ajouter"} Profil</button>
            </form>
        </Modal>
    );
};

export default AddProfilModal;
