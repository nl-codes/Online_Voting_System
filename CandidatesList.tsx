import React, { useState } from 'react';
import CandidateForm from './CandidateForm';
import { Candidate } from '../types';

interface CandidatesListProps {
  electionId: number;
  candidates: Candidate[];
  onRefresh: () => void;
}

const CandidatesList: React.FC<CandidatesListProps> = ({
  electionId,
  candidates,
  onRefresh
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddCandidate = () => {
    setEditingCandidate(null);
    setShowForm(true);
  };

  const handleEditCandidate = (candidate: Candidate) => {
    setEditingCandidate(candidate);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCandidate(null);
  };

  const handleSave = async (candidateData: Candidate) => {
    setIsLoading(true);
    try {
      const url = editingCandidate
        ? `/api/candidates/${editingCandidate.id}`
        : `/api/elections/${electionId}/candidates`;

      const method = editingCandidate ? 'PUT' : 'POST';

      const formData = new FormData();
      formData.append('full_name', candidateData.full_name);
      formData.append('saying', candidateData.saying);
      if (candidateData.photo) {
        formData.append('photo', candidateData.photo); // Attach file
      }

      const response = await fetch(url, {
        method,
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to save candidate');
      }

      setShowForm(false);
      onRefresh();
    } catch (error) {
      console.error('Error saving candidate:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Failed to save candidate'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (candidateId: number) => {
    if (!window.confirm('Are you sure you want to delete this candidate?')) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/candidates/${candidateId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete candidate');
      }

      onRefresh();
    } catch (error) {
      console.error('Error deleting candidate:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Failed to delete candidate'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="candidates-list">
      <div className="list-header">
        <h3>Candidates</h3>
        {!showForm && (
          <button
            className="add-candidate-button"
            onClick={handleAddCandidate}
            disabled={isLoading}
          >
            Add Candidate
          </button>
        )}
      </div>

      {isLoading && <p className="loading">Loading...</p>}

      {showForm ? (
        <CandidateForm
          electionId={electionId}
          candidate={editingCandidate || undefined}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      ) : (
        <div className="candidates-grid">
          {candidates.length === 0 ? (
            <p className="no-candidates">No candidates added yet.</p>
          ) : (
            candidates.map(candidate => (
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
                    className="edit-button"
                    onClick={() => handleEditCandidate(candidate)}
                    disabled={isLoading}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(candidate.id)}
                    disabled={isLoading}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default CandidatesList;
