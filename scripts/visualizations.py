"""
Visualization Utilities for Cobre Payment Corridor Analysis

Functions for creating publication-ready charts and exporting visualizations.
"""

import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
import numpy as np
from pathlib import Path
from typing import Optional, Tuple


# Set default style
sns.set_style("whitegrid")
plt.rcParams['figure.dpi'] = 100
plt.rcParams['savefig.dpi'] = 300
plt.rcParams['font.size'] = 10
plt.rcParams['axes.labelsize'] = 11
plt.rcParams['axes.titlesize'] = 13
plt.rcParams['xtick.labelsize'] = 9
plt.rcParams['ytick.labelsize'] = 9
plt.rcParams['legend.fontsize'] = 9


def create_corridor_volume_comparison(
    df: pd.DataFrame,
    output_path: str = 'output/visualizations/corridor_volume_comparison.png'
) -> plt.Figure:
    """
    Create horizontal bar chart comparing corridor transaction volumes.

    Args:
        df: DataFrame with columns: corridor, total_transactions, failure_rate
        output_path: Path to save the chart

    Returns:
        matplotlib Figure object
    """
    fig, ax = plt.subplots(figsize=(12, 6))

    # Sort by volume
    df_sorted = df.sort_values('total_transactions', ascending=True)

    # Color USD_MXN differently to highlight the problem corridor
    colors = ['#E74C3C' if 'USD_MXN' in corridor else '#3498DB'
              for corridor in df_sorted['corridor']]

    # Create horizontal bar chart
    bars = ax.barh(df_sorted['corridor'], df_sorted['total_transactions'], color=colors)

    # Add value labels
    for i, (corridor, value) in enumerate(zip(df_sorted['corridor'], df_sorted['total_transactions'])):
        ax.text(value + 200, i, f'{int(value):,}', va='center', fontsize=10)

    ax.set_xlabel('Transaction Volume', fontweight='bold')
    ax.set_title('Payment Corridors by Transaction Volume (Jul-Dec 2025)',
                 fontweight='bold', pad=20)
    ax.set_xlim(0, df_sorted['total_transactions'].max() * 1.15)

    # Add note about USD_MXN
    if 'USD_MXN' in df_sorted['corridor'].values:
        ax.text(0.98, 0.02, 'Red: USD→MXN (Problem Corridor)',
                transform=ax.transAxes, ha='right', va='bottom',
                fontsize=9, style='italic', color='#E74C3C')

    plt.tight_layout()
    export_chart(fig, output_path)
    return fig


def create_corridor_failure_rates(
    df: pd.DataFrame,
    output_path: str = 'output/visualizations/corridor_failure_rates.png'
) -> plt.Figure:
    """
    Create bar chart comparing failure rates across corridors.

    Args:
        df: DataFrame with columns: corridor, failure_rate
        output_path: Path to save the chart

    Returns:
        matplotlib Figure object
    """
    fig, ax = plt.subplots(figsize=(12, 6))

    # Sort by failure rate
    df_sorted = df.sort_values('failure_rate', ascending=False)

    # Color code: red for >10%, yellow for 5-10%, green for <5%
    colors = []
    for rate in df_sorted['failure_rate']:
        if rate >= 10:
            colors.append('#E74C3C')  # Red
        elif rate >= 5:
            colors.append('#F39C12')  # Orange/Yellow
        else:
            colors.append('#2ECC71')  # Green

    bars = ax.bar(range(len(df_sorted)), df_sorted['failure_rate'], color=colors)

    # Customize x-axis
    ax.set_xticks(range(len(df_sorted)))
    ax.set_xticklabels(df_sorted['corridor'], rotation=0)
    ax.set_ylabel('Failure Rate (%)', fontweight='bold')
    ax.set_title('Payment Corridor Failure Rates (Jul-Dec 2025)',
                 fontweight='bold', pad=20)

    # Add 5% baseline line
    ax.axhline(y=5, color='gray', linestyle='--', linewidth=1, alpha=0.7, label='5% Target')

    # Add value labels on bars
    for i, (bar, value) in enumerate(zip(bars, df_sorted['failure_rate'])):
        height = bar.get_height()
        ax.text(bar.get_x() + bar.get_width()/2., height + 0.3,
                f'{value:.1f}%', ha='center', va='bottom', fontsize=10, fontweight='bold')

    ax.legend(loc='upper right')
    ax.set_ylim(0, df_sorted['failure_rate'].max() * 1.2)

    plt.tight_layout()
    export_chart(fig, output_path)
    return fig


