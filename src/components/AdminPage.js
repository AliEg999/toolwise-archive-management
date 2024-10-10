import React, { useState } from 'react';
import InventaireList from './InventaireList';
import DispositionList from './DispositionList';
import OutillageList from './OutillageList';
import OutillageHistoryList from './OutillageHistoryList';
import Systeme from './Systeme';
import CaissePage from './CaissePage';
import EtalonnageList from './EtalonnageList';

const AdminPage = ({ user = {} }) => {
    const [currentPage, setCurrentPage] = useState('user');
    
    const renderPage = () => {
        switch (currentPage) {
            case 'Outillage History':
                return <OutillageHistoryList mle={user.mle || ''} prenom={user.prenom || ''} nom={user.nom || ''} service={user.service || ''} departement={user.departement || ''} />;
            case 'inventaire':
                return <InventaireList mle={user.mle || ''} prenom={user.prenom || ''} nom={user.nom || ''} service={user.service || ''} departement={user.departement || ''} />;
            case 'miseADisposition':
                return <DispositionList mle={user.mle || ''} prenom={user.prenom || ''} nom={user.nom || ''} service={user.service || ''} departement={user.departement || ''} />;
            case 'Etalonnage':
                return <EtalonnageList mle={user.mle || ''} prenom={user.prenom || ''} nom={user.nom || ''} service={user.service || ''} departement={user.departement || ''} />;
            case 'outillage':
                return <OutillageList mle={user.mle || ''} prenom={user.prenom || ''} nom={user.nom || ''} service={user.service || ''} departement={user.departement || ''} />;
            case 'Systeme':
                return <Systeme mle={user.mle || ''} prenom={user.prenom || ''} nom={user.nom || ''} service={user.service || ''} departement={user.departement || ''} />;
            case 'caisse':
                return <CaissePage mle={user.mle || ''} prenom={user.prenom || ''} nom={user.nom || ''} service={user.service || ''} departement={user.departement || ''} />;
            default:
                return (
                    <div>
                    
                       
                    </div>
                );
        }
    };
    
    return <div>{renderPage()}</div>;
};

export default AdminPage;

           