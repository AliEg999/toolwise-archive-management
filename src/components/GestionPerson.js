// src/components/GestionPerson.js

import React, { useState } from 'react';
import PersonList from './PersonList';
import AddPersonModal from './AddPersonModal';

const GestionPerson = (user) => {
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
                        {user.gsysteme !== 'Lecture' && (
      <>
      </>
    )}
           
            <AddPersonModal 
              mle={user.mle} 
              prenom={user.prenom} 
              nom={user.nom} 
              service={user.service} 
              departement={user.departement}  
              ginventaire={user.ginventaire}
            isOpen={isModalOpen} onRequestClose={closeModal} refreshList={refreshList} />
            <PersonList 
              mle={user.mle} 
              prenom={user.prenom} 
              nom={user.nom} 
              service={user.service} 
              departement={user.departement}  
              gsysteme={user.gsysteme}
            key={refresh} />
        </div>
    );
};

export default GestionPerson;
