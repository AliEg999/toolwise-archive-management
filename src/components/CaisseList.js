import React, { useState, useEffect } from 'react';
import axios from 'axios';
import OutillagePage from './OutillagePage'; // Updated import statement
import CaisseHistoryList from './CaisseHistoryList'; // Import the history modal
import './CaisseListUser.css';
import * as XLSX from 'xlsx';

const CaisseList = ({ caisses, onEdit, onDelete, handleAddCaisse }) => {
    const [selectedField, setSelectedField] = useState('caisseName');
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredCaisses, setFilteredCaisses] = useState(caisses); // State for filtered caisses
    const [outillagesMap, setOutillagesMap] = useState({});
    const [selectedCaisse, setSelectedCaisse] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

    useEffect(() => {
        const fetchOutillages = async () => {
            try {
                const response = await axios.get('/api/outillages');
                const outillages = response.data;

                const outillagesMap = {};
                outillages.forEach((outillage) => {
                    if (!outillagesMap[outillage.caisseMatricule]) {
                        outillagesMap[outillage.caisseMatricule] = [];
                    }
                    outillagesMap[outillage.caisseMatricule].push(outillage);
                });

                setOutillagesMap(outillagesMap);
            } catch (error) {
                console.error('Error fetching outillages:', error);
            }
        };

        fetchOutillages();
    }, [caisses]);

    // Update filteredCaisses whenever caisses, searchTerm, or selectedField changes
    useEffect(() => {
        setFilteredCaisses(filterCaisses(caisses));
    }, [caisses, searchTerm, selectedField]);

    const handleEdit = (caisse) => {
        if (caisse.caisseMatricule === 'Caisse Virtuelle') {
            alert("Nous ne pouvons pas modifier la Caisse Virtuelle");
        } else {
            onEdit(caisse);
        }
    };

    const handleDelete = async (caisseMatricule) => {
        if (caisseMatricule === 'Caisse Virtuelle') {
            alert("Nous ne pouvons pas supprimer la Caisse Virtuelle");
        } else {
            if (window.confirm('Etes-vous sûr de vouloir supprimer cette caisse ?')) {
                await axios.delete(`/api/caisses/${caisseMatricule}`);
                onDelete();
            }
        }
    };

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

    const filterCaisses = (caisses) => {
        return caisses.filter(caisse =>
            caisse[selectedField]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    const handleSearch = (field, term) => {
        setSelectedField(field);
        setSearchTerm(term);
        setCurrentPage(1); // Reset to first page after search
    };

    const handleCancelSearch = () => {
        setSearchTerm('');
        setSelectedField('caisseName');
        setCurrentPage(1); // Reset pagination
    };

    const handleDownloadExcel = () => {
        const excelData = filteredCaisses.map(caisse => ({
            "Caisse Name": caisse.caisseName || 'Caisse Virtuelle',
            "Type de caisse": caisse.type || '-',
            "MLE": caisse.mle || '-',
            "NOM": caisse.person?.nom || '-',
            "PRENOM": caisse.person?.prenom || '-',
            "DEPARTEMENT": caisse.person?.departement || '-',
            "SERVICE": caisse.person?.service || '-',
        }));

        const worksheet = XLSX.utils.json_to_sheet(excelData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Caisses");

        XLSX.writeFile(workbook, "caisses.xlsx");
    };

    const renderCaisseTable = () => {
        return (
            <div>
                <h2>Caisses List <span className="caisse-count">({filteredCaisses.length})</span></h2>

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
                        <button className="BO" onClick={handleAddCaisse}>Ajouter Caisse</button>
                    </form>
                </div>

               
                <table>
                    <thead>
                        <tr>
                            <th>Caisse Name</th>
                            <th>Type de caisse</th>
                            <th>MLE</th>
                            <th>NOM</th>
                            <th>PRENOM</th>
                            <th>DEPARTEMENT</th>
                            <th>SERVICE</th>
                            <th>ETAT</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCaisses.map((caisse) => (
                            <tr key={caisse.caisseMatricule}>
                                <td>{caisse.caisseName || 'Caisse Virtuelle'}</td>
                                <td>{caisse.type || '-'}</td>
                                <td>{caisse.mle || '-'}</td>
                                <td>{caisse.person?.nom || '-'}</td>
                                <td>{caisse.person?.prenom || '-'}</td>
                                <td>{caisse.person?.departement || '-'}</td>
                                <td>{caisse.person?.service || '-'} </td>
                                <td>{caisse.etat || '-'} </td>
                                <td>
                                    <button className="button" onClick={() => handleEdit(caisse)}>Mis A Jour</button>
                                    <button className="button" onClick={() => handleDelete(caisse.caisseMatricule)}>Supprimer</button>
                                    <button className="button" onClick={() => handleVisualiser(caisse)}>Visualiser</button>
                                    <button className="button" onClick={() => handleHistoryClick(caisse)}>History</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div>
            {renderCaisseTable()}
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
        </div>
    );
};

export default CaisseList;