def create_segment_performance(
    df: pd.DataFrame,
    output_path: str = 'output/visualizations/segment_performance.png'
) -> plt.Figure:
    """
    Create grouped bar chart for user segment performance metrics.

    Args:
        df: DataFrame with columns: user_segment, failure_rate, avg_txns_per_user, avg_amount
        output_path: Path to save the chart

    Returns:
        matplotlib Figure object
    """
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))

    # Chart 1: Failure rate by segment
    segments = df['user_segment'].values
    failure_rates = df['failure_rate'].values

    colors = {'enterprise': '#E74C3C', 'sme': '#F39C12', 'retail': '#3498DB'}
    bar_colors = [colors.get(seg, '#95A5A6') for seg in segments]

    bars1 = ax1.bar(segments, failure_rates, color=bar_colors)
    ax1.set_ylabel('Failure Rate (%)', fontweight='bold')
    ax1.set_title('Failure Rate by User Segment', fontweight='bold', pad=15)
    ax1.axhline(y=5, color='gray', linestyle='--', linewidth=1, alpha=0.7, label='5% Target')

    for bar, value in zip(bars1, failure_rates):
        height = bar.get_height()
        ax1.text(bar.get_x() + bar.get_width()/2., height + 0.2,
                f'{value:.1f}%', ha='center', va='bottom', fontsize=10, fontweight='bold')

    ax1.legend(loc='upper right')
    ax1.set_ylim(0, max(failure_rates) * 1.3)

    # Chart 2: Average transaction amount by segment
    avg_amounts = df['avg_amount'].values

    bars2 = ax2.bar(segments, avg_amounts, color=bar_colors)
    ax2.set_ylabel('Average Amount (USD)', fontweight='bold')
    ax2.set_title('Avg Transaction Amount by Segment', fontweight='bold', pad=15)

    for bar, value in zip(bars2, avg_amounts):
        height = bar.get_height()
        ax2.text(bar.get_x() + bar.get_width()/2., height + 100,
                f'${value:,.0f}', ha='center', va='bottom', fontsize=10, fontweight='bold')

    ax2.set_ylim(0, max(avg_amounts) * 1.25)

    plt.suptitle('User Segment Performance Analysis', fontsize=15, fontweight='bold', y=1.02)
    plt.tight_layout()
    export_chart(fig, output_path)
    return fig


def create_daily_trend(
    df: pd.DataFrame,
    output_path: str = 'output/visualizations/daily_trend.png'
) -> plt.Figure:
    """
    Create line chart showing daily transaction volume trend.

    Args:
        df: DataFrame with columns: transaction_date, txn_count, failure_rate
        output_path: Path to save the chart

    Returns:
        matplotlib Figure object
    """
    fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(14, 8), sharex=True)

    # Convert date to datetime
    df['transaction_date'] = pd.to_datetime(df['transaction_date'])
    df = df.sort_values('transaction_date')

    # Chart 1: Transaction volume
    ax1.plot(df['transaction_date'], df['txn_count'], color='#3498DB', linewidth=2)
    ax1.fill_between(df['transaction_date'], df['txn_count'], alpha=0.3, color='#3498DB')
    ax1.set_ylabel('Transaction Count', fontweight='bold')
    ax1.set_title('Daily Transaction Volume (Jul-Dec 2025)', fontweight='bold', pad=15)
    ax1.grid(True, alpha=0.3)

    # Chart 2: Failure rate
    ax2.plot(df['transaction_date'], df['failure_rate'], color='#E74C3C', linewidth=2)
    ax2.axhline(y=5, color='gray', linestyle='--', linewidth=1, alpha=0.7, label='5% Target')
    ax2.set_ylabel('Failure Rate (%)', fontweight='bold')
    ax2.set_xlabel('Date', fontweight='bold')
    ax2.set_title('Daily Failure Rate Trend', fontweight='bold', pad=15)
    ax2.legend(loc='upper right')
    ax2.grid(True, alpha=0.3)

    plt.tight_layout()
    export_chart(fig, output_path)
    return fig


