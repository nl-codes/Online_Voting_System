import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import CandidatesPage from './CandidatesPage';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Election, Candidate } from './types';
import './App.css';
import ViewCandidates from './components/ViewCandidates';
import CandidateForm from './components/CandidateForm';

interface FormData {
  title: string;
  position: string;
  description: string;
  startTime: string;
  endTime: string;
}

const App: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    position: '',
    description: '',
    startTime: '',
    endTime: '',
  });

  const [viewMode, setViewMode] = useState(true);
  const [elections, setElections] = useState<Election[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedElectionId, setSelectedElectionId] = useState<number | null>(null);

  const navigate = useNavigate();

  const handleElectionChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const createElection = async () => {
    if (!formData.title.trim() || !formData.position.trim()) {
      alert('Title and Position are required');
      return;
    }

    if (!formData.startTime || !formData.endTime) {
      alert('Please select both start and end times');
      return;
    }

    const startDate = new Date(formData.startTime);
    const endDate = new Date(formData.endTime);

    if (endDate <= startDate) {
      alert('End time must be after start time');
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:5001/api/elections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          position: formData.position,
          description: formData.description,
          start_time: formData.startTime,
          end_time: formData.endTime,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create election');
      }

      await fetchElections();
      setViewMode(true);
      setFormData({
        title: '',
        position: '',
        description: '',
        startTime: '',
        endTime: '',
      });
      alert('Election created successfully!');
    } catch (error) {
      console.error('Error creating election:', error);
      alert(`Error creating election: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchElections = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:5001/api/elections');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setElections(data);
    } catch (error) {
      console.error('Error fetching elections:', error);
      alert('Failed to load elections');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveCandidate = async (candidateData: Omit<Candidate, 'photo'> & { photo?: File | string }) => {
    try {
      const formData = new FormData();
      formData.append('full_name', candidateData.full_name);
      formData.append('saying', candidateData.saying || '');
      formData.append('election_id', String(candidateData.electionId));
      
      // Handle both File and string photo cases
      if (candidateData.photo instanceof File) {
        formData.append('photo', candidateData.photo);
      } else if (typeof candidateData.photo === 'string' && candidateData.photo.startsWith('data:')) {
        // Convert base64 string to blob if needed
        const blob = await fetch(candidateData.photo).then(r => r.blob());
        formData.append('photo', blob, 'candidate-photo.jpg');
      } else if (candidateData.photo) {
        formData.append('photo_url', candidateData.photo);
      }
  
      const response = await fetch('http://localhost:5001/api/elections/${candidateData.election_id}/candidates', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to save candidate: ${errorText}`);
      }
  
      const savedCandidate = await response.json();
      alert('Candidate saved successfully!');
      navigate('/view-candidates');
      return savedCandidate;
    } catch (err) {
      console.error(err);
      alert(`Error saving candidate: ${err instanceof Error ? err.message : 'Unknown error'}`);
      throw err;
    }
  };

  const handleCancelCandidateForm = () => {
    navigate('/');
  };

  useEffect(() => {
    fetchElections();
  }, []);

  return (
    <div className="app">
      <Header />
      <div className="container">
        <Sidebar
          onViewClick={() => {
            setViewMode(true);
            navigate('/');
          }}
          onCreateClick={() => {
            setViewMode(false);
            navigate('/');
          }}
          onViewCandidates={() => navigate('/view-candidates')}
          onCreateCandidate={() => {
            const firstElectionId = elections.length > 0 ? elections[0].id : null;
            if (firstElectionId) {
              setSelectedElectionId(firstElectionId);
              navigate('/create-candidate');
            } else {
              alert('No elections available. Please create one first.');
            }
          }}
          onVerifyVoter={() => navigate('/verify-voter')}
          onAssignCandidate={() => navigate('/assign-candidate')}
          viewMode={viewMode}
        />

        <Routes>
          <Route
            path="/"
            element={
              <MainContent
                formData={formData}
                handleElectionChange={handleElectionChange}
                viewMode={viewMode}
                elections={elections}
                onCreateElection={createElection}
                isLoading={isLoading}
              />
            }
          />
          <Route path="/candidates/:electionId" element={<CandidatesPage />} />
          <Route path="/view-candidates" element={<ViewCandidates />} />
          <Route
            path="/create-candidate"
            element={
              selectedElectionId !== null ? (
                <CandidateForm
  electionId={selectedElectionId}
  onSave={handleSaveCandidate}
  onCancel={handleCancelCandidateForm}
/>

              ) : (
                <div>No election selected.</div>
              )
            }
          />
          <Route path="/verify-voter" element={<div>Voter Verification</div>} />
          <Route path="/assign-candidate" element={<div>Candidate Assignment</div>} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
