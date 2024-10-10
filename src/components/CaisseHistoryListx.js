// CaisseHistoryListx.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import OutillageHistoryCaissex from './OutillageHistoryCaissex'; // Import the new component
import * as XLSX from 'xlsx';

Modal.setAppElement('#root');

const CaisseHistoryListx = ({ isOpen, onRequestClose, caisseMatricule,dateCaisseHistory}) => {
    const [history, setHistory] = useState([]);
    const [filteredHistory, setFilteredHistory] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedHistory, setSelectedHistory] = useState(null);
    const [detailedOutillage, setDetailedOutillage] = useState([]);
    const itemsPerPage = 5;

    useEffect(() => {
        if (isOpen) {
            fetchCaisseHistory();
        }
    }, [isOpen, caisseMatricule,dateCaisseHistory]);

    const fetchCaisseHistory = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/caissehistories');
            const sortedHistory = response.data
                .filter(history =>
                    history.caisseMatricule === caisseMatricule &&
                    history.operation === 'invantaire'
                )
                .sort((a, b) => new Date(b.dateCaisseHistory).getTime() - new Date(a.dateCaisseHistory).getTime());
            setHistory(sortedHistory);
            setFilteredHistory(sortedHistory);
        } catch (error) {
            console.error('Error fetching caisse history:', error);
            setError('Error fetching caisse history: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchDetailedOutillage = async (caisseMatricule, dateCaisseHistory)  => {
        setLoading(true);
        try {
            const response = await axios.get(`/api/outillagehistory?caisseMatricule=${caisseMatricule}`);
            setDetailedOutillage(response.data);
        } catch (error) {
            console.error('Error fetching outillage history:', error);
            setError('Error fetching outillage history: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDetailsClick = (history) => {
        setSelectedHistory(history);
        fetchDetailedOutillage(caisseMatricule, history.dateCaisseHistory);
    };

    const indexOfLastHistory = currentPage * itemsPerPage;
    const indexOfFirstHistory = indexOfLastHistory - itemsPerPage;
    const currentHistory = filteredHistory.slice(indexOfFirstHistory, indexOfLastHistory);
    const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);

    const handleNextPage = () => {
        setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages));
    };

    const handlePrevPage = () => {
        setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
    };

    const handleDownloadExcel = () => {
        // Prepare data for Excel export
        const excelData = history.map(history => ({
            "Operation": history.operation || '-',
            "Date": history.dateCaisseHistory || '-',
            "Caisse Nom": history.caisseName || '-',
            "Type": history.type || '-',
            "Mle": history.mle || '-',
      
        }));
    
        // Create a worksheet and workbook
        const worksheet = XLSX.utils.json_to_sheet(excelData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Caisse History");
    
        // Trigger the download
        XLSX.writeFile(workbook, "caisse_history.xlsx");
    };

    

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Caisse History"
            className="modal history-modal"
            overlayClassName="modal-overlay"
        >
            <div className="caisse-history-list-container">
                <h2>Caisse History pour {caisseMatricule}</h2>
                {loading && <p>Loading...</p>}
                {error && <p className="error-message">{error}</p>}
                
                <table>
                    <thead>
                        <tr>
                            <th>Operation</th>
                            <th>Date</th>
                            <th>Caisse Nom</th>
                            <th>Type</th>
                            <th>Mle</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentHistory.length > 0 ? (
                            currentHistory.map(caissehistory => (
                                <tr key={caissehistory.caisseId}>
                                    <td>{caissehistory.operation || '-'}</td>
                                    <td>{caissehistory.dateCaisseHistory || '-'}</td>
                                    <td>{caissehistory.caisseName || '-'}</td>
                                    <td>{caissehistory.type || '-'}</td>
                                    <td>{caissehistory.mle || '-'}</td>
                                    <td>
                                        <button 
                                            className="button" 
                                            onClick={() => handleDetailsClick(caissehistory)}
                                        >
                                            Details
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6">No History available.</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <div className="pagination">
                    <button onClick={handlePrevPage} disabled={currentPage === 1 || loading}>Précédente</button>
                    <span>Page {currentPage} sur {totalPages}</span>
                    <button onClick={handleNextPage} disabled={currentPage === totalPages || loading}>Suivante</button>
                </div>
                <button onClick={handleDownloadExcel}>Extraction</button>
                <button onClick={onRequestClose} className="close-button">X</button>

                {/* Detailed Outillage Modal */}
                <OutillageHistoryCaissex
                    isOpen={!!selectedHistory}
                    onRequestClose={() => setSelectedHistory(null)}
                    detailedOutillage={detailedOutillage}
                    loading={loading}
                    caisseMatricule={caisseMatricule}
                    dateCaisseHistory={selectedHistory ? selectedHistory.dateCaisseHistory : null} // Pass the selected dateCaisseHistory

                   
                    error={error}
                />
            </div>
        </Modal>
    );
};

export default CaisseHistoryListx;
