import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddDispositionModal from './AddDispositionModal';
import SearchBarDisposition from './SearchBarDisposition';
import * as XLSX from 'xlsx';



const DispositionList = () => {
    const [dispositions, setDispositions] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedDisposition, setSelectedDisposition] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isEditingX, setIsEditingX] = useState(false);
    const [originalDispositions, setOriginalDispositions] = useState([]); // For storing the initial list

    useEffect(() => {
        const fetchDispositions = async () => {
            try {
                const response = await axios.get('/api/dispositions');
                console.log('Fetched dispositions:', response.data);
                setDispositions(response.data);
                setOriginalDispositions(dispositions); // Save the original list
            } catch (error) {
                console.error('Error fetching dispositions:', error);
            }
        };
    
        fetchDispositions();
    }, []);

    const openModal = (disposition , editType) => {
        setSelectedDisposition(disposition);
        setIsEditing(editType === 'Update');
        setIsEditingX(editType === 'UpdateX');
        setModalIsOpen(true);
    };
    

    const closeModal = () => {
        setModalIsOpen(false);
        setIsEditing(false);
        setIsEditingX(false);
        setSelectedDisposition(null);
    };

    const refreshList = async () => {
        try {
            const response = await axios.get('/api/dispositions');
            setDispositions(response.data);
        } catch (error) {
            console.error('Error refreshing dispositions:', error);
        }
    };
    const handleSearch = (field, searchTerm) => {
        if (!searchTerm) {
            refreshList(); // Refresh the list to the original state
        } else {
            const filtered = dispositions.filter((disposition) => {
                switch (field) {
                    case 'nmad':
                        return disposition.nmad && disposition.nmad.toLowerCase().includes(searchTerm.toLowerCase());
                    case 'datedisposition':
                        return disposition.datedisposition && new Date(disposition.datedisposition).toLocaleDateString().includes(searchTerm);
                    case 'dateretour':
                        return disposition.dateretour && new Date(disposition.dateretour).toLocaleDateString().includes(searchTerm);
                    case 'designation':
                        return disposition.outillage && disposition.outillage.designation && disposition.outillage.designation.toLowerCase().includes(searchTerm.toLowerCase());
                    case 'nserie':
                        return disposition.outillage && disposition.nserie && disposition.nserie.toLowerCase().includes(searchTerm.toLowerCase());
                    case 'marque':
                        return disposition.outillage && disposition.outillage.marque && disposition.outillage.marque.toLowerCase().includes(searchTerm.toLowerCase());
                    case 'etat':
                        return disposition.etat && disposition.etat.toLowerCase().includes(searchTerm.toLowerCase());
                    case 'remarque':
                        return disposition.remarque && disposition.remarque.toLowerCase().includes(searchTerm.toLowerCase());
                    default:
                        return false;
                }
            });
            setDispositions(filtered);
        }
    };
    

    const handleCancel = () => {
        refreshList();
        setDispositions(originalDispositions); // Reset to the original list
        
    };

    const handleDownloadExcel = () => {
        // Prepare the data for Excel export
        const excelData = [];
    
        // Demande MAD list data
        if (demandeMadList.length > 0) {
            demandeMadList.forEach(disposition => {
                excelData.push({
                    "NMAD": disposition.nmad || '-',
                    "Date Disposition": disposition.datedisposition ? new Date(disposition.datedisposition).toLocaleDateString() : 'N/A',
                    "Date Retour": disposition.dateretour ? new Date(disposition.dateretour).toLocaleDateString() : '-',
                    "Outillage Designation": disposition.outillage?.designation || '-',
                    "Outillage Nserie": disposition.outillage?.nserie || '-',
                    "Outillage Marque": disposition.outillage?.marque || '-',
                    "Etat": disposition.etat || '-',
                    "Remarque": disposition.remarque || '-',
                    "Section": "Demande MAD"
                });
            });
        }
    
        // Acceptation Temporaire list data
        if (acceptationTemporaireList.length > 0) {
            acceptationTemporaireList.forEach(disposition => {
                excelData.push({
                    "NMAD": disposition.nmad || '-',
                    "Date Disposition": disposition.datedisposition ? new Date(disposition.datedisposition).toLocaleDateString() : 'N/A',
                    "Date Retour": disposition.dateretour ? new Date(disposition.dateretour).toLocaleDateString() : '-',
                    "Outillage Designation": disposition.outillage?.designation || '-',
                    "Outillage Nserie": disposition.outillage?.nserie || '-',
                    "Outillage Marque": disposition.outillage?.marque || '-',
                    "Etat": disposition.etat || '-',
                    "Remarque": disposition.remarque || '-',
                    "Section": "Acceptation Temporaire"
                });
            });
        }
    
        // Demande Remise MAD list data
        if (demandeReMadList.length > 0) {
            demandeReMadList.forEach(disposition => {
                excelData.push({
                    "NMAD": disposition.nmad || '-',
                    "Date Disposition": disposition.datedisposition ? new Date(disposition.datedisposition).toLocaleDateString() : 'N/A',
                    "Date Retour": disposition.dateretour ? new Date(disposition.dateretour).toLocaleDateString() : '-',
                    "Outillage Designation": disposition.outillage?.designation || '-',
                    "Outillage Nserie": disposition.outillage?.nserie || '-',
                    "Outillage Marque": disposition.outillage?.marque || '-',
                    "Etat": disposition.etat || '-',
                    "Remarque": disposition.remarque || '-',
                    "Section": "Demande Remise MAD"
                });
            });
        }
    
        // Acceptation Remise MAD list data
        if (acceptationReMadList.length > 0) {
            acceptationReMadList.forEach(disposition => {
                excelData.push({
                    "NMAD": disposition.nmad || '-',
                    "Date Disposition": disposition.datedisposition ? new Date(disposition.datedisposition).toLocaleDateString() : 'N/A',
                    "Date Retour": disposition.dateretour ? new Date(disposition.dateretour).toLocaleDateString() : '-',
                    "Outillage Designation": disposition.outillage?.designation || '-',
                    "Outillage Nserie": disposition.outillage?.nserie || '-',
                    "Outillage Marque": disposition.outillage?.marque || '-',
                    "Etat": disposition.etat || '-',
                    "Remarque": disposition.remarque || '-',
                    "Section": "Acceptation Remise MAD"
                });
            });
        }
    
        // Create a worksheet and workbook
        const worksheet = XLSX.utils.json_to_sheet(excelData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Dispositions");
    
        // Trigger the download
        XLSX.writeFile(workbook, "dispositions.xlsx");
    };
    
    // Separate dispositions into lists based on criteria
    const demandeMadList = dispositions.filter(d => d.demande === 'Demande MAD');
    const acceptationTemporaireList = dispositions.filter(d => d.demande === 'Acceptation' && d.etat === 'Temporaire');
    const demandeReMadList = dispositions.filter(d => d.demande === 'Demande re-MAD');
    const acceptationReMadList = dispositions.filter(d => d.demande === 'Acceptation re-MAD');

    return (
        <div>
            <SearchBarDisposition onSearch={handleSearch} onCancel={handleCancel} /> {/* Search functionality */}
            <button className="LJA" onClick={handleDownloadExcel}>Extraction</button>
            
            <br></br>
          
            {/* Demande = Demande MAD List */}
            <h3 >LISTE DES DEMANDES DE MISE A DISPOSITION</h3>
            <table>
                <thead>
                    <tr>
                        <th>NMAD</th>
                        <th>MLE</th>
                        <th>NOM</th>
                        <th>PRENOM</th>
                        <th>DATE Disposition</th>
                        <th>DATE Retour</th>
                        <th>DESIGNATION</th>
                        <th>NSERIE</th>
                        <th>MARQUE</th>
                        <th>Etat</th>
                        <th>Remarque</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {demandeMadList.length > 0 ? (
                        demandeMadList.map(disposition => (
                            <tr key={disposition.nmad}>
                                <td>{disposition.nmad}</td>
                                <td>{disposition.person ? disposition.person.mle : '-'}</td>
                                <td>{disposition.person ? disposition.person.nom : '-'}</td>
                                <td>{disposition.person ? disposition.person.prenom : '-'}</td>
                                <td>{disposition.datedisposition ? new Date(disposition.datedisposition).toLocaleDateString() : 'N/A'}</td>
                                <td>{disposition.dateretour ? new Date(disposition.dateretour).toLocaleDateString() : 'N/A'}</td>
                                <td>{disposition.outillage ? disposition.outillage.designation : '-'}</td>
                                <td>{disposition.outillage ? disposition.nserie : '-'}</td>
                                <td>{disposition.outillage ? disposition.outillage.marque : '-'}</td>
                                <td>{disposition.etat ? disposition.etat: '-'}</td>
                                <td>{disposition.remarque ? disposition.remarque: '-'}</td>
                                
                                <td>
                                <button className="button" onClick={() => openModal(disposition, 'Update')}>TRAITER</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="9">No dispositions with Demande MAD</td>
                        </tr>
                    )}
                </tbody>
            </table>
<br></br>
<br></br>
            {/* Demande = Acceptation && Etat = Temporaire List */}
            <h3>LISTE DES DEMANDES ACCEPTEES</h3>
            <table>
                <thead>
                    <tr>
                    <th>NMAD</th>
                        <th>MLE</th>
                        <th>NOM</th>
                        <th>PRENOM</th>
                        <th>DATE Disposition</th>
                        <th>DATE Retour</th>
                        <th>DESIGNATION</th>
                        <th>NSERIE</th>
                        <th>MARQUE</th>
                        <th>Etat</th>
                        <th>Remarque</th>
                        
                    </tr>
                </thead>
                <tbody>
                    {acceptationTemporaireList.length > 0 ? (
                        acceptationTemporaireList.map(disposition => (
                            <tr key={disposition.nmad}>
                                  <td>{disposition.nmad}</td>
                                <td>{disposition.person ? disposition.person.mle : '-'}</td>
                                <td>{disposition.person ? disposition.person.nom : '-'}</td>
                                <td>{disposition.person ? disposition.person.prenom : '-'}</td>
                                <td>{disposition.datedisposition ? new Date(disposition.datedisposition).toLocaleDateString() : 'N/A'}</td>
                                <td>{disposition.dateretour ? new Date(disposition.dateretour).toLocaleDateString() : 'N/A'}</td>
                                <td>{disposition.outillage ? disposition.outillage.designation : '-'}</td>
                                <td>{disposition.outillage ? disposition.nserie : '-'}</td>
                                <td>{disposition.outillage ? disposition.outillage.marque : '-'}</td>
                                <td>{disposition.etat ? disposition.etat: '-'}</td>
                                <td>{disposition.remarque ? disposition.remarque: '-'}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8">No dispositions with Acceptation Temporaire</td>
                        </tr>
                    )}
                </tbody>
            </table>
            <br></br>
            <br></br>
            {/* Demande = Demande re-MAD List */}
            <h3>LISTE DES DEMANDES DE REMISE A DISPOSITION</h3>
            <table>
                <thead>
                    <tr>
                    <th>NMAD</th>
                        <th>MLE</th>
                        <th>NOM</th>
                        <th>PRENOM</th>
                        <th>DATE Disposition</th>
                        <th>DATE Retour</th>
                        <th>DESIGNATION</th>
                        <th>NSERIE</th>
                        <th>MARQUE</th>
                        <th>Etat</th>
                        <th>Remarque</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {demandeReMadList.length > 0 ? (
                        demandeReMadList.map(disposition => (
                            <tr key={disposition.nmad}>
                                  <td>{disposition.nmad}</td>
                                <td>{disposition.person ? disposition.person.mle : '-'}</td>
                                <td>{disposition.person ? disposition.person.nom : '-'}</td>
                                <td>{disposition.person ? disposition.person.prenom : '-'}</td>
                                <td>{disposition.datedisposition ? new Date(disposition.datedisposition).toLocaleDateString() : 'N/A'}</td>
                                <td>{disposition.dateretour ? new Date(disposition.dateretour).toLocaleDateString() : 'N/A'}</td>
                                <td>{disposition.outillage ? disposition.outillage.designation : '-'}</td>
                                <td>{disposition.outillage ? disposition.nserie : '-'}</td>
                                <td>{disposition.outillage ? disposition.outillage.marque : '-'}</td>
                                <td>{disposition.etat ? disposition.etat: '-'}</td>
                                <td>{disposition.remarque ? disposition.remarque: '-'}</td>
                                <td>
                                <button className="button" onClick={() => openModal(disposition, 'UpdateX')}>TRAITER</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8">No dispositions with Demande re-MAD</td>
                        </tr>
                    )}
                </tbody>
            </table>
            <br></br>
            <br></br>
            {/* Demande = Acceptation re-MAD List */}
            <h3>LISTE DES DEMANDES DE REMISE A DISPOSITION ACCEPTEES</h3>
            <table>
                <thead>
                    <tr>
                    <th>NMAD</th>
                        <th>MLE</th>
                        <th>NOM</th>
                        <th>PRENOM</th>
                        <th>DATE Disposition</th>
                        <th>DATE Retour</th>
                        <th>DESIGNATION</th>
                        <th>NSERIE</th>
                        <th>MARQUE</th>
                        <th>Etat</th>
                        <th>Remarque</th>
                        
                    </tr>
                </thead>
                <tbody>
                    {acceptationReMadList.length > 0 ? (
                        acceptationReMadList.map(disposition => (
                            <tr key={disposition.nmad}>
                           <td>{disposition.nmad}</td>
                                <td>{disposition.person ? disposition.person.mle : '-'}</td>
                                <td>{disposition.person ? disposition.person.nom : '-'}</td>
                                <td>{disposition.person ? disposition.person.prenom : '-'}</td>
                                <td>{disposition.datedisposition ? new Date(disposition.datedisposition).toLocaleDateString() : 'N/A'}</td>
                                <td>{disposition.dateretour ? new Date(disposition.dateretour).toLocaleDateString() : 'N/A'}</td>
                                <td>{disposition.outillage ? disposition.outillage.designation : '-'}</td>
                                <td>{disposition.outillage ? disposition.nserie : '-'}</td>
                                <td>{disposition.outillage ? disposition.outillage.marque : '-'}</td>
                                <td>{disposition.etat ? disposition.etat: '-'}</td>
                                <td>{disposition.remarque ? disposition.remarque: '-'}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8">No dispositions with Acceptation Re-MAD</td>
                        </tr>
                    )}
                </tbody>
            </table>

            <AddDispositionModal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                refreshList={refreshList}
                initialDisposition={selectedDisposition}
                disposition={selectedDisposition}
                isUpdate={isEditing}
                isUpdateX={isEditingX}

                
                loggedInMle={selectedDisposition?.mle}  // Pass loggedInMle if needed
            />
        </div>
    );
};

export default DispositionList;
