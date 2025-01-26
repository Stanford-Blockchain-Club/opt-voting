import numpy as np
import pandas as pd


def generate_voter_preferences(n_voters, n_projects, distribution="pareto"):
    """Generate voter preferences following a power law distribution."""
    if distribution == "pareto":
        alpha = 2.5
        preferences = np.zeros((n_voters, n_projects))
        for i in range(n_voters):
            # Generate raw power law values
            preferences[i] = np.random.pareto(alpha, size=n_projects)
    elif distribution == "uniform":
        preferences = np.random.rand(n_voters, n_projects)
    else:
        raise ValueError(f"Invalid distribution: {distribution}")
    
    # Normalize preference sum to 1
    preferences = preferences / preferences.sum(axis=1, keepdims=True)
    return preferences

def generate_voting_power(n_voters, distribution="constant"):
    if distribution == "constant":
        voting_power = np.ones(n_voters)
    elif distribution == "uniform":
        voting_power = np.random.rand(n_voters)
    elif distribution == "gaussian":
        voting_power = np.random.normal(100, 10, n_voters)
    elif distribution == "pareto":
        voting_power = np.random.pareto(2.5, n_voters)
    else:
        raise ValueError(f"Invalid distribution: {distribution}")
    return voting_power

def generate_data(n_voters=100, n_projects=10, voting_power=100, d_pref = "pareto", d_weight = "constant"):
    """Generate voter preferences and voting power data."""
    # Generate preferences using power law distribution
    preferences = generate_voter_preferences(n_voters, n_projects, d_pref)
    
    # Create voter IDs
    voter_ids = [f"voter_{i+1}" for i in range(n_voters)]
    
    # Create preferences DataFrame
    pref_columns = [f"project_{i+1}" for i in range(n_projects)]
    preferences_df = pd.DataFrame(preferences, columns=pref_columns)
    preferences_df.insert(0, 'voter_id', voter_ids)
    
    # Create voting power DataFrame with constant value
    voting_power_df = pd.DataFrame({
        'voter_id': voter_ids,
        'voting_power': generate_voting_power(n_voters, d_weight)
    })
    
    return preferences_df, voting_power_df

def save_data(preferences_df, voting_power_df):
    data = pd.merge(voting_power_df, preferences_df, on="voter_id")
    data.to_csv("data/data_gen.csv", index=False)

if __name__ == "__main__":
    preferences_df, voting_power_df = generate_data(n_voters=100, n_projects=10, voting_power=100, d_pref="pareto", d_weight="constant")
    print(preferences_df.head())
    print(voting_power_df.head())
    save_data(preferences_df, voting_power_df)