import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import * as XLSX from 'xlsx';

Modal.setAppElement('#root');

const EtalonnageHistoryList = ({ isOpen, onRequestClose, selectedNumSertif }) => {
    const [etalonnageHistory, setEtalonnageHistory] = useState([]);
    const [filteredEtalonnageHistory, setFilteredEtalonnageHistory] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const itemsPerPage = 5;

    useEffect(() => {
        if (isOpen) {
            console.log("Selected Num Sertif:", selectedNumSertif); // Debugging line
            fetchEtalonnageHistory();
        }
    }, [isOpen, selectedNumSertif]);

    const fetchEtalonnageHistory = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/etalonnagehistory');
            console.log("Fetched Data:", response.data); // Check the data structure
            const sortedEtalonnageHistory = response.data
                .filter(history => history.numSertif === selectedNumSertif)
                .sort((a, b) => b.dateDebutEtalonnage.localeCompare(a.dateDebutEtalonnage));
            setEtalonnageHistory(sortedEtalonnageHistory);
            setFilteredEtalonnageHistory(sortedEtalonnageHistory);
        } catch (error) {
            console.error('Error fetching etalonnage history:', error);
            setError('Error fetching etalonnage history: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const indexOfLastHistory = currentPage * itemsPerPage;
    const indexOfFirstHistory = indexOfLastHistory - itemsPerPage;
    const currentEtalonnageHistory = filteredEtalonnageHistory.slice(indexOfFirstHistory, indexOfLastHistory);
    const totalPages = Math.ceil(filteredEtalonnageHistory.length / itemsPerPage);

    const handleNextPage = () => {
        setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages));
    };

    const handlePrevPage = () => {
        setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
    };

    const handleDownloadExcel = () => {
        // Prepare data for Excel export
        const excelData = etalonnageHistory.map(history => ({
            "Operation": history.operation || '-',
            "Date": history.dateEtalonnageHistory || '-',
            "Person": history.person || '-',
            "Num Sertif": history.numSertif || '-',
            "N Serie": history.nserie || '-',
            "Date Debut Etalonnage": history.dateDebutEtalonnage ? new Date(history.dateDebutEtalonnage).toLocaleDateString() : '-',
            "Date Fin Etalonnage": history.dateFinEtalonnage ? new Date(history.dateFinEtalonnage).toLocaleDateString() : '-',
            "Etat": history.etat || '-',
            "Exercice": history.exercice || '-',
            "Notification": history.notification || '-'
        }));

        // Create a worksheet and workbook
        const worksheet = XLSX.utils.json_to_sheet(excelData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Etalonnage History");

        // Trigger the download
        XLSX.writeFile(workbook, "etalonnage_history.xlsx");
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Etalonnage History"
            className="modal history-modal"
            overlayClassName="modal-overlay"
        >
            <div className="etalonnage-history-list-container">
                <h2>Etalonnage History pour {selectedNumSertif}</h2>
                {loading && <p>Loading...</p>}
                {error && <p className="error-message">{error}</p>}
                
                <table>
    <thead>
        <tr>
            <th>Operation</th>
            <th>Date</th>
            <th>Person</th>
            <th>Num Sertif</th>
            <th>N serie</th>
            <th>Date Debut Etalonnage</th>
            <th>Date Fin Etalonnage</th>
            <th>Etat</th>
            <th>Exercice</th>
            <th>Notification</th>
        </tr>
    </thead>
    <tbody>
        {currentEtalonnageHistory.length > 0 ? (
            currentEtalonnageHistory.map(etalonnagehistory => (
                <tr key={etalonnagehistory.numSertif}>
                    <td>{etalonnagehistory.operation}</td>
                    <td>{etalonnagehistory.dateEtalonnageHistory || 'N/A'}</td>
                    <td>{etalonnagehistory.person}</td>
                    <td>{etalonnagehistory.numSertif}</td>
                    <td>{etalonnagehistory.nserie}</td>
                    <td>{etalonnagehistory.dateDebutEtalonnage ? new Date(etalonnagehistory.dateDebutEtalonnage).toLocaleDateString() : 'N/A'}</td>
                    <td>{etalonnagehistory.dateFinEtalonnage ? new Date(etalonnagehistory.dateFinEtalonnage).toLocaleDateString() : 'N/A'}</td>
                    <td>{etalonnagehistory.etat}</td>
                    <td>{etalonnagehistory.exercice}</td>
                    <td>{etalonnagehistory.notification}</td>
                </tr>
            ))
        ) : (
            <tr>
                <td colSpan="8">No History available.</td>
            </tr>
        )}
    </tbody>
</table>


                <div className="pagination">
                    <button onClick={handlePrevPage} disabled={currentPage === 1 || loading}>Précédente</button>
                    <span>Page {currentPage} sur {totalPages}</span>
                    <button onClick={handleNextPage} disabled={currentPage === totalPages || loading}>Suivante</button>
                </div>
                <button onClick={handleDownloadExcel}>Extraction </button>
                <button onClick={onRequestClose} className="close-button">X</button>
            </div>
        </Modal>
    );
};

export default EtalonnageHistoryList;
