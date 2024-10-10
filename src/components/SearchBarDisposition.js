import React, { useState } from 'react';
import './SearchBar.css'; // Ensure you have the appropriate styles

const SearchBarDisposition = ({ onSearch, onCancel }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedField, setSelectedField] = useState('nmad');  // Default search field

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
                    <option value="nmad">Nom Matériel (nmad)</option>
                    <option value="datedisposition">Date Disposition</option>
                    <option value="dateretour">Date Retour</option>
                    <option value="outillage.designation">Désignation Outillage</option>
                    <option value="nserie">Numéro de Série (nserie)</option>
                    <option value="outillage.marque">Marque Outillage</option>
                    <option value="etat">État</option>
                    <option value="remarque">Remarque</option>
                </select>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search..."
                    className="search-inputD"
                />
                <button type="submit" className="search-button">Recherche</button>
                <button type="button" onClick={handleCancel} className="cancel-button">x</button>
            </form>
            
        </div>
    );
};

export default SearchBarDisposition;
