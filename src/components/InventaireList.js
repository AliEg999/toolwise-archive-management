import React, { useState, useEffect } from 'react';
import axios from 'axios';
import OutillagePagex from './OutillagePagex';
import CaisseHistoryListx from './CaisseHistoryListx';
import SearchBarCaisseZ from './SearchBarCaisseZ'; // Import the SearchBarCaisse component
import * as XLSX from 'xlsx';


const InventaireList = () => {
    const [caisses, setCaisses] = useState([]);
    const [filteredCaisses, setFilteredCaisses] = useState([]); // Add a state to store filtered caisses
    const [outillagesMap, setOutillagesMap] = useState({});
    const [selectedCaisse, setSelectedCaisse] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

    useEffect(() => {
        const fetchCaisses = async () => {
            try {
                const response = await axios.get('/api/caisses');
                setCaisses(response.data);
                setFilteredCaisses(response.data); // Initialize filteredCaisses with the full list
            } catch (error) {
                console.error('Error fetching caisses:', error);
            }
        };

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

        fetchCaisses();
        fetchOutillages();
    }, []);

    const handleSearch = (field, term) => {
        const filtered = caisses.filter((caisse) => {
            if (field === 'nserie') {
                // Searching in outillages based on nserie
                return outillagesMap[caisse.caisseMatricule]?.some(outillage => 
                    outillage.nserie.toLowerCase().includes(term.toLowerCase())
                );
            } else if (caisse[field]) {
                return caisse[field].toLowerCase().includes(term.toLowerCase());
            }
            return false;
        });
        setFilteredCaisses(filtered);
    };

    const handleCancel = () => {
        setFilteredCaisses(caisses); // Reset the filtered list to the full list of caisses
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
    
    const handleDownloadExcel = () => {
        // Create an array of objects for the Excel file from the filtered caisses
        const excelData = filteredCaisses.map(caisse => ({
            "Caisse Name": caisse.caisseName || 'Caisse Virtuelle',
            "Type de Caisse": caisse.type || '-',
            "MLE": caisse.mle || '-',
            "Nom": caisse.person?.nom || '-',
            "Prenom": caisse.person?.prenom || '-',
            "Departement": caisse.person?.departement || '-',
            "Service": caisse.person?.service || '-',
        }));
    
        // Create a worksheet and workbook
        const worksheet = XLSX.utils.json_to_sheet(excelData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Caisses");
    
        // Trigger the download
        XLSX.writeFile(workbook, "inventaire_list.xlsx");
    };
    
    const renderCaisseTable = () => {
        return (
            <div>
              
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
                                <td>{caisse.person?.service || '-'}</td>
                                <td>
                                    <button className="button" onClick={() => handleVisualiser(caisse)}>Inventaire</button>
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
           
            <h2>Inventaire des Caisses <span className="caisse-count">({filteredCaisses.length})</span></h2>
        
            <SearchBarCaisseZ onSearch={handleSearch} onCancel={handleCancel} /> {/* Add the SearchBarCaisse */}
            <button className="LJAZ" onClick={handleDownloadExcel}>Extraction</button>
            {renderCaisseTable()}
            {selectedCaisse && (
                <OutillagePagex
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    outillages={outillagesMap[selectedCaisse.caisseMatricule] || []}
                    caisse={selectedCaisse}
                />
            )}
            {selectedCaisse && (
                <CaisseHistoryListx
                    isOpen={isHistoryModalOpen}
                    onRequestClose={closeHistoryModal}
                    caisseMatricule={selectedCaisse.caisseMatricule}
                />
            )}
        </div>
    );
};

export default InventaireList;
