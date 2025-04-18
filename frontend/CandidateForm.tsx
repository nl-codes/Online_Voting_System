// // CandidateForm.tsx
// import React, { useState } from 'react';
// import axios from 'axios';

// interface CandidateFormProps {
//   electionId: number;
//   onCandidateSaved?: () => void;
// }

// const CandidateForm: React.FC<CandidateFormProps> = ({ electionId, onCandidateSaved }) => {
//   const [fullName, setFullName] = useState('');
//   const [saying, setSaying] = useState('');
//   const [photo, setPhoto] = useState<File | null>(null);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
//     setSuccess('');

//     if (!fullName.trim()) {
//       setError('Full name is required.');
//       return;
//     }

//     const formData = new FormData();
//     formData.append('fullName', fullName);
//     formData.append('saying', saying);
//     if (photo) {
//       formData.append('photo', photo);
//     }

//     try {
//       const response = await axios.post(
//         `http://localhost:5001/api/elections/${electionId}/candidates`,
//         formData,
//         {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//           },
//         }
//       );

//       setSuccess('Candidate saved successfully!');
//       setFullName('');
//       setSaying('');
//       setPhoto(null);
//       onCandidateSaved?.();
//     } catch (err: any) {
//       console.error('Error uploading candidate:', err);
//       setError(err.response?.data?.message || 'Upload failed');
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} encType="multipart/form-data">
//       <h2>Add Candidate</h2>
//       {error && <p style={{ color: 'red' }}>{error}</p>}
//       {success && <p style={{ color: 'green' }}>{success}</p>}

//       <div>
//         <label>Full Name:</label>
//         <input value={fullName} onChange={(e) => setFullName(e.target.value)} required />
//       </div>

//       <div>
//         <label>Saying:</label>
//         <textarea value={saying} onChange={(e) => setSaying(e.target.value)} />
//       </div>

//       <div>
//         <label>Photo (optional):</label>
//         <input
//           type="file"
//           accept="image/*"
//           onChange={(e) => setPhoto(e.target.files?.[0] || null)}
//         />
//       </div>

//       <button type="submit">Save Candidate</button>
//     </form>
//   );
// };

// export default CandidateForm;

import React, { useState } from 'react';
import axios from 'axios';

interface CandidateFormProps {
  electionId: number;
  onCandidateSaved?: () => void;
}

const CandidateForm: React.FC<CandidateFormProps> = ({ electionId, onCandidateSaved }) => {
  const [fullName, setFullName] = useState('');
  const [saying, setSaying] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!fullName.trim()) {
      setError('Full name is required.');
      return;
    }

    const formData = new FormData();
    formData.append('fullName', fullName);
    formData.append('saying', saying);

    try {
      const response = await axios.post(
        `http://localhost:5001/api/elections/${electionId}/candidates`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setSuccess('Candidate saved successfully!');
      setFullName('');
      setSaying('');
      onCandidateSaved?.();
    } catch (err: any) {
      console.error('Error uploading candidate:', err);
      setError(err.response?.data?.message || 'Upload failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <h2>Add Candidate</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      <div>
        <label>Full Name:</label>
        <input value={fullName} onChange={(e) => setFullName(e.target.value)} required />
      </div>

      <div>
        <label>Saying:</label>
        <textarea value={saying} onChange={(e) => setSaying(e.target.value)} />
      </div>

      <button type="submit">Save Candidate</button>
    </form>
  );
};

export default CandidateForm;

