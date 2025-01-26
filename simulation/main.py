import pandas as pd
from voting_mechanisms import *

def main():
    # File path for voter preferences
    input_file = "data/voter_pref.csv"
    output_file = "data/results.csv"
    
    # Load voter data
    print("Loading voter preference data...")
    voter_data = pd.read_csv(input_file)
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
    votes.to_csv(output_file, index=False)
    print(f"\nResults saved to {output_file}")
        

if __name__ == "__main__":
    main()