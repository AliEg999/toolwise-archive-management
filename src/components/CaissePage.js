// src/components/CaissePage.js
import React, { useState, useEffect } from 'react';
import CaisseList from './CaisseList';
import CaisseModal from './CaisseModal';
import SearchBarCaisse from './SearchBarCaisse';
import axios from 'axios';
//import InventaireList from './InventaireList';

const CaissePage = () => {
    const [showModal, setShowModal] = useState(false);
    const [caisseToEdit, setCaisseToEdit] = useState(null);
    const [caisses, setCaisses] = useState([]);
    const [filteredCaisses, setFilteredCaisses] = useState([]);

    useEffect(() => {
        const fetchCaisses = async () => {
            const response = await axios.get('/api/caisses');
            setCaisses(response.data);
            setFilteredCaisses(response.data); // Initialize filtered list with all caisses
        };
        fetchCaisses();
    }, []);

    const handleAddCaisse = () => {
        setCaisseToEdit(null);
        setShowModal(true);
    };

    const handleEditCaisse = (caisse) => {
        setCaisseToEdit(caisse);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleSaveCaisse = async () => {
        const response = await axios.get('/api/caisses'); // Fetch updated caisse list
        setCaisses(response.data); // Update caisse state
        setFilteredCaisses(response.data); // Update filtered caisse list
        handleCloseModal();
    };

    const handleSearch = (field, term) => {
        const lowerCaseTerm = term.toLowerCase();
        const result = caisses.filter(caisse => {
            if (caisse[field]) {
                return caisse[field].toString().toLowerCase().includes(lowerCaseTerm);
            }
            return false;
        });
        setFilteredCaisses(result);
    };

    const handleCancelSearch = () => {
        setFilteredCaisses(caisses); // Reset to original list
    };

    const handleDeleteCaisse = async () => {
        const response = await axios.get('/api/caisses');
        setCaisses(response.data);
        setFilteredCaisses(response.data);
    };

    return (
        <div>
           
          
            <CaisseList 
                caisses={filteredCaisses} 
                onEdit={handleEditCaisse} 
                onDelete={handleDeleteCaisse} 
                handleSearch={handleSearch} 
                handleCancelSearch={handleCancelSearch} 
                handleAddCaisse={handleAddCaisse} // Pass the add function
            />
            
           
            <CaisseModal 
                show={showModal} 
                onClose={handleCloseModal} 
                caisseToEdit={caisseToEdit} 
                refreshCaisseList={handleSaveCaisse} // Call this after add/edit
                
            />
        </div>
    );
};

export default CaissePage;
