import type { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { parse } from 'csv-parse';
import {
  maxVoting,
  quadraticVotingNoAttack,
  meanVotingNoAttack,
  quadraticVotingVoterCollusionAttack,
  quadraticVotingProjectCollusionAttack,
  meanVotingVoterEpsilonAttack,
  meanVotingProjectEpsilonAttack,
  trueVoting
} from '../../utils/votingMechanisms'; // Import voting functions

// Directory for storing uploaded files
const uploadDir = path.join(process.cwd(), 'uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

export const config = {
  api: {
    bodyParser: false,
  },
};

const multerMiddleware = upload.fields([
  { name: 'voterFile', maxCount: 1 },
  { name: 'votingPowerFile', maxCount: 1 },
]);

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

const parseCSV = async (filePath: string): Promise<any[]> => {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  return new Promise((resolve, reject) => {
    parse(fileContent, { trim: true }, (err, records) => {
      if (err) {
        reject(err);
      }
      resolve(records);
    });
  });
};

const simulateHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log('Simulation started');
  await runMiddleware(req, res, multerMiddleware);

  const voterFile = req.files?.['voterFile']?.[0];
  const votingPowerFile = req.files?.['votingPowerFile']?.[0];

  if (!voterFile || !votingPowerFile) {
    console.error('Files are missing');
    return res.status(400).json({ error: 'Files are missing' });
  }

  const voterFilePath = voterFile.path;
  const votingPowerFilePath = votingPowerFile.path;

  try {
    console.log('Parsing CSV files');
    const preferenceMatrix = await parseCSV(voterFilePath);
    const votingPowerMatrix = await parseCSV(votingPowerFilePath);

    const votersData = preferenceMatrix.map((preferences, index) => {
      const votingPower = votingPowerMatrix[index][0];
      return {
        voterId: index + 1,
        preferences: preferences.map(Number),
        votingPower: Number(votingPower),
      };
    });

    console.log('Executing voting mechanisms');
    const maxVotingResults = maxVoting(votersData);
    const quadraticNoAttackResults = quadraticVotingNoAttack(votersData);
    const meanNoAttackResults = meanVotingNoAttack(votersData);
    const quadraticVoterCollusionResults = quadraticVotingVoterCollusionAttack(votersData);
    const quadraticProjectCollusionResults = quadraticVotingProjectCollusionAttack(votersData);
    const meanVoterEpsilonResults = meanVotingVoterEpsilonAttack(votersData);
    const meanProjectEpsilonResults = meanVotingProjectEpsilonAttack(votersData);
    const trueVotingResults = trueVoting(votersData);

    console.log('Sending JSON response with voting results');
    // Return the results as JSON
    res.status(200).json({
      maxVotingResults,
      quadraticNoAttackResults,
      meanNoAttackResults,
      quadraticVoterCollusionResults,
      quadraticProjectCollusionResults,
      meanVoterEpsilonResults,
      meanProjectEpsilonResults,
      trueVotingResults,
    });
  } catch (error) {
    console.error('Error processing files:', error);
    res.status(500).json({ error: 'Error processing files' });
  }
};

export default simulateHandler;
