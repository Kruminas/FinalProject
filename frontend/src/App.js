// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';

// Auth
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';

// Admin
import UserManagement from './components/Admin/UserManagement';

// Templates
import TemplateList from './components/Templates/TemplateList';
import CreateTemplate from './components/Templates/CreateTemplate';
import FillForm from './components/Templates/FillForm';
import SearchResults from './components/Search/SearchResults';

// Forms
import FormList from './components/Forms/FormList';
import TemplatePage from './components/Templates/TemplatePage';
import FormPage from './components/Forms/FormPage';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<TemplateList />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Templates */}
        <Route path="/templates" element={<TemplateList />} />
        <Route path="/templates/create" element={<CreateTemplate />} />
        <Route path="/templates/:id/fill" element={<FillForm />} />
        <Route path="/templates/:id/edit" element={<TemplatePage />} />
        <Route path="/search" element={<SearchResults />} />

        {/* Admin - view all forms, manage users */}
        <Route path="/forms" element={<FormList />} />
        <Route path="/forms/:id" element={<FormPage />} />
        <Route path="/admin/users" element={<UserManagement />} />
      </Routes>
    </Router>
  );
}

export default App;
