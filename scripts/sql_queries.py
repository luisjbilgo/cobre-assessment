"""
SQL Query Templates for Cobre Payment Corridor Analysis

Reusable SQL queries for corridor performance, user behavior, and time pattern analysis.
"""


def corridor_performance_query() -> str:
    """
    Get comprehensive performance metrics for all payment corridors.

    Returns:
        SQL query string for corridor performance analysis
    """
    return """
    SELECT
        corridor,
        COUNT(*) as total_transactions,
        SUM(CASE WHEN status = 'success' THEN 1 ELSE 0 END) as successful,
        SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed,
        ROUND(100.0 * SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) / COUNT(*), 2) as failure_rate,
        ROUND(AVG(amount_usd), 2) as avg_amount,
        ROUND(SUM(amount_usd), 2) as total_value,
        ROUND(SUM(CASE WHEN status = 'success' THEN amount_usd ELSE 0 END) * 0.005, 2) as revenue_usd
    FROM transactions
    GROUP BY corridor
    ORDER BY total_transactions DESC
    """


def user_segment_analysis_query() -> str:
    """
    Analyze transaction patterns by user segment.

    Returns:
        SQL query string for segment analysis
    """
    return """
    SELECT
        user_segment,
        COUNT(DISTINCT user_id) as unique_users,
        COUNT(*) as total_transactions,
        ROUND(1.0 * COUNT(*) / COUNT(DISTINCT user_id), 2) as avg_txns_per_user,
        ROUND(AVG(amount_usd), 2) as avg_amount,
        ROUND(100.0 * SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) / COUNT(*), 2) as failure_rate
    FROM transactions
    GROUP BY user_segment
    ORDER BY total_transactions DESC
    """


def daily_trend_query() -> str:
    """
    Get daily transaction volume and failure rate trends.

    Returns:
        SQL query string for daily trend analysis
    """
    return """
    SELECT
        transaction_date,
        COUNT(*) as txn_count,
        SUM(CASE WHEN status = 'success' THEN 1 ELSE 0 END) as successful,
        SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed,
        ROUND(100.0 * SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) / COUNT(*), 2) as failure_rate,
        ROUND(SUM(amount_usd), 2) as total_value
    FROM transactions
    GROUP BY transaction_date
    ORDER BY transaction_date
    """


def day_of_week_pattern_query() -> str:
    """
    Analyze transaction patterns by day of week.

    Returns:
        SQL query string for day-of-week analysis
    """
    return """
    SELECT
        CASE CAST(strftime('%w', transaction_date) AS INTEGER)
            WHEN 0 THEN 'Sunday'
            WHEN 1 THEN 'Monday'
            WHEN 2 THEN 'Tuesday'
            WHEN 3 THEN 'Wednesday'
            WHEN 4 THEN 'Thursday'
            WHEN 5 THEN 'Friday'
            WHEN 6 THEN 'Saturday'
        END as day_of_week,
        CAST(strftime('%w', transaction_date) AS INTEGER) as day_num,
        COUNT(*) as txn_count,
        ROUND(100.0 * SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) / COUNT(*), 2) as failure_rate,
        ROUND(AVG(amount_usd), 2) as avg_amount
    FROM transactions
    GROUP BY strftime('%w', transaction_date)
    ORDER BY day_num
    """


def hourly_pattern_query() -> str:
    """
    Analyze transaction patterns by hour of day.

    Returns:
        SQL query string for hourly pattern analysis
    """
    return """
    SELECT
        CAST(strftime('%H', transaction_time) AS INTEGER) as hour,
        COUNT(*) as txn_count,
        ROUND(100.0 * SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) / COUNT(*), 2) as failure_rate,
        ROUND(AVG(amount_usd), 2) as avg_amount
    FROM transactions
    GROUP BY hour
    ORDER BY hour
    """


def amount_distribution_query() -> str:
    """
    Analyze transaction distribution by amount brackets.

    Returns:
        SQL query string for amount distribution analysis
    """
    return """
    SELECT
        CASE
            WHEN amount_usd < 1000 THEN '<$1k'
            WHEN amount_usd < 5000 THEN '$1k-$5k'
            WHEN amount_usd < 10000 THEN '$5k-$10k'
            WHEN amount_usd < 20000 THEN '$10k-$20k'
            ELSE '>$20k'
        END as amount_bracket,
        COUNT(*) as txn_count,
        ROUND(100.0 * SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) / COUNT(*), 2) as failure_rate,
        ROUND(AVG(amount_usd), 2) as avg_amount,
        ROUND(MIN(amount_usd), 2) as min_amount
    FROM transactions
    GROUP BY amount_bracket
    ORDER BY min_amount
    """


def usd_mxn_corridor_query() -> str:
    """
    Create temporary table for USD→MXN corridor analysis.

    Returns:
        SQL query string to create USD_MXN temporary table
    """
    return """
    CREATE TEMP TABLE IF NOT EXISTS usd_mxn_txns AS
    SELECT
        t.*,
        u.country as user_country,
        u.status as user_status,
        u.registration_date as user_reg_date
    FROM transactions t
    LEFT JOIN users u ON t.user_id = u.user_id
    WHERE t.corridor = 'USD_MXN'
    """


