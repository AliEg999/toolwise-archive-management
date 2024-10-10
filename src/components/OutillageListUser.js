import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import SearchBarOutillage from './SearchBarOutillage';
import AddDispositionModal from './AddDispositionModal';
import OutillageHistoryList from './OutillageHistoryList';
import AddOutillageModal from './AddOutillageModal';
import * as XLSX from 'xlsx';


const OutillageListUser = ({ mle, prenom, nom,goutillage }) => {
    const [searchField, setSearchField] = useState('nserie'); // Default search field
    const [searchTerm, setSearchTerm] = useState(''); // Search term
    const [outillages, setOutillages] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loggedInMle, setLoggedInMle] = useState(mle); // Initialize with prop value
    const [selectedNSerie, setSelectedNSerie] = useState('');
    const [filteredOutillages, setFilteredOutillages] = useState([]);
    const [neavauxAndInterdepartementOutillages, setNeavauxAndInterdepartementOutillages] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentPageNeavaux, setCurrentPageNeavaux] = useState(1); // New state for pagination
    const [error, setError] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedOutillage, setSelectedOutillage] = useState(null);
    const [selectedNserie, setSelectedNserie] = useState(null); // New state for selected Nserie
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);



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

    const fetchOutillages = useCallback(() => {
        axios.get('/api/outillages')
            .then(response => {
                const allOutillages = response.data;
                
                // Filter outillages for the logged-in user
                const userOutillages = allOutillages.filter(outillage => outillage.mle === loggedInMle);
                setOutillages(userOutillages);
                setFilteredOutillages(userOutillages);

                // Filter outillages by type for the new list
                const neavauxAndInterdepartement = allOutillages.filter(
                    outillage => outillage.type === 'InterDepartement' 
                );
                setNeavauxAndInterdepartementOutillages(neavauxAndInterdepartement);
            })
            .catch(error => {
                setError(error.message);
            });
    }, [loggedInMle]);
    const refreshList = () => {
        fetchOutillages();
    };

    useEffect(() => {
        fetchOutillages();
    }, [fetchOutillages]);

    const indexOfLastOutillage = currentPage * itemsPerPage;
    const indexOfFirstOutillage = indexOfLastOutillage - itemsPerPage;
    const currentOutillages = filteredOutillages.slice(indexOfFirstOutillage, indexOfLastOutillage);
    const totalPages = Math.ceil(filteredOutillages.length / itemsPerPage);

    const indexOfLastNeavaux = currentPageNeavaux * itemsPerPage;
    const indexOfFirstNeavaux = indexOfLastNeavaux - itemsPerPage;
    const currentNeavauxAndInterdepartementOutillages = neavauxAndInterdepartementOutillages.slice(indexOfFirstNeavaux, indexOfLastNeavaux);
    const totalPagesNeavaux = Math.ceil(neavauxAndInterdepartementOutillages.length / itemsPerPage);

    const handleUpdateClick = (outillage) => {
        setSelectedOutillage(outillage);
        setSelectedNserie(outillage.nserie); // Set selected Nserie for updating
        setIsUpdateModalOpen(true);
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

    const handleHistoryClick = (outillage) => {
        setSelectedOutillage(outillage);
        setSelectedNserie(outillage.nserie); // Set selected Nserie for history
        setIsHistoryModalOpen(true);
    };

    const handleAddClick = () => {
        setSelectedOutillage(null);
        setSelectedNserie(null); // Clear selected Nserie when adding
        setIsAddModalOpen(true);
    };
    const handleNextPage = () => {
        setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages));
    };

    const handlePrevPage = () => {
        setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
    };

    const handleNextPageNeavaux = () => {
        setCurrentPageNeavaux(prevPage => Math.min(prevPage + 1, totalPagesNeavaux));
    };

    const handlePrevPageNeavaux = () => {
        setCurrentPageNeavaux(prevPage => Math.max(prevPage - 1, 1));
    };



    const handleDemandeClick = (outillage) => {
        setSelectedOutillage(outillage);
        setSelectedNSerie(outillage.nserie); // Set selected NSerie
        setModalIsOpen(true);
    };

    const handleDownloadExcel = () => {
        // Create an array of objects for the Excel file
       
            const excelData = currentOutillages.map(outillage => ({
            "Nserie": outillage.nserie || '-',
            "Designation": outillage.designation || '-',
            "Type": outillage.type || '-',
            "Marque": outillage.marque || '-',
            "MLE": outillage.mle || '-',
            "Nom": outillage.person?.nom || '-',
            "Prenom": mle || '-',
            "Departement": outillage.person?.departement || '-',
            "Service": outillage.person?.service || '-',
            "Reference": outillage.reference || '-',
            "Etalonnage": outillage.etalonnage || '-',
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
        <div>
          
            {error && <p className="error-message">{error}</p>}
      

            
            <h2>Votre Outillage List <span className="outillage-count">({filteredOutillages.length})</span></h2>

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
                    
                    {/* Conditional Rendering Based on User Permissions */}
                    {goutillage !== 'Lecture' && (
                 <>
                    <button className="BO" onClick={handleAddClick} disabled={loading}>
                    Ajouter Outillage
                   </button>
                 </>
                   )}
                </form>
            </div>

        
             
           
         

            <table>
                <thead>
                    <tr>
                        <th>Nserie</th>
                        <th>Designation</th>
                        <th>Type</th>
                        <th>Marque</th>
                        <th>Affectation</th>
                        <th>Reference</th>
                        <th>Etalonnage</th>
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
                            <td>{outillage.mle} - {outillage.person.nom} {outillage.person.prenom}</td>
                            <td>{outillage.reference}</td>
                            <td>{outillage.etalonnage}</td>
                            <td>{outillage.etat}</td>
                            <td className="actions">
                            {goutillage !== 'Lecture' && (
                             <>
                                 <button className="button" onClick={() => handleUpdateClick(outillage)}>Mis A Jour</button>
                                 <button className="button" onClick={() => handleDelete(outillage.nserie)}>Supprimer</button>
                             </>
                               )}

                                <button className="button" onClick={() => handleHistoryClick(outillage)}>History</button>
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
            <br></br>
            <br></br>
            <br></br>

           <h2>InterDepartement Outillage List</h2>
<table>
    <thead>
        <tr>
            <th>Nserie</th>
            <th>Designation</th>
            <th>Type</th>
            <th>Marque</th>
            <th>Affectation</th>
            <th>Reference</th>
            <th>Etalonnage</th>
            <th>Demande</th> {/* New column for the button */}
        </tr>
    </thead>
    <tbody>
        {currentNeavauxAndInterdepartementOutillages.length > 0 ? (
            currentNeavauxAndInterdepartementOutillages.map(outillage => (
                <tr key={outillage.nserie}>
                    <td>{outillage.nserie}</td>
                    <td>{outillage.designation}</td>
                    <td>{outillage.type}</td>
                    <td>{outillage.marque}</td>
                    <td>{outillage.mle} - {outillage.person.nom} {outillage.person.prenom}</td>
                    <td>{outillage.reference}</td>
                    <td>{outillage.etalonnage}</td>
                    <td>
                        <button onClick={() => handleDemandeClick(outillage)}>Demande MAD</button>
                    </td>
                </tr>
            ))
        ) : (
            <tr>
                <td colSpan="8" style={{ textAlign: 'center' }}>No outillages available.</td>
            </tr>
        )}
    </tbody>
</table>


            <div className="pagination">
                <button onClick={handlePrevPageNeavaux} disabled={currentPageNeavaux === 1}>Précédente</button>
                <span>Page {currentPageNeavaux} sur {totalPagesNeavaux}</span>
                <button onClick={handleNextPageNeavaux} disabled={currentPageNeavaux === totalPagesNeavaux}>Suivante</button>
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

         

            {/* Outillage History Modal */}
            {selectedOutillage && (
                <OutillageHistoryList
                    isOpen={isHistoryModalOpen}
                    onRequestClose={() => setIsHistoryModalOpen(false)}
                    selectedNserie={selectedNserie} // Pass selectedNserie here
                />
            )}
            <AddDispositionModal
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                initialOutillage={selectedOutillage}
                refreshList={fetchOutillages}
                loggedInMle={loggedInMle} // Pass loggedInMle to modal
                selectedNSerie={selectedNSerie} // Pass selectedNSerie to modal
            />
        </div>
    );
};

export default OutillageListUser;
