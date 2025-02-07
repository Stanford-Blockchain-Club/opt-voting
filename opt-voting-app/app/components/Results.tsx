"use client";

import React, { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface VotingResults {
  [key: string]: { [project: string]: number };
}

const Results: React.FC<{ votingResults: VotingResults | null }> = ({ votingResults }) => {
  const [visibleCharts, setVisibleCharts] = useState<{ [key: string]: 'bar' | 'pie' }>({});
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Initialize the visible charts when voting mechanisms change
  useEffect(() => {
    const initialVisibility = votingMechanisms.reduce((acc, mechanism) => {
      acc[mechanism] = 'bar';
      return acc;
    }, {} as { [key: string]: 'bar' | 'pie' });
    setVisibleCharts(initialVisibility);
  }, []);

  useEffect(() => {
    console.log('Voting results updated in Results component:', votingResults); // Check if results are passed
    if (!votingResults) {
      console.log('No voting results yet!');
    }
  }, [votingResults]);

  // Placeholder data if no votingResults yet
  const placeholderData = {
    labels: ['Placeholder Project 1', 'Placeholder Project 2', 'Placeholder Project 3'],
    datasets: [
      {
        label: 'Votes',
        data: [20, 30, 50],
        backgroundColor: ['rgba(230, 57, 70, 0.6)', 'rgba(34, 202, 236, 0.6)', 'rgba(54, 162, 235, 0.6)'],
        borderColor: '#e63946',
        borderWidth: 1,
      },
    ],
  };

  const votingMechanisms = [
    'trueVotingResults',
    // Quadratic Voting Group
    'quadraticNoAttackResults',
    'quadraticVoterCollusionResults',
    'quadraticProjectCollusionResults',
    // Mean Voting Group
    'meanNoAttackResults',
    'meanVoterEpsilonResults',
    'meanProjectEpsilonResults',
    // Median Voting Group
    'medianNoAttackResults',
    'medianVoterEpsilonResults',
    'medianProjectEpsilonResults',
  ];

  // Add mapping for friendly names
  const mechanismNames: { [key: string]: string } = {
    quadraticNoAttackResults: 'Quadratic Voting (Base Case)',
    quadraticVoterCollusionResults: 'Quadratic Voting with Voter Collusion',
    quadraticProjectCollusionResults: 'Quadratic Voting with Project Collusion',
    meanNoAttackResults: 'Mean Voting (Base Case)',
    meanVoterEpsilonResults: 'Mean Voting with Voter Manipulation',
    meanProjectEpsilonResults: 'Mean Voting with Project Manipulation',
    trueVotingResults: 'Baseline Voting Distribution',
    medianNoAttackResults: 'Median Voting (Base Case)',
    medianVoterEpsilonResults: 'Median Voting with Voter Manipulation',
    medianProjectEpsilonResults: 'Median Voting with Project Manipulation',
  };

  // Add descriptions for each mechanism
  const mechanismDescriptions: { [key: string]: string } = {
    quadraticNoAttackResults: 'Quadratic voting mechanism in its pure form, where the cost of votes increases quadratically. This helps prevent extreme allocations.',
    quadraticVoterCollusionResults: 'Quadratic voting with voter collusion, where voters coordinate their voting strategy to maximize influence in a quadratic voting system.',
    quadraticProjectCollusionResults: 'Shows how quadratic voting results change when projects collaborate to manipulate vote distribution.',
    meanNoAttackResults: 'Mean voting system in its basic form, where votes are averaged to reduce the impact of extreme allocations.',
    meanVoterEpsilonResults: 'Illustrates the effect of strategic voting in a mean voting system when voters attempt to manipulate outcomes.',
    meanProjectEpsilonResults: 'Shows the impact of project coordination on mean voting results when projects try to game the system.',
    trueVotingResults: 'Distribution of votes according to data from voters\' preference matrix, without any manipulation, serving as a baseline for comparison.',
    medianNoAttackResults: 'Median voting mechanism in its basic form, where the median preference is used to determine the winner.',
    medianVoterEpsilonResults: 'Shows the impact of strategic voting in a median voting system when voters attempt to manipulate outcomes.',
    medianProjectEpsilonResults: 'Shows the impact of project coordination on median voting results when projects try to game the system.',
  };

  const generateChartData = (data: { [project: string]: number }) => {
    const labels = Object.keys(data).map((project) => `Project ${project}`);
    const values = Object.values(data);

    return {
      labels,
      datasets: [
        {
          label: 'Votes',
          data: values,
          backgroundColor: [
            'rgba(230, 57, 70, 0.6)',
            'rgba(34, 202, 236, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(255, 205, 86, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)'
          ],
          borderColor: '#e63946',
          borderWidth: 1,
        },
      ],
    };
  };

  // Bar chart options without a legend
  const generateChartOptions = (mechanism: string) => ({
    plugins: {
      title: {
        display: true,
        text: `${votingMechanisms.indexOf(mechanism) + 1}. ${mechanismNames[mechanism]}`,
        font: {
          size: 20,
        },
        padding: {
          top: 0,
          bottom: 10
        }
      },
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Projects',
          font: {
            size: 14,
          },
        },
        ticks: {
          padding: 5
        }
      },
      y: {
        title: {
          display: true,
          text: 'Votes',
          font: {
            size: 14,
          },
        },
        beginAtZero: true,
        ticks: {
          padding: 5
        }
      },
    },
    layout: {
      padding: {
        left: 5,
        right: 5,
        top: 5,
        bottom: 0
      }
    },
    maintainAspectRatio: true,
  });

  // Pie chart options without axis and axis titles
  const generatePieChartOptions = (mechanism: string) => ({
    plugins: {
      title: {
        display: true,
        text: `${votingMechanisms.indexOf(mechanism) + 1}. ${mechanismNames[mechanism]}`,
        font: {
          size: 20,
        },
        padding: {
          top: 5,
          bottom: 20
        }
      },
      legend: {
        display: true,
        position: 'top' as const, // Place the legend on top
        align: 'center' as const, // Align the legend in the center
        labels: {
          boxWidth: 20, // Size of the color box in the legend
          padding: 10,
        },
      },
    },
    layout: {
      padding: {
        left: 5,
        right: 5,
        top: 5,
        bottom: 0
      }
    },
  });

  const toggleChart = (mechanism: string) => {
    setVisibleCharts(prev => ({
      ...prev,
      [mechanism]: prev[mechanism] === 'bar' ? 'pie' : 'bar'
    }));
  };

  const handlePrevSlide = () => {
    setCurrentSlideIndex((prev) => (prev === 0 ? votingMechanisms.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlideIndex((prev) => (prev === votingMechanisms.length - 1 ? 0 : prev + 1));
  };

  // Generate dynamic text summarizing the voting mechanisms and the impact of attacks
  const generateDynamicText = () => {
    if (!votingResults) {
      return 'Currently displaying placeholder data. Once the actual voting results are available, they will be shown here.';
    }

    const rows: { index: number; mechanism: string; winner: string; votes: number }[] = [];

    // Generate table rows with index
    votingMechanisms.forEach((mechanism, index) => {
      const data = votingResults?.[mechanism];
      if (data && Object.keys(data).length > 0) {
        const maxVotes = Math.max(...Object.values(data));
        const maxProject = Object.keys(data)[Object.values(data).indexOf(maxVotes)];
        
        rows.push({
          index: index + 1,
          mechanism: mechanismNames[mechanism],
          winner: `Project ${maxProject}`,
          votes: maxVotes
        });
      }
    });

    return (
      <div className="table-container">
        <table className="results-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Mechanism</th>
              <th>Winner</th>
              <th>Votes</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.index}>
                <td>{row.index}</td>
                <td>{row.mechanism}</td>
                <td>{row.winner}</td>
                <td className="value-cell">{row.votes.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <style jsx>{`
          .table-container {
            overflow-x: auto;
            margin: 20px 0;
          }
          
          .results-table {
            width: 100%;
            border-collapse: collapse;
            background-color: white;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          }
          
          .results-table th,
          .results-table td {
            padding: 12px 16px;
            text-align: left;
            border-bottom: 1px solid #eee;
          }
          
          .results-table th {
            background-color: #f5f5f5;
            font-weight: 600;
          }
          
          .value-cell {
            font-family: monospace;
            font-weight: 500;
          }
          
          .results-table tr:hover {
            background-color: #f8f8f8;
          }
        `}</style>
      </div>
    );
  };

  return (
    <section id="results" className="results-section">
      <h2 className="section-heading">Results</h2>
      <h3 className="subsection-heading">Voting Mechanisms</h3>
      <p className="section-paragraph">
        This section visualizes the outcomes of different voting mechanisms and their resilience to various manipulation strategies. Each chart compares project vote distributions across multiple voting systems including quadratic voting, mean voting, and maximum voting.
      </p>

      <div className="results-grid">
        <div className="slide-controls">
          <button className="slide-button" onClick={handlePrevSlide}>
            ←
          </button>
          <button className="slide-button" onClick={handleNextSlide}>
            →
          </button>
        </div>

        {/* Only render the current slide */}
        {(() => {
          const mechanism = votingMechanisms[currentSlideIndex];
          const data = votingResults?.[mechanism] || {};
          const hasData = Object.keys(data).length > 0;

          const barChartData = hasData ? generateChartData(data) : placeholderData;
          const barChartOptions = generateChartOptions(mechanism);

          const pieChartData = hasData ? generateChartData(data) : placeholderData;
          const pieChartOptions = generatePieChartOptions(mechanism);

          return (
            <div className="result-box">
              <div className="chart-container">
                {visibleCharts[mechanism] === 'bar' ? (
                  <Bar data={barChartData} options={barChartOptions} />
                ) : (
                  <Pie data={pieChartData} options={pieChartOptions} />
                )}
              </div>
              <div className="mechanism-description">
                <p>{mechanismDescriptions[mechanism]}</p>
                {votingResults && votingResults[mechanism] && (
                  <p className="results-summary">
                    {Object.entries(votingResults[mechanism])
                      .sort(([, a], [, b]) => b - a)
                      .slice(0, 1)
                      .map(([project, votes]) => 
                        `Winner: Project ${project} with ${votes.toFixed(2)} votes`
                      )}
                  </p>
                )}
              </div>
              <button 
                className="chart-toggle-button" 
                onClick={() => toggleChart(mechanism)}
              >
                Switch to {visibleCharts[mechanism] === 'bar' ? 'Pie' : 'Bar'} Chart
              </button>
            </div>
          );
        })()}

        <div className="slide-indicator">
          {votingMechanisms.map((_, index) => (
            <div
              key={index}
              className={`indicator-dot ${index === currentSlideIndex ? 'active' : ''}`}
              onClick={() => setCurrentSlideIndex(index)}
            />
          ))}
        </div>
      </div>

      <h3 className="subsection-heading">Summary of Results</h3>
      <p className="section-paragraph">
        The table below summarizes the winning projects across different voting mechanisms. This comparison helps identify how various voting strategies and attack vectors can influence the final outcomes.
      </p>
      {generateDynamicText()}
      
      <style jsx>{`
        .subsection-heading {
          margin-top: 2rem;
          margin-bottom: 1rem;
          font-size: 1.5rem;
          font-weight: 600;
        }
        
        .table-container {
          overflow-x: auto;
          margin: 20px 0;
        }
        
        .results-table {
          width: 100%;
          border-collapse: collapse;
          background-color: white;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        
        .results-table th,
        .results-table td {
          padding: 12px 16px;
          text-align: left;
          border-bottom: 1px solid #eee;
        }
        
        .results-table th {
          background-color: #f5f5f5;
          font-weight: 600;
          white-space: nowrap;
        }
        
        .results-table td {
          padding: 12px 16px;
          text-align: left;
          border-bottom: 1px solid #eee;
          line-height: 1.4;
        }
        
        /* Add zebra striping for better readability */
        .results-table tbody tr:nth-child(even) {
          background-color: #fafafa;
        }
        
        .value-cell {
          font-family: monospace;
          font-weight: 500;
        }
        
        .results-table tr:hover {
          background-color: #f8f8f8;
        }
        
        .download-button {
          margin: 20px 0;
          padding: 10px 20px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 1rem;
          transition: background-color 0.2s;
        }

        .download-button:hover {
          background-color: #0056b3;
        }
      `}</style>
                {/* Add download button */}
                {votingResults && (
        <div className="download-button-container">
          <button 
            className="show-more-button"
            onClick={() => {
              // Convert voting results to CSV format
              const csvRows = ['Mechanism,Project,Votes'];
              Object.entries(votingResults).forEach(([mechanism, data]) => {
                Object.entries(data).forEach(([project, votes]) => {
                  csvRows.push(`${mechanismNames[mechanism]},Project ${project},${votes}`);
                });
              });
              
              // Create and trigger download
              const csvContent = csvRows.join('\n');
              const blob = new Blob([csvContent], { type: 'text/csv' });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'voting_results.csv';
              document.body.appendChild(a);
              a.click();
              a.remove();
              window.URL.revokeObjectURL(url);
            }}
          >
            Download Voting Results as CSV
          </button>
        </div>
      )}
      
    </section>
  );
};

export default Results;

