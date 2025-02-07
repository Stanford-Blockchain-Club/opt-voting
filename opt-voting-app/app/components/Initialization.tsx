/**
 * Initialization Component
 * 
 * A React component that handles the initial setup for the Optimism Voting Strategy simulation.
 * It provides two main functionalities:
 * 1. File Upload: Allows users to upload CSV files containing voter preferences and voting power data
 * 2. Random Generation: Generates random data for both voter preferences and voting power using
 *    either uniform or gaussian distributions
 * 
 * Props:
 * - setVotingResults: (data: any) => void
 *   Callback function to update the parent component with processed voting results
 * 
 * Features:
 * - Supports both CSV file upload and random data generation
 * - Configurable number of voters and projects for random generation
 * - Choice between uniform and gaussian distributions for random data
 * - Real-time validation of file uploads
 * - Automatic CSV conversion of generated data
 * - Integration with backend simulation API
 * 
 * @component
 * @example
 * ```tsx
 * <Initialization setVotingResults={(data) => handleVotingResults(data)} />
 * ```
 */
'use client';

import React, { useState } from 'react';
import Papa from 'papaparse';  // Import PapaParse for CSV parsing

// Helper function to generate random data with Voter ID
const generateRandomData = (rows: number, cols: number, distribution: 'uniform' | 'gaussian' | 'pareto' | 'constant') => {
  const data = [];
  for (let i = 0; i < rows; i++) {
    const row = [`Voter ${i + 1}`]; // Adding Voter ID as first column
    
    // Generate raw values first
    const rawValues = [];
    for (let j = 0; j < cols; j++) {
      if (distribution === 'pareto') {
        // Generate raw Pareto value
        const alpha = 2.5;
        const u = Math.random();
        // Use proper Pareto inverse CDF
        const x = Math.pow(1 - u, -1/alpha);
        rawValues.push(x);
      } else if (distribution === 'uniform') {
        rawValues.push(Math.random());
      } else if (distribution === 'gaussian') {
        const u1 = Math.random();
        const u2 = Math.random();
        const randGaussian = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
        rawValues.push(Math.max(0, Math.min(1, (randGaussian + 3) / 6))); // Scale to [0,1]
      } else if (distribution === 'constant') {
        rawValues.push(1000);
      }
    }

    // Normalize after generating all values
    if (distribution !== 'constant') {
      const sum = rawValues.reduce((a, b) => a + b, 0);
      rawValues.forEach(value => {
        row.push((value / sum).toFixed(4)); // Using 4 decimal places for more precision
      });
    } else {
      rawValues.forEach(value => row.push(value.toString()));
    }
    
    data.push(row);
  }
  return data;
};

// Function to convert random data into CSV string format with headers
const convertToCSV = (data: any[], headers: string[]) => {
  return Papa.unparse({
    fields: headers,
    data: data
  });
};

