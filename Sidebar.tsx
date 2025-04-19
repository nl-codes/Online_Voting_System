import React from 'react';

interface SidebarProps {
  onViewClick: () => void;
  onCreateClick: () => void;
  onViewCandidates: () => void;
  onCreateCandidate: () => void;
  onVerifyVoter: () => void;
  onAssignCandidate: () => void;
  viewMode: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  onViewClick,
  onCreateClick,
  onViewCandidates,
  onCreateCandidate,
  onVerifyVoter,
  onAssignCandidate,
  viewMode,
}) => {
  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Admin Panel</h2>
      <div className="button-container">
        <button
          className={`sidebar-btn ${viewMode ? 'active' : ''}`}
          onClick={onViewClick}
        >
          View Elections
        </button>

        <button
          className={`sidebar-btn ${!viewMode ? 'active' : ''}`}
          onClick={onCreateClick}
        >
          Create Election
        </button>

        <button className="sidebar-btn" onClick={onViewCandidates}>
          View Candidates
        </button>

        <button className="sidebar-btn" onClick={onCreateCandidate}>
          Create Candidate
        </button>

        <button className="sidebar-btn" onClick={onVerifyVoter}>
          Verify Voter
        </button>

        <button className="sidebar-btn" onClick={onAssignCandidate}>
          Assign Candidate
        </button>
      </div>
    </div>
  );
};

export default Sidebar;