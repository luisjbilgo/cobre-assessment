# Análisis de Causa Raíz del Corredor USD→MXN

## Declaración del Problema

El corredor de pagos USD→MXN exhibe una tasa de fallos del 18.3%, excediendo significativamente la línea base de la compañía del 5%. Este corredor representa el 34.8% del volumen total de transacciones (17,407 transacciones en 6 meses), convirtiéndolo tanto en el corredor de mayor volumen como en el de mayor riesgo en la red de pagos de Cobre.

## Identificación de Causa Raíz

El análisis de datos revela dos impulsores primarios de la elevada tasa de fallos:

**1. Efecto del Umbral de Monto de Transacción**
Las transacciones grandes que exceden los $10,000 demuestran una tasa de fallos del 23.4%, comparado con el 18.7% para transacciones menores a $5,000. Este diferencial de 4.7 puntos porcentuales sugiere que los socios bancarios mexicanos aplican protocolos de verificación mejorados para transferencias USD→MXN de alto valor, probablemente activados por umbrales regulatorios de Lavado de Dinero (AML) y Conozca a su Cliente (KYC).

**2. Vulnerabilidad del Segmento Enterprise**
Los clientes Enterprise experimentan tasas de fallo del 23.9%, versus 14.1% para PYMEs y 19.5% para segmentos minoristas. Esta correlación se alinea con el hallazgo del monto de transacción, ya que los usuarios enterprise envían montos promedio más grandes ($22,983 vs $2,623 promedio retail).

**3. Análisis Temporal**
Los patrones temporales muestran una varianza mínima (1.9pp rango día-semana, 2.7pp rango mensual), descartando restricciones de capacidad o retrasos de procesamiento de fin de semana como factores contribuyentes. La tasa de fallos consistente a través de los periodos de tiempo refuerza que los procesos de verificación sistémicos —no cuellos de botella operativos— son la causa primaria.

## Evidencia de Respaldo

La comparación entre corredores valida la naturaleza específica de México en este problema. USD→COP (Colombia) mantiene una tasa de fallos saludable del 5.1% a pesar de volúmenes de transacción y segmentos de usuario similares, indicando que la causa raíz yace en los requisitos de los socios bancarios mexicanos o marcos regulatorios en lugar de los sistemas internos de Cobre.

## Impacto de Negocio

La tasa de fallos USD→MXN genera una pérdida de ingresos anual estimada de $251,300 en tarifas de transacción (asumiendo estructura de tarifa del 0.5%). Más allá del impacto directo en ingresos, la tasa de fallos enterprise del 23.9% crea una degradación en la experiencia del cliente para el segmento de mayor valor de Cobre, introduciendo vulnerabilidad competitiva ya que los clientes enterprise podrían migrar a proveedores de pagos más confiables.

Reducir la tasa de fallos al objetivo de la compañía del 5% recuperaría aproximadamente 386 transacciones mensualmente, traduciéndose en $20,942 en recuperación de ingresos mensuales y una retención mejorada de cuentas enterprise estratégicas.

---
*Análisis basado en 50,000 transacciones a través de 6 meses (Jul-Dic 2025)*
