import React, { useState } from 'react';
//import './SearchBarProfil.css'; // Optional: Add some styling
import './SearchBar.css';

const SearchBarProfil = ({ onSearch, onCancel }) => {
    const [searchField, setSearchField] = useState('nprofil');
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            onSearch(searchField, searchTerm);
        }
    };

    const handleCancel = () => {
        setSearchTerm('');
        onCancel();
    };

    return (
        <div className="search-bar-container">
            <form onSubmit={handleSearch} className="search-bar-form">
                <select
                    value={searchField}
                    onChange={(e) => setSearchField(e.target.value)}
                    className="search-field-select"
                >
                    <option value="nprofil">Nprofil</option>
                    <option value="gcaisse">Gcaisse</option>
                    <option value="goutillage">Goutillage</option>
                    <option value="ginventaire">Ginventaire</option>
                    <option value="gdisposition">Gdisposition</option>
                    <option value="getalonnage">Getalonnage</option>
                    <option value="gsysteme">Gsysteme</option>
                </select>
                <input
                    type="text"
                    placeholder={`Search by ${searchField}`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
                <button type="submit" className="search-button" >Recherche</button>
                <button type="button" onClick={handleCancel}>x</button>
            </form>
        </div>
    );
};

export default SearchBarProfil;
