import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddEtalonnageModal from './AddEtalonnageModal';
import SearchBarEtalonnage from './SearchBarEtalonnage';  // Import the SearchBarEtalonnage component
import EtalonnageHistoryList from './EtalonnageHistoryList'; // Import the EtalonnageHistoryList component
import './EtalonnageList.css';
import * as XLSX from 'xlsx';

const EtalonnageList = () => {
    const [etalonnages, setEtalonnages] = useState([]);
    const [selectedEtalonnage, setSelectedEtalonnage] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchField, setSearchField] = useState('numSertif');
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const [selectedNumSertif, setSelectedNumSertif] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedField, setSelectedField] = useState('numSertif');
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredEtalonnages, setFilteredEtalonnages] = useState([]);

   


    useEffect(() => {
       fetchEtalonnages();
    }, []);

    useEffect(() => {
        // Convert searchQuery to ISO date format if it's a date field
        const convertQueryToISO = (query) => {
            return query ? convertToISODate(query) : '';
        };
    
        const filtered = etalonnages.filter(etalonnage => {
            if (searchField === 'dateDebutEtalonnage' || searchField === 'dateFinEtalonnage') {
                const formattedQuery = convertQueryToISO(searchQuery);
                const dateField = searchField === 'dateDebutEtalonnage' ? etalonnage.dateDebutEtalonnage : etalonnage.dateFinEtalonnage;
                return new Date(dateField).toISOString().slice(0, 10) === formattedQuery;
            }
            const value = etalonnage[searchField]?.toString().toLowerCase() || '';
            return value.includes(searchQuery.toLowerCase());  // Perform partial match
        });
    
        setFilteredEtalonnages(filtered);
    }, [searchQuery, searchField, etalonnages]);
    

 
    
 const fetchEtalonnages = async () => {
    setLoading(true);
    try {
        const response = await axios.get('/api/etalonnages');
        
        const sortedEtalonnage = response.data.sort((a, b) => {
            const nserieA = a.nserie || '';  // Use an empty string if nserie is null
            const nserieB = b.nserie || '';  // Use an empty string if nserie is null
            return nserieA.localeCompare(nserieB);
        });

        setEtalonnages(sortedEtalonnage);
    } catch (error) {
        setError('Error fetching outillages: ' + error.message);
    } finally {
        setLoading(false);
    }
};


    const handleUpdateClick = (etalonnage) => {
        setSelectedEtalonnage(etalonnage);
        setIsUpdate(true);
        setIsModalOpen(true);
    };

    const handleDelete = async (numSertif) => {
        try {
            await axios.delete(`/api/etalonnages/${numSertif}`);
            setEtalonnages(etalonnages.filter(etalonnage => etalonnage.numSertif !== numSertif));
        } catch (error) {
            setError('Failed to delete etalonnage');
            console.error('Error deleting etalonnage:', error);
        }
    };

    const refreshList = () => {
        fetchEtalonnages();
    };



    const handleCancel = () => {
        setSearchQuery('');
        setSearchField('numSertif');
    };

    const handleHistoryClick = (etalonnage) => {
        console.log('Selected etalonnage numSertif:', etalonnage.numSertif);
        setSelectedNumSertif(etalonnage.numSertif);
        console.log('Updated selectedNumSertif:', etalonnage.numSertif);
        setIsHistoryModalOpen(true);
    };
    

  

    const handleSearch = (field, query) => {
        setSelectedField(field);
        setSearchTerm(query);
    };

    const handleCancelSearch = () => {
        setSearchQuery('');
        setSearchField('numSertif');
    };
