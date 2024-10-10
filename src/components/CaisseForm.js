import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CaisseForm.css';

const CaisseForm = ({ caisseToEdit, onSave }) => {
    const [caisse, setCaisse] = useState({
        caisseMatricule: '',
        caisseName: '',
        mle: '',
        type: '',
        etat: '',
    });

    const [mleList, setMleList] = useState([]);
    const [filteredMleList, setFilteredMleList] = useState([]);

    useEffect(() => {
        const fetchMleList = async () => {
            try {
                const response = await axios.get('/api/persons');
                setMleList(response.data);
            } catch (error) {
                console.error('Error fetching MLE list:', error);
            }
        };

        fetchMleList();

        if (caisseToEdit) {
            setCaisse(caisseToEdit);
        } else {
            setCaisse({
                caisseMatricule: '',
                caisseName: '',
                mle: '',
                type: '',
                etat: '',
            });
        }
    }, [caisseToEdit]);

    useEffect(() => {
        if (caisse.type === 'Ileater') {
            const adminMle = mleList.filter(person => person.mle === 'admin');
            setFilteredMleList(adminMle);
        } else {
            setFilteredMleList(mleList);
        }
    }, [caisse.type, mleList]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCaisse({ ...caisse, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (caisseToEdit) {
                await axios.put(`/api/caisses/${caisse.caisseMatricule}`, caisse);
            } else {
                await axios.post('/api/caisses', caisse);
            }
            console.log('Caisse saved, now saving history...');
            await addCaisseHistory();
            onSave();
        } catch (error) {
            console.error('Error saving caisse:', error);
        }
    };

    const addCaisseHistory = async () => {
        const historyData = {
            caisseId: generateRandomId(),
            operation: caisseToEdit ? 'Mis A Jour' : 'Ajouter',
            dateCaisseHistory: getCurrentDateTime(),
            caisseMatricule: caisse.caisseMatricule,
            caisseName: caisse.caisseName,
            mle: caisse.mle,
            type: caisse.type,
            etat: caisse.etat,
        };

        try {
            console.log('History data being sent:', historyData);
            const response = await axios.post('/api/caissehistories', historyData);
            console.log('History saved successfully:', response.data);
        } catch (error) {
            console.error('Error adding caisse history:', error);
        }
    };

    const generateRandomId = () => Math.random().toString(36).substring(2, 15);

    const getCurrentDateTime = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
    
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    return (
        <form onSubmit={handleSubmit}>
              <div > 
              <label  htmlFor="caisseMatricule">Caisse Matricule: </label>
                  <input  className="group"
                type="text"
                name="caisseMatricule"
                value={caisse.caisseMatricule}
                onChange={handleChange}
                placeholder="Caisse Matricule"
                required
                disabled={!!caisseToEdit}
               />
            </div>
<br></br>
            <div > 
              <label  htmlFor="caisseName">Caisse Name:  </label>
              <input className="group"
                type="text"
                name="caisseName"
                value={caisse.caisseName}
                onChange={handleChange}
                placeholder="Caisse Name"
                required
            />
            </div>
            <br></br>
            <div > 
              <label  htmlFor="mle">mle: </label>
              <select className="groupx"
                name="mle"
                value={caisse.mle}
                onChange={handleChange}
                required
            >
                <option value="" disabled>Select MLE</option>
                {filteredMleList.map(person => (
                    <option key={person.mle} value={person.mle}>
                        {person.mle} - {person.nom} {person.prenom}
                    </option>
                ))}
            </select>
            </div>
            <br></br>
      
            <div > 
              <label  htmlFor="etat">ETAT: </label>
              <select className="groupx"
                name="etat"
                value={caisse.etat}
                onChange={handleChange}
                required
            >
                <option value="" disabled>Select ETAT</option>
                <option value="ACTIVE">ACTIVE</option>
                <option value="NON ACTIVE">INACTIVE</option>
               
                
            </select>
            </div>
            <br></br>
            <div > 
              <label  htmlFor="type">Type: </label>
              <select className="groupx"
                name="type"
                value={caisse.type}
                onChange={handleChange}
                required
            >
                <option value="" disabled>Select type</option>
                <option value="Individuel">Individuel</option>
                <option value="InterDepartement">InterDepartement</option>
                <option value="Commune departement">Commune departement</option>
                <option value="Commune service">Commune service</option>
            </select>
            </div>

            <br></br>
      



            <button type="submit">{caisseToEdit ? 'Mis A Jour Caisse' : 'Ajouter Caisse'}</button>
        </form>
    );
};

export default CaisseForm;
