import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchBarEtalonnage from './SearchBarEtalonnage';
import EtalonnageHistoryList from './EtalonnageHistoryList';
import AddEtalonnageModal from './AddEtalonnageModal';
import * as XLSX from 'xlsx';

//import './EtalonnageList.css';
const EtalonnageListUser = ({ mle, prenom, nom ,getalonnage}) => {
    const [selectedEtalonnage, setSelectedEtalonnage] = useState(null);
    const [isUpdate, setIsUpdate] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [etalonnages, setEtalonnages] = useState([]);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchField, setSearchField] = useState('numSertif');
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const [selectedNumSertif, setSelectedNumSertif] = useState('');
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        const fetchEtalonnages = async () => {
            try {
                const response = await axios.get('/api/etalonnages');
                const currentDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format

                // Filter etalonnages by logged-in user's mle
                const filteredEtalonnages = response.data.filter(etalonnage =>
                    etalonnage.outillage.mle === mle
                );

                // Set etat based on the dateFinEtalonnage
                setEtalonnages(filteredEtalonnages.map(etalonnage => ({
                    ...etalonnage,
                    etat: new Date(etalonnage.dateFinEtalonnage) > new Date(currentDate) ? 'Etalonner' : 'Exercer'
                })));
            } catch (error) {
                setError('Error fetching etalonnages');
                console.error('Error fetching etalonnages:', error);
            }
        };

        fetchEtalonnages();
    }, [mle]);

    const refreshList = () => {
        const fetchEtalonnages = async () => {
            try {
                const response = await axios.get('/api/etalonnages');
                const currentDate = new Date().toISOString().split('T')[0];

                const filteredEtalonnages = response.data.filter(etalonnage =>
                    etalonnage.outillage.mle === mle
                );

                setEtalonnages(filteredEtalonnages.map(etalonnage => ({
                    ...etalonnage,
                    etat: new Date(etalonnage.dateFinEtalonnage) > new Date(currentDate) ? 'Etalonner' : 'Exercer'
                })));
            } catch (error) {
                setError('Error fetching etalonnages');
                console.error('Error fetching etalonnages:', error);
            }
        };

        fetchEtalonnages();
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
    const handleSearch = (field, query) => {
        setSearchField(field);
        setSearchQuery(query);
    };

    const handleCancelSearch = () => {
        setSearchQuery('');
        setSearchField('numSertif');
    };

    const handleHistoryClick = (etalonnage) => {
        setSelectedNumSertif(etalonnage.numSertif);
        setIsHistoryModalOpen(true);
    };

    const filteredEtalonnages = etalonnages.filter(etalonnage =>
        etalonnage[searchField]?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDownloadExcel = () => {
        const excelData = filteredEtalonnages.map(etalonnage => ({
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
        <div className="etalonnage-list-container">
           
            <h2>Etalonnages Pour {prenom} {nom} ({filteredEtalonnages.length}) </h2>








            
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
                    {getalonnage !== 'Lecture' && (
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
                    )}
                </form>
            </div>




            
             

            {error && <p className="error-message">{error}</p>}



      

            <table className="modaly">
    <thead>
        <tr>
            <th>Designation</th>
            <th>Nserie</th>
            <th>Marque</th>
            <th>Num Sertif</th>
            <th>Amle</th>
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
        {filteredEtalonnages.length > 0 ? (
            filteredEtalonnages.map(etalonnage => (
                <tr key={etalonnage.numSertif}>
                <td>{etalonnage.outillage?.designation || '-'}</td>
                <td>{etalonnage.nserie || '-'}</td>
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

                {getalonnage !== 'Lecture' && (
      <>
                <button className="button" onClick={() => handleUpdateClick(etalonnage)}>Mis A Jour</button>
                <button className="button" onClick={() => handleDelete(etalonnage.numSertif)}>Supprimer</button>       
      </>
    )}
            


                    <button className="button" onClick={() => handleHistoryClick(etalonnage)}>History</button>
                </td>
            </tr>
            ))
        ) : (
            <tr>
                <td colSpan="15" style={{ textAlign: 'center' }}>No etalonnages available.</td>
            </tr>
        )}
    </tbody>
</table>
                 <AddEtalonnageModal
                    isOpen={isModalOpen}
                    onRequestClose={() => setIsModalOpen(false)}
                    refreshList={refreshList}
                    initialEtalonnage={selectedEtalonnage}
                    isUpdate={isUpdate}
                />

            <EtalonnageHistoryList
                isOpen={isHistoryModalOpen}
                onRequestClose={() => setIsHistoryModalOpen(false)}
                selectedNumSertif={selectedNumSertif}
            />
        </div>
    );
};

export default EtalonnageListUser;
