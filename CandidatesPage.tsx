import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Election, Candidate } from './types';


interface CandidatesPageProps {
  showFormInitially?: boolean;
}

const CandidatesPage: React.FC<CandidatesPageProps> = ({ showFormInitially = false }) => {
  const { electionId, candidateId } = useParams<{ electionId: string; candidateId?: string }>();
  const navigate = useNavigate();
  
  // State management
  const [election, setElection] = useState<Election | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(showFormInitially);
  const [currentCandidate, setCurrentCandidate] = useState<Candidate | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    full_name: '',
    photo: '',
    saying: ''
  });

  // Fetch election and candidates
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch election details
        const electionRes = await fetch(`http://localhost:5001/api/elections/${electionId}`);
        if (!electionRes.ok) throw new Error('Failed to fetch election');
        const electionData = await electionRes.json();
        setElection(electionData);

        // Fetch candidates
        const candidatesRes = await fetch(`http://localhost:5001/api/elections/${electionId}/candidates`);
        if (!candidatesRes.ok) throw new Error('Failed to fetch candidates');
        const candidatesData = await candidatesRes.json();
        setCandidates(candidatesData);

        // Handle edit mode if candidateId is in URL
        if (candidateId) {
          const candidateToEdit = candidatesData.find((c: Candidate) => c.id.toString() === candidateId);
          if (candidateToEdit) {
            setCurrentCandidate(candidateToEdit);
            setFormData({
              full_name: candidateToEdit.full_name,
              photo: candidateToEdit.photo || '',
              saying: candidateToEdit.saying || ''
            });
            setShowForm(true);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [electionId, candidateId]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      let response;

      if (currentCandidate) {
        // Update existing candidate
        response = await fetch(`http://localhost:5001/api/candidates/${currentCandidate.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      } else {
        // Create new candidate
        response = await fetch(`http://localhost:5001/api/elections/${electionId}/candidates`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            election_id: electionId
          })
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save candidate');
      }

      // Refresh the candidates list
      const updatedRes = await fetch(`http://localhost:5001/api/elections/${electionId}/candidates`);
      const updatedData = await updatedRes.json();
      setCandidates(updatedData);

      // Reset form and navigate
      setShowForm(false);
      setCurrentCandidate(null);
      setFormData({ full_name: '', photo: '', saying: '' });
      navigate(`/elections/${electionId}/candidates`);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save candidate');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle candidate edit
  const handleEdit = (candidate: Candidate) => {
    navigate(`/elections/${electionId}/candidates/${candidate.id}/edit`);
  };

  // Handle candidate deletion
  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this candidate?')) return;

    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:5001/api/candidates/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Deletion failed');
      
      // Refresh candidates list
      const updatedRes = await fetch(`http://localhost:5001/api/elections/${electionId}/candidates`);
      const updatedData = await updatedRes.json();
      setCandidates(updatedData);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Deletion failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle add candidate
  const handleAddCandidate = () => {
    navigate(`/elections/${electionId}/candidates/new`);
  };

  // Handle form cancel
  const handleCancel = () => {
    setShowForm(false);
    setCurrentCandidate(null);
    setFormData({ full_name: '', photo: '', saying: '' });
    navigate(`/elections/${electionId}/candidates`);
  };

  if (isLoading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!election) return <div className="error">Election not found</div>;

  return (
    <div className="candidates-page">
      <header className="page-header">
        <h1>Manage Candidates</h1>
        <button onClick={() => navigate(-1)} className="back-button">
          ← Back to Elections
        </button>
      </header>

      <div className="election-info">
        <h2>{election.title}</h2>
        <p><strong>Position:</strong> {election.position}</p>
        <p><strong>Period:</strong> {new Date(election.start_time).toLocaleDateString()} to {new Date(election.end_time).toLocaleDateString()}</p>
      </div>

      <div className="candidates-actions">
        {!showForm && (
          <button 
            onClick={handleAddCandidate}
            className="add-candidate-button"
            disabled={isLoading}
          >
            Add New Candidate
          </button>
        )}
      </div>

      {showForm && (
        <div className="candidate-form-container">
          <h3>{currentCandidate ? 'Edit Candidate' : 'Add New Candidate'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="form-group">
              <label>Photo URL</label>
              <input
                type="url"
                name="photo"
                value={formData.photo}
                onChange={handleInputChange}
                placeholder="https://example.com/photo.jpg"
                disabled={isLoading}
              />
            </div>
            
            <div className="form-group">
              <label>Slogan/Statement</label>
              <textarea
                name="saying"
                value={formData.saying}
                onChange={handleInputChange}
                rows={3}
                disabled={isLoading}
              />
            </div>
            
            <div className="form-actions">
              <button 
                type="button" 
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save Candidate'}
              </button>
            </div>
          </form>
        </div>
      )}

      {!showForm && (
        <div className="candidates-list">
          <h3>Candidates ({candidates.length})</h3>
          
          {candidates.length === 0 ? (
            <p className="no-candidates">No candidates yet. Add one to get started!</p>
          ) : (
            <div className="candidates-grid">
              {candidates.map(candidate => (
                <div key={candidate.id} className="candidate-card">
                  {candidate.photo && (
                    <div className="candidate-photo">
                      <img src={candidate.photo} alt={candidate.full_name} />
                    </div>
                  )}
                  <div className="candidate-info">
                    <h4>{candidate.full_name}</h4>
                    {candidate.saying && <p className="saying">"{candidate.saying}"</p>}
                  </div>
                  <div className="candidate-actions">
                    <button 
                      onClick={() => handleEdit(candidate)}
                      disabled={isLoading}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(candidate.id)}
                      disabled={isLoading}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CandidatesPage;