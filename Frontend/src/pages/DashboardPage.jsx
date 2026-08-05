import { useState } from 'react';
import { useNavigate } from 'react-router';
import { FileText, UploadCloud, Briefcase, User, Sparkles } from 'lucide-react';
import api from '../services/api';
import './Dashboard.scss';

const DashboardPage = ({ user }) => {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [selfDescription, setSelfDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== 'application/pdf') {
        setError('Please upload a PDF file.');
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setError('');
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError('Please select a resume file first.');
      return;
    }
    if (!jobDescription.trim()) {
      setError('Please provide the job description.');
      return;
    }
    if (!selfDescription.trim()) {
      setError('Please provide your self description.');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('jobDescription', jobDescription);
    formData.append('selfDescription', selfDescription);


    try {
      const response = await api.post('/api/interview', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate('/report', { state: { report: response.data } });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to analyze resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-page container">
      <div className="dashboard-header text-center">
        <h1>Welcome, {user?.email || 'User'}!</h1>
        <p className="text-secondary">Ready to land your dream job? Provide your details below.</p>
      </div>

      {error && <div className="error-message text-center" style={{marginBottom: '1rem'}}>{error}</div>}

      <div className="dashboard-grid">
        {/* Left Section - Resume Upload */}
        <div className="card dashboard-section">
          <div className="section-header">
            <FileText className="section-icon" size={24} />
            <h2>Upload Resume</h2>
          </div>
          <p className="section-subtitle">Select a PDF version of your resume for AI analysis.</p>
          
          <div className="upload-area">
            <input 
              type="file" 
              id="resume-upload" 
              accept=".pdf" 
              onChange={handleFileChange} 
              className="file-input"
            />
            <label htmlFor="resume-upload" className="upload-label">
              <UploadCloud size={32} className="upload-icon" />
              <span>{file ? file.name : 'Choose a PDF file or drag it here'}</span>
            </label>
          </div>
        </div>

        {/* Right Section - Job & Self Description */}
        <div className="card dashboard-section">
          <div className="form-group">
            <label htmlFor="job-description">
              <Briefcase size={18} className="input-icon" /> Job Description <span className="required">*</span>
            </label>
            <textarea
              id="job-description"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="form-textarea"
              placeholder="Paste the job description here..."
              required
              rows="4"
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="self-description">
              <User size={18} className="input-icon" /> Self Description <span className="required">*</span>
            </label>
            <textarea
              id="self-description"
              value={selfDescription}
              onChange={(e) => setSelfDescription(e.target.value)}
              className="form-textarea"
              placeholder="Tell us about yourself, your skills, experience, projects, and career goals..."
              required
              rows="4"
            ></textarea>
          </div>
        </div>
      </div>

      {/* Analyze Action */}
      <div className="dashboard-action">
        <button 
          className="btn-primary analyze-btn" 
          onClick={handleAnalyze}
          disabled={!file || !jobDescription.trim() || !selfDescription.trim() || loading}
        >
          <Sparkles size={20} className="btn-icon" />
          {loading ? 'Analyzing...' : 'Analyze Resume'}
        </button>
      </div>
    </div>
  );
};

export default DashboardPage;
