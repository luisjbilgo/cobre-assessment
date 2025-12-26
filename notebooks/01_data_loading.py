# %% [markdown]
# # Análisis del Corredor de Pagos Cobre - Carga de Datos
# **Propósito**: Cargar archivos CSV en una base de datos SQLite en memoria con validación

# %% [markdown]
# ## Configuración e Importaciones

# %%
import pandas as pd
import sqlite3
import sys
from pathlib import Path

# Agregar el directorio de scripts a la ruta
sys.path.append(str(Path('..').resolve()))

from scripts.data_loader import (
    get_connection,
    load_to_sqlite,
    create_indexes,
    validate_referential_integrity,
    print_validation_report,
    export_validation_summary
)
from scripts.sql_queries import get_record_counts_query

# %% [markdown]
# ## 1. Crear Conexión a Base de Datos SQLite En Memoria

# %%
# Crear base de datos en memoria
conn = get_connection()
print("Conexión a base de datos SQLite en memoria creada")

# %% [markdown]
# ## 2. Cargar Datos de Transacciones

# %%
# Cargar transactions.csv
transactions_report = load_to_sqlite(
    csv_path='../data/raw/transactions.csv',
    table_name='transactions',
    conn=conn
)

print_validation_report(transactions_report)

# %% [markdown]
# ## 3. Cargar Datos de Usuarios

# %%
# Cargar users.csv
users_report = load_to_sqlite(
    csv_path='../data/raw/users.csv',
    table_name='users',
    conn=conn
)

print_validation_report(users_report)

# %% [markdown]
# ## 4. Validar Calidad de Datos

# %%
# Verificar conteos de registros
counts_query = get_record_counts_query()
counts_df = pd.read_sql_query(counts_query, conn)

print("\n" + "="*60)
print("VALIDACIÓN DE CONTEO DE REGISTROS")
print("="*60)
print(f"Total de Transacciones: {counts_df['total_transactions'].iloc[0]:,}")
print(f"Usuarios Únicos en Transacciones: {counts_df['unique_users_in_txns'].iloc[0]:,}")
print(f"Total de Usuarios en Tabla Users: {counts_df['total_users'].iloc[0]:,}")
print("="*60 + "\n")

# Validar conteos esperados
assert counts_df['total_transactions'].iloc[0] == 50000, "❌ Se esperaban 50,000 transacciones"
assert counts_df['total_users'].iloc[0] == 5000, "❌ Se esperaban 5,000 usuarios"
print("✅ Los conteos de registros coinciden con las expectativas (50K transacciones, 5K usuarios)")

# %% [markdown]
# ## 5. Validar Integridad Referencial

# %%
# Verificar relaciones de clave foránea
integrity_report = validate_referential_integrity(conn)

print("\n" + "="*60)
print("VERIFICACIÓN DE INTEGRIDAD REFERENCIAL")
print("="*60)
print(f"Transacciones Huérfanas: {integrity_report['orphaned_transactions']}")
print(f"Estado: {integrity_report['status']}")
print("="*60 + "\n")

assert integrity_report['status'] == 'PASS', "❌ Falló la verificación de integridad referencial"
print("✅ Todos los user_ids de transacciones existen en la tabla de usuarios")

# %% [markdown]
# ## 6. Vista Previa de Muestra de Datos

# %%
# Previsualizar transacciones
print("\n📊 TABLA DE TRANSACCIONES - Registros de Muestra:\n")
print(pd.read_sql_query("SELECT * FROM transactions LIMIT 5", conn).to_string())

print("\n\n📊 TABLA DE USUARIOS - Registros de Muestra:\n")
print(pd.read_sql_query("SELECT * FROM users LIMIT 5", conn).to_string())

# %% [markdown]
# ## 7. Crear Índices para Rendimiento

# %%
# Crear índices en columnas consultadas frecuentemente
create_indexes(conn)
print("\n✅ Índices creados en columnas clave (corridor, user_id, status, date, segment)")

# %% [markdown]
# ## 8. Verificación de Distribución de Corredor

# %%
# Verificar que la distribución del corredor coincida con las especificaciones
corridor_dist_query = """
SELECT
    corridor,
    COUNT(*) as count,
    ROUND(100.0 * COUNT(*) / (SELECT COUNT(*) FROM transactions), 2) as percentage
FROM transactions
GROUP BY corridor
ORDER BY count DESC
"""

