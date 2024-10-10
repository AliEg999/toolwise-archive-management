import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal'; // Import the modal component
import './OutillageHistory.css'; 
import * as XLSX from 'xlsx';

Modal.setAppElement('#root'); // Set the app element for accessibility

const OutillageHistoryList = ({ isOpen, onRequestClose, selectedNserie }) => {
    const [outillageHistory, setOutillageHistory] = useState([]);
    const [filteredOutillageHistory, setFilteredOutillageHistory] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const itemsPerPage = 5;

    useEffect(() => {
        if (isOpen) {
            console.log("Selected Nserie:", selectedNserie); // Debugging line
            fetchOutillageHistory();
        }
    }, [isOpen, selectedNserie]); // Add selectedNserie to dependency array

    const fetchOutillageHistory = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/outillagehistory');
            const sortedOutillageHistory = response.data
                .filter(history => history.nserie === selectedNserie) // Filter by selected nserie
                .sort((a, b) => b.dateOutillageHistory.localeCompare(a.dateOutillageHistory));
            setOutillageHistory(sortedOutillageHistory);
            setFilteredOutillageHistory(sortedOutillageHistory);
        } catch (error) {
            console.error('Error fetching outillage history:', error);
            setError('Error fetching outillage history: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const indexOfLastHistory = currentPage * itemsPerPage;
    const indexOfFirstHistory = indexOfLastHistory - itemsPerPage;
    const currentOutillageHistory = filteredOutillageHistory.slice(indexOfFirstHistory, indexOfLastHistory);
    const totalPages = Math.ceil(filteredOutillageHistory.length / itemsPerPage);

    const handleNextPage = () => {
        setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages));
    };

    const handlePrevPage = () => {
        setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
    };

    const handleDownloadExcel = () => {
        // Create an array of objects for the Excel file using all filteredOutillageHistory
        const excelData = filteredOutillageHistory.map(outillagehistory => ({
            "Operation": outillagehistory.operation || '-',
            "Date": outillagehistory.dateOutillageHistory ? new Date(outillagehistory.dateOutillageHistory).toLocaleDateString() : '-',
            "Person": outillagehistory.person || '-',
            "Nserie": outillagehistory.nserie || '-',
            "Designation": outillagehistory.designation || '-',
            "Type": outillagehistory.type || '-',
            "Marque": outillagehistory.marque || '-',
            "Mle": outillagehistory.mle || '-',
            "Caisse Matricule": outillagehistory.caisseMatricule || '-',
            "Reference": outillagehistory.reference || '-',
            "Etalonnage": outillagehistory.etalonnage || '-',
            "Etat": outillagehistory.etat || '-',
            "Resultat": outillagehistory.resultat || '-'
        }));
    
        // Create a worksheet and workbook
        const worksheet = XLSX.utils.json_to_sheet(excelData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "OutillageHistory");
    
        // Trigger the download
        XLSX.writeFile(workbook, "outillage_history.xlsx");
    };
    

    return (
        <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        contentLabel="Outillage History"
        className="modal history-modal" // Use a different className for the history modal
        overlayClassName="modal-overlay"
        >
            <div className="outillage-history-list-container">
                <h2>Outillage History pour {selectedNserie}</h2>
                {loading && <p>Loading...</p>}
                {error && <p className="error-message">{error}</p>}
                
                <table>
                    <thead>
                        <tr>
                            
                            <th>Operation</th>
                            <th>Date</th>
                            <th>Person</th>
                            <th>Nserie</th>
                            <th>Designation</th>
                            <th>Type</th>
                            <th>Marque</th>
                            <th>Mle</th>
                            <th>Caisse Matricule</th>
                            <th>Reference</th>
                            <th>Etalonnage</th>
                            <th>Etat</th>
                            <th>Resultat</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentOutillageHistory.map(outillagehistory => (
                            <tr key={outillagehistory.outillageId}>
                                
                                <td>{outillagehistory.operation || '-'}</td>
                                <td>{outillagehistory.dateOutillageHistory || '-'}</td>
                                <td>{outillagehistory.person || '-'}</td>
                                <td>{outillagehistory.nserie || '-'}</td>
                                <td>{outillagehistory.designation || '-'}</td>
                                <td>{outillagehistory.type || '-'}</td>
                                <td>{outillagehistory.marque || '-'}</td>
                                <td>{outillagehistory.mle || '-'}</td>
                                <td>{outillagehistory.caisseMatricule || '-'}</td>
                                <td>{outillagehistory.reference || '-'}</td>
                                <td>{outillagehistory.etalonnage || '-'}</td>
                                <td>{outillagehistory.etat || '-'}</td>
                                <td>{outillagehistory.resultat || '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="pagination">
                    <button onClick={handlePrevPage} disabled={currentPage === 1 || loading}>Previous</button>
                    <span>Page {currentPage} of {totalPages}</span>
                    <button onClick={handleNextPage} disabled={currentPage === totalPages || loading}>Next</button>
                </div>
                <button onClick={handleDownloadExcel}>Extraction</button>
                <button onClick={onRequestClose} className="close-button">X</button> {/* Close button */}
            </div>
        </Modal>
    );
};

export default OutillageHistoryList;
