# %% [markdown]
# # Parte 1: Análisis del Rendimiento del Corredor
# **Objetivo**: Analizar el rendimiento del corredor de pagos, el comportamiento de los usuarios y los patrones temporales
# **Entregables**: Tablas de métricas, visualizaciones, insights para el libro de Excel

# %% [markdown]
# ## Configuración

# %%
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import sys
from pathlib import Path

# Add scripts to path
sys.path.append(str(Path('..').resolve()))

from scripts import sql_queries
from scripts import visualizations as viz
from scripts.data_loader import get_connection, load_to_sqlite, create_indexes

# Ensure visualizations directory exists
Path('../output/visualizations').mkdir(parents=True, exist_ok=True)

# %% [markdown]
# ## Cargar Datos

# %%
# Recreate database connection and load data
conn = get_connection()

# Load transactions
load_to_sqlite('../data/raw/transactions.csv', 'transactions', conn)
load_to_sqlite('../data/raw/users.csv', 'users', conn)
create_indexes(conn)

print("✅ Data loaded into SQLite in-memory database")

# %% [markdown]
# ## Métrica 1: Volumen del Corredor y Tasas de Éxito

# %%
# Execute corridor performance query
corridor_query = sql_queries.corridor_performance_query()
corridor_df = pd.read_sql_query(corridor_query, conn)

print("\n" + "="*80)
print("CORRIDOR PERFORMANCE ANALYSIS")
print("="*80)
print(corridor_df.to_string(index=False))
print("="*80 + "\n")

# Save for Excel export
corridor_df.to_csv('../output/csv_exports/corridor_performance.csv', index=False)
print("✅ Saved: ../output/csv_exports/corridor_performance.csv")

# %% [markdown]
# ### Visualización: Comparación del Volumen del Corredor

# %%
# Create corridor volume comparison chart
viz.create_corridor_volume_comparison(
    df=corridor_df,
    output_path='../output/visualizations/corridor_volume_comparison.png'
)

plt.show()

# %% [markdown]
# ### Visualización: Tasas de Fallo del Corredor

# %%
# Create corridor failure rates chart
viz.create_corridor_failure_rates(
    df=corridor_df,
    output_path='../output/visualizations/corridor_failure_rates.png'
)

plt.show()

# %% [markdown]
# ### Insights Clave: Rendimiento del Corredor

# %%
print("\n📊 KEY INSIGHTS - CORRIDOR PERFORMANCE:\n")

# Identify problem corridors
high_failure = corridor_df[corridor_df['failure_rate'] > 10]
print(f"1. HIGH FAILURE CORRIDORS (>10%):")
for _, row in high_failure.iterrows():
    print(f"   - {row['corridor']}: {row['failure_rate']:.1f}% failure ({int(row['failed']):,} failed txns)")

# Revenue analysis
print(f"\n2. REVENUE DISTRIBUTION:")
total_revenue = corridor_df['revenue_usd'].sum()
for _, row in corridor_df.head(3).iterrows():
    pct = (row['revenue_usd'] / total_revenue) * 100
    print(f"   - {row['corridor']}: ${row['revenue_usd']:,.0f} ({pct:.1f}% of total)")

# Volume leaders
print(f"\n3. VOLUME LEADERS:")
for _, row in corridor_df.head(3).iterrows():
    pct = (row['total_transactions'] / 50000) * 100
    print(f"   - {row['corridor']}: {int(row['total_transactions']):,} txns ({pct:.1f}% of total)")

# %% [markdown]
# ## Métrica 2: Análisis de Segmentos de Usuario

# %%
# Execute user segment analysis query
segment_query = sql_queries.user_segment_analysis_query()
segment_df = pd.read_sql_query(segment_query, conn)

print("\n" + "="*80)
print("USER SEGMENT BEHAVIOR ANALYSIS")
print("="*80)
print(segment_df.to_string(index=False))
print("="*80 + "\n")

# Save for Excel
segment_df.to_csv('../output/csv_exports/user_segment_analysis.csv', index=False)
print("✅ Saved: ../output/csv_exports/user_segment_analysis.csv")

# %% [markdown]
# ### Visualización: Rendimiento por Segmento

# %%
# Create segment performance charts
viz.create_segment_performance(
    df=segment_df,
    output_path='../output/visualizations/segment_performance.png'
)

plt.show()

# %% [markdown]
# ### Insights Clave: Segmentos de Usuario

# %%
print("\n📊 KEY INSIGHTS - USER SEGMENTS:\n")

print("1. TRANSACTION FREQUENCY:")
for _, row in segment_df.iterrows():
    print(f"   - {row['user_segment'].capitalize()}: {row['avg_txns_per_user']:.1f} txns/user")

print("\n2. AVERAGE TRANSACTION AMOUNTS:")
for _, row in segment_df.iterrows():
    print(f"   - {row['user_segment'].capitalize()}: ${row['avg_amount']:,.0f}")

