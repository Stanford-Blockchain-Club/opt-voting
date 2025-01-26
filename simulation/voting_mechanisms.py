"""
Voting mechanism implementations for RPGF simulation framework using NumPy/Pandas.

This module contains implementations of various voting mechanisms and their
corresponding attack scenarios for analyzing voting behavior in Optimism's
Retroactive Public Goods Funding (RPGF) program.
"""

import numpy as np
import pandas as pd

def baseline_voting(voter_data: pd.DataFrame):
    """Baseline preference-weighted voting (baseline)."""
    voting_power = voter_data['voting_power'].values
    preferences = voter_data.drop(columns=['voting_power']).values
    
    # Normalize preferences row-wise
    pref_sums = preferences.sum(axis=1, keepdims=True)
    normalized_prefs = preferences / pref_sums
    
    # Weight by voting power and sum across voters
    weighted_votes = normalized_prefs * voting_power[:, np.newaxis]
    
    votes = pd.DataFrame({
        'project_id': range(preferences.shape[1]),
        'votes': weighted_votes.sum(axis=0),
    })

    metadata = {
        'n_voters': len(voter_data),
        'n_projects': preferences.shape[1],
        'total_voting_power': voting_power.sum(),
        'attack_type': 'none',
        'mechanism': 'baseline'
    }
    return votes, metadata

def quadratic_voting(voter_data: pd.DataFrame, 
                    attack: str = 'none'):
    """Quadratic voting with optional attack scenarios."""
    voting_power = voter_data['voting_power'].values
    preferences = voter_data.drop(columns=['voting_power']).values
    n_voters, n_projects = preferences.shape
    
    if attack == 'voter_collusion':
        # Randomly select two colluding voters
        colluding_ids = np.random.choice(voter_data.index, 2, replace=False)
        colluding_mask = voter_data.index.isin(colluding_ids)
        
        # Handle colluding voters
        votes = np.zeros(n_projects)
        
        # Colluding voters split votes between top preferences
        colluding_prefs = preferences[colluding_mask]
        top_two = np.argsort(colluding_prefs, axis=1)[:, -2:]
        colluding_power = voting_power[colluding_mask]
        
        for prefs, power in zip(top_two, colluding_power):
            vote_amount = np.sqrt(0.5 * power)
            votes[prefs] += vote_amount
        
        # Normal voting for others
        normal_prefs = preferences[~colluding_mask]
        normal_power = voting_power[~colluding_mask]
        
        pref_sums = normal_prefs.sum(axis=1, keepdims=True)
        normal_votes = np.sqrt((normal_prefs / pref_sums) * normal_power[:, np.newaxis])
        votes += normal_votes.sum(axis=0)
        
    elif attack == 'project_collusion':
        # Select colluding projects
        colluding_projects = np.random.choice(n_projects, 2, replace=False)
        
        votes = np.zeros(n_projects)
        for voter_prefs, power in zip(preferences, voting_power):
            top_pref_idx = np.argmax(voter_prefs)
            
            if top_pref_idx in colluding_projects:
                # Split votes between colluding projects
                vote_amount = np.sqrt(0.5 * power)
                votes[colluding_projects] += vote_amount
            else:
                # Normal quadratic voting
                pref_sum = voter_prefs.sum()
                votes += np.sqrt((voter_prefs / pref_sum) * power)
    
    else:  # Standard quadratic voting
        pref_sums = preferences.sum(axis=1, keepdims=True)
        votes = np.sqrt((preferences / pref_sums) * voting_power[:, np.newaxis])
        votes = votes.sum(axis=0)
    
    results = pd.DataFrame({
        'project_id': range(n_projects),
        'votes': votes,
    })
    
    metadata = {
        'n_voters': n_voters,
        'n_projects': n_projects,
        'total_voting_power': voting_power.sum(),
        'attack': attack,
        'mechanism': 'quadratic'
    }
    
    return results, metadata