const Initialization: React.FC<{ setVotingResults: (data: any) => void }> = ({ setVotingResults }) => {
  const [voterFile, setVoterFile] = useState<File | null>(null);
  const [votingPowerFile, setVotingPowerFile] = useState<File | null>(null);
  const [voterSource, setVoterSource] = useState('generate'); // Changed from 'upload' to 'generate'
  const [votingPowerSource, setVotingPowerSource] = useState('generate'); // Changed from 'upload' to 'generate'
  const [voterDistribution, setVoterDistribution] = useState<'uniform' | 'gaussian' | 'pareto'>('pareto');
  const [powerDistribution, setPowerDistribution] = useState<'uniform' | 'gaussian' | 'pareto' | 'constant'>('constant');
  const [numProjects, setNumProjects] = useState(5); // Default number of projects
  const [numVoters, setNumVoters] = useState(100); // Default number of voters
  const [loading, setLoading] = useState(false);
  const [downloadCsv, setDownloadCsv] = useState(false);

  // Function to handle file uploads
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setFile: React.Dispatch<React.SetStateAction<File | null>>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // Function to simulate or generate data
  const handleSimulate = async () => {
    setLoading(true);

    try {
      // Generate or get voter data
      const voterHeaders = ['Voter ID', ...Array.from({ length: numProjects }, (_, idx) => `Project ${idx + 1}`)];
      const votingPowerHeaders = ['Voter ID', 'Voting Power'];

      let voterData = '';
      let votingPowerData = '';

      // Handle voter data
      if (voterSource === 'generate') {
        const randomVoterData = generateRandomData(numVoters, numProjects, voterDistribution);
        voterData = convertToCSV(randomVoterData, voterHeaders);
      } else if (voterFile) {
        voterData = await fileToString(voterFile);
      } else {
        alert('Please upload the voter preferences file.');
        setLoading(false);
        return;
      }

      // Handle voting power data
      if (votingPowerSource === 'generate') {
        const randomVotingPowerData = generateRandomData(numVoters, 1, powerDistribution);
        votingPowerData = convertToCSV(randomVotingPowerData, votingPowerHeaders);
      } else if (votingPowerFile) {
        votingPowerData = await fileToString(votingPowerFile);
      } else {
        alert('Please upload the voting power file.');
        setLoading(false);
        return;
      }

      // Create FormData for the request
      const formData = new FormData();
      formData.append('voterFile', new Blob([voterData], { type: 'text/csv' }), 'voter_preferences.csv');
      formData.append('votingPowerFile', new Blob([votingPowerData], { type: 'text/csv' }), 'voting_power.csv');
      formData.append('numSimulations', '1000');

      const response = await fetch('/api/simulate', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to simulate');
      }

      const results = await response.json();
      setVotingResults(results);

    } catch (error) {
      console.error('Error in simulation:', error);
    } finally {
      setLoading(false);
    }
  };

  // Utility: if you need to convert File -> string
  async function fileToString(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  return (
    <section id="initialization" className="initialization-section" style={{ padding: '20px 20px' }}>
      <h2 className="section-heading">Initialization</h2>
      <p className="section-paragraph">
        This section provides the initial setup for the Optimism Voting Strategy. Below, you can upload CSV files or generate random data for voter preferences and voting power.
      </p>

      {/* Links to download voter preferences and voting power CSV templates */}
      <div className="download-links">
        <h3>Download Sample CSV Files</h3>
        <a href="/uploads/voter_preferences.csv" download>Download Voter Preferences CSV</a> | 
        <a href="/uploads/voting_power.csv" download>Download Voting Power CSV</a>
      </div>

      {/* Voter Preferences */}
      <div className="box-pair">
        <div className="input-box">
          <label className="variable-title">Voter Preferences</label>
          <select value={voterSource} onChange={(e) => setVoterSource(e.target.value)}>
            <option value="upload">Upload CSV</option>
            <option value="generate">Generate Random Data</option>
          </select>

          {voterSource === 'upload' ? (
            <>
              <input type="file" className="input-field" accept=".csv" onChange={(e) => handleFileUpload(e, setVoterFile)} />
              <p className="instruction">Please upload a CSV file containing voting preference data.</p>
            </>
          ) : (
            <>
              <select value={voterDistribution} onChange={(e) => setVoterDistribution(e.target.value as 'uniform' | 'gaussian' | 'pareto')}>
                <option value="uniform">Uniform Distribution</option>
                <option value="gaussian">Gaussian Distribution</option>
                <option value="pareto">Pareto Distribution</option>
              </select>
              <p className="instruction">Random data will be generated using the selected distribution.</p>

              <label htmlFor="numProjects" className="variable-title">Number of Projects</label>
              <input
                type="number"
                className="input-field"
                id="numProjects"
                value={numProjects}
                onChange={(e) => setNumProjects(parseInt(e.target.value))}
              />

              <label htmlFor="numVoters" className="variable-title">Number of Voters</label>
              <input
                type="number"
                className="input-field"
                id="numVoters"
                value={numVoters}
                onChange={(e) => setNumVoters(parseInt(e.target.value))}
              />
            </>
          )}
        </div>
      </div>

      {/* Voting Power */}
      <div className="box-pair">
        <div className="input-box">
          <label className="variable-title">Voting Power</label>
          <select value={votingPowerSource} onChange={(e) => setVotingPowerSource(e.target.value)}>
            <option value="upload">Upload CSV</option>
            <option value="generate">Generate Random Data</option>
          </select>

          {votingPowerSource === 'upload' ? (
            <>
              <input type="file" className="input-field" accept=".csv" onChange={(e) => handleFileUpload(e, setVotingPowerFile)} />
              <p className="instruction">Please upload a CSV file containing voting power data.</p>
            </>
          ) : (
            <>
              <select value={powerDistribution} onChange={(e) => setPowerDistribution(e.target.value as 'uniform' | 'gaussian' | 'pareto' | 'constant')}>
                <option value="constant">Constant Distribution</option>
                <option value="uniform">Uniform Distribution</option>
                <option value="gaussian">Gaussian Distribution</option>
                <option value="pareto">Pareto Distribution</option>
              </select>
              <p className="instruction">Random data will be generated using the selected distribution for the selected number of voters.</p>
              {/* The number of voters is selected in the voter preferences */}
            </>
          )}
        </div>
      </div>

      {/* Simulate Button */}
      <div className="simulate-button-container">
        <button className="simulate-button" onClick={handleSimulate} disabled={loading}>
          {loading ? 'Simulating...' : 'Simulate'}
        </button>
      </div>
    </section>
  );
};

export default Initialization;

