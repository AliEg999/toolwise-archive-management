import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal'; // Import the modal component
//import './CaisseHistory.css'; // Import the CSS file for styling
import * as XLSX from 'xlsx';

Modal.setAppElement('#root'); // Set the app element for accessibility

const CaisseHistoryList = ({ isOpen, onRequestClose, caisseMatricule }) => {
    const [history, setHistory] = useState([]);
    const [filteredHistory, setFilteredHistory] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const itemsPerPage = 5;

    useEffect(() => {
        if (isOpen) {
            console.log("Selected Caisse Matricule:", caisseMatricule); // Debugging line
            fetchCaisseHistory();
        }
    }, [isOpen, caisseMatricule]); // Add caisseMatricule to dependency array

    const fetchCaisseHistory = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/caissehistories');
            const sortedHistory = response.data
                .filter(history => history.caisseMatricule === caisseMatricule) // Filter by selected caisseMatricule
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Assuming date is in ISO format
            setHistory(sortedHistory);
            setFilteredHistory(sortedHistory);
        } catch (error) {
            console.error('Error fetching caisse history:', error);
            setError('Error fetching caisse history: ' + error.message);
        } finally {
            setLoading(false);
        }
    };


    const handleDownloadExcel = () => {
        // Create an array of objects for the Excel file using the entire dataset
        const excelData = filteredHistory.map(caissehistory => ({
            "Operation": caissehistory.operation || '-',
            "Date": caissehistory.dateCaisseHistory || '-',
            "Caisse Nom": caissehistory.caisseName || '-',
            "Type": caissehistory.type || '-',
            "Mle": caissehistory.mle || '-',
            "Etat": caissehistory.etat || '-'
        }));
    
        // Create a worksheet and workbook
        const worksheet = XLSX.utils.json_to_sheet(excelData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "CaisseHistory");
    
        // Trigger the download
        XLSX.writeFile(workbook, "caisse_history.xlsx");
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

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Caisse History"
            className="modal history-modal" // Use a different className for the history modal
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
            <th>Etat</th>
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
                    <td>{caissehistory.etat || '-'}</td>
                </tr>
            ))
        ) : (
            <tr>
                <td colSpan="5">No History available.</td> {/* Adjust colSpan based on the number of columns */}
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
                <button onClick={onRequestClose} className="close-button">X</button> {/* Close button */}
            </div>
        </Modal>
    );
};

export default CaisseHistoryList;
