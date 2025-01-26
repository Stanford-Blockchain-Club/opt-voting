import pandas as pd
from voting_mechanisms import *
from gen_data import *
from eval_data import *
import matplotlib.pyplot as plt
import time

def run_simulation(n_times, n_voters, n_projects, d_pref="pareto", d_weight="constant"):
    results = []
    for i in range(n_times):
        voter_data = generate_data(n_voters, n_projects, d_pref, d_weight)
        baseline, _ = baseline_voting(voter_data)

        # Quadratic Voting
        quad_base, _ = quadratic_voting(voter_data)
        quad_voter_attack, _ = quadratic_voting(voter_data, attack="voter_collusion")
        quad_project_attack, _ = quadratic_voting(voter_data, attack="project_collusion")
        quad_br = get_pairwise_resilience(baseline, quad_base)
        quad_va = get_pairwise_resilience(quad_base, quad_voter_attack)
        quad_pa = get_pairwise_resilience(quad_base, quad_project_attack)

        # Mean Voting
        mean_base, _ = mean_voting(voter_data)
        mean_voter_attack, _ = mean_voting(voter_data, attack="voter_collusion")
        mean_project_attack, _ = mean_voting(voter_data, attack="project_collusion")
        mean_br = get_pairwise_resilience(baseline, mean_base)
        mean_va = get_pairwise_resilience(mean_base, mean_voter_attack)
        mean_pa = get_pairwise_resilience(mean_base, mean_project_attack)

        # Median Voting
        median_base, _ = median_voting(voter_data)
        median_voter_attack, _ = median_voting(voter_data, attack="voter_collusion")
        median_project_attack, _ = median_voting(voter_data, attack="project_collusion")
        median_br = get_pairwise_resilience(baseline, median_base)
        median_va = get_pairwise_resilience(median_base, median_voter_attack)
        median_pa = get_pairwise_resilience(median_base, median_project_attack)

        # Log Results
        results.append({
            'quad_br': quad_br,
            'quad_va': quad_va,
            'quad_pa': quad_pa,
            'mean_br': mean_br,
            'mean_va': mean_va,
            'mean_pa': mean_pa,
            'median_br': median_br,
            'median_va': median_va,
            'median_pa': median_pa
        })
    
    return pd.DataFrame(results)

def run_mean(n_times, n_voters, n_projects, d_pref="pareto", d_weight="constant"):
    results = []
    for i in range(n_times):
        voter_data = generate_data(n_voters, n_projects, d_pref, d_weight)
        baseline, _ = baseline_voting(voter_data)
        mean_base, _ = mean_voting(voter_data)
        mean_voter_attack, _ = mean_voting(voter_data, attack="voter_collusion")
        mean_project_attack, _ = mean_voting(voter_data, attack="project_collusion")
        # print(mean_base)
        # print(mean_voter_attack)
        # print(mean_project_attack)
        # Calculate resilience scores
        mean_br = get_pairwise_resilience(baseline, mean_base)
        mean_va = get_pairwise_resilience(mean_base, mean_voter_attack)
        mean_pa = get_pairwise_resilience(mean_base, mean_project_attack)

        # Rename and merge
        baseline.rename(columns={'votes': 'baseline_votes'}, inplace=True)
        mean_base.rename(columns={'votes': 'mean_base_votes'}, inplace=True)
        mean_voter_attack.rename(columns={'votes': 'mean_voter_attack_votes'}, inplace=True)
        mean_project_attack.rename(columns={'votes': 'mean_project_attack_votes'}, inplace=True)
        vote_sample_df = baseline.merge(mean_base, on='project_id')\
                            .merge(mean_voter_attack, on='project_id')\
                            .merge(mean_project_attack, on='project_id')
        print(vote_sample_df)
        vote_sample_df.to_csv("data/vote_sample_df.csv", index=False)
        results.append({'mean_br': mean_br, 'mean_va': mean_va, 'mean_pa': mean_pa})
    return pd.DataFrame(results)

def plot_results(results):
    # Visualize results using histograms
    # Create a 3x3 subplot grid for each voting mechanism
    fig, axes = plt.subplots(3, 3, figsize=(15, 15))
    fig.suptitle('Resilience Comparison Across Voting Mechanisms')
    
    # # Plot quadratic voting results (top row)
    # results['quad_br'].hist(ax=axes[0,0], bins=20)
    # axes[0,0].set_title('Quadratic Voting\nBaseline Resilience')
    # axes[0,0].set_xlabel('Resilience Score')
    # axes[0,0].set_ylabel('Count')
    
    # results['quad_va'].hist(ax=axes[0,1], bins=20)
    # axes[0,1].set_title('Quadratic Voting\nVoter Attack Resilience')
    # axes[0,1].set_xlabel('Resilience Score')
    
    # results['quad_pa'].hist(ax=axes[0,2], bins=20)
    # axes[0,2].set_title('Quadratic Voting\nProject Attack Resilience')
    # axes[0,2].set_xlabel('Resilience Score')
    
    # Plot mean voting results (middle row)
    results['mean_br'].hist(ax=axes[1,0], bins=20)
    axes[1,0].set_title('Mean Voting\nBaseline Resilience')
    axes[1,0].set_xlabel('Resilience Score')
    axes[1,0].set_ylabel('Count')
    
    results['mean_va'].hist(ax=axes[1,1], bins=20)
    axes[1,1].set_title('Mean Voting\nVoter Attack Resilience')
    axes[1,1].set_xlabel('Resilience Score')
    
    results['mean_pa'].hist(ax=axes[1,2], bins=20)
    axes[1,2].set_title('Mean Voting\nProject Attack Resilience')
    axes[1,2].set_xlabel('Resilience Score')
    
    # # Plot median voting results (bottom row)
    # results['median_br'].hist(ax=axes[2,0], bins=20)
    # axes[2,0].set_title('Median Voting\nBaseline Resilience')
    # axes[2,0].set_xlabel('Resilience Score')
    # axes[2,0].set_ylabel('Count')
    
    # results['median_va'].hist(ax=axes[2,1], bins=20)
    # axes[2,1].set_title('Median Voting\nVoter Attack Resilience')
    # axes[2,1].set_xlabel('Resilience Score')
    
    # results['median_pa'].hist(ax=axes[2,2], bins=20)
    # axes[2,2].set_title('Median Voting\nProject Attack Resilience')
    # axes[2,2].set_xlabel('Resilience Score')
    
    plt.tight_layout()
    plt.savefig('data/voting_mechanism_comparison.png')
    # plt.show()
    plt.close()

if __name__ == "__main__":
    # Set parameters
    repeat_n = 1000
    voter_n = 133
    project_n = 374
    # Time the run
    start_time = time.time()
    
    # results = run_simulation(repeat_n, voter_n, project_n)
    results = run_mean(repeat_n, voter_n, project_n)
    end_time = time.time()
    print(f"Time taken: {end_time - start_time} seconds")
    print(results)
    results.to_csv("data/results.csv", index=False)
    plot_results(results)