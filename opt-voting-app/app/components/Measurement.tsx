"use client";

import React, { useEffect, useState } from 'react';

interface VotingResults {
  [key: string]: { [project: string]: number };
}

interface MeasurementProps {
  votingResults: VotingResults | null;
}

const Measurement: React.FC<MeasurementProps> = ({ votingResults }) => {
  const [projectWinnersCount, setProjectWinnersCount] = useState(0);
  const [quadraticVoterAttackDifference, setQuadraticVoterAttackDifference] = useState(0);
  const [quadraticProjectAttackDifference, setQuadraticProjectAttackDifference] = useState(0);
  const [meanVoterAttackDifference, setMeanVoterAttackDifference] = useState(0);
  const [meanProjectAttackDifference, setMeanProjectAttackDifference] = useState(0);
  const [medianVoterAttackDifference, setMedianVoterAttackDifference] = useState(0);
  const [medianProjectAttackDifference, setMedianProjectAttackDifference] = useState(0);

  useEffect(() => {
    if (!votingResults) return;

    // 1. Calculate Shannon Entropy of winners
    const mechanisms = ['maxVotingResults', 'quadraticNoAttackResults', 'meanNoAttackResults', 
      'quadraticVoterCollusionResults', 'quadraticProjectCollusionResults', 
      'meanVoterEpsilonResults', 'meanProjectEpsilonResults', 'trueVotingResults',
      'medianNoAttackResults', 'medianVoterEpsilonResults', 'medianProjectEpsilonResults'];

    const winners: string[] = [];
    mechanisms.forEach((mechanism) => {
      const data = votingResults[mechanism];
      if (data) {
        const maxVotes = Math.max(...Object.values(data));
        const winner = Object.keys(data).find((project) => data[project] === maxVotes);
        if (winner) {
          winners.push(winner);
        }
      }
    });

    // Calculate probabilities for each winner
    const winnerCounts: { [key: string]: number } = {};
    winners.forEach(winner => {
      winnerCounts[winner] = (winnerCounts[winner] || 0) + 1;
    });

    // Calculate Shannon Entropy
    const totalWinners = winners.length;
    let entropy = 0;
    Object.values(winnerCounts).forEach(count => {
      const probability = count / totalWinners;
      entropy -= probability * Math.log2(probability);
    });

    // Normalize by dividing by log2(8) (maximum possible entropy with 8 mechanisms)
    const normalizedEntropy = entropy / Math.log2(mechanisms.length);
    setProjectWinnersCount(normalizedEntropy);

    // 2. Calculate percentage difference between Quadratic Voting and Voter Attack
    setQuadraticVoterAttackDifference(calculatePercentageDifference(votingResults['quadraticNoAttackResults'], votingResults['quadraticVoterCollusionResults']));

    // 3. Calculate percentage difference between Quadratic Voting and Project Attack
    setQuadraticProjectAttackDifference(calculatePercentageDifference(votingResults['quadraticNoAttackResults'], votingResults['quadraticProjectCollusionResults']));

    // 4. Calculate percentage difference between Mean Voting and Voter Attack
    setMeanVoterAttackDifference(calculatePercentageDifference(votingResults['meanNoAttackResults'], votingResults['meanVoterEpsilonResults']));

    // 5. Calculate percentage difference between Mean Voting and Project Attack
    setMeanProjectAttackDifference(calculatePercentageDifference(votingResults['meanNoAttackResults'], votingResults['meanProjectEpsilonResults']));

    // 6. Calculate percentage difference between Median Voting and Voter Attack
    setMedianVoterAttackDifference(calculatePercentageDifference(votingResults['medianNoAttackResults'], votingResults['medianVoterEpsilonResults']));

    // 7. Calculate percentage difference between Median Voting and Project Attack
    setMedianProjectAttackDifference(calculatePercentageDifference(votingResults['medianNoAttackResults'], votingResults['medianProjectEpsilonResults']));

  }, [votingResults]);

  const calculatePercentageDifference = (noAttackData: { [project: string]: number }, attackData: { [project: string]: number }): number => {
    if (!noAttackData || !attackData) return 0;

    // Convert to percentages
    const totalNoAttack = Object.values(noAttackData).reduce((a, b) => a + b, 0);
    const totalAttack = Object.values(attackData).reduce((a, b) => a + b, 0);
  
    if (totalNoAttack === 0 || totalAttack === 0) return 0;
  
    // Calculate percentage arrays
    const noAttackPercentages = Object.values(noAttackData).map(votes => (votes / totalNoAttack) * 100);
    const attackPercentages = Object.values(attackData).map(votes => (votes / totalAttack) * 100);
  
    // Calculate squared differences
    const squaredDiffs = noAttackPercentages.map((noAttackPct, idx) => 
      Math.pow(noAttackPct - attackPercentages[idx], 2)
    );
  
    // Sum of squared differences
    const squaredDiffSum = squaredDiffs.reduce((a, b) => a + b, 0);
    
    // Sum of squared original percentages
    const squaredOriginalSum = noAttackPercentages.reduce((sum, pct) => sum + Math.pow(pct, 2), 0);
  
    if (squaredOriginalSum === 0) return 0;
  
    // Return PMS (Percentage Mean Square) metric
    return (squaredDiffSum / squaredOriginalSum) * 100;
  };

  const measurementValues = [
    { 
      label: 'Voting System Divergence', 
      value: projectWinnersCount, 
      max: 1,
      explanation: 'Normalized Shannon entropy of winning project distributions. A value of 1 indicates maximum disagreement between voting systems, while 0 indicates perfect consensus.'
    },
    // Quadratic Voting Section
    { 
      label: 'Quadratic Voting: Voter Collusion Impact', 
      value: quadraticVoterAttackDifference, 
      max: 10000,
      explanation: 'Measures how much voter coordination changed the results in quadratic voting. Higher percentages indicate greater vulnerability to voter collusion.'
    },
    { 
      label: 'Quadratic Voting: Project Manipulation Impact', 
      value: quadraticProjectAttackDifference, 
      max: 10000,
      explanation: 'Shows how much project-level manipulation affected quadratic voting results. Higher percentages suggest greater susceptibility to project-based attacks.'
    },
    // Mean Voting Section
    { 
      label: 'Mean Voting: Voter Collusion Impact', 
      value: meanVoterAttackDifference, 
      max: 10000,
      explanation: 'Indicates how much voter coordination influenced mean voting results. Higher percentages show greater sensitivity to voter collusion.'
    },
    { 
      label: 'Mean Voting: Project Manipulation Impact', 
      value: meanProjectAttackDifference, 
      max: 10000,
      explanation: 'Demonstrates how project-level manipulation affected mean voting results. Higher percentages indicate greater vulnerability to project-based attacks.'
    },
    // Median Voting Section
    { 
      label: 'Median Voting: Voter Manipulation Impact', 
      value: medianVoterAttackDifference, 
      max: 10000,
      explanation: 'Shows how much voter coordination influenced median voting results. Higher percentages indicate greater sensitivity to voter collusion.'
    },
    { 
      label: 'Median Voting: Project Manipulation Impact', 
      value: medianProjectAttackDifference, 
      max: 10000,
      explanation: 'Indicates how much project-level manipulation affected median voting results. Higher percentages suggest greater susceptibility to project-based attacks.'
    },
  ];

  return (
    <section id="measurement" className="measurement-section" style={{ padding: '20px 20px' }}>
      <h2 className="section-heading">Measurement</h2>
      <p className="section-paragraph">
        This section provides a detailed overview of the key measurements involved in the Optimism Voting Strategy.
      </p>

      <div className="table-container">
        <table className="measurement-table">
          <thead>
            <tr>
              <th>Measurement</th>
              <th>Value</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {measurementValues.map((measurement, index) => (
              <tr key={index}>
                <td>{measurement.label}</td>
                <td className="value-cell">
                  {measurement.max === 100 
                    ? `${measurement.value.toFixed(2)}%`
                    : measurement.value.toFixed(2)}
                </td>
                <td>{measurement.explanation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        .table-container {
          overflow-x: auto;
          margin: 20px 0;
        }
        
        .measurement-table {
          width: 100%;
          border-collapse: collapse;
          background-color: white;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        
        .measurement-table th,
        .measurement-table td {
          padding: 12px 16px;
          text-align: left;
          border-bottom: 1px solid #eee;
        }
        
        .measurement-table th {
          background-color: #f5f5f5;
          font-weight: 600;
        }
        
        .value-cell {
          font-family: monospace;
          font-weight: 500;
        }
        
        .measurement-table tr:hover {
          background-color: #f8f8f8;
        }
      `}</style>
    </section>
  );
};

export default Measurement;