def create_day_of_week_pattern(
    df: pd.DataFrame,
    output_path: str = 'output/visualizations/day_of_week_pattern.png'
) -> plt.Figure:
    """
    Create bar chart showing day-of-week transaction patterns.

    Args:
        df: DataFrame with columns: day_of_week, txn_count, failure_rate
        output_path: Path to save the chart

    Returns:
        matplotlib Figure object
    """
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))

    # Ensure correct day order
    day_order = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    df['day_of_week'] = pd.Categorical(df['day_of_week'], categories=day_order, ordered=True)
    df = df.sort_values('day_of_week')

    # Chart 1: Transaction volume by day
    ax1.bar(df['day_of_week'], df['txn_count'], color='#3498DB')
    ax1.set_ylabel('Transaction Count', fontweight='bold')
    ax1.set_title('Transaction Volume by Day of Week', fontweight='bold', pad=15)
    ax1.tick_params(axis='x', rotation=45)

    for i, (day, count) in enumerate(zip(df['day_of_week'], df['txn_count'])):
        ax1.text(i, count + 50, f'{int(count):,}', ha='center', va='bottom', fontsize=9)

    # Chart 2: Failure rate by day
    ax2.bar(df['day_of_week'], df['failure_rate'], color='#E74C3C')
    ax2.axhline(y=5, color='gray', linestyle='--', linewidth=1, alpha=0.7, label='5% Target')
    ax2.set_ylabel('Failure Rate (%)', fontweight='bold')
    ax2.set_title('Failure Rate by Day of Week', fontweight='bold', pad=15)
    ax2.tick_params(axis='x', rotation=45)
    ax2.legend(loc='upper right')

    for i, (day, rate) in enumerate(zip(df['day_of_week'], df['failure_rate'])):
        ax2.text(i, rate + 0.2, f'{rate:.1f}%', ha='center', va='bottom', fontsize=9)

    plt.suptitle('Day-of-Week Transaction Patterns', fontsize=15, fontweight='bold', y=1.00)
    plt.tight_layout()
    export_chart(fig, output_path)
    return fig


def create_amount_distribution(
    df: pd.DataFrame,
    output_path: str = 'output/visualizations/amount_distribution.png'
) -> plt.Figure:
    """
    Create histogram showing transaction amount distribution with failure rate overlay.

    Args:
        df: DataFrame with columns: amount_bracket, txn_count, failure_rate
        output_path: Path to save the chart

    Returns:
        matplotlib Figure object
    """
    fig, ax1 = plt.subplots(figsize=(12, 6))

    # Bar chart for transaction count
    x_pos = range(len(df))
    bars = ax1.bar(x_pos, df['txn_count'], color='#3498DB', alpha=0.7, label='Transaction Count')
    ax1.set_ylabel('Transaction Count', fontweight='bold', color='#3498DB')
    ax1.tick_params(axis='y', labelcolor='#3498DB')
    ax1.set_xticks(x_pos)
    ax1.set_xticklabels(df['amount_bracket'])
    ax1.set_xlabel('Transaction Amount Bracket', fontweight='bold')

    # Add value labels on bars
    for bar, value in zip(bars, df['txn_count']):
        height = bar.get_height()
        ax1.text(bar.get_x() + bar.get_width()/2., height + 100,
                f'{int(value):,}', ha='center', va='bottom', fontsize=9)

    # Line chart for failure rate (secondary y-axis)
    ax2 = ax1.twinx()
    line = ax2.plot(x_pos, df['failure_rate'], color='#E74C3C', marker='o',
                    linewidth=2, markersize=8, label='Failure Rate')
    ax2.set_ylabel('Failure Rate (%)', fontweight='bold', color='#E74C3C')
    ax2.tick_params(axis='y', labelcolor='#E74C3C')
    ax2.axhline(y=5, color='gray', linestyle='--', linewidth=1, alpha=0.5)

    # Add failure rate labels
    for i, rate in enumerate(df['failure_rate']):
        ax2.text(i, rate + 0.5, f'{rate:.1f}%', ha='center', va='bottom',
                fontsize=9, color='#E74C3C', fontweight='bold')

    plt.title('Transaction Amount Distribution & Failure Rate', fontweight='bold', pad=20)

    # Combine legends
    lines1, labels1 = ax1.get_legend_handles_labels()
    lines2, labels2 = ax2.get_legend_handles_labels()
    ax1.legend(lines1 + lines2, labels1 + labels2, loc='upper right')

    plt.tight_layout()
    export_chart(fig, output_path)
    return fig


