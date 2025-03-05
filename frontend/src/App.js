import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import TemplateList from './components/Templates/TemplateList';
import CreateTemplate from './components/Templates/CreateTemplate';
import FillForm from './components/Templates/FillForm';
import TemplatePage from './components/Templates/TemplatePage';
import SearchResults from './components/Search/SearchResults';
import FormList from './components/Forms/FormList';
import FormPage from './components/Forms/FormPage';
import UserManagement from './components/Admin/UserManagement';
import TemplateReadOnly from './components/Templates/TemplateReadOnly';
import UserProfile from './components/Profile/UserProfile';
import CreateJiraTicket from './components/Templates/CreateJiraTicket';
import HelpPage from './components/Help/HelpPage';

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<TemplateList />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/templates/create" element={<CreateTemplate />} />
        <Route path="/templates/:id/fill" element={<FillForm />} />
        <Route path="/templates/:id/edit" element={<TemplatePage />} />
        <Route path="/templates/:id/readonly" element={<TemplateReadOnly />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/forms" element={<FormList />} />
        <Route path="/forms/:id" element={<FormPage />} />
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/create-jira-ticket" element={<CreateJiraTicket />} />
        <Route path="/help" element={<HelpPage />} />
      </Routes>
    </Router>
  );
}