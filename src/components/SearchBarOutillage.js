// src/components/SearchBarOutillage.js

import React, { useState } from 'react';
import './SearchBar.css';

const SearchBarOutillage = ({ onSearch, onCancel }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedField, setSelectedField] = useState('nserie');  // Default search field

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
                    <option value="nserie">Nserie</option>
                    <option value="designation">Designation</option>
                    <option value="type">Type</option>
                    <option value="marque">Marque</option>
                    <option value="mle">Affectation</option>
                    <option value="reference">Reference</option>
                    <option value="etalonnage">Etalonnage</option>
                </select>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search..."
                    className="search-input"
                />
                <button type="submit" className="search-button">Recherche</button>
                <button type="button" onClick={handleCancel} className="cancel-button">x</button>
            </form>
        </div>
    );
};

export default SearchBarOutillage;
