import React, { useState } from 'react';
import Modal from 'react-modal';
import * as XLSX from 'xlsx';

Modal.setAppElement('#root');

const OutillageHistoryCaissex = ({ isOpen, onRequestClose, detailedOutillage, loading, caisseMatricule, dateCaisseHistory, error }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // Adjust the number of items per page as needed

    // Parse dateCaisseHistory into a Date object
    const baseDate = new Date(dateCaisseHistory);

    // Calculate the start and end of the 1-minute window
    const startDate = new Date(baseDate.getTime() - 1 * 60 * 1000); // 1 minute before
    const endDate = new Date(baseDate.getTime() + 1 * 60 * 1000); // 1 minute after

    // Filter outillage history based on caisseMatricule, dateOutillageHistory within the 1-minute window, and operation
    const filteredOutillage = detailedOutillage.filter(outillage => {
        const outillageDate = new Date(outillage.dateOutillageHistory);
        return (
            outillage.caisseMatricule === caisseMatricule &&
            outillageDate >= startDate &&
            outillageDate <= endDate &&
            outillage.operation === 'invantaire'
        );
    });

    // Paginate filtered outillage
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentOutillage = filteredOutillage.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredOutillage.length / itemsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prevPage => prevPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prevPage => prevPage - 1);
        }
    };

    const handleDownloadExcel = () => {
        // Prepare data for Excel export
        const excelData = filteredOutillage.map(outillage => ({
            "Operation": outillage.operation || '-',
            "Date": outillage.dateOutillageHistory || '-',
            "Person": outillage.person || '-',
            "Nserie": outillage.nserie || '-',
            "Designation": outillage.designation || '-',
            "Type": outillage.type || '-',
            "Marque": outillage.marque || '-',
            "Mle": outillage.mle || '-',
            "Caisse Matricule": outillage.caisseMatricule || '-',
            "Reference": outillage.reference || '-',
            "Etalonnage": outillage.etalonnage || '-',
            "Etat": outillage.etat || '-',
            "Resultat": outillage.resultat || '-'
        }));
        
        // Create a worksheet and workbook
        const worksheet = XLSX.utils.json_to_sheet(excelData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Outillage History");
        
        // Trigger the download
        XLSX.writeFile(workbook, "outillage_history.xlsx");
    };
    
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Detailed Outillage"
            className="modal detailed-outillage-modal"
            overlayClassName="modal-overlay"
        >
            <div className="detailed-outillage-container">
                <h2>
                    Outillage Details pour Caisse {caisseMatricule}
                </h2>
                {loading && <p>Loading details...</p>}
                {error && <p className="error-message">{error}</p>}

                {filteredOutillage.length > 0 ? (
                    <>
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
                                {currentOutillage.map(outillage => (
                                    <tr key={outillage.outillageId}>
                                        <td>{outillage.operation}</td>
                                        <td>{outillage.dateOutillageHistory}</td>
                                        <td>{outillage.person}</td>
                                        <td>{outillage.nserie}</td>
                                        <td>{outillage.designation}</td>
                                        <td>{outillage.type}</td>
                                        <td>{outillage.marque}</td>
                                        <td>{outillage.mle}</td>
                                        <td>{outillage.caisseMatricule}</td>
                                        <td>{outillage.reference}</td>
                                        <td>{outillage.etalonnage}</td>
                                        <td>{outillage.etat}</td>
                                        <td>{outillage.resultat}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="pagination">
                            <button onClick={handlePrevPage} disabled={currentPage === 1 || loading}>Précédente</button>
                            <span>Page {currentPage} sur {totalPages}</span>
                            <button onClick={handleNextPage} disabled={currentPage === totalPages || loading}>Suivante</button>
                        </div>
                    </>
                ) : (
                    <p>No outillage details available.</p>
                )}
                <button onClick={handleDownloadExcel}>Extraction </button>
                <button onClick={onRequestClose} className="close-button">X</button>
            </div>
        </Modal>
    );
};

export default OutillageHistoryCaissex;