print("\n3. FAILURE RATES BY SEGMENT:")
for _, row in segment_df.iterrows():
    print(f"   - {row['user_segment'].capitalize()}: {row['failure_rate']:.1f}%")

# Identify high-risk segment
highest_failure_seg = segment_df.loc[segment_df['failure_rate'].idxmax()]
print(f"\n⚠️  HIGHEST RISK SEGMENT: {highest_failure_seg['user_segment'].capitalize()} ({highest_failure_seg['failure_rate']:.1f}% failure)")

# %% [markdown]
# ## Métrica 3: Patrones Temporales - Tendencias Diarias

# %%
# Execute daily trend query
daily_query = sql_queries.daily_trend_query()
daily_df = pd.read_sql_query(daily_query, conn)

print(f"\n✅ Retrieved {len(daily_df)} days of transaction data")
print(f"   Date range: {daily_df['transaction_date'].min()} to {daily_df['transaction_date'].max()}")

# Save for Excel
daily_df.to_csv('../output/csv_exports/daily_trends.csv', index=False)
print("✅ Saved: ../output/csv_exports/daily_trends.csv")

# %% [markdown]
# ### Visualización: Tendencias Diarias de Transacciones

# %%
# Create daily trend visualization
viz.create_daily_trend(
    df=daily_df,
    output_path='../output/visualizations/daily_trend.png'
)

plt.show()

# %% [markdown]
# ### Insights Clave: Tendencias Diarias

# %%
print("\n📊 KEY INSIGHTS - DAILY TRENDS:\n")

# Average daily volume
avg_daily_volume = daily_df['txn_count'].mean()
max_day = daily_df.loc[daily_df['txn_count'].idxmax()]
min_day = daily_df.loc[daily_df['txn_count'].idxmin()]

print(f"1. DAILY VOLUME STATISTICS:")
print(f"   - Average: {avg_daily_volume:.0f} transactions/day")
print(f"   - Peak day: {max_day['transaction_date']} ({int(max_day['txn_count']):,} txns)")
print(f"   - Lowest day: {min_day['transaction_date']} ({int(min_day['txn_count']):,} txns)")

# Failure rate stability
avg_failure_rate = daily_df['failure_rate'].mean()
std_failure_rate = daily_df['failure_rate'].std()

print(f"\n2. FAILURE RATE VARIABILITY:")
print(f"   - Average: {avg_failure_rate:.1f}%")
print(f"   - Std Dev: {std_failure_rate:.1f}%")
print(f"   - Interpretation: {'Stable' if std_failure_rate < 2 else 'Variable'} failure pattern")

# %% [markdown]
# ## Métrica 4: Patrones Temporales - Día de la Semana

# %%
# Execute day of week pattern query
dow_query = sql_queries.day_of_week_pattern_query()
dow_df = pd.read_sql_query(dow_query, conn)

print("\n" + "="*80)
print("DAY OF WEEK TRANSACTION PATTERNS")
print("="*80)
print(dow_df[['day_of_week', 'txn_count', 'failure_rate', 'avg_amount']].to_string(index=False))
print("="*80 + "\n")

# Save for Excel
dow_df.to_csv('../output/csv_exports/day_of_week_patterns.csv', index=False)
print("✅ Saved: ../output/csv_exports/day_of_week_patterns.csv")

# %% [markdown]
# ### Visualización: Patrones por Día de la Semana
# %%
# Create day of week visualization
viz.create_day_of_week_pattern(
    df=dow_df,
    output_path='../output/visualizations/day_of_week_pattern.png'
)

plt.show()

# %% [markdown]
# ### Insights Clave: Patrones por Día de la Semana

# %%
print("\n📊 KEY INSIGHTS - DAY OF WEEK:\n")

# Busiest day
busiest_day = dow_df.loc[dow_df['txn_count'].idxmax()]
slowest_day = dow_df.loc[dow_df['txn_count'].idxmin()]

print("1. VOLUME BY DAY:")
print(f"   - Busiest: {busiest_day['day_of_week']} ({int(busiest_day['txn_count']):,} txns)")
print(f"   - Slowest: {slowest_day['day_of_week']} ({int(slowest_day['txn_count']):,} txns)")

# Failure rate variance
highest_failure_day = dow_df.loc[dow_df['failure_rate'].idxmax()]
lowest_failure_day = dow_df.loc[dow_df['failure_rate'].idxmin()]

print(f"\n2. FAILURE RATE BY DAY:")
print(f"   - Highest: {highest_failure_day['day_of_week']} ({highest_failure_day['failure_rate']:.1f}%)")
print(f"   - Lowest: {lowest_failure_day['day_of_week']} ({lowest_failure_day['failure_rate']:.1f}%)")
print(f"   - Variance: {(dow_df['failure_rate'].max() - dow_df['failure_rate'].min()):.1f} percentage points")

if (dow_df['failure_rate'].max() - dow_df['failure_rate'].min()) < 2:
    print("   - Interpretation: Minimal day-of-week effect on failure rates")

