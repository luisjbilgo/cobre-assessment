import pandas as pd
import sys
from pathlib import Path
sys.path.append(str(Path(__file__).parent.parent))

from scripts.data_loader import get_connection, load_to_sqlite

# Load data
conn = get_connection()
load_to_sqlite('data/raw/transactions.csv', 'transactions', conn)
load_to_sqlite('data/raw/users.csv', 'users', conn)

# Key metrics
overall = pd.read_sql_query('''
    SELECT
        COUNT(*) as total_txns,
        ROUND(100.0 * SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) / COUNT(*), 1) as overall_failure_rate,
        ROUND(SUM(amount_usd), 0) as total_value
    FROM transactions
''', conn)

usd_mxn = pd.read_sql_query('''
    SELECT
        COUNT(*) as txns,
        ROUND(100.0 * COUNT(*) / (SELECT COUNT(*) FROM transactions), 1) as pct_volume,
        ROUND(100.0 * SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) / COUNT(*), 1) as failure_rate,
        ROUND(AVG(amount_usd), 0) as avg_amount
    FROM transactions
    WHERE corridor = 'USD_MXN'
''', conn)

enterprise = pd.read_sql_query('''
    SELECT
        ROUND(100.0 * SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) / COUNT(*), 1) as failure_rate
    FROM transactions
    WHERE corridor = 'USD_MXN' AND user_segment = 'enterprise'
''', conn)

large_txns = pd.read_sql_query('''
    SELECT
        ROUND(100.0 * SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) / COUNT(*), 1) as failure_rate
    FROM transactions
    WHERE corridor = 'USD_MXN' AND amount_usd > 10000
''', conn)

print('=== MÉTRICAS CLAVE PARA RESUMEN EJECUTIVO ===\n')
print(f'Dataset General:')
print(f'  • Total Transacciones: {int(overall.iloc[0]["total_txns"]):,}')
print(f'  • Valor Total: ${overall.iloc[0]["total_value"]/1e6:.1f}M')
print(f'  • Tasa Fallo Promedio: {overall.iloc[0]["overall_failure_rate"]}%')

print(f'\nCorredor USD→MXN (Problema):')
print(f'  • Volumen: {int(usd_mxn.iloc[0]["txns"]):,} transacciones ({usd_mxn.iloc[0]["pct_volume"]}% del total)')
print(f'  • Tasa Fallo: {usd_mxn.iloc[0]["failure_rate"]}% (3.7x el promedio)')
print(f'  • Monto Promedio: ${int(usd_mxn.iloc[0]["avg_amount"]):,}')

print(f'\nSegmentos de Alto Riesgo:')
print(f'  • Enterprise en USD→MXN: {enterprise.iloc[0]["failure_rate"]}% fallo')
print(f'  • Transacciones >$10k: {large_txns.iloc[0]["failure_rate"]}% fallo')

# Revenue calculation
monthly_vol = int(usd_mxn.iloc[0]["txns"]) / 6
current_fail_rate = usd_mxn.iloc[0]["failure_rate"] / 100
target_fail_rate = 0.05
avg_amount = int(usd_mxn.iloc[0]["avg_amount"])
fee = 0.005

monthly_failed = monthly_vol * current_fail_rate
recoverable = monthly_failed * ((current_fail_rate - target_fail_rate) / current_fail_rate)
monthly_gain = recoverable * avg_amount * fee
annual_gain = monthly_gain * 12

print(f'\nImpacto Financiero:')
print(f'  • Pérdida Mensual Actual: ${monthly_failed * avg_amount * fee:,.0f}')
print(f'  • Oportunidad Anual: ${annual_gain:,.0f}')
print(f'  • Transacciones Recuperables/mes: {recoverable:,.0f}')
