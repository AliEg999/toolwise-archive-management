import React, { useState } from 'react';
import Modal from 'react-modal';
import AddOutillageModal from './AddOutillageModal';
import OutillageHistoryList from './OutillageHistoryList'; // Import the OutillageHistoryList component
import './OutillagePage.css';
import * as XLSX from 'xlsx';

// Ensure Modal is properly set up
Modal.setAppElement('#root');

const OutillagePage = ({ isOpen, onClose, outillages, caisse }) => {
    const [isAddOutillageModalOpen, setAddOutillageModalOpen] = useState(false);
    const [isHistoryModalOpen, setHistoryModalOpen] = useState(false);
    const [selectedNserie, setSelectedNserie] = useState(null); // State to store the selected nserie
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const closeAddOutillageModal = () => {
        setAddOutillageModalOpen(false);
    };

    const openHistoryModal = (nserie) => {
        setSelectedNserie(nserie);
        setHistoryModalOpen(true);
    };

    const closeHistoryModal = () => {
        setHistoryModalOpen(false);
    };

    const handleDownloadExcel = () => {
        // Prepare data for Excel export
        const excelData = outillages.map(outillage => ({
            "Désignation": outillage.designation || '-',
            "Marque": outillage.marque || '-',
            "N° Série": outillage.nserie || '-',
            "Type": outillage.type || '-',
            "MLE": outillage.mle || '-',
            "NOM": outillage.person?.nom || '-',
            "PRENOM": outillage.person?.prenom || '-',
            "Etat": outillage.etat || '-',
            "Étalonnage": outillage.etalonnage || '-',
            "Inventaire": outillage.inventaire || '-'
        }));

        // Create a worksheet and workbook
        const worksheet = XLSX.utils.json_to_sheet(excelData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Outillages");

        // Trigger the download
        XLSX.writeFile(workbook, "outillages.xlsx");
    };

    // Pagination Logic
    const indexOfLastOutillage = currentPage * itemsPerPage;
    const indexOfFirstOutillage = indexOfLastOutillage - itemsPerPage;
    const currentOutillages = outillages.slice(indexOfFirstOutillage, indexOfLastOutillage);
    const totalPages = Math.ceil(outillages.length / itemsPerPage);

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

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Outillage List"
            className="modal"
            overlayClassName="modal-overlay"
        >
            <div className="modal-header">
                <h2>Outillage List pour {caisse.caisseMatricule}</h2>
                <button onClick={onClose} className="modal-close-button">X</button>
            </div>
            <table className="model">
                <thead>
                    <tr>
                        <th>Désignation</th>
                        <th>Marque</th>
                        <th>N° Série</th>
                        <th>Type</th>
                        <th>MLE</th>
                        <th>NOM</th>
                        <th>PRENOM</th>
                        <th>Etat</th>
                        <th>Étalonnage</th>
                        <th>Inventaire</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {currentOutillages.length > 0 ? (
                        currentOutillages.map((outillage) => (
                            <tr key={outillage.nserie}>
                                <td>{outillage.designation}</td>
                                <td>{outillage.marque}</td>
                                <td>{outillage.nserie}</td>
                                <td>{outillage.type}</td>
                                <td>{outillage.mle} </td>
                                <td>{outillage.person.nom} </td>
                                <td>{outillage.person.prenom}</td>
                                <td>{outillage.etat}</td>
                                <td>{outillage.etalonnage}</td>
                                <td>{outillage.inventaire ? outillage.inventaire : '-'}</td>
                                <td>
                                    <button onClick={() => openHistoryModal(outillage.nserie)}>History</button> {/* History button */}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="11">No outillages found for this caisse.</td>
                        </tr>
                    )}
                </tbody>
            </table>
            <div className="pagination">
                <button onClick={handlePrevPage} disabled={currentPage === 1}>Précédente</button>
                <span>Page {currentPage} sur {totalPages}</span>
                <button onClick={handleNextPage} disabled={currentPage === totalPages}>Suivante</button>
            </div>
            <button onClick={handleDownloadExcel}>Extraction</button>
            <AddOutillageModal
                isOpen={isAddOutillageModalOpen}
                onRequestClose={closeAddOutillageModal}
                refreshList={() => { /* Function to refresh the outillage list */ }}
                isUpdate={false}
                caisse={caisse}
            />
            <OutillageHistoryList
                isOpen={isHistoryModalOpen}
                onRequestClose={closeHistoryModal}
                selectedNserie={selectedNserie} // Pass the selected nserie to the history modal
            />
        </Modal>
    );
};

export default OutillagePage;
