import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddOutillageModal from './AddOutillageModal';
import SearchBarOutillage from './SearchBarOutillage';
import AddDispositionModal from './AddDispositionModal';
import OutillageHistoryList from './OutillageHistoryList';
import './OutillageList.css'; // Ensure you have a CSS file for styling
import * as XLSX from 'xlsx';

const OutillageList = () => {
    const [searchField, setSearchField] = useState('nserie'); // Default search field
    const [searchTerm, setSearchTerm] = useState(''); // Search term
    const [outillages, setOutillages] = useState([]);
    const [filteredOutillages, setFilteredOutillages] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedOutillage, setSelectedOutillage] = useState(null);
    const [selectedNserie, setSelectedNserie] = useState(null); // New state for selected Nserie
    const [error, setError] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isDispositionModalOpen, setIsDispositionModalOpen] = useState(false);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const itemsPerPage = 10;

    useEffect(() => {
        // Filter profils whenever searchTerm or searchField changes
        const filtered = outillages.filter(profil => {
            const value = profil[searchField]?.toString().toLowerCase() || '';
            return value.includes(searchTerm.toLowerCase());  // Perform partial match
        });
        setFilteredOutillages(filtered);
        setCurrentPage(1);  // Reset to the first page on search
    }, [searchTerm, searchField, outillages]);

    useEffect(() => {
        fetchOutillages();
    }, []);

    const fetchOutillages = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/outillages');
            const sortedOutillages = response.data.sort((a, b) => a.nserie.localeCompare(b.nserie));
            setOutillages(sortedOutillages);
            setFilteredOutillages(sortedOutillages);
        } catch (error) {
            setError('Error fetching outillages: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAddClick = () => {
        setSelectedOutillage(null);
        setSelectedNserie(null); // Clear selected Nserie when adding
        setIsAddModalOpen(true);
    };

    const handleUpdateClick = (outillage) => {
        setSelectedOutillage(outillage);
        setSelectedNserie(outillage.nserie); // Set selected Nserie for updating
        setIsUpdateModalOpen(true);
    };

    const handleDemandeClick = (outillage) => {
        setSelectedOutillage(outillage);
        setSelectedNserie(outillage.nserie); // Set selected Nserie for disposition
        setIsDispositionModalOpen(true);
    };

    const handleHistoryClick = (outillage) => {
        setSelectedOutillage(outillage);
        setSelectedNserie(outillage.nserie); // Set selected Nserie for history
        setIsHistoryModalOpen(true);
    };

    const handleDelete = async (nserie) => {
        if (window.confirm('Are you sure you want to delete this outillage?')) {
            setLoading(true);
            try {
                await axios.delete(`/api/outillages/${nserie}`);
                const updatedOutillages = outillages.filter(outillage => outillage.nserie !== nserie);
                setOutillages(updatedOutillages);
                setFilteredOutillages(updatedOutillages);
            } catch (error) {
                setError('Error deleting outillage: ' + error.message);
            } finally {
                setLoading(false);
            }
        }
    };

    const refreshList = () => {
        fetchOutillages();
    };

    const indexOfLastOutillage = currentPage * itemsPerPage;
    const indexOfFirstOutillage = indexOfLastOutillage - itemsPerPage;
    const currentOutillages = filteredOutillages.slice(indexOfFirstOutillage, indexOfLastOutillage);
    const totalPages = Math.ceil(filteredOutillages.length / itemsPerPage);

    const handleNextPage = () => {
        setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages));
    };

    const handlePrevPage = () => {
        setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
    };



    const handleDownloadExcel = () => {
        // Create an array of objects for the Excel file based on the outillages data
        const excelData = filteredOutillages.map(outillage => ({
            "Nserie": outillage.nserie,
            "Designation": outillage.designation || '-',
            "Type": outillage.type || '-',
            "Marque": outillage.marque || '-',
            "Affectation MLE": outillage.mle || '-',
            "Personne NOM": outillage.person?.nom || '-',
            "Personne PRENOM": outillage.person?.prenom || '-',
            "Caisse Matricule": outillage.caisseMatricule || '-',
            "Etat": outillage.etat || '-',
        }));
    
        // Create a worksheet and workbook
        const worksheet = XLSX.utils.json_to_sheet(excelData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Outillages");
    
        // Trigger the download
        XLSX.writeFile(workbook, "outillages.xlsx");
    };
    const handleSearch = (field, term) => {
        const filtered = outillages.filter(outillage => {
            const value = outillage[field]?.toString().toLowerCase() || ''; // Ensure string
            return value.includes(term.toLowerCase()); // Perform case-insensitive partial match
        });
        setFilteredOutillages(filtered);
        setCurrentPage(1); // Reset to first page after search
    };

    const handleCancelSearch = () => {
        setFilteredOutillages(outillages); // Reset the filtered list to show all data
        setSearchTerm(''); // Clear search term
        setCurrentPage(1); // Reset to first page
    };

    return (
        <div className="outillage-list-container">
             
            <h2>Outillage List <span className="outillage-count">({filteredOutillages.length})</span></h2>
            {loading && <p className="loading-message">Loading...</p>}
            {error && <p className="error-message">{error}</p>}
            
            <div className="search-bar-container">
                <form onSubmit={(e) => { e.preventDefault(); handleSearch(searchField, searchTerm); }} className="search-bar-form">
                    <select
                        value={searchField}
                        onChange={(e) => setSearchField(e.target.value)}
                        className="search-field-select"
                    >
                        <option value="nserie">Nserie</option>
                        <option value="designation">Designation</option>
                        <option value="type">Type</option>
                        <option value="marque">Marque</option>
                        <option value="mle">Affectation (mle)</option>
                        <option value="etat">Etat</option>
                    </select>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    <button type="button" onClick={handleCancelSearch}>x</button>
                    <button onClick={handleDownloadExcel}>Extraction</button> {/* Add your extraction logic */}
                    
              
                    <button className="BO" onClick={handleAddClick} disabled={loading}>
                    Ajouter Outillage
                   </button>
                 
                  
                </form>
            </div>
     
          
            <table className="table">
                <thead>
                    <tr>
                        <th>Nserie</th>
                        <th>Designation</th>
                        <th>Type</th>
                        <th>Marque</th>
                        <th>Affectation</th>
                        <th>Caisse Matricule</th>
                        <th>Etat</th>
                        
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentOutillages.map(outillage => (
                        <tr key={outillage.nserie}>
                            <td>{outillage.nserie}</td>
                            <td>{outillage.designation}</td>
                            <td>{outillage.type}</td>
                            <td>{outillage.marque}</td>
                            <td>{outillage.mle} - {outillage.person?.nom} {outillage.person?.prenom}</td>
                            <td>{outillage.caisseMatricule}</td>
                            <td>{outillage.etat}</td>
                            
                            <td className="actions">
                                <button className="button" onClick={() => handleUpdateClick(outillage)}>Mis A Jour</button>
                                <button className="button" onClick={() => handleDelete(outillage.nserie)}>Supprimer</button>
                                <button className="button" onClick={() => handleHistoryClick(outillage)}>History</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="pagination">
                <button onClick={handlePrevPage} disabled={currentPage === 1 || loading}>Précédente</button>
                <span>Page {currentPage} sur {totalPages}</span>
                <button onClick={handleNextPage} disabled={currentPage === totalPages || loading}>Suivante</button>
            </div>

            {/* Add Outillage Modal */}
            <AddOutillageModal
                isOpen={isAddModalOpen}
                onRequestClose={() => setIsAddModalOpen(false)}
                refreshList={refreshList}
            />

            {/* Update Outillage Modal */}
            {selectedOutillage && (
                <AddOutillageModal
                    isOpen={isUpdateModalOpen}
                    onRequestClose={() => setIsUpdateModalOpen(false)}
                    refreshList={refreshList}
                    initialOutillage={selectedOutillage}
                    isUpdate={true}
                />
            )}

            {/* Add Disposition Modal */}
            {selectedOutillage && (
                <AddDispositionModal
                    isOpen={isDispositionModalOpen}
                    onRequestClose={() => setIsDispositionModalOpen(false)}
                    refreshList={refreshList}
                    outillage={selectedOutillage}
                />
            )}

            {/* Outillage History Modal */}
            {selectedOutillage && (
                <OutillageHistoryList
                    isOpen={isHistoryModalOpen}
                    onRequestClose={() => setIsHistoryModalOpen(false)}
                    selectedNserie={selectedNserie} // Pass selectedNserie here
                />
            )}
        </div>
    );
};

export default OutillageList;
