import React, { useState } from 'react';
import OutillageListUser from './OutillageListUser';
import CaisseListUser from './CaisseListUser';
import EtalonnageListUser from './EtalonnageListUser';
import DispositionListUser from './DispositionListUser';
import InventaireListUser from './InventaireListUser';
import Systeme from './Systeme';

const UserPage = ({ user }) => {
  const [currentPage, setCurrentPage] = useState('user');

  const renderPage = () => {
    switch (currentPage) {
      case 'Inventaire':
        return (
          <InventaireListUser 
            mle={user.mle} 
            password={user.password} 
            prenom={user.prenom} 
            nom={user.nom} 
            service={user.service} 
            departement={user.departement}  
            ginventaire={user.ginventaire}
          />
        );
      case 'mis a disposition':
        return (
          <DispositionListUser 
            mle={user.mle} 
            prenom={user.prenom} 
            password={user.password} 
            nom={user.nom} 
            service={user.service} 
            departement={user.departement}  
            gdisposition={user.gdisposition}
          />
        );
      case 'outillage':
        return (
          <OutillageListUser  
            mle={user.mle} 
            prenom={user.prenom} 
            password={user.password} 
            nom={user.nom} 
            goutillage={user.goutillage}
          />
        );
      case 'caisse':
        return (
          <CaisseListUser 
            mle={user.mle} 
            prenom={user.prenom} 
            nom={user.nom} 
            password={user.password} 
            service={user.service} 
            departement={user.departement} 
            gcaisse={user.gcaisse}
          />
        );
      case 'etalonnage':
        return (
          <EtalonnageListUser 
            mle={user.mle} 
            prenom={user.prenom} 
            nom={user.nom}  
            password={user.password} 
            getalonnage={user.getalonnage}
          />
        );
      case 'Systeme':
        return (
          <Systeme user={user} />

        );
      default:
     
    }
    
  };

  return <div>{renderPage()}</div>;
};

export default UserPage;
