import pandas as pd
from voting_mechanisms import *
from gen_data import *
from eval_data import *


def run_quadratic_voting(n_voters, n_projects, d_pref, d_weight):
    # Test run attack and non-attack cases of quadratic voting
    voter_data = generate_data(n_voters, n_projects, d_pref, d_weight)
    baseline, _ = baseline_voting(voter_data)
    quad_base, _ = quadratic_voting(voter_data)
    quad_attack, _ = quadratic_voting(voter_data, attack="voter_collusion")
    attack_resilience = get_pairwise_resilience(quad_base, quad_attack)

    base_diff = get_pairwise_resilience(baseline, quad_base)
    attack_diff = get_pairwise_resilience(baseline, quad_attack)
    print(f"Base difference: {base_diff}")
    print(f"Attack difference: {attack_diff}")
    print(f"Attack resilience: {attack_resilience}")
    return attack_resilience

def run_baseline_voting(n_voters, n_projects, d_pref, d_weight):
    voter_data = generate_data(n_voters, n_projects, d_pref, d_weight)
    return baseline_voting(voter_data)

if __name__ == "__main__":
    run_quadratic_voting(100, 10, "pareto", "constant")