import numpy as np
import pandas as pd

def get_pairwise_score(results1: pd.DataFrame, results2: pd.DataFrame, metric='pms') -> float:
    """
    Resilience score between two voting results, defined as normalized squared difference between the two results.
    Because we evaluate against different mechanisms, we normalize by the sum of the squares of the first result.
    
    Args:
        results1: DataFrame with columns ['project_id', 'votes'] for first mechanism
        results2: DataFrame with columns ['project_id', 'votes'] for second mechanism
    
    Returns:
        float: Percentage difference score
    """
    # Convert votes to percentages
    total_votes1 = results1['votes'].sum()
    total_votes2 = results2['votes'].sum()
    
    if total_votes1 == 0 or total_votes2 == 0:
        return 0.0
        
    votes1_pct = results1['votes'] / total_votes1 * 100
    votes2_pct = results2['votes'] / total_votes2 * 100
    
    # Calculate squared differences
    squared_diffs = np.power(votes1_pct - votes2_pct, 2)
    
    if metric.lower() == 'mse':
        # Mean Squared Error
        return np.mean(squared_diffs)
    
    elif metric.lower() == 'pms':
        squared_diff_sum = np.sum(squared_diffs)
        squared_original_sum = np.sum(np.power(votes1_pct, 2))
        
        if squared_original_sum == 0:
            return 0.0
        
        return (squared_diff_sum / squared_original_sum) * 100
    else:
        raise ValueError(f"Invalid metric: {metric}")