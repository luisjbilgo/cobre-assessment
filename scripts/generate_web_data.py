import json
import sqlite3
import pandas as pd
from pathlib import Path
from data_loader import load_to_sqlite, create_indexes
from sql_queries import (
    corridor_performance_query,
    user_segment_analysis_query,
    daily_trend_query,
    amount_distribution_query,
    usd_mxn_corridor_query,
    usd_mxn_segment_analysis_query,
    usd_mxn_amount_analysis_query
)

def get_db_connection(db_path: str) -> sqlite3.Connection:
    conn = sqlite3.connect(db_path)
    return conn

def run_query_to_json(conn, query, output_path):
    df = pd.read_sql_query(query, conn)
    # Convert dates to string if needed, mostly handled by pandas to_json
    df.to_json(output_path, orient='records')
    print(f"Saved {output_path}")

def generate_web_data():
    # Paths
    db_path = 'web/public/assessment.db' # Use the public one directly
    public_data_path = Path('web/public/data')
    public_data_path.mkdir(parents=True, exist_ok=True)
    
    # Connect to file DB
    conn = get_db_connection(db_path)
    
    # Check if tables exist, if not load them (first run)
    try:
        conn.execute("SELECT 1 FROM transactions LIMIT 1")
    except sqlite3.OperationalError:
        print("Loading raw data into DB...")
        load_to_sqlite('data/raw/transactions.csv', 'transactions', conn)
        load_to_sqlite('data/raw/users.csv', 'users', conn)
        create_indexes(conn)
    
    # Generate JSONs
    print("Generating JSONs...")
    
    # 1. Corridor Performance (Global)
    run_query_to_json(conn, corridor_performance_query(), public_data_path / 'corridor_performance.json')
    
    # 2. User Segments (Global)
    run_query_to_json(conn, user_segment_analysis_query(), public_data_path / 'user_segments.json')
    
    # 3. Daily Trend (Global)
    run_query_to_json(conn, daily_trend_query(), public_data_path / 'daily_trend.json')

    # 4. Amount Distribution (Global) - NEW
    run_query_to_json(conn, amount_distribution_query(), public_data_path / 'amount_distribution.json')
    
    # 5. USD->MXN Specifics
    # Create temp table first
    conn.execute(usd_mxn_corridor_query())
    
    # Run sub-analyses
    usd_mxn_segments = pd.read_sql_query(usd_mxn_segment_analysis_query(), conn)
    usd_mxn_amounts = pd.read_sql_query(usd_mxn_amount_analysis_query(), conn)
    
    # Combine into one structure for the RCA chart
    rca_data = {
        'segments': usd_mxn_segments.to_dict(orient='records'),
        'amounts': usd_mxn_amounts.to_dict(orient='records')
    }
    
    with open(public_data_path / 'usd_mxn_rca.json', 'w') as f:
        json.dump(rca_data, f)
    print(f"Saved {public_data_path / 'usd_mxn_rca.json'}")

    conn.close()
    print("Done!")

if __name__ == "__main__":
    generate_web_data()
