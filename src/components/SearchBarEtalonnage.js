// src/components/SearchBarEtalonnage.js
import React, { useState } from 'react';
import './SearchBar.css'; // Ensure you have appropriate styles

const SearchBarEtalonnage = ({ onSearch, onCancel }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedField, setSelectedField] = useState('numSertif');  // Default search field

    const handleSearch = (event) => {
        event.preventDefault();
        onSearch(selectedField, searchTerm);
    };

    const handleCancel = () => {
        setSearchTerm('');
        setSelectedField('numSertif'); // Reset to default field
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
                    <option value="numSertif">Num Sertif</option>
                    <option value="nserie">Outillage Nserie</option>
                    <option value="dateDebutEtalonnage">Date Debut</option>
                    <option value="dateFinEtalonnage">Date Fin</option>
                    <option value="etat">function</option>
                    <option value="exercice">Etat</option>
                </select>
                <input
                    type={['dateDebutEtalonnage', 'dateFinEtalonnage'].includes(selectedField) ? 'date' : 'text'}
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

export default SearchBarEtalonnage;
