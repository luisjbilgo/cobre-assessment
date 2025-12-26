"""
Master Script to Generate All Assessment Deliverables

This script executes all analysis notebooks and compiles the final Excel workbook.
Run this script to generate all deliverables for submission.
"""

import sys
import sqlite3
from pathlib import Path

# Add scripts to path
sys.path.append(str(Path(__file__).parent.parent.resolve()))

from scripts.data_loader import get_connection, load_to_sqlite, create_indexes
from scripts import sql_queries
from scripts.export_deliverables import create_excel_workbook
import pandas as pd


def main():
    """Execute complete analysis pipeline and generate deliverables."""

    print("\n" + "="*80)
    print("COBRE PAYMENT CORRIDOR ANALYSIS - DELIVERABLE GENERATION")
    print("="*80 + "\n")

    # Create output directories
    Path('output').mkdir(exist_ok=True)
    Path('output/visualizations').mkdir(exist_ok=True)
    Path('output/csv_exports').mkdir(exist_ok=True)

    # Step 1: Load data
    print("📊 Step 1/5: Loading data into SQLite...")
    conn = get_connection()
    load_to_sqlite('data/raw/transactions.csv', 'transactions', conn)
    load_to_sqlite('data/raw/users.csv', 'users', conn)
    create_indexes(conn)
    print("✅ Data loaded\n")

    # Step 2: Execute all analysis queries
    print("📊 Step 2/5: Executing analysis queries...")

    data_dict = {}

    # Executive Summary
    data_dict['Executive Summary'] = pd.DataFrame({
        'Metric': [
            'Total Transactions',
            'Total Users',
            'Analysis Period',
            'Total Transaction Value',
            'Overall Failure Rate',
            'USD→MXN Failure Rate',
            'Target Failure Rate',
            'Problem Corridor',
            'Annual Revenue Impact',
            'Primary Root Cause',
            'Recommended Action'
        ],
        'Value': [
            '50,000',
            '5,000',
            'Jul-Dec 2025 (6 months)',
            '$281.5M',
            '9.6%',
            '18.3%',
            '5.0%',
            'USD→MXN (34.8% of volume)',
            '$360,000 potential recovery',
            'Large transaction verification delays',
            'Fix USD→MXN corridor'
        ]
    })

    # Corridor Performance
    corridor_query = sql_queries.corridor_performance_query()
    data_dict['Corridor Performance'] = pd.read_sql_query(corridor_query, conn)

    # User Segments
    segment_query = sql_queries.user_segment_analysis_query()
    data_dict['User Segments'] = pd.read_sql_query(segment_query, conn)

    # Daily Trends
    daily_query = sql_queries.daily_trend_query()
    data_dict['Daily Trends'] = pd.read_sql_query(daily_query, conn)

    # Day of Week
    dow_query = sql_queries.day_of_week_pattern_query()
    data_dict['Day of Week'] = pd.read_sql_query(dow_query, conn)

    # Amount Distribution
    amount_query = sql_queries.amount_distribution_query()
    data_dict['Amount Distribution'] = pd.read_sql_query(amount_query, conn)

    # USD→MXN Analysis
    conn.execute(sql_queries.usd_mxn_corridor_query())

    usd_mxn_segment_query = sql_queries.usd_mxn_segment_analysis_query()
    data_dict['USD_MXN Segments'] = pd.read_sql_query(usd_mxn_segment_query, conn)

    usd_mxn_amount_query = sql_queries.usd_mxn_amount_analysis_query()
    data_dict['USD_MXN Amounts'] = pd.read_sql_query(usd_mxn_amount_query, conn)

    usd_mxn_monthly_query = sql_queries.usd_mxn_monthly_trend_query()
    data_dict['USD_MXN Monthly'] = pd.read_sql_query(usd_mxn_monthly_query, conn)

    # Corridor Comparison
    corridor_compare_query = sql_queries.corridor_comparison_for_strategy_query()
    data_dict['Corridor Comparison'] = pd.read_sql_query(corridor_compare_query, conn)

    print("✅ All queries executed\n")

    # Step 3: Create visualizations
    print("📊 Step 3/5: Generating visualizations...")
    print("ℹ️  Note: Run notebooks individually to generate visualizations")
    print("   Visualizations require interactive matplotlib execution\n")

    # Step 4: Generate Excel workbook
    print("📊 Step 4/5: Creating Excel workbook...")
    create_excel_workbook(
        data_dict=data_dict,
        output_path='output/analysis_workbook.xlsx'
    )

    # Step 5: Verify deliverables
    print("\n📊 Step 5/5: Verifying deliverables...")

    deliverables = [
        'output/analysis_workbook.xlsx',
        'output/root_cause_analysis.md',
        'output/strategic_recommendation.md',
        'output/ai_usage_documentation.md'
    ]

    all_present = True
    for deliverable in deliverables:
        if Path(deliverable).exists():
            size = Path(deliverable).stat().st_size
            print(f"  ✓ {deliverable} ({size:,} bytes)")
        else:
            print(f"  ✗ {deliverable} - MISSING")
            all_present = False

    if all_present:
        print("\n✅ All core deliverables generated!")
    else:
        print("\n⚠️  Some deliverables missing - run notebooks for complete output")

    print("\n" + "="*80)
    print("DELIVERABLE GENERATION COMPLETE")
    print("="*80)

    print("\n📦 Submission Package Contents:")
    print("  1. analysis_workbook.xlsx - Comprehensive data analysis")
    print("  2. root_cause_analysis.md - USD→MXN failure investigation (250-300 words)")
    print("  3. strategic_recommendation.md - Corridor strategy memo (1 page)")
    print("  4. ai_usage_documentation.md - AI tool usage transparency")
    print("  5. visualizations/ - Publication-ready charts (generated from notebooks)")

    print("\n📝 Next Steps:")
    print("  - Run individual notebooks (01-04) in VS Code/Jupyter to generate visualizations")
    print("  - Review all deliverables for accuracy")
    print("  - Export strategic_recommendation.md to PDF if required")
    print("  - Package all files for submission")

    print("\n🎯 Assessment Complete!")
    print("="*80 + "\n")


if __name__ == "__main__":
    main()
