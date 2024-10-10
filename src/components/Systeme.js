import React, { useState } from 'react';

import GestionPerson from './GestionPerson';
import ProfilList from './ProfilList';



const Systeme = ({ user = {} }) => {
    const [currentPage, setCurrentPage] = useState('user');
    
    const renderPage = () => {
        switch (currentPage) {
            
            case 'gestionperson':
                return <GestionPerson gsysteme={user.gsysteme} mle={user.mle || ''} prenom={user.prenom || ''} nom={user.nom || ''} service={user.service || ''} departement={user.departement || ''} />;
                case 'ProfilList':
                    return <ProfilList gsysteme={user.gsysteme} mle={user.mle || ''} prenom={user.prenom || ''} nom={user.nom || ''} service={user.service || ''} departement={user.departement || ''} />;
                
            default:
                return (
                    <div>
                        <h1>Bienvenue sur la page Systeme </h1>
                        <div >
                       
                            <button onClick={() => setCurrentPage('ProfilList')}>Gestion Profils</button>
                            <button onClick={() => setCurrentPage('gestionperson')}>Gestion Utilisateurs</button>
                          
                        </div>
                        
                    </div>
                );
        }
    };
    
    return <div>{renderPage()}</div>;
};

export default Systeme;

           