def usd_mxn_segment_analysis_query() -> str:
    """
    Analyze USD→MXN transactions by user segment.

    Returns:
        SQL query string for USD_MXN segment analysis
    """
    return """
    SELECT
        user_segment,
        COUNT(*) as txn_count,
        ROUND(100.0 * SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) / COUNT(*), 2) as failure_rate,
        ROUND(AVG(amount_usd), 2) as avg_amount,
        ROUND(SUM(amount_usd), 2) as total_value
    FROM usd_mxn_txns
    GROUP BY user_segment
    ORDER BY failure_rate DESC
    """


def usd_mxn_amount_analysis_query() -> str:
    """
    Analyze USD→MXN failure rates by transaction amount brackets.

    Returns:
        SQL query string for USD_MXN amount analysis
    """
    return """
    SELECT
        CASE
            WHEN amount_usd < 5000 THEN '<$5k'
            WHEN amount_usd < 10000 THEN '$5k-$10k'
            ELSE '>$10k'
        END as amount_bracket,
        COUNT(*) as txn_count,
        ROUND(100.0 * SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) / COUNT(*), 2) as failure_rate,
        ROUND(AVG(amount_usd), 2) as avg_amount
    FROM usd_mxn_txns
    GROUP BY amount_bracket
    ORDER BY MIN(amount_usd)
    """


def usd_mxn_monthly_trend_query() -> str:
    """
    Analyze USD→MXN monthly failure rate trends.

    Returns:
        SQL query string for USD_MXN monthly trends
    """
    return """
    SELECT
        strftime('%Y-%m', transaction_date) as month,
        COUNT(*) as txn_count,
        ROUND(100.0 * SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) / COUNT(*), 2) as failure_rate,
        ROUND(AVG(amount_usd), 2) as avg_amount
    FROM usd_mxn_txns
    GROUP BY month
    ORDER BY month
    """


def usd_mxn_day_of_week_query() -> str:
    """
    Analyze USD→MXN failure patterns by day of week.

    Returns:
        SQL query string for USD_MXN day-of-week analysis
    """
    return """
    SELECT
        CASE CAST(strftime('%w', transaction_date) AS INTEGER)
            WHEN 0 THEN 'Sunday'
            WHEN 1 THEN 'Monday'
            WHEN 2 THEN 'Tuesday'
            WHEN 3 THEN 'Wednesday'
            WHEN 4 THEN 'Thursday'
            WHEN 5 THEN 'Friday'
            WHEN 6 THEN 'Saturday'
        END as day_of_week,
        CAST(strftime('%w', transaction_date) AS INTEGER) as day_num,
        COUNT(*) as txn_count,
        ROUND(100.0 * SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) / COUNT(*), 2) as failure_rate
    FROM usd_mxn_txns
    GROUP BY strftime('%w', transaction_date)
    ORDER BY day_num
    """


def usd_mxn_user_status_query() -> str:
    """
    Analyze USD→MXN failures by user account status.

    Returns:
        SQL query string for USD_MXN user status analysis
    """
    return """
    SELECT
        user_status,
        COUNT(*) as txn_count,
        ROUND(100.0 * SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) / COUNT(*), 2) as failure_rate,
        ROUND(AVG(amount_usd), 2) as avg_amount
    FROM usd_mxn_txns
    GROUP BY user_status
    """


def corridor_comparison_for_strategy_query() -> str:
    """
    Compare all corridors for strategic prioritization.

    Returns:
        SQL query string for corridor strategic comparison
    """
    return """
    SELECT
        corridor,
        COUNT(*) as volume,
        ROUND(AVG(amount_usd), 2) as avg_amount,
        ROUND(SUM(amount_usd), 2) as total_value,
        ROUND(100.0 * SUM(CASE WHEN status = 'success' THEN 1 ELSE 0 END) / COUNT(*), 2) as success_rate,
        ROUND(SUM(CASE WHEN status = 'success' THEN amount_usd ELSE 0 END) * 0.005, 2) as revenue_potential,
        ROUND(100.0 *
            SUM(CASE WHEN transaction_date >= '2025-11-01' THEN 1 ELSE 0 END) /
            NULLIF(SUM(CASE WHEN transaction_date < '2025-09-01' THEN 1 ELSE 0 END), 0) - 100,
        2) as growth_rate
    FROM transactions
    GROUP BY corridor
    ORDER BY revenue_potential DESC
    """


def get_record_counts_query() -> str:
    """
    Get basic record counts for validation.

    Returns:
        SQL query string for record count validation
    """
    return """
    SELECT
        (SELECT COUNT(*) FROM transactions) as total_transactions,
        (SELECT COUNT(DISTINCT user_id) FROM transactions) as unique_users_in_txns,
        (SELECT COUNT(*) FROM users) as total_users
    """
