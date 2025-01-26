import pandas as pd
from voting_mechanisms import *
from gen_data import *
from eval_data import *
import matplotlib.pyplot as plt
import time

def run_quadratic_voting(n_times, n_voters, n_projects, d_pref="pareto", d_weight="constant"):
    # Test run attack and non-attack cases of quadratic voting
    results = []
    for i in range(n_times):
        voter_data = generate_data(n_voters, n_projects, d_pref, d_weight)
        baseline, _ = baseline_voting(voter_data)
        quad_base, _ = quadratic_voting(voter_data)
        quad_voter_attack, _ = quadratic_voting(voter_data, attack="voter_collusion")
        quad_project_attack, _ = quadratic_voting(voter_data, attack="project_collusion")

        
        voter_attack_resilience = get_pairwise_resilience(quad_base, quad_voter_attack)
        project_attack_resilience = get_pairwise_resilience(quad_base, quad_project_attack)
        
        base_diff = get_pairwise_resilience(baseline, quad_base)
        voter_attack_diff = get_pairwise_resilience(baseline, quad_voter_attack)
        project_attack_diff = get_pairwise_resilience(baseline, quad_project_attack)
        
        results.append({
            'base_difference': base_diff,
            'voter_attack_difference': voter_attack_diff, 
            'voter_attack_resilience': voter_attack_resilience,
            'project_attack_difference': project_attack_diff,
            'project_attack_resilience': project_attack_resilience
        })
    
    return pd.DataFrame(results)

def run_baseline_voting(n_voters, n_projects, d_pref, d_weight):
    voter_data = generate_data(n_voters, n_projects, d_pref, d_weight)
    return baseline_voting(voter_data)

if __name__ == "__main__":
    # Set parameters
    repeat_n = 1000
    voter_n = 133
    project_n = 374
    # Time the run
    start_time = time.time()
    results = run_quadratic_voting(repeat_n, voter_n, project_n) # Use pareto and constant defaults
    end_time = time.time()
    print(f"Time taken: {end_time - start_time} seconds")
    print(results)
    results.to_csv("data/results.csv", index=False)
    
    # Visualize results using histograms
    fig, axes = plt.subplots(2, 3, figsize=(15, 10))
    fig.suptitle('Quadratic Voting Results - Resilience Distribution')
    
    # Plot histograms for each metric
    results['base_difference'].hist(ax=axes[0,0], bins=20)
    axes[0,0].set_title('Baseline vs Quadratic\nDifference')
    axes[0,0].set_xlabel('Difference')
    axes[0,0].set_ylabel('Frequency')
    
    # results['voter_attack_difference'].hist(ax=axes[0,1], bins=20)
    # axes[0,1].set_title('Baseline vs Voter Attack\nDifference')
    # axes[0,1].set_xlabel('Difference')
    
    results['voter_attack_resilience'].hist(ax=axes[0,1], bins=20)
    axes[0,1].set_title('Voter Attack Resilience')
    axes[0,1].set_xlabel('Resilience Score')
    
    # results['project_attack_difference'].hist(ax=axes[1,0], bins=20)
    # axes[1,0].set_title('Baseline vs Project Attack\nDifference')
    # axes[1,0].set_xlabel('Difference')
    # axes[1,0].set_ylabel('Frequency')
    
    results['project_attack_resilience'].hist(ax=axes[0,2], bins=20)
    axes[0,2].set_title('Project Attack Resilience')
    axes[0,2].set_xlabel('Resilience Score')
    
    # Remove the unused subplot
    fig.delaxes(axes[1,2])
    
    plt.tight_layout()
    plt.savefig('data/results_distribution.png')
    plt.show()
    plt.close()