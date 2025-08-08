import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './components/Layout/Header';
import Dashboard from './pages/Dashboard';
import FormBuilder from './pages/FormBuilder';
import FormPreview from './pages/FormPreview';
import FormFill from './pages/FormFill';
import FormResponses from './pages/FormResponses';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/builder/:id?" element={<FormBuilder />} />
            <Route path="/preview/:id" element={<FormPreview />} />
            <Route path="/form/:slug" element={<FormFill />} />
            <Route path="/responses/:id" element={<FormResponses />} />
          </Routes>
        </main>
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

export default App;