def create_usd_mxn_analysis_chart(
    segment_df: pd.DataFrame,
    amount_df: pd.DataFrame,
    output_path: str = 'output/visualizations/usd_mxn_failure_analysis.png'
) -> plt.Figure:
    """
    Create comprehensive USD→MXN failure analysis chart.

    Args:
        segment_df: DataFrame with segment analysis
        amount_df: DataFrame with amount bracket analysis
        output_path: Path to save the chart

    Returns:
        matplotlib Figure object
    """
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))

    # Chart 1: Failure rate by segment
    segments = segment_df['user_segment'].values
    failure_rates = segment_df['failure_rate'].values

    colors = {'enterprise': '#E74C3C', 'sme': '#F39C12', 'retail': '#3498DB'}
    bar_colors = [colors.get(seg, '#95A5A6') for seg in segments]

    bars1 = ax1.bar(segments, failure_rates, color=bar_colors)
    ax1.axhline(y=18.3, color='#E74C3C', linestyle='--', linewidth=1.5,
                alpha=0.7, label='USD→MXN Avg (18.3%)')
    ax1.axhline(y=5, color='gray', linestyle='--', linewidth=1, alpha=0.5, label='Target (5%)')
    ax1.set_ylabel('Failure Rate (%)', fontweight='bold')
    ax1.set_title('USD→MXN: Failure Rate by Segment', fontweight='bold', pad=15)
    ax1.legend(loc='upper right')

    for bar, value in zip(bars1, failure_rates):
        height = bar.get_height()
        ax1.text(bar.get_x() + bar.get_width()/2., height + 0.5,
                f'{value:.1f}%', ha='center', va='bottom', fontsize=11, fontweight='bold')

    ax1.set_ylim(0, max(failure_rates) * 1.3)

    # Chart 2: Failure rate by amount bracket
    brackets = amount_df['amount_bracket'].values
    amount_failure_rates = amount_df['failure_rate'].values

    bars2 = ax2.bar(range(len(brackets)), amount_failure_rates, color='#E74C3C', alpha=0.8)
    ax2.axhline(y=18.3, color='#E74C3C', linestyle='--', linewidth=1.5,
                alpha=0.7, label='USD→MXN Avg (18.3%)')
    ax2.axhline(y=5, color='gray', linestyle='--', linewidth=1, alpha=0.5, label='Target (5%)')
    ax2.set_xticks(range(len(brackets)))
    ax2.set_xticklabels(brackets)
    ax2.set_ylabel('Failure Rate (%)', fontweight='bold')
    ax2.set_title('USD→MXN: Failure Rate by Amount', fontweight='bold', pad=15)
    ax2.legend(loc='upper left')

    for bar, value in zip(bars2, amount_failure_rates):
        height = bar.get_height()
        ax2.text(bar.get_x() + bar.get_width()/2., height + 0.5,
                f'{value:.1f}%', ha='center', va='bottom', fontsize=11, fontweight='bold')

    ax2.set_ylim(0, max(amount_failure_rates) * 1.3)

    plt.suptitle('USD→MXN Corridor: Root Cause Analysis', fontsize=16, fontweight='bold', y=1.02)
    plt.tight_layout()
    export_chart(fig, output_path)
    return fig


def export_chart(fig: plt.Figure, output_path: str, dpi: int = 300) -> None:
    """
    Export chart to file with proper quality settings.

    Args:
        fig: Matplotlib figure object
        output_path: Path to save the chart
        dpi: Dots per inch for export quality
    """
    # Ensure output directory exists
    Path(output_path).parent.mkdir(parents=True, exist_ok=True)

    # Save with high quality
    fig.savefig(output_path, dpi=dpi, bbox_inches='tight', facecolor='white')
    print(f"✅ Chart exported: {output_path}")
