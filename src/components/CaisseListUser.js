import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import SearchBarCaisseUser from './SearchBarCaisseUser';
import OutillagePage from './OutillagePage';
import CaisseHistoryList from './CaisseHistoryList';
import CaisseModal from './CaisseModal';
import * as XLSX from 'xlsx';


import './CaisseListUser.css';

const CaisseListUser = ({ mle, prenom, nom, service, departement,gcaisse }) => {
const [searchTerm, setSearchTerm] = useState('');
const [currentPage, setCurrentPage] = useState(1);


    const [caisses, setCaisses] = useState([]);
    const [outillagesMap, setOutillagesMap] = useState({});
    const [selectedCaisse, setSelectedCaisse] = useState(null);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
 
    const [itemsPerPage] = useState(10);
    const [error, setError] = useState(null);
 
    const [selectedField, setSelectedField] = useState('caisseName');
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [caisseToEdit, setCaisseToEdit] = useState(null);

    // Fetch caisses from the server
    const fetchCaisses = useCallback(() => {
        axios.get('/api/caisses')
            .then(response => {
                const caisses = response.data;
                const filteredCaisses = caisses.filter(caisse => {
                    return (caisse.mle === mle ||
                        (caisse.type === 'Commune service' && caisse.person && caisse.person.service === service) ||
                        (caisse.type === 'Commune departement' && caisse.person && caisse.person.departement === departement) ||
                        caisse.type === 'InterDepartement');
                });
                setCaisses(filteredCaisses);
            })
            .catch(error => {
                console.error('Error fetching caisses:', error.message);
                setError(error.message);
            });
    }, [mle, service, departement]);

    // Fetch outillages from the server
    const fetchOutillages = useCallback(() => {
        axios.get('/api/outillages')
            .then(response => {
                const outillages = response.data;
                const map = outillages.reduce((acc, outillage) => {
                    if (!acc[outillage.caisseMatricule]) {
                        acc[outillage.caisseMatricule] = [];
                    }
                    acc[outillage.caisseMatricule].push(outillage);
                    return acc;
                }, {});
                setOutillagesMap(map);
            })
            .catch(error => {
                console.error('Error fetching outillages:', error.message);
                setError(error.message);
            });
    }, []);

    useEffect(() => {
        fetchCaisses();
        fetchOutillages();
    }, [fetchCaisses, fetchOutillages]);

    // Paginate the list of caisses
    const getPaginatedData = (data) => {
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        return data.slice(indexOfFirstItem, indexOfLastItem);
    };

    const handleNextPage = () => {
        setCurrentPage(prevPage => Math.min(prevPage + 1, Math.ceil(caisses.length / itemsPerPage)));
    };

    const handlePrevPage = () => {
        setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
    };

    // Filter the caisses list
    const filterCaisses = (caisses) => {
        return caisses.filter(caisse =>
            caisse[selectedField].toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    const handleSearch = (field, term) => {
        const filtered = caisses.filter(caisse => {
            const value = caisse[field]?.toString().toLowerCase() || ''; // Ensure string
            return value.includes(term.toLowerCase()); // Perform case-insensitive partial match
        });
        filterCaisses(filtered);
        setCurrentPage(1); // Reset to first page after search
    };

    // Handle canceling search
    const handleCancelSearch = () => {
        filterCaisses(caisses); // Reset to full list
        setSearchTerm(''); // Clear search term
        setCurrentPage(1); // Reset pagination
    };

    const filteredCaisses = filterCaisses(caisses);

    const handleVisualiser = (caisse) => {
        setSelectedCaisse(caisse);
        setIsModalOpen(true);
    };

    const handleHistoryClick = (caisse) => {
        setSelectedCaisse(caisse);
        setIsHistoryModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedCaisse(null);
    };

    const closeHistoryModal = () => {
        setIsHistoryModalOpen(false);
        setSelectedCaisse(null);
    };

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
        try {
            const response = await axios.get('/api/caisses');
            const caisses = response.data;
    
            // Reapply the filter logic
            const filteredCaisses = caisses.filter(caisse => {
                return (caisse.mle === mle ||
                    (caisse.type === 'Commune service' && caisse.person && caisse.person.service === service) ||
                    (caisse.type === 'Commune departement' && caisse.person && caisse.person.departement === departement) ||
                    caisse.type === 'InterDepartement');
            });
    
            setCaisses(filteredCaisses); // Update the state with the filtered caisses
            handleCloseModal(); // Close the modal after saving
        } catch (error) {
            console.error('Error saving or fetching caisses:', error.message);
            setError(error.message);
        }
    };
    
    const handleDownloadExcel = () => {
        // Create an array of objects for the Excel file
        const excelData = getPaginatedData(filteredCaisses).map(caisse => ({
          "Caisse Name": caisse.caisseName || 'Caisse Virtuelle',
          "Type de caisse": caisse.type || '-',
          "MLE": caisse.mle || '-',
          "NOM": caisse.person?.nom || '-',
          "PRENOM": caisse.person?.prenom || '-',
          "DEPARTEMENT": caisse.person?.departement || '-',
          "SERVICE": caisse.person?.service || '-',
        }));
      
        // Create a worksheet and workbook
        const worksheet = XLSX.utils.json_to_sheet(excelData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Caisses");
      
        // Trigger the download
        XLSX.writeFile(workbook, "caisses.xlsx");
      };

    return (
        <div>

            
<h2>Caisse List <span className="caisse-count">({filteredCaisses.length})</span></h2>
          

            
 {/* Search Bar */}
 <div className="search-bar-container">
                <form onSubmit={(e) => { e.preventDefault(); handleSearch(selectedField, searchTerm); }} className="search-bar-form">
                    <select
                        value={selectedField}
                        onChange={(e) => setSelectedField(e.target.value)}
                        className="search-field-select"
                    >
                        <option value="caisseMatricule">Caisse Matricule</option>
                        <option value="caisseName">Caisse Name</option>
                        <option value="type">Type</option>
                        <option value="mle">Affectation (mle)</option>
                        
                      
                    </select>
                    <input
                        type="text"
                       
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    <button type="button" onClick={handleCancelSearch}>x</button>
                    <button onClick={handleDownloadExcel}>Extraction</button>
                    {gcaisse !== 'Lecture' && (
                               <>
                      <button className="BO" onClick={handleAddCaisse}>Ajouter Caisse</button>     
                          </>
                               )}
                </form>
 </div>


        
                        
            {error && <p className="error-message">{error}</p>}
            <table className="table-spacing">
                <thead>
                    <tr>
                        <th>Caisse Name</th>
                        <th>Type de caisse</th>
                        <th>MLE</th>
                        <th>NOM</th>
                        <th>PRENOM</th>
                        <th>DEPARTEMENT</th>
                        <th>SERVICE</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {getPaginatedData(filteredCaisses).map(caisse => (
                        <tr key={caisse.caisseMatricule}>
                            <td>{caisse.caisseName || 'Caisse Virtuelle'}</td>
                            <td>{caisse.type || '-'}</td>
                            <td>{caisse.mle || '-'}</td>
                            <td>{caisse.person?.nom || '-'}</td>
                            <td>{caisse.person?.prenom || '-'}</td>
                            <td>{caisse.person.departement || '-'}</td>
                            <td>{caisse.person.service || '-'} </td>
                            <td>

                            {gcaisse !== 'Lecture' && (
                               <>
                   <button className="button" onClick={() => handleEditCaisse(caisse)}>Mis A Jour</button>
                               </>
                               )}
                                


                                <button className="button" onClick={() => handleVisualiser(caisse)}>Visualiser</button>
                                <button className="button" onClick={() => handleHistoryClick(caisse)}>History</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="pagination">
                <button onClick={handlePrevPage} disabled={currentPage === 1}>Précédente</button>
                <span>Page {currentPage} sur {Math.ceil(filteredCaisses.length / itemsPerPage)}</span>
                <button onClick={handleNextPage} disabled={currentPage === Math.ceil(filteredCaisses.length / itemsPerPage)}>Suivante</button>
            </div>
            {selectedCaisse && (
                <OutillagePage
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    outillages={outillagesMap[selectedCaisse.caisseMatricule] || []}
                    caisse={selectedCaisse}
                />
            )}
            {selectedCaisse && (
                <CaisseHistoryList
                    isOpen={isHistoryModalOpen}
                    onRequestClose={closeHistoryModal}
                    caisseMatricule={selectedCaisse.caisseMatricule}
                />
            )}
            {showModal && (
                <CaisseModal
                    show={showModal}
                    onClose={handleCloseModal}
                    caisseToEdit={caisseToEdit}
                    refreshCaisseList={handleSaveCaisse}
                />
            )}
        </div>
    );
};

export default CaisseListUser;