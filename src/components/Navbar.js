// Navbar.js
import React, { useState } from 'react';
import OutillageListUser from './OutillageListUser';
import CaisseListUser from './CaisseListUser';
import EtalonnageListUser from './EtalonnageListUser';
import DispositionListUser from './DispositionListUser';
import InventaireListUser from './InventaireListUser';
import Systeme from './Systeme';
import Modal from './Modal';

import './Navbar.css';
import { FaUserCircle } from 'react-icons/fa';
import PersonFormUser from './PersonFormUser';

const Navbar = ({ user, onLogout }) => {
    const [currentPage, setCurrentPage] = useState('user');
    const [showUserDetails, setShowUserDetails] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(user);  // Use local state for the user

    const toggleUserDetails = () => {
        setShowUserDetails(!showUserDetails);
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleUserUpdate = (updatedUser) => {
        setCurrentUser(updatedUser);  // Update the local state with the new user details
        setShowUserDetails(false);    // Close the user details dropdown after update
    };

    const renderPage = () => {
        switch (currentPage) {
            case 'Inventaire':
                return (
                    <InventaireListUser
                        mle={currentUser?.mle}
                        password={currentUser.password} 
                        prenom={currentUser?.prenom}
                        nom={currentUser?.nom}
                        service={currentUser?.service}
                        departement={currentUser?.departement}
                        ginventaire={currentUser?.ginventaire}
                    />
                );
            case 'mis a disposition':
                return (
                    <DispositionListUser
                        mle={currentUser?.mle}
                        password={currentUser.password} 
                        prenom={currentUser?.prenom}
                        nom={currentUser?.nom}
                        service={currentUser?.service}
                        departement={currentUser?.departement}
                        gdisposition={currentUser?.gdisposition}
                    />
                );
            case 'outillage':
                return (
                    <OutillageListUser
                        mle={currentUser?.mle}
                        password={currentUser.password} 
                        prenom={currentUser?.prenom}
                        nom={currentUser?.nom}
                        goutillage={currentUser?.goutillage}
                    />
                );
            case 'caisse':
                return (
                    <CaisseListUser
                        mle={currentUser?.mle}
                        password={currentUser.password} 
                        prenom={currentUser?.prenom}
                        nom={currentUser?.nom}
                        service={currentUser?.service}
                        departement={currentUser?.departement}
                        gcaisse={currentUser?.gcaisse}
                    />
                );
            case 'etalonnage':
                return (
                    <EtalonnageListUser
                        mle={currentUser?.mle}
                        password={currentUser.password} 
                        prenom={currentUser?.prenom}
                        nom={currentUser?.nom}
                        getalonnage={currentUser?.getalonnage}
                    />
                );
            case 'Systeme':
                return <Systeme user={currentUser} />;
            default:
                return <div></div>;
        }
    };

    return (
        <div>
            <nav className="navbar">
                <div className="navbar-content">
                    <div className="navbar-buttons">
                    <img className="navbar-logo" 

        src={require('C:/Users/eljou/Desktop/toolwise/src/images/LOGLOG.png')} 
        alt="ToolWise Logo" 

    />
                        {currentUser?.gsysteme !== 'No Acces' && (
                            <button className="AA" onClick={() => setCurrentPage('Systeme')}>Systeme</button>
                        )}
                        {currentUser?.goutillage !== 'No Acces' && (
                            <button className="AA" onClick={() => setCurrentPage('outillage')}>Gestion Outillages</button>
                        )}
                        {currentUser?.gcaisse !== 'No Acces' && (
                            <button className="AA" onClick={() => setCurrentPage('caisse')}>Gestion Caisses</button>
                        )}
                        {currentUser?.getalonnage !== 'No Acces' && (
                            <button className="AA" onClick={() => setCurrentPage('etalonnage')}>Gestion Etalonnages</button>
                        )}
                        {currentUser?.gdisposition !== 'No Acces' && (
                            <button className="AA" onClick={() => setCurrentPage('mis a disposition')}>Mis à Disposition</button>
                        )}
                        {currentUser?.ginventaire !== 'No Acces' && (
                            <button className="AA" onClick={() => setCurrentPage('Inventaire')}>Gestion Inventaires</button>
                        )}
                    </div>
                    <div className="navbar-right">
                        <FaUserCircle className="profile-icon" onClick={toggleUserDetails} />
                        <span className="navbar-title">
                            {currentUser?.prenom} {currentUser?.nom}
                        </span>
                        
                        {showUserDetails && (
                            <div className="user-details-dropdown">
                                <p><strong>-Name:</strong> {currentUser?.prenom} {currentUser?.nom}</p>
                                <p><strong>-Matricule:</strong> {currentUser?.mle}</p>
                                <p><strong>-Service:</strong> {currentUser?.service}</p>
                                <p><strong>-Departement:</strong> {currentUser?.departement}</p>
                                <p><strong>-Profil:</strong> {currentUser?.nprofil}</p>
                               
                               
                                <button className="AAL" onClick={openModal}>
                                    Parametre
                                </button>
                                <br></br>
                                <button className="AALX" onClick={() => onLogout(currentUser?.mle)} >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
            <div>
                {renderPage()}
            </div>

            {/* Modal for PersonForm */}
            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <PersonFormUser
                    refreshList={() => {}}
                    initialPerson={currentUser}
                    isUpdate={true}
                    onRequestClose={closeModal}
                    onUpdateSuccess={handleUserUpdate}  // Pass the update handler to the form
                />
            </Modal>
        </div>
    );
};

export default Navbar;
