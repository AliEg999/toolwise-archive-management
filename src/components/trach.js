import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddDispositionModal from './AddDispositionModal';
import SearchBarDisposition from './SearchBarDisposition';


const DispositionListUser = ({ mle, prenom, nom, service, departement,gdisposition }) => {
    const [dispositions, setDispositions] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedDisposition, setSelectedDisposition] = useState(null);
    const [isEditingZ, setIsEditingZ] = useState(false);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [isEditingX, setIsEditingX] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');  // State for search term

    useEffect(() => {
        const fetchDispositions = async () => {
            try {
                if (mle) {
                    const response = await axios.get('/api/dispositions');
                    const userDispositions = response.data.filter(d => d.mle === mle);
                    console.log('Fetched Dispositions:', userDispositions);
                    setDispositions(userDispositions);
                } else {
                    console.error('User MLE is missing.');
                    setError('User information is missing.');
                }
            } catch (error) {
                console.error('Error fetching dispositions:', error);
                setError('Error fetching dispositions.');
            }
        };

        fetchDispositions();
    }, [mle]);

    const openModal = (disposition , editType) => {
        setSelectedDisposition(disposition);
        setIsEditing(editType === 'Update');
        setIsEditingX(editType === 'UpdateX');
        setIsEditingZ(editType === 'UpdateZ');
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setIsEditingZ(false);
        setSelectedDisposition(null);
    };

    const refreshList = async () => {
        try {
            if (mle) {
                const response = await axios.get('/api/dispositions');
                const userDispositions = response.data.filter(d => d.mle === mle);
                setDispositions(userDispositions);
            }
        } catch (error) {
            console.error('Error refreshing dispositions:', error);
            setError('Error refreshing dispositions.');
        }
    };

    const handleSearch = (term) => {
        setSearchTerm(term.toLowerCase());
    };

        // Filtered List based on search term
        const filteredDispositions = dispositions.filter(disposition => {
            return (
                disposition.nmad.toLowerCase().includes(searchTerm) ||
                (disposition.outillage?.designation?.toLowerCase() || '').includes(searchTerm) ||
                (disposition.outillage?.nserie?.toLowerCase() || '').includes(searchTerm) ||
                (disposition.outillage?.marque?.toLowerCase() || '').includes(searchTerm)
            );
        });

    const demandeMadList = dispositions.filter(d => d.demande === 'Demande MAD');
    const acceptationTemporaireList = dispositions.filter(d => d.demande === 'Acceptation' && d.etat === 'Temporaire');
    const acceptationReMadList = dispositions.filter(d => d.demande === 'Acceptation re-MAD');
    const DemandeReMad = dispositions.filter(d => d.demande === 'Demande re-MAD');

    return (
        <div>
            <h2>
                {prenom && nom ? `${prenom} ${nom} Dispositions` : 'Dispositions'}
            </h2>
            {error && <p className="error-message">{error}</p>}
        {/* Search Bar */}
           <SearchBarDisposition onSearch={handleSearch} />
            <h3>DEMANDE MISE A DISPOSITION EN ATTENTE DE TRAITMENT </h3>
            <table>
                <thead>
                    <tr>
                    <th>NMAD</th>
                       
                        <th>DATE Disposition</th>
                        <th>DATE Retour</th>
                        <th>OUTILLAGE DEMANDE DESIGNATION</th>
                        <th>OUTILLAGE DEMANDE NSERIE</th>
                        <th>OUTILLAGE DEMANDE MARQUE</th>
                        <th>Etat</th>
                        <th>Remarque</th>
                       
                        {gdisposition !== 'Lecture' && (
      <>
                                <th>Actions</th>
      </>
    )}
                       
                    </tr>
                </thead>
                <tbody>
                    {demandeMadList.length > 0 ? (
                        demandeMadList.map(disposition => (
                            <tr key={disposition.nmad}>
                                  <td>{disposition.nmad}</td>
                               
                                <td>{disposition.datedisposition ? new Date(disposition.datedisposition).toLocaleDateString() : 'N/A'}</td>
                                <td>{disposition.dateretour ? new Date(disposition.dateretour).toLocaleDateString() : 'N/A'}</td>
                                <td>{disposition.outillage ? disposition.outillage.designation : '-'}</td>
                                <td>{disposition.outillage ? disposition.nserie : '-'}</td>
                                <td>{disposition.outillage ? disposition.outillage.marque : '-'}</td>
                                <td>{disposition.etat ? disposition.etat: '-'}</td>
                                <td>{disposition.remarque ? disposition.remarque: '-'}</td>

                                {gdisposition !== 'Lecture' && (
      <>
                                <td>
                                <button className="button" onClick={() => openModal(disposition, 'Update')}>TRAITER</button>
                                </td>
      </>
    )}

                              


                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8">No dispositions with Demande MAD</td>
                        </tr>
                    )}
                </tbody>
            </table>


        </div>
    );
};

export default DispositionListUser;
