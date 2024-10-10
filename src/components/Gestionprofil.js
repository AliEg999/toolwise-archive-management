import React, { useState } from 'react';
import ProfilList from './ProfilList';
import AddProfilModal from './AddProfilModal';

const GestionProfil = () => {
    const [refresh, setRefresh] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const refreshList = () => {
        setRefresh(!refresh);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div>
            <button onClick={() => setIsModalOpen(true)}>Ajouter Profil</button>
            <AddProfilModal isOpen={isModalOpen} onRequestClose={closeModal} refreshList={refreshList} />
            <ProfilList key={refresh} />
        </div>
    );
};

export default GestionProfil;