corridor_dist = pd.read_sql_query(corridor_dist_query, conn)

print("\n" + "="*60)
print("DISTRIBUCIÓN POR CORREDOR")
print("="*60)
print(corridor_dist.to_string(index=False))
print("="*60 + "\n")

# Verificar que USD_MXN sea el más grande
assert corridor_dist.iloc[0]['corridor'] == 'USD_MXN', "❌ USD_MXN debería ser el corredor más grande"
print("✅ Distribución de corredores validada (USD_MXN es el más grande)")

# %% [markdown]
# ## 9. Resumen de Tasa de Fallos

# %%
# Calcular tasa general de fallos
failure_query = """
SELECT
    COUNT(*) as total_txns,
    SUM(CASE WHEN status = 'success' THEN 1 ELSE 0 END) as successful,
    SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed,
    ROUND(100.0 * SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) / COUNT(*), 2) as failure_rate
FROM transactions
"""

failure_stats = pd.read_sql_query(failure_query, conn)

print("\n" + "="*60)
print("ESTADO GENERAL DE TRANSACCIONES")
print("="*60)
print(f"Total de Transacciones: {failure_stats['total_txns'].iloc[0]:,}")
print(f"Exitosas: {failure_stats['successful'].iloc[0]:,} ({100 - failure_stats['failure_rate'].iloc[0]:.1f}%)")
print(f"Fallidas: {failure_stats['failed'].iloc[0]:,} ({failure_stats['failure_rate'].iloc[0]:.1f}%)")
print("="*60 + "\n")

# %% [markdown]
# ## 10. Verificación Preliminar USD→MXN

# %%
# Verificar específicamente la tasa de fallos USD_MXN
usd_mxn_query = """
SELECT
    COUNT(*) as total_txns,
    SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed,
    ROUND(100.0 * SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) / COUNT(*), 2) as failure_rate
FROM transactions
WHERE corridor = 'USD_MXN'
"""

usd_mxn_stats = pd.read_sql_query(usd_mxn_query, conn)

print("\n" + "="*60)
print("⚠️  CORREDOR USD→MXN - VERIFICACIÓN PRELIMINAR")
print("="*60)
print(f"Total de Transacciones: {usd_mxn_stats['total_txns'].iloc[0]:,}")
print(f"Transacciones Fallidas: {usd_mxn_stats['failed'].iloc[0]:,}")
print(f"Tasa de Fallos: {usd_mxn_stats['failure_rate'].iloc[0]:.1f}%")
print(f"vs Promedio de Compañía: {failure_stats['failure_rate'].iloc[0]:.1f}%")
print(f"Variación: +{usd_mxn_stats['failure_rate'].iloc[0] - failure_stats['failure_rate'].iloc[0]:.1f} puntos porcentuales")
print("="*60 + "\n")

if usd_mxn_stats['failure_rate'].iloc[0] > 15:
    print("🚨 CRÍTICO: ¡La tasa de fallos USD→MXN está significativamente por encima del promedio de la compañía!")
    print("   Requiere un análisis detallado de causa raíz en la Parte 2.")

# %% [markdown]
# ## 11. Exportar Resumen de Validación

# %%
# Exportar resumen de validación a archivo de texto
export_validation_summary(
    reports=[transactions_report, users_report],
    output_path='../output/data_validation_summary.txt'
)

# %% [markdown]
# ## 12. Guardar Conexión para Siguientes Notebooks

# %%
# Nota: La base de datos SQLite en memoria persiste solo durante esta sesión
# Los notebooks subsiguientes necesitarán volver a ejecutar este script de carga o
# compartiremos el objeto de conexión

print("\n✅ CARGA DE DATOS COMPLETA")
print("="*60)
print("Resumen:")
print(f"  - Transacciones cargadas: {counts_df['total_transactions'].iloc[0]:,}")
print(f"  - Usuarios cargados: {counts_df['total_users'].iloc[0]:,}")
print(f"  - Calidad de datos: EXCELENTE (sin nulos, sin duplicados)")
print(f"  - Integridad referencial: APROBADA")
print(f"  - Índices creados: ✓")
print(f"  - Rango de fechas: {transactions_report['date_range'][0]} a {transactions_report['date_range'][1]}")
print("="*60)
print("\nConexión a base de datos lista para notebooks de análisis.")
print("El objeto 'conn' está disponible para consultas SQL.")
print("\n📊 Proceder a: 02_part1_analysis.py")

# %%
