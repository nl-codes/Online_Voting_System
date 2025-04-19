import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Candidate {
  id: number;
  full_name: string;
  photo: string;
  saying: string;
  election_title?: string;
  election_position?: string;
}

const ViewCandidates: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/candidates');
        if (!response.ok) {
          throw new Error('Failed to fetch candidates');
        }
        const data = await response.json();
        setCandidates(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch candidates');
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  const handleEdit = (id: number) => {
    navigate(`/edit-candidate/${id}`);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this candidate?')) return;
    
    try {
      const response = await fetch(`http://localhost:5001/api/candidates/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete candidate');
      }

      setCandidates(candidates.filter(candidate => candidate.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete candidate');
    }
  };

  if (loading) {
    return (
      <div className="main-content">
        <div className="loading-candidates">Loading candidates...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="main-content">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="candidates-list-container">
        <div className="candidates-header">
          <h2>View Candidates</h2>
        </div>

        {candidates.length === 0 ? (
          <div className="no-candidates">
            <p>No candidates found.</p>
          </div>
        ) : (
          <div className="candidates-grid">
            {candidates.map(candidate => (
              <div key={candidate.id} className="candidate-card">
                <div className="candidate-photo-container">
                  {candidate.photo ? (
                    <img 
                      src={candidate.photo} 
                      alt={candidate.full_name} 
                      className="candidate-photo"
                    />
                  ) : (
                    <div className="candidate-photo-placeholder">No photo available</div>
                  )}
                </div>
                <div className="candidate-details">
                  <h3>{candidate.full_name}</h3>
                  {candidate.saying && (
                    <p className="candidate-saying">"{candidate.saying}"</p>
                  )}
                  {candidate.election_title && (
                    <p className="election-info">
                      <strong>Election:</strong> {candidate.election_title} ({candidate.election_position})
                    </p>
                  )}
                </div>
                <div className="candidate-actions">
                  <button 
                    className="edit-btn"
                    onClick={() => handleEdit(candidate.id)}
                  >
                    Edit
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDelete(candidate.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewCandidates;