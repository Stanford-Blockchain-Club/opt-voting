import type { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import fs from 'fs';
import { parse } from 'csv-parse/sync'; // Using sync parser for simplicity
import {
  maxVoting,
  quadraticVotingNoAttack,
  meanVotingNoAttack,
  quadraticVotingVoterCollusionAttack,
  quadraticVotingProjectCollusionAttack,
  meanVotingVoterEpsilonAttack,
  meanVotingProjectEpsilonAttack,
  trueVoting,
  medianVotingNoAttack,
  medianVotingVoterEpsilonAttack,
  medianVotingProjectEpsilonAttack,
} from '../../utils/votingMechanisms'; // Import voting functions

// Directory for storing uploaded files
const uploadDir = '/tmp'; // Use tmp for temporary file storage

const upload = multer({
  storage: multer.diskStorage({
    destination: '/tmp',
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
  }),
});

export const config = {
  api: {
    bodyParser: false,
  },
};

const parseCSV = (filePath: string) => {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
  });
  return records;
};

const processVoterData = (voterRecords: any[], powerRecords: any[]) => {
  return voterRecords.map((voter: any, index: number) => {
    const voterId = voter['Voter ID'];
    const preferences = Object.entries(voter)
      .filter(([key]) => key.startsWith('Project '))
      .map(([_, value]) => parseFloat(value as string));
    const votingPower = parseFloat(powerRecords[index]['Voting Power']);

    return {
      voterId,
      preferences,
      votingPower,
    };
  });
};

const simulateHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await runMiddleware(req, res, upload.fields([
      { name: 'voterFile', maxCount: 1 },
      { name: 'votingPowerFile', maxCount: 1 },
    ]));

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    // let numSimulations = parseInt(req.body.numSimulations) || 1000;
    // if (numSimulations > 10000) {
    //   numSimulations = 10000;
    // }
    // Handle single simulation
    let numSimulations = 1;

    if (!files.voterFile?.[0] || !files.votingPowerFile?.[0]) {
      return res.status(400).json({ error: 'Missing required files' });
    }

    // Parse CSV files
    const voterRecords = parseCSV(files.voterFile[0].path);
    const powerRecords = parseCSV(files.votingPowerFile[0].path);

    // Initialize results accumulator
    let aggregatedResults: Record<string, Record<string, number>> = {};

    // Run simulations
    for (let i = 0; i < numSimulations; i++) {
      const voterData = processVoterData(voterRecords, powerRecords);
      
      const simulationResults = {
        // maxVotingResults: maxVoting(voterData),
        quadraticNoAttackResults: quadraticVotingNoAttack(voterData),
        quadraticVoterCollusionResults: quadraticVotingVoterCollusionAttack(voterData),
        quadraticProjectCollusionResults: quadraticVotingProjectCollusionAttack(voterData),
        meanNoAttackResults: meanVotingNoAttack(voterData),
        meanVoterEpsilonResults: meanVotingVoterEpsilonAttack(voterData),
        meanProjectEpsilonResults: meanVotingProjectEpsilonAttack(voterData),
        trueVotingResults: trueVoting(voterData),
        medianNoAttackResults: medianVotingNoAttack(voterData),
        medianVoterEpsilonResults: medianVotingVoterEpsilonAttack(voterData),
        medianProjectEpsilonResults: medianVotingProjectEpsilonAttack(voterData),
      };

      // Accumulate results
      Object.entries(simulationResults).forEach(([mechanism, results]) => {
        if (!aggregatedResults[mechanism]) {
          aggregatedResults[mechanism] = {};
        }
        Object.entries(results).forEach(([project, votes]) => {
          if (!aggregatedResults[mechanism][project]) {
            aggregatedResults[mechanism][project] = 0;
          }
          aggregatedResults[mechanism][project] += votes;
        });
      });
    }

    // Calculate averages
    Object.keys(aggregatedResults).forEach(mechanism => {
      Object.keys(aggregatedResults[mechanism]).forEach(project => {
        aggregatedResults[mechanism][project] /= numSimulations;
      });
    });

    // Clean up temporary files
    fs.unlinkSync(files.voterFile[0].path);
    fs.unlinkSync(files.votingPowerFile[0].path);

    res.status(200).json(aggregatedResults);
  } catch (error) {
    console.error('Error in simulation:', error);
    res.status(500).json({ error: 'Failed to process simulation' });
  }
};

function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: Function) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default simulateHandler;
