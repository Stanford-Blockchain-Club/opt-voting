import pandas as pd
import numpy as np
from voting_mechanisms import baseline_voting

def load_voter_data(file_path: str) -> pd.DataFrame:
    """
    Load voter preference data from CSV file.
    Expected format: Each row represents a voter, columns are projects
    First column should be Voter ID
    """
    try:
        # Read CSV file
        df = pd.read_csv(file_path)
        
        # Assuming first column is Voter ID
        voter_ids = df.iloc[:, 0]
        
        # Convert preferences to numpy array, excluding Voter ID column
        preferences = df.iloc[:, 1:].values
        
        # Generate simple voting power (all equal for baseline)
        voting_power = np.ones(len(df))
        
        # Create DataFrame with required structure
        voter_data = pd.DataFrame({
            'voter_id': voter_ids,
            'preferences': [row for row in preferences],
            'voting_power': voting_power
        })
        
        return voter_data
        
    except Exception as e:
        print(f"Error loading voter data: {e}")
        raise

def main():
    # File path for voter preferences
    input_file = "data/voter_pref.csv"
    
    try:
        # Load voter data
        print("Loading voter preference data...")
        voter_data = load_voter_data(input_file)
        print(voter_data.head())

        # Run baseline voting simulation
        print("Running baseline voting simulation...")
        votes, metadata = baseline_voting(voter_data)
        
        # Print results
        print("\nSimulation Results:")
        print(f"Number of voters: {metadata['n_voters']}")
        print(f"Number of projects: {metadata['n_projects']}")
        print("\nVoting Results:")
        print(votes)
        
        # Save results to CSV
        output_file = "data/baseline_results.csv"
        votes.to_csv(output_file, index=False)
        print(f"\nResults saved to {output_file}")
        
    except Exception as e:
        print(f"Error in simulation: {e}")

if __name__ == "__main__":
    main()