def mean_voting(voter_data: pd.DataFrame,
                attack: str = 'none'):
    """Mean voting with optional epsilon attack."""
    voting_power = voter_data['voting_power'].values
    preferences = voter_data.drop(columns=['voting_power']).values
    n_voters, n_projects = preferences.shape
    epsilon = 0.01 # Epsilon value in attack scenarios
    
    if attack == 'voter_epsilon':
        # Select random attacker
        attacker_idx = np.random.choice(n_voters)
        
        # Calculate votes excluding attacker
        pref_sums = preferences.sum(axis=1, keepdims=True)
        normal_votes = (preferences / pref_sums) * voting_power[:, np.newaxis]
        
        # Epsilon attack strategy
        
        attacker_prefs = preferences[attacker_idx]
        max_idx = np.argmax(attacker_prefs)
        
        attack_votes = np.full(n_projects, epsilon)
        attack_votes[max_idx] = voting_power[attacker_idx] - (epsilon * (n_projects - 1))
        
        # Replace attacker's votes
        normal_votes[attacker_idx] = attack_votes
        final_votes = normal_votes.mean(axis=0)
        
    elif attack == 'project_epsilon':
        # Select attacking project
        attack_project = np.random.choice(n_projects)
        
        # Normal voting calculation
        pref_sums = preferences.sum(axis=1, keepdims=True)
        votes = (preferences / pref_sums) * voting_power[:, np.newaxis]
        
        # For each voter, if they voted for the attacking project,
        # maximize their vote for it while minimizing others
        for i in range(n_voters):
            if preferences[i, attack_project] > 0:
                attack_votes = np.full(n_projects, epsilon)
                attack_votes[attack_project] = voting_power[i] - (epsilon * (n_projects - 1))
                votes[i] = attack_votes
        
        final_votes = votes.mean(axis=0)
        
    else:  # Standard mean voting
        pref_sums = preferences.sum(axis=1, keepdims=True)
        final_votes = ((preferences / pref_sums) * voting_power[:, np.newaxis]).mean(axis=0)
    
    votes = pd.DataFrame({
        'project_id': range(n_projects),
        'votes': final_votes,
        'mechanism': 'mean',
        'attack_type': attack
    })
    
    metadata = {
        'n_voters': n_voters,
        'n_projects': n_projects,
        'total_voting_power': voting_power.sum(),
        'attack': attack
    }
    
    return votes, metadata

def median_voting(voter_data: pd.DataFrame, attack: str = 'none'):
    """Median voting with optional attacks."""
    preferences = np.vstack(voter_data['preferences'].values)
    voting_power = voter_data['voting_power'].values
    n_voters, n_projects = preferences.shape
    epsilon = 0.01
    
    if attack == 'voter_epsilon':
        # Select random attacker
        attacker_idx = np.random.choice(n_voters)
        
        # Calculate normalized votes
        pref_sums = preferences.sum(axis=1, keepdims=True)
        votes = (preferences / pref_sums) * voting_power[:, np.newaxis]
        
        # Epsilon attack strategy
        attacker_prefs = preferences[attacker_idx]
        max_idx = np.argmax(attacker_prefs)
        
        attack_votes = np.full(n_projects, epsilon)
        attack_votes[max_idx] = voting_power[attacker_idx] - (epsilon * (n_projects - 1))
        
        votes[attacker_idx] = attack_votes
        final_votes = np.median(votes, axis=0)
        
    elif attack == 'project_epsilon':
        # Select attacking project
        attack_project = np.random.choice(n_projects)
        
        # Calculate normalized votes
        pref_sums = preferences.sum(axis=1, keepdims=True)
        votes = (preferences / pref_sums) * voting_power[:, np.newaxis]
        
        # For each voter who preferred the attacking project
        for i in range(n_voters):
            if preferences[i, attack_project] > 0:
                # Create epsilon attack votes array
                attack_votes = np.full(n_projects, epsilon)
                # Allocate remaining voting power to attacking project
                attack_votes[attack_project] = voting_power[i] - (epsilon * (n_projects - 1))
                # Replace voter's votes with attack votes
                votes[i] = attack_votes
        
        final_votes = np.median(votes, axis=0)
        
    else:  # Standard median voting
        pref_sums = preferences.sum(axis=1, keepdims=True)
        votes = (preferences / pref_sums) * voting_power[:, np.newaxis]
        final_votes = np.median(votes, axis=0)
    
    votes = pd.DataFrame({
        'project_id': range(n_projects),
        'votes': final_votes,
    })
    
    metadata = {
        'n_voters': n_voters,
        'n_projects': n_projects,
        'total_voting_power': voting_power.sum(),
        'mechanism': 'median',
        'attack_type': attack
    }
    
    return votes, metadata