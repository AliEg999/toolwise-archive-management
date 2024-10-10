import React, { useState } from 'react';
import InventaireList from './InventaireList';
import DispositionList from './DispositionList';
import OutillageList from './OutillageList';
import OutillageHistoryList from './OutillageHistoryList';
import Systeme from './Systeme';
import CaissePage from './CaissePage';
import EtalonnageList from './EtalonnageList';
import './Navbar.css'; // Import the CSS file for styling
import { FaUserCircle } from 'react-icons/fa';

const NavbarAdmin = ({ user, onLogout }) => {
    const [currentPage, setCurrentPage] = useState('user');
    const [showUserDetails, setShowUserDetails] = useState(false);

    const toggleUserDetails = () => {
        setShowUserDetails(!showUserDetails);
    };
    const renderPage = () => {
        switch (currentPage) {
            case 'Inventaire':
                return (
                    <InventaireList
                        mle={user?.mle} 
                        prenom={user?.prenom} 
                        nom={user?.nom} 
                        service={user?.service} 
                        departement={user?.departement}  
                        ginventaire={user?.ginventaire}
                    />
                );
            case 'mis a disposition':
                return (
                    <DispositionList
                        mle={user?.mle} 
                        prenom={user?.prenom} 
                        nom={user?.nom} 
                        service={user?.service} 
                        departement={user?.departement}  
                        gdisposition={user?.gdisposition}
                    />
                );
            case 'outillage':
                return (
                    <OutillageList  
                        mle={user?.mle} 
                        prenom={user?.prenom} 
                        nom={user?.nom} 
                        goutillage={user?.goutillage}
                    />
                );
            case 'caisse':
                return (
                    <CaissePage
                        mle={user?.mle} 
                        prenom={user?.prenom} 
                        nom={user?.nom} 
                        service={user?.service} 
                        departement={user?.departement} 
                        gcaisse={user?.gcaisse}
                    />
                );
            case 'etalonnage':
                return (
                    <EtalonnageList 
                        mle={user?.mle} 
                        prenom={user?.prenom} 
                        nom={user?.nom}  
                        getalonnage={user?.getalonnage}
                    />
                );
            case 'Systeme':
                return (
                    <Systeme user={user} />
                );
            default:
                return (
                    <div></div>
                );
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
                        {user?.gsysteme !== 'No Acces' && (
                            <button className="AA"  onClick={() => setCurrentPage('Systeme')}>Systeme</button>
                        )}
                        {user?.goutillage !== 'No Acces' && (
                            <button className="AA"  onClick={() => setCurrentPage('outillage')}>Gestion Outillages</button>
                        )}
                        {user?.gcaisse !== 'No Acces' && (
                            <button className="AA"  onClick={() => setCurrentPage('caisse')}>Gestion Caisses</button>
                        )}
                        {user?.getalonnage !== 'No Acces' && (
                            <button className="AA"  onClick={() => setCurrentPage('etalonnage')}>Gestion Etalonnages</button>
                        )}
                        {user?.gdisposition !== 'No Acces' && (
                            <button className="AA"  onClick={() => setCurrentPage('mis a disposition')}>Mis à Disposition</button>
                        )}
                        {user?.ginventaire !== 'No Acces' && (
                            <button className="AA"  onClick={() => setCurrentPage('Inventaire')}>Gestion Inventaires</button>
                        )}
                    </div>
                    <div className="navbar-right">
                        <FaUserCircle className="profile-icon" onClick={toggleUserDetails} />
                        <span className="navbar-title">
                           Admin
                        </span>
                        
                        {showUserDetails && (
                            <div className="user-details-dropdown">
                              
                               
                               
                             
                             
                                <button onClick={() => onLogout(user?.mle)} className="navbar-logout">
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
        </div>
    );
};

export default NavbarAdmin;