const convertToISODate = (dateString) => {
    const [day, month, year] = dateString.split('/');
    return `${year}-${month}-${day}`;
};

    

    
    

    const handleDownloadExcel = () => {
        const excelData = filteredEtalonnages.map(etalonnage  => ({
            "Designation": etalonnage.outillage?.designation || '-',
            "Marque": etalonnage.outillage?.marque || '-',
            "Num Sertif": etalonnage.numSertif,
            "mle": etalonnage.outillage?.person?.mle || '-',
            "Nom": etalonnage.outillage?.person?.nom || '-',
            "Prenom": etalonnage.outillage?.person?.prenom || '-',
            "Service": etalonnage.outillage?.person?.service || '-',
            "Departement": etalonnage.outillage?.person?.departement || '-',
            "Nom Caisse": etalonnage.outillage?.caisseMatricule || '-',
            "Type Caisse": etalonnage.outillage?.caisse?.type || '-',
            "Date Debut": etalonnage.dateDebutEtalonnage ? new Date(etalonnage.dateDebutEtalonnage).toLocaleDateString() : '-',
            "Date Fin": etalonnage.dateFinEtalonnage ? new Date(etalonnage.dateFinEtalonnage).toLocaleDateString() : '-',
            "Etat": etalonnage.etat || '-',
            "Exercice": etalonnage.exercice || '-',
            "Notification": etalonnage.notification || '-',
        }));
      
        const worksheet = XLSX.utils.json_to_sheet(excelData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Etalonnages");
      
        XLSX.writeFile(workbook, "etalonnages.xlsx");
    };

    return (
        <div>
            {error && <p className="error-message">{error}</p>}
       
            <h2>Etalonnages List ({filteredEtalonnages.length})</h2>
      
            <div className="search-bar-container">
                <form
                    onSubmit={(e) => { e.preventDefault(); handleSearch(searchField, searchQuery); }}
                    className="search-bar-form"
                >
                    
                    <select
                        value={searchField}
                        onChange={(e) => setSearchField(e.target.value)}
                        className="search-field-select"
                    >
                        <option value="numSertif">Num Sertif</option>
                        <option value="nserie">Nserie</option>
                       
                        <option value="etat">Etat</option>
                        <option value="exercice">Exercice</option>
                        <option value="notification">Notification</option>
                    </select>


                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                    <button type="button" onClick={handleCancelSearch}>x</button>
                    <button type="button" onClick={handleDownloadExcel}>Extraction</button>
                  
                        <button
                            className="BO"
                            onClick={() => {
                                setSelectedEtalonnage(null);
                                setIsUpdate(false);
                                setIsModalOpen(true);
                            }}
                            disabled={loading}
                        >
                            Ajouter Etalonnage
                        </button>
                   
                </form>
            </div>

            

          
        
            <br></br>
            <table className="modalx">
                <thead>
                    <tr>
                        <th>Designation</th>
                        <th>Marque</th>
                        <th>Num Sertif</th>
                        <th>mle</th>
                        <th>nom</th>
                        <th>prenom</th>
                        <th>service</th>
                        <th>departement</th>
                        <th>nom caisse</th>
                        <th>type caisse</th>
                        <th>Date Debut</th>
                        <th>Date Fin</th>
                        <th>Etat</th>
                        <th>Function</th>
                        <th>Notification</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
    {filteredEtalonnages.map(etalonnage => (
        <tr key={etalonnage.numSertif}>
            <td>{etalonnage.outillage?.designation || '-'}</td>
            <td>{etalonnage.outillage?.marque || '-'}</td>
            <td>{etalonnage.numSertif}</td>
            <td>{etalonnage.outillage?.person?.mle || '-'}</td>
            <td>{etalonnage.outillage?.person?.nom || '-'}</td>
            <td>{etalonnage.outillage?.person?.prenom || '-'}</td>
            <td>{etalonnage.outillage?.person?.service || '-'}</td>
            <td>{etalonnage.outillage?.person?.departement || '-'}</td>
            <td>{etalonnage.outillage?.caisseMatricule || '-'}</td>
            <td>{etalonnage.outillage?.caisse?.type || '-'}</td>
            <td>{etalonnage.dateDebutEtalonnage ? new Date(etalonnage.dateDebutEtalonnage).toLocaleDateString() : '-'}</td>
            <td>{etalonnage.dateFinEtalonnage ? new Date(etalonnage.dateFinEtalonnage).toLocaleDateString() : '-'}</td>
            <td>{etalonnage.etat}</td>
            <td>{etalonnage.exercice}</td>
            <td>{etalonnage.notification}</td>
            
            <td>
                <button className="button" onClick={() => handleUpdateClick(etalonnage)}>Mis A Jour</button>
                <button className="button" onClick={() => handleDelete(etalonnage.numSertif)}>Supprimer</button>
                <button className="button" onClick={() => handleHistoryClick(etalonnage)}>History</button>
            </td>
        </tr>
    ))}
</tbody>

            </table>

            {isModalOpen && (
                <AddEtalonnageModal
                    isOpen={isModalOpen}
                    onRequestClose={() => setIsModalOpen(false)}
                    refreshList={refreshList}
                    initialEtalonnage={selectedEtalonnage}
                    isUpdate={isUpdate}
                />
            )}
            {isHistoryModalOpen && (
    <EtalonnageHistoryList
        isOpen={isHistoryModalOpen}
        onRequestClose={() => setIsHistoryModalOpen(false)}
        selectedNumSertif={selectedNumSertif}
    />
)}
        </div>
    );
};

export default EtalonnageList;