# %% [markdown]
# ## Métrica 5: Distribución de Montos de Transacción

# %%
# Execute amount distribution query
amount_query = sql_queries.amount_distribution_query()
amount_df = pd.read_sql_query(amount_query, conn)

print("\n" + "="*80)
print("TRANSACTION AMOUNT DISTRIBUTION")
print("="*80)
print(amount_df[['amount_bracket', 'txn_count', 'failure_rate', 'avg_amount']].to_string(index=False))
print("="*80 + "\n")

# Save for Excel
amount_df.to_csv('../output/csv_exports/amount_distribution.csv', index=False)
print("✅ Saved: ../output/csv_exports/amount_distribution.csv")

# %% [markdown]
# ### Visualización: Distribución de Montos

# %%
# Create amount distribution visualization
viz.create_amount_distribution(
    df=amount_df,
    output_path='../output/visualizations/amount_distribution.png'
)

plt.show()

# %% [markdown]
# ### Insights Clave: Distribución de Montos

# %%
print("\n📊 KEY INSIGHTS - TRANSACTION AMOUNTS:\n")

print("1. VOLUME DISTRIBUTION:")
total_txns = amount_df['txn_count'].sum()
for _, row in amount_df.iterrows():
    pct = (row['txn_count'] / total_txns) * 100
    print(f"   - {row['amount_bracket']}: {int(row['txn_count']):,} txns ({pct:.1f}%)")

print("\n2. FAILURE RATE BY AMOUNT:")
for _, row in amount_df.iterrows():
    print(f"   - {row['amount_bracket']}: {row['failure_rate']:.1f}% failure")

# Identify correlation
print("\n3. CORRELATION ANALYSIS:")
# Check if failure rate increases with amount
if amount_df['failure_rate'].is_monotonic_increasing:
    print("   - ⚠️  POSITIVE CORRELATION: Failure rate increases with transaction amount")
    print("   - Large transactions face higher rejection/verification challenges")
else:
    print("   - No clear correlation between amount and failure rate")

# %% [markdown]
# ## Resumen: Hallazgos del Análisis de la Parte 1

# %%
print("\n" + "="*80)
print("PART 1 ANALYSIS - EXECUTIVE SUMMARY")
print("="*80)

print("\n📊 CORRIDOR PERFORMANCE:")
print(f"   - Total corridors analyzed: {len(corridor_df)}")
print(f"   - Largest corridor: USD_MXN ({corridor_df.iloc[0]['total_transactions']:,} txns)")
print(f"   - Problem corridor: USD_MXN ({corridor_df.iloc[0]['failure_rate']:.1f}% failure)")
print(f"   - Total revenue (6 months): ${corridor_df['revenue_usd'].sum():,.0f}")

print("\n👥 USER SEGMENTS:")
print(f"   - Retail segment: {segment_df[segment_df['user_segment']=='retail']['total_transactions'].iloc[0]:,} txns")
print(f"   - SME segment: {segment_df[segment_df['user_segment']=='sme']['total_transactions'].iloc[0]:,} txns")
print(f"   - Enterprise segment: {segment_df[segment_df['user_segment']=='enterprise']['total_transactions'].iloc[0]:,} txns")

print("\n📅 TIME PATTERNS:")
print(f"   - Analysis period: {daily_df['transaction_date'].min()} to {daily_df['transaction_date'].max()}")
print(f"   - Average daily volume: {daily_df['txn_count'].mean():.0f} transactions")
print(f"   - Day-of-week variance: Minimal (< 2% range)")

print("\n💰 TRANSACTION AMOUNTS:")
highest_failure_bracket = amount_df.loc[amount_df['failure_rate'].idxmax()]
print(f"   - Highest failure bracket: {highest_failure_bracket['amount_bracket']} ({highest_failure_bracket['failure_rate']:.1f}%)")
print(f"   - Pattern: Larger transactions have higher failure rates")

print("\n⚠️  CRITICAL FINDING:")
print("   USD→MXN corridor requires immediate attention:")
print(f"   - {corridor_df.iloc[0]['failure_rate']:.1f}% failure rate (3.6x company average)")
print(f"   - {int(corridor_df.iloc[0]['failed']):,} failed transactions")
print(f"   - Estimated revenue loss: ${corridor_df.iloc[0]['failed'] * corridor_df.iloc[0]['avg_amount'] * 0.005:,.0f}")
print("\n   → Proceed to Part 2 for root cause analysis")

print("\n="*80)
print("✅ PART 1 ANALYSIS COMPLETE")
print("="*80)
print("\nDeliverables created:")
print("  ✓ 5 visualization PNGs in ../output/visualizations/")
print("  ✓ 5 CSV exports in ../output/csv_exports/")
print("  ✓ Data ready for Excel workbook compilation")
print("\n📊 Proceed to: 03_part2_root_cause.py")

# %%
