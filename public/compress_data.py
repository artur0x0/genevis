import pandas as pd
import numpy as np

def process_crispr_data(input_file, output_file):
    """
    Process CRISPR gene expression data by:
    1. Rounding numbers to 3 decimal points
    2. Replacing values > -1.15 with 0
    3. Converting remaining negative values to positive
    4. Removing columns that contain only zeros
    
    Parameters:
    input_file (str): Path to input CSV file
    output_file (str): Path to save processed data
    """

    # Read the CSV file
    # First column will be used as index since it contains cell line IDs
    df = pd.read_csv(input_file, index_col=0)
    
    # Round all numeric values to 3 decimal points
    df = df.round(3)

    '''
    First pass filtering was by <-1.15, as mentioned in DepMap forums
    This produced the following results (absolute values):
    -------------
    Descriptive Statistics (non-zero values only):
    Mean: 1.711
    Median: 1.59
    Standard Deviation: 0.475
    Variance: 0.226
    Value range: 0.000 to 5.783
    Final shape: 1150 rows and 3447 columns
    Number of non-zero values: 832292
    -------------
    Mean and meadian are close, meaning its likely a non-skewed normal distribution
    Given the size of the problem, we presumably want to start focus on at >1 sigma effects
    Hence, second pass filtering was by <-2.186
    '''
    
    # Replace values > -2.186 with 0
    df = df.where(df <= -2.186, 0)

    # Flip all number to positive
    df = df.abs()

    # Remove columns where all values are 0
    zero_cols = df.columns[df.sum() == 0]
    df = df.drop(columns=zero_cols)

    # Calculate statistics for non-zero values
    non_zero_values = df.values[df.values != 0]
    stats = {
        'Mean': np.mean(non_zero_values).round(3),
        'Median': np.median(non_zero_values).round(3),
        'Standard Deviation': np.std(non_zero_values).round(3),
        'Variance': np.var(non_zero_values).round(3)
    }
    
    # Save the processed data
    df.to_csv(output_file)
    
    # Print basic statistics
    print("\nData Processing Summary:")
    print(f"Initial shape: {df.shape[0]} rows and {len(zero_cols) + df.shape[1]} columns")
    print(f"Removed {len(zero_cols)} columns containing only zeros")
    print(f"Final shape: {df.shape[0]} rows and {df.shape[1]} columns")
    print(f"Number of non-zero values: {len(non_zero_values)}")
    print(f"Value range: {df.values.min():.3f} to {df.values.max():.3f}")
    
    print("\nDescriptive Statistics (non-zero values only):")
    for stat_name, value in stats.items():
        print(f"{stat_name}: {value}")
    
    print(f"\nOutput saved to: {output_file}")

    # Return statistics dictionary in case needed for further analysis
    return stats

# Usage:
if __name__ == "__main__":
    input_file = "CRISPRGeneEffect.csv"  # Replace with your input file path
    output_file = "depmap_data.csv"  # Replace with desired output path
    stats = process_crispr_data(input_file, output_file)