// src/components/SearchBarCaisse.js

import React, { useState } from 'react';
import './SearchBarCaisseZ.css'; // Ensure you have the appropriate styles

const SearchBarCaisseZ = ({ onSearch, onCancel }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedField, setSelectedField] = useState('caisseMatricule');  // Default search field

    const handleSearch = (event) => {
        event.preventDefault();
        onSearch(selectedField, searchTerm);
    };

    const handleCancel = () => {
        setSearchTerm('');
        onCancel();  // Call the onCancel function to reset the filter
    };

    return (
        <div className="search-bar-container">
            <form onSubmit={handleSearch} className="search-bar-form">
                <select
                    value={selectedField}
                    onChange={(e) => setSelectedField(e.target.value)}
                    className="search-field-select"
                >
                    <option value="caisseMatricule">Caisse Matricule</option>
                    <option value="caisseName">Caisse Name</option>
                    <option value="mle">Affectation (Mle)</option>
                    <option value="nserie">Nserie</option>
                    <option value="type">Type</option>
                </select>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search..."
                    className="search-inputZ"
                />
                <button type="submit" className="search-button">Recherche</button>
                <button type="button" onClick={handleCancel} className="cancel-button">x</button>
            </form>
        </div>
    );
};

export default SearchBarCaisseZ;
