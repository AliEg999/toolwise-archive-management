import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddProfilModal from './AddProfilModal';
import './ProfilList.css';
import * as XLSX from 'xlsx';

const ProfilList = (user) => {
    const [profils, setProfils] = useState([]);
    const [filteredProfils, setFilteredProfils] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedProfil, setSelectedProfil] = useState(null);
    const [error, setError] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [searchField, setSearchField] = useState('nprofil'); // State for search field
    const [searchTerm, setSearchTerm] = useState(''); // State for search term
    const itemsPerPage = 10;

    useEffect(() => {
        // Filter profils whenever searchTerm or searchField changes
        const filtered = profils.filter(profil => {
            const value = profil[searchField]?.toString().toLowerCase() || '';
            return value.includes(searchTerm.toLowerCase());  // Perform partial match
        });
        setFilteredProfils(filtered);
        setCurrentPage(1);  // Reset to the first page on search
    }, [searchTerm, searchField, profils]);


    useEffect(() => {
        fetchProfils();
    }, []);

    const fetchProfils = () => {
        axios.get('/api/profils')  // Fetch data from the API
            .then(response => {
                const sortedProfils = response.data.sort((a, b) => a.nprofil.localeCompare(b.nprofil));
                setProfils(sortedProfils);
                setFilteredProfils(sortedProfils);  // Set initial filtered profils
            })
            .catch(error => {
                setError(error.message);
            });
    };

    const handleAddClick = () => {
        setIsAddModalOpen(true);
    };

    const handleUpdateClick = (profil) => {
        setSelectedProfil(profil);
        setIsUpdateModalOpen(true);
    };

    const handleDelete = (nprofil) => {
        axios.delete(`/api/profils/${nprofil}`)
            .then(() => {
                const updatedProfils = profils.filter(profil => profil.nprofil !== nprofil);
                setProfils(updatedProfils);
                setFilteredProfils(updatedProfils);  // Update filtered list
            })
            .catch(error => {
                setError(error.message);
            });
    };

    const refreshList = () => {
        fetchProfils();  // Refresh the list to get the latest data
    };

    const indexOfLastProfil = currentPage * itemsPerPage;
    const indexOfFirstProfil = indexOfLastProfil - itemsPerPage;
    const currentProfils = filteredProfils.slice(indexOfFirstProfil, indexOfLastProfil);

    const totalPages = Math.ceil(filteredProfils.length / itemsPerPage);

    const handleNextPage = () => {
        setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages));
    };

    const handlePrevPage = () => {
        setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
    };

 // Search functionality
    const handleSearch = () => {
        const filtered = profils.filter(profil => {
            const value = profil[searchField]?.toString().toLowerCase() || '';
            return value.includes(searchTerm.toLowerCase());  // Perform partial match
        });
        setFilteredProfils(filtered);
        setCurrentPage(1);  // Reset to the first page on search
    };

    const handleCancelSearch = () => {
        setSearchTerm('');
        setSearchField('nprofil'); // Optionally reset search field to default
        setFilteredProfils(profils);  // Reset the filteredProfils to show all data
        setCurrentPage(1);  // Reset to the first page when canceling search
    };

    const handleDownloadExcel = () => {
        const data = filteredProfils.map(profil => ({
            'Nom Profil': profil.nprofil,
            'Gestion Caisse': profil.gcaisse,
            'Gestion Outillage': profil.goutillage,
            'Inventaire': profil.ginventaire,
            'Mise à Disposition': profil.gdisposition,
            'Gestion Etalonnage': profil.getalonnage,
            'Système': profil.gsysteme,
        }));

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Profils');
        XLSX.writeFile(workbook, 'Profil_List.xlsx');
    };

    return (
        <div className="profil-list-container">
           
            <h2>List des Profils <span className="profil-count">({filteredProfils.length})</span></h2>
            {error && <p className="error-message">{error}</p>}

            {/* Search Bar logic */}
            <div className="search-bar-container">
                <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="search-bar-form">
                    <select
                        value={searchField}
                        onChange={(e) => setSearchField(e.target.value)}
                        className="search-field-select"
                    >
                        <option value="nprofil">Nom Profil</option>
                        <option value="gcaisse">Caisse</option>
                        <option value="goutillage">Outillage</option>
                        <option value="ginventaire">Inventaire</option>
                        <option value="gdisposition">Mis A Disposition</option>
                        <option value="getalonnage">Etalonnage</option>
                        <option value="gsysteme">Systeme</option>
                    </select>
                    <input
                        type="text"
                        placeholder={`ÉCRIRE ICI`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    <button type="button" onClick={handleCancelSearch}>x</button>
                    <button onClick={handleDownloadExcel}>Extraction</button>
                    {user.gsysteme !== 'Lecture' && (
                <>
                    <button className="BO" onClick={handleAddClick}>Ajouter Profil</button>
                </>
            )}
                </form>
            </div>

           





            <table>
                <thead>
                    <tr>
                        <th>Nom Profil</th>
                        <th>Caisse</th>
                        <th>Outillage</th>
                        <th>Inventaire</th>
                        <th>Mis A Disposition</th>
                        <th>Etalonnage</th>
                        <th>Systeme</th>
                        {user.gsysteme !== 'Lecture' && (
                            <>
                                <th>Actions</th>
                            </>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {currentProfils.map(profil => (
                        <tr key={profil.nprofil}>
                            <td>{profil.nprofil}</td>
                            <td>{profil.gcaisse}</td>
                            <td>{profil.goutillage}</td>
                            <td>{profil.ginventaire}</td>
                            <td>{profil.gdisposition}</td>
                            <td>{profil.getalonnage}</td>
                            <td>{profil.gsysteme}</td>
                            <td className="actions">
                                {user.gsysteme !== 'Lecture' && (
                                    <>
                                        <button className="button" onClick={() => handleUpdateClick(profil)}>Mis A Jour</button>
                                        <button className="button" onClick={() => handleDelete(profil.nprofil)}>Supprimer</button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="pagination">
                <button onClick={handlePrevPage} disabled={currentPage === 1}>Précédente</button>
                <span>Page {currentPage} sur {totalPages}</span>
                <button onClick={handleNextPage} disabled={currentPage === totalPages}>Suivante</button>
            </div>

            {/* Add Profil Modal */}
            <AddProfilModal
                isOpen={isAddModalOpen}
                onRequestClose={() => setIsAddModalOpen(false)}
                refreshList={refreshList}
            />

            {/* Update Profil Modal */}
            {selectedProfil && (
                <AddProfilModal
                    isOpen={isUpdateModalOpen}
                    onRequestClose={() => setIsUpdateModalOpen(false)}
                    refreshList={refreshList}
                    initialProfil={selectedProfil}
                    isUpdate={true}
                />
            )}
        </div>
    );
};

export default ProfilList;
