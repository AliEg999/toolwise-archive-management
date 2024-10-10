import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddPersonModal from './AddPersonModal';
import SearchBarPerson from './SearchBarPerson';  // Import SearchBar component
import './PersonList.css';
import * as XLSX from 'xlsx';

const PersonList = (user) => {
    const [persons, setPersons] = useState([]);
    const [filteredPersons, setFilteredPersons] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedPerson, setSelectedPerson] = useState(null);
    const [error, setError] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const itemsPerPage = 10;
    const [searchField, setSearchField] = useState('nprofil'); // State for search field
    const [searchTerm, setSearchTerm] = useState(''); // State for search term

    useEffect(() => {
        // Filter profils whenever searchTerm or searchField changes
        const filtered = persons.filter(profil => {
            const value = profil[searchField]?.toString().toLowerCase() || '';
            return value.includes(searchTerm.toLowerCase());  // Perform partial match
        });
        setFilteredPersons(filtered);
        setCurrentPage(1);  // Reset to the first page on search
    }, [searchTerm, searchField, persons]);

    useEffect(() => {
        fetchPersons();
    }, []);



    const fetchPersons = () => {
        axios.get('/api/persons')  // Fetch data from the API
            .then(response => {
                const sortedPersons = response.data.sort((a, b) => a.mle - b.mle);
                setPersons(sortedPersons);
                setFilteredPersons(sortedPersons);  // Set initial filtered persons
            })
            .catch(error => {
                setError(error.message);
            });
    };


    const handleUpdateClick = (person) => {
        if (person.mle === 'admin') {
            alert("The admin user cannot be updated."); // Display a popup message
        } else {
            setSelectedPerson(person);
            setIsUpdateModalOpen(true);
        }
    };
    
    const handleDelete = (mle) => {
        if (mle === 'admin') {
            alert("The admin user cannot be deleted."); // Display a popup message
        } else {
            axios.delete(`/api/persons/${mle}`)
                .then(() => {
                    const updatedPersons = persons.filter(person => person.mle !== mle);
                    setPersons(updatedPersons);
                    setFilteredPersons(updatedPersons);  // Update filtered list
                })
                .catch(error => {
                    setError(error.message);
                });
        }
    };
    

    const refreshList = () => {
        fetchPersons();  // Refresh the list to get the latest data
    };






    const handleAddClick = () => {
        setIsAddModalOpen(true);
    };




    const indexOfLastPerson = currentPage * itemsPerPage;
    const indexOfFirstPerson = indexOfLastPerson - itemsPerPage;
    const currentPersons = filteredPersons.slice(indexOfFirstPerson, indexOfLastPerson);

    const totalPages = Math.ceil(filteredPersons.length / itemsPerPage);

    const handleNextPage = () => {
        setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages));
    };

    const handlePrevPage = () => {
        setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
    };

    // Updated to allow partial matches and normalize terms for search
    const handleSearch = (field, term) => {
        const filtered = persons.filter(person => {
            const value = person[field]?.toString().toLowerCase() || '';
            return value.includes(term.toLowerCase());  // Perform partial match
        });
        setFilteredPersons(filtered);
        setCurrentPage(1);  // Reset to the first page on search
    };
    

    const handleCancelSearch = () => {
        setFilteredPersons(persons);  // Reset the filteredPersons to show all data
        setCurrentPage(1);  // Reset to the first page when canceling search
    };

    const handleDownloadExcel = () => {
        // Create an array of objects for the Excel file
        const excelData = currentPersons.map(person => ({
            "Mle": person.mle || '-',
            "Nom": person.nom || '-',
            "Prenom": person.prenom || '-',
            "Service": person.service || '-',
            "Departement": person.departement || '-',
            "Password": person.password || '-',
            "Profil": person.nprofil || '-',
        }));

        // Create a worksheet and workbook
        const worksheet = XLSX.utils.json_to_sheet(excelData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Persons");

        // Trigger the download
        XLSX.writeFile(workbook, "persons.xlsx");
    };
    return (
        <div >
            
            
            <h3>UTILISATEUR LIST <span className="person-count">({filteredPersons.length})</span></h3>
            {error && <p className="error-message">{error}</p>}
    {/* Search Bar logic */}
    <div className="search-bar-container">
    <form onSubmit={(e) => { e.preventDefault(); handleSearch(searchField, searchTerm); }} className="search-bar-form">
    <select
        value={searchField}
        onChange={(e) => setSearchField(e.target.value)}
        className="search-field-select"
    >
        <option value="mle">Mle</option>
        <option value="nom">Nom</option>
        <option value="prenom">Prenom</option>
        <option value="service">Service</option>
        <option value="departement">Département</option>
        <option value="nprofil">Profil</option>
    </select>
    <input
        type="text"
        placeholder={`ÉCRIRE ICI`}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
    />
    <button type="button" onClick={handleCancelSearch}>x</button>
    <button onClick={handleDownloadExcel}>Extraction</button>
    {user.gsysteme !== 'Lecture' && (
                
                <>
                
               <button className="BO" onClick={handleAddClick}>
                Ajouter Person
               </button>
                                 
                </>
              )}

</form>

            </div>


         
            
            <table>
                <thead>
                    <tr>
                        <th>Mle</th>
                        <th>Nom</th>
                        <th>Prenom</th>
                        <th>Service</th>
                        <th>Departement</th>
                        
                        <th>Profil</th>
                        {user.gsysteme !== 'Lecture' && (
      <>
      
                          <th>Actions</th>
      </>
    )}

                    </tr>
                </thead>
                <tbody>
                    {currentPersons.map(person => (
                        <tr key={person.mle}>
                            <td>{person.mle}</td>
                            <td>{person.nom}</td>
                            <td>{person.prenom}</td>
                            <td>{person.service}</td>
                            <td>{person.departement}</td>
                           
                            <td>{person.nprofil}</td>  {/* Show nprofil here */}
                            <td className="actions">

                            {user.gsysteme !== 'Lecture' && (
      <>
      
                        <button className="button" onClick={() => handleUpdateClick(person)}>Mis A Jour</button>
                        <button className="button" onClick={() => handleDelete(person.mle)}>supprimer</button>   
      </>
    )}

                            
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="pagination">
                <button onClick={handlePrevPage} disabled={currentPage === 1}>Précédente</button>
                <span>Page {currentPage} sur {totalPages}</span>
                <button onClick={handleNextPage} disabled={currentPage === totalPages}>Suivante</button>
            </div>

            {/* Add Person Modal */}
            <AddPersonModal
                isOpen={isAddModalOpen}
                onRequestClose={() => setIsAddModalOpen(false)}
                refreshList={refreshList}
            />
 
         
            {/* Update Person Modal */}
            {selectedPerson && (
                <AddPersonModal
                    isOpen={isUpdateModalOpen}
                    onRequestClose={() => setIsUpdateModalOpen(false)}
                    refreshList={refreshList}
                    initialPerson={selectedPerson}  // Pass the selected person data
                    isUpdate={true}  // Indicate that this is an update operation
                />
            )}
        </div>
    );
};

export default PersonList;
