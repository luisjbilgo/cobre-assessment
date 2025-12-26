"""
Utilidades de Carga de Datos para el Análisis del Corredor de Pagos Cobre

Funciones para cargar archivos CSV en una base de datos SQLite en memoria con validación.
"""

import pandas as pd
import sqlite3
from pathlib import Path
from typing import Dict, Tuple


def get_connection() -> sqlite3.Connection:
    """
    Crea una conexión a base de datos SQLite en memoria.

    Retorna:
        sqlite3.Connection: Conexión a base de datos en memoria
    """
    conn = sqlite3.connect(':memory:')
    return conn


def load_to_sqlite(
    csv_path: str,
    table_name: str,
    conn: sqlite3.Connection
) -> Dict[str, any]:
    """
    Carga un archivo CSV en una tabla SQLite con validación exhaustiva.

    Argumentos:
        csv_path: Ruta al archivo CSV
        table_name: Nombre de la tabla SQLite de destino
        conn: Objeto de conexión SQLite

    Retorna:
        Dict conteniendo el reporte de validación:
            - records_loaded: Número de registros cargados
            - columns: Lista de nombres de columnas
            - null_counts: Diccionario de valores nulos por columna
            - duplicates: Número de registros duplicados
            - date_range: Tupla de (fecha_min, fecha_max) si existen columnas de fecha
            - status: 'PASS' (Aprobado) o 'FAIL' (Fallo)
    """
    # Cargar CSV
    df = pd.read_csv(csv_path)

    # Reporte de validación
    report = {
        'file': csv_path,
        'table': table_name,
        'records_loaded': len(df),
        'columns': list(df.columns),
        'null_counts': {},
        'duplicates': 0,
        'date_range': None,
        'status': 'PASS'
    }

    # Verificar nulos
    null_counts = df.isnull().sum()
    report['null_counts'] = {col: int(count) for col, count in null_counts.items() if count > 0}

    # Verificar duplicados (basado en la primera columna como ID)
    if len(df.columns) > 0:
        id_col = df.columns[0]
        report['duplicates'] = int(df[id_col].duplicated().sum())

    # Verificar rangos de fechas si aplica
    date_columns = [col for col in df.columns if 'date' in col.lower()]
    if date_columns and len(date_columns) > 0:
        date_col = date_columns[0]
        df[date_col] = pd.to_datetime(df[date_col])
        report['date_range'] = (
            df[date_col].min().strftime('%Y-%m-%d'),
            df[date_col].max().strftime('%Y-%m-%d')
        )

    # Cargar a SQLite
    df.to_sql(table_name, conn, if_exists='replace', index=False)

    # Estado de validación
    if report['null_counts'] or report['duplicates'] > 0:
        report['status'] = 'WARNINGS'

    return report


def create_indexes(conn: sqlite3.Connection) -> None:
    """
    Crea índices en columnas consultadas frecuentemente para rendimiento.

    Argumentos:
        conn: Objeto de conexión SQLite
    """
    cursor = conn.cursor()

    # Índices de tabla de transacciones
    indexes = [
        "CREATE INDEX IF NOT EXISTS idx_corridor ON transactions(corridor)",
        "CREATE INDEX IF NOT EXISTS idx_user_id ON transactions(user_id)",
        "CREATE INDEX IF NOT EXISTS idx_status ON transactions(status)",
        "CREATE INDEX IF NOT EXISTS idx_date ON transactions(transaction_date)",
        "CREATE INDEX IF NOT EXISTS idx_segment ON transactions(user_segment)",
        # Índices de tabla de usuarios
        "CREATE INDEX IF NOT EXISTS idx_user_pk ON users(user_id)",
        "CREATE INDEX IF NOT EXISTS idx_user_segment ON users(user_segment)",
        "CREATE INDEX IF NOT EXISTS idx_user_country ON users(country)"
    ]

    for index_sql in indexes:
        cursor.execute(index_sql)

    conn.commit()


def validate_referential_integrity(conn: sqlite3.Connection) -> Dict[str, any]:
    """
    Valida las relaciones de clave foránea entre tablas.

    Argumentos:
        conn: Objeto de conexión SQLite

    Retorna:
        Dict conteniendo resultados de validación
    """
    cursor = conn.cursor()

    # Verificar si todos los user_ids de transacciones existen en la tabla de usuarios
    query = """
    SELECT COUNT(*) as orphaned_records
    FROM transactions t
    LEFT JOIN users u ON t.user_id = u.user_id
    WHERE u.user_id IS NULL
    """

    result = cursor.execute(query).fetchone()
    orphaned_count = result[0]

    return {
        'orphaned_transactions': orphaned_count,
        'status': 'PASS' if orphaned_count == 0 else 'FAIL'
    }


def print_validation_report(report: Dict[str, any]) -> None:
    """
    Imprime el reporte de validación formateado en la consola.

    Argumentos:
        report: Diccionario de reporte de validación desde load_to_sqlite
    """
    print(f"\n{'='*60}")
    print(f"REPORTE DE VALIDACIÓN DE DATOS: {report['table']}")
    print(f"{'='*60}")
    print(f"Archivo: {report['file']}")
    print(f"Registros Cargados: {report['records_loaded']:,}")
    print(f"Columnas: {len(report['columns'])}")
    print(f"\nNombres de Columnas: {', '.join(report['columns'])}")

    if report['null_counts']:
        print(f"\n⚠️  VALORES NULOS DETECTADOS:")
        for col, count in report['null_counts'].items():
            print(f"  - {col}: {count} nulos")
    else:
        print(f"\n✅ No se encontraron valores nulos")

    if report['duplicates'] > 0:
        print(f"\n⚠️  DUPLICADOS: {report['duplicates']} IDs duplicados")
    else:
        print(f"✅ Sin IDs duplicados")

    if report['date_range']:
        print(f"\n📅 Rango de Fechas: {report['date_range'][0]} a {report['date_range'][1]}")

    print(f"\nEstado: {report['status']}")
    print(f"{'='*60}\n")


def export_validation_summary(
    reports: list,
    output_path: str = 'output/data_validation_summary.txt'
) -> None:
    """
    Exporta reportes de validación a un archivo de texto.

    Argumentos:
        reports: Lista de diccionarios de reportes de validación
        output_path: Ruta al archivo de salida
    """
    Path(output_path).parent.mkdir(parents=True, exist_ok=True)

    with open(output_path, 'w') as f:
        f.write("ANÁLISIS DE CORREDOR DE PAGOS COBRE - RESUMEN DE VALIDACIÓN DE DATOS\n")
        f.write("=" * 80 + "\n\n")

        for report in reports:
            f.write(f"Tabla: {report['table']}\n")
            f.write(f"Archivo: {report['file']}\n")
            f.write(f"Registros: {report['records_loaded']:,}\n")
            f.write(f"Columnas: {len(report['columns'])}\n")

            if report['null_counts']:
                f.write(f"Valores Nulos: {sum(report['null_counts'].values())}\n")
            else:
                f.write(f"Valores Nulos: 0\n")

            f.write(f"Duplicados: {report['duplicates']}\n")

            if report['date_range']:
                f.write(f"Rango de Fechas: {report['date_range'][0]} a {report['date_range'][1]}\n")

            f.write(f"Estado: {report['status']}\n")
            f.write("-" * 80 + "\n\n")

        f.write("Validación Completa\n")

    print(f"✅ Resumen de validación exportado a: {output_path}")