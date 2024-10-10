import React from 'react';
import PersonList from './PersonList';
import AddPersonModal from './AddPersonModal';
import './MainPage.css';

const MainPage = () => {
  return (
    <div className="main-page">
      <PersonList />
      <AddPersonModal />
    </div>
  );
};

export default MainPage;
