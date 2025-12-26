# %% [markdown]
# # Test Setup - Cobre Business Analyst Assessment
# Este archivo verifica que todas las dependencias y configuración funcionan correctamente

# %% Imports
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sqlalchemy import create_engine
import sqlite3
from datetime import datetime

print("✅ Todas las librerías importadas correctamente")

# %% Verificar versiones
print(f"Pandas version: {pd.__version__}")
print(f"NumPy version: {np.__version__}")
print(f"SQLAlchemy instalado correctamente")

# %% Crear datos de prueba (simulando transactions.csv)
test_data = {
    'transaction_id': [f'TXN_{i:06d}' for i in range(1, 101)],
    'user_id': [f'USR_{i:04d}' for i in np.random.randint(1, 21, 100)],
    'corridor': np.random.choice(['USD_MXN', 'USD_COP', 'MXN_COP'], 100),
    'amount_usd': np.random.uniform(100, 10000, 100).round(2),
    'status': np.random.choice(['success', 'failed'], 100, p=[0.85, 0.15])
}

df_test = pd.DataFrame(test_data)
print(f"\n✅ DataFrame de prueba creado: {len(df_test)} transacciones")
print(df_test.head())

# %% Crear SQLite en memoria
engine = create_engine('sqlite:///:memory:')
df_test.to_sql('transactions', engine, index=False, if_exists='replace')
print("\n✅ Datos cargados a SQLite en memoria")

# %% Ejecutar query SQL básico
query = """
SELECT 
    corridor,
    COUNT(*) as total_transactions,
    SUM(CASE WHEN status = 'success' THEN 1 ELSE 0 END) as successful,
    ROUND(AVG(amount_usd), 2) as avg_amount
FROM transactions
GROUP BY corridor
ORDER BY total_transactions DESC
"""

result = pd.read_sql_query(query, engine)
print("\n✅ Query SQL ejecutado correctamente:")
print(result)

# %% Análisis con pandas
success_rate = df_test.groupby('corridor').agg({
    'status': lambda x: (x == 'success').mean() * 100,
    'amount_usd': 'mean'
}).round(2)
success_rate.columns = ['success_rate_%', 'avg_amount_usd']

print("\n✅ Análisis con pandas:")
print(success_rate)

# %% Visualización simple
plt.figure(figsize=(10, 6))
corridor_counts = df_test['corridor'].value_counts()
plt.bar(corridor_counts.index, corridor_counts.values, color='steelblue')
plt.title('Distribución de Transacciones por Corredor')
plt.xlabel('Corredor')
plt.ylabel('Número de Transacciones')
plt.tight_layout()

# Guardar el gráfico
plt.savefig('../output/test_chart.png', dpi=150, bbox_inches='tight')
print("\n✅ Visualización creada y guardada en output/test_chart.png")
plt.show()

# %% Verificar capacidad de escritura
output_file = '../output/test_results.csv'
result.to_csv(output_file, index=False)
print(f"\n✅ Resultados exportados a {output_file}")

# %% Resumen final
print("\n" + "="*50)
print("🎉 TODAS LAS VERIFICACIONES PASARON")
print("="*50)
print("\nSistema listo para el assessment:")
print("  ✓ Pandas funcionando")
print("  ✓ SQLite en memoria funcionando")
print("  ✓ Queries SQL ejecutándose")
print("  ✓ Visualizaciones funcionando")
print("  ✓ Exportación de archivos funcionando")
print("\n¡Listo para comenzar el análisis de Cobre! 🚀")

# %%
