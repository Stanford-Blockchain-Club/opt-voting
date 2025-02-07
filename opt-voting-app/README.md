# Optimism Voting Mechanism Dashboard

A dashboard application for analyzing different voting mechanisms and their vulnerability to various attack vectors in the context of Optimism's Retroactive Public Goods Funding (RPGF).

[View Demo](https://opt-voting.vercel.app/) | [RFP Details](https://github.com/orgs/ethereum-optimism/projects/31/views/1?pane=issue&itemId=61734498) | [Research Paper](https://blockchain.stanford.edu/files/research/optimism-rpgf-0206.pdf)

Maintainers: Billy Gao and Jay Yu

## Overview

This project implements a voting simulation system that models different voting algorithms and their responses to potential attack scenarios. The simulation helps evaluate the effectiveness and security of various voting mechanisms for Optimism's RPGF program.

## Features

- Multiple voting algorithm implementations:
  - Quadratic Voting
  - Mean Voting
  - Median Voting
- Configurable simulation parameters
- Support for custom preference matrices via CSV import
- Automated random preference matrix generation
- Interactive visualization of voting outcomes

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Technology Stack

- Next.js
- Tailwind CSS
- TypeScript

## Usage

1. Choose a voting mechanism (Quadratic, Mean, or Median)
2. Configure simulation parameters
3. Either import a custom preference matrix or generate a random one
4. Run the simulation to visualize outcomes
5. Analyze the results under different attack scenarios
