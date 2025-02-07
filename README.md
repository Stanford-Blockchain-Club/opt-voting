# Optimism RFP: Evaluating Voting Designs for RPGF

A simulation framework for analyzing different voting mechanisms and their vulnerability to various attack vectors in the context of Optimism's Retroactive Public Goods Funding (RPGF).

Research Paper (As of Feb 6, 2025): https://blockchain.stanford.edu/files/research/optimism-rpgf-0206.pdf

RFP Information: https://github.com/orgs/ethereum-optimism/projects/31/views/1?pane=issue&itemId=61734498

Live Dashboard Deployment: https://opt-voting.vercel.app/

Maintainers: Billy Gao and Jay Yu

## Overview

This project implements a voting simulation system that models different voting algorithms and their responses to potential attack scenarios. The simulation framework consists of both Python-based simulations for data generation and analysis, and a Next.js web application for interactive visualization.

## Features

### Simulation Framework
- Multiple voting mechanism implementations:
  - Quadratic Voting
  - Mean Voting
  - Median Voting
- Attack vectors:
  - Voter Collusion Attack: Scenarios where groups of voters coordinate to manipulate outcomes bystrategically concentrating their voting power on specific projects.
  - Project Collusion Attack: Scenarios where multiple projects collude by encouraging their supportersto split votes among the colluding group, effectively amplifying their collective allocation.

- Data Generation:
  - Synthetic voter preference matrices (Pareto, Uniform, Gaussian distributions)
  - Voting power distributions (Constant, Uniform, Gaussian, Pareto)

- Analysis tools:
  - Statistical metrics calculation
  - Result comparison across mechanisms
  - Attack impact quantification
  - Data visualization utilities

### Dashboard Web Application
Live Dashboard Deployment: https://opt-voting.vercel.app/
- Interactive visualization of voting outcomes
- Support for custom preference matrices via CSV import
- Real-time simulation of voting mechanisms
- Comparative analysis of attack scenarios

## Quick Start

### Simulation Framework

```bash
# Clone the repository
git clone https://github.com/Stanford-Blockchain-Club/optimism-rfp-simulation
cd simulation

# Install required packages
pip install -r requirements.txt

# Run simulations
python main.py
```

### Web Application

```bash
cd opt-voting-app
npm install
npm run dev
```

## Voting Algorithms

### Quadratic Voting
Vote allocation follows a square root relationship with preferences:
- Standard: `votes = sqrt(preference * vote_num)`
- Voter Collusion Attack: Simulates coordinated voting between random voter pairs
- Project Collusion Attack: Simulates coordinated voting between random project pairs

### Mean Voting
Calculates mean preference across all voters:
- Standard: `project_votes = mean(preferences * vote_num)`
- Voter Epsilon Attack: Demonstrates vulnerability to strategic minimal voting
- Project Epsilon Attack: Shows impact of coordinated project manipulation

### Median Voting
Uses median preference to determine vote allocation:
- Standard: `project_votes = median(preferences * vote_num)`
- Voter Epsilon Attack: Tests resilience against strategic voting
- Project Epsilon Attack: Evaluates impact of project coordination


## License

MIT License

## Acknowledgments

Based on research into Optimism's Retroactive Public Goods Funding mechanisms and voting system vulnerabilities.