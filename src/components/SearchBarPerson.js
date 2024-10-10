// src/components/SearchBarPerson.js

import React, { useState } from 'react';
import './SearchBar.css';

const SearchBarPerson = ({ onSearch, onCancel }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedField, setSelectedField] = useState('mle');  // Default search field

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
                    <option value="mle">Mle</option>
                    <option value="nom">Nom</option>
                    <option value="prenom">Prenom</option>
                    <option value="service">Service</option>
                    <option value="departement">Département</option>
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

export default SearchBarPerson;
