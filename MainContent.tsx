import React from 'react';
import { Election } from '../types';

interface FormData {
  title: string;
  position: string;
  description: string;
  startTime: string;
  endTime: string;
}

interface MainContentProps {
  formData: FormData;
  handleElectionChange: (field: keyof FormData, value: string) => void;
  viewMode: boolean;
  elections: Election[];
  onCreateElection: () => Promise<void>;
  isLoading: boolean;
}

const MainContent: React.FC<MainContentProps> = ({
  formData,
  handleElectionChange,
  viewMode,
  elections,
  onCreateElection,
  isLoading,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    handleElectionChange(name as keyof FormData, value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getElectionStatus = (startTime: string, endTime: string) => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (now < start) return 'upcoming';
    if (now > end) return 'ended';
    return 'active';
  };

  return (
    <div className="main-content">
      {!viewMode ? (
        <div className="form-container">
          <h2>Create Election</h2>
          <form>
            <div className="input-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Election title"
              />
            </div>

            <div className="input-group">
              <label htmlFor="position">Position</label>
              <input
                type="text"
                id="position"
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                placeholder="Position being elected"
              />
            </div>

            <div className="input-group">
              <label htmlFor="description">Description</label>
              <input
                type="text"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Election description"
              />
            </div>

            <div className="input-group date-inputs">
              <div>
                <label htmlFor="startTime">Start Time</label>
                <input
                  type="datetime-local"
                  id="startTime"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label htmlFor="endTime">End Time</label>
                <input
                  type="datetime-local"
                  id="endTime"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <button
              type="button"
              className="save-button"
              onClick={onCreateElection}
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Election'}
            </button>
          </form>
        </div>
      ) : (
        <div className="elections-list">
          <h2>View Elections</h2>
          {elections.length > 0 ? (
            <div className="elections-grid">
              {elections.map((election) => {
                const status = getElectionStatus(election.start_time, election.end_time);
                return (
                  <div key={election.id} className="election-card">
                    <div className="election-header">
                      <h3>{election.title}</h3>
                      <span className={`status-badge status-${status}`}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </span>
                    </div>
                    <span className="election-type">{election.position}</span>
                    <div className="election-details">
                      <p><strong>Starts:</strong> {formatDate(election.start_time)}</p>
                      <p><strong>Ends:</strong> {formatDate(election.end_time)}</p>
                      {election.description && (
                        <p className="election-description">
                          <strong>Description:</strong> {election.description}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="no-elections">No elections available</p>
          )}
        </div>
      )}
    </div>
  );
};

export default MainContent;