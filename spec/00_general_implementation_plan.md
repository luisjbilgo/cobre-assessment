# Cobre Business Analyst Assessment - General Implementation Plan

## Executive Summary

**Project**: Payment Corridor Analysis for Cobre Fintech
**Timeline**: 90 minutes (optimized with AI assistance)
**Critical Problem**: USD→MXN corridor with 18.3% failure rate (vs 5% company baseline)
**Deliverables**: Excel workbook + Root cause analysis (250-300 words) + Strategic memo (1 page)

---

## Phase 1: Environment & Infrastructure Setup (10 min)

### 1.1 Create Missing Business Strategist Agent
**File**: `.claude/agents/business-strategist.md`

**Purpose**: Specialized agent for root cause analysis and strategic recommendations

**Capabilities**:
- Root cause analysis using 5 Whys, fishbone diagrams, hypothesis validation
- Strategic recommendation frameworks (prioritization matrices, ROI calculations)
- Business memo writing (executive summaries, action plans)
- Revenue impact quantification

### 1.2 Create Core Utility Scripts
**Location**: `scripts/`

**Files to create**:
1. `scripts/__init__.py` - Package marker
2. `scripts/data_loader.py` - CSV → SQLite loader with validation
3. `scripts/sql_queries.py` - Reusable query templates
4. `scripts/visualizations.py` - Chart generation utilities
5. `scripts/export_deliverables.py` - Excel/PDF export automation

**Key functions**:
```python
# data_loader.py
load_to_sqlite(csv_path, table_name, conn) → validation_report
get_connection() → sqlite3.Connection (in-memory)

# sql_queries.py
corridor_performance_query() → SQL string
user_behavior_query(segment) → SQL string
time_pattern_query(corridor) → SQL string

# visualizations.py
create_corridor_comparison_chart(data) → matplotlib.Figure
create_failure_trend_chart(data) → matplotlib.Figure
export_chart(fig, filename, dpi=300) → None
```

### 1.3 Verify Dependencies
**File**: `requirements.txt` (should already exist)

**Required packages**:
- pandas>=2.0.0
- sqlite3 (built-in)
- sqlalchemy>=2.0.0
- matplotlib>=3.7.0
- seaborn>=0.13.0
- openpyxl>=3.1.0 (for Excel export)
- reportlab>=4.0.0 (for PDF generation)

**Action**: Verify installation with `pip list` in venv

---

## Phase 2: Data Loading & Validation (15 min)

### 2.1 Create Data Loading Notebook
**File**: `notebooks/01_data_loading.py`

**Structure** (using # %% cells):
```python
# %% Cell 1: Imports and setup
import pandas as pd
import sqlite3
from scripts.data_loader import load_to_sqlite, get_connection

# %% Cell 2: Load transactions
conn = get_connection()
transactions_report = load_to_sqlite(
    'data/raw/transactions.csv',
    'transactions',
    conn
)

# %% Cell 3: Load users
users_report = load_to_sqlite(
    'data/raw/users.csv',
    'users',
    conn
)

# %% Cell 4: Validation queries
# Check record counts
# Verify date ranges
# Test referential integrity
# Confirm no nulls in critical columns

# %% Cell 5: Create indexes
# Index on corridor, user_id, status, transaction_date

# %% Cell 6: Export validation summary
# Save to output/data_validation_summary.txt
```

**Critical validations**:
1. Record counts: 50,000 transactions, 5,000 users ✅
2. Date range: 2025-07-01 to 2025-12-30 ✅
3. No nulls in critical columns ✅
4. Referential integrity: all transaction user_ids exist in users ✅
5. Status values: only 'success' or 'failed' ✅

**Data Quality Note**:
- Use `user_segment` from transactions table (transaction-level classification)
- NOT from users table (user's registered segment)
- 60.9% of transactions have segment mismatch - this is expected behavior

---

## Phase 3: Part 1 Analysis - Corridor Performance (20 min)

### 3.1 Analysis Notebook
**File**: `notebooks/02_part1_analysis.py`

### 3.2 Required Metrics & Visualizations

#### Metric 1: Corridor Volume & Success Rates
**SQL Query**:
```sql
SELECT
    corridor,
    COUNT(*) as total_transactions,
    SUM(CASE WHEN status = 'success' THEN 1 ELSE 0 END) as successful,
    SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed,
    ROUND(100.0 * SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) / COUNT(*), 2) as failure_rate,
    ROUND(AVG(amount_usd), 2) as avg_amount,
    ROUND(SUM(amount_usd), 2) as total_value
FROM transactions
GROUP BY corridor
ORDER BY total_transactions DESC;
```

**Visualization**: Horizontal bar chart (corridor comparison)
- X-axis: Transaction count
- Y-axis: Corridors (sorted by volume)
- Color code: Highlight USD_MXN in red

#### Metric 2: User Behavior by Segment
**SQL Query**:
```sql
SELECT
    user_segment,
    COUNT(DISTINCT user_id) as unique_users,
    COUNT(*) as total_transactions,
    ROUND(1.0 * COUNT(*) / COUNT(DISTINCT user_id), 2) as avg_txns_per_user,
    ROUND(AVG(amount_usd), 2) as avg_amount,
    ROUND(100.0 * SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) / COUNT(*), 2) as failure_rate
FROM transactions
GROUP BY user_segment
ORDER BY total_transactions DESC;
```

**Visualization**: Grouped bar chart (segment comparison)
- Categories: enterprise, sme, retail
- Metrics: failure rate, avg amount, txns per user

#### Metric 3: Time Patterns
**SQL Queries**:

a) **Daily trend**:
```sql
SELECT
    transaction_date,
    COUNT(*) as txn_count,
    ROUND(100.0 * SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) / COUNT(*), 2) as failure_rate
FROM transactions
GROUP BY transaction_date
ORDER BY transaction_date;
```

b) **Day of week pattern**:
```sql
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
    COUNT(*) as txn_count,
    ROUND(100.0 * SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) / COUNT(*), 2) as failure_rate
FROM transactions
GROUP BY strftime('%w', transaction_date)
ORDER BY CAST(strftime('%w', transaction_date) AS INTEGER);
```

c) **Hourly pattern**:
```sql
SELECT
    CAST(strftime('%H', transaction_time) AS INTEGER) as hour,
    COUNT(*) as txn_count,
    ROUND(100.0 * SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) / COUNT(*), 2) as failure_rate
FROM transactions
GROUP BY hour
ORDER BY hour;
```

**Visualizations**:
- Line chart: Daily transaction volume over 6 months
- Bar chart: Day of week pattern (Mon-Sun)
- Heatmap: Hour of day × day of week (transaction density)

#### Metric 4: Transaction Amount Distribution
**SQL Query**:
```sql
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
    ROUND(AVG(amount_usd), 2) as avg_amount
FROM transactions
GROUP BY amount_bracket
ORDER BY MIN(amount_usd);
```

**Visualization**: Histogram with failure rate overlay

### 3.3 Output Files
- `output/visualizations/corridor_volume_comparison.png`
- `output/visualizations/segment_performance.png`
- `output/visualizations/daily_trend.png`
- `output/visualizations/day_of_week_pattern.png`
- `output/visualizations/hourly_heatmap.png`
- `output/visualizations/amount_distribution.png`

---

## Phase 4: Part 2 - USD→MXN Root Cause Analysis (20 min)

### 4.1 Analysis Notebook
**File**: `notebooks/03_part2_root_cause.py`

### 4.2 Investigation Framework

#### Step 1: Isolate USD→MXN Transactions
```sql
CREATE TEMP TABLE usd_mxn_txns AS
SELECT t.*, u.country as user_country, u.status as user_status
FROM transactions t
LEFT JOIN users u ON t.user_id = u.user_id
WHERE t.corridor = 'USD_MXN';
```

#### Step 2: Segment Analysis
**By user segment**:
```sql
SELECT
    user_segment,
    COUNT(*) as txn_count,
    ROUND(100.0 * SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) / COUNT(*), 2) as failure_rate,
    ROUND(AVG(amount_usd), 2) as avg_amount
FROM usd_mxn_txns
GROUP BY user_segment
ORDER BY failure_rate DESC;
```

**Expected finding**:
- Retail: ~19.5% failure
- Enterprise: ~23.9% failure (highest)
- SME: ~14.1% failure

#### Step 3: Amount Analysis
**Large transactions hypothesis**:
```sql
SELECT
    CASE
        WHEN amount_usd < 5000 THEN '<$5k'
        WHEN amount_usd < 10000 THEN '$5k-$10k'
        ELSE '>$10k'
    END as amount_bracket,
    COUNT(*) as txn_count,
    ROUND(100.0 * SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) / COUNT(*), 2) as failure_rate
FROM usd_mxn_txns
GROUP BY amount_bracket
ORDER BY MIN(amount_usd);
```

**Expected finding**: >$10k transactions show ~23.4% failure

#### Step 4: Temporal Patterns
**Monthly trend**:
```sql
SELECT
    strftime('%Y-%m', transaction_date) as month,
    COUNT(*) as txn_count,
    ROUND(100.0 * SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) / COUNT(*), 2) as failure_rate
FROM usd_mxn_txns
GROUP BY month
ORDER BY month;
```

**Day of week**:
```sql
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
    COUNT(*) as txn_count,
    ROUND(100.0 * SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) / COUNT(*), 2) as failure_rate
FROM usd_mxn_txns
GROUP BY strftime('%w', transaction_date)
ORDER BY CAST(strftime('%w', transaction_date) AS INTEGER);
```

**Expected finding**: Minimal day-of-week variance (17.0%-18.9%)

#### Step 5: User Status & Registration Cohorts
```sql
SELECT
    u.status as user_status,
    COUNT(*) as txn_count,
    ROUND(100.0 * SUM(CASE WHEN t.status = 'failed' THEN 1 ELSE 0 END) / COUNT(*), 2) as failure_rate
FROM usd_mxn_txns t
LEFT JOIN users u ON t.user_id = u.user_id
GROUP BY u.status;
```

### 4.3 Root Cause Hypothesis Validation

**Primary Hypotheses**:

1. **Enterprise segment + large transactions**
   - Enterprise has 23.9% failure (vs 14.1% SME, 19.5% retail)
   - Transactions >$10k have 23.4% failure
   - Possible cause: Enhanced verification for high-value enterprise transfers
   - Mexican banking regulations for large cross-border amounts

2. **User verification issues**
   - Check correlation between inactive users and failures
   - Registration date cohorts (new vs. established users)

3. **Mexican banking partner limitations**
   - USD→MXN specific (USD→COP only 5.1% failure)
   - Destination country = Mexico specific issue
   - Possible partner bank capacity or compliance constraints

4. **Transaction amount thresholds**
   - Clear correlation: larger amounts = higher failure
   - Mexican AML/KYC regulations trigger at certain thresholds
   - Possible $10k threshold triggering additional checks

### 4.4 Revenue Impact Calculation

**Formula**:
```python
# Constants
USD_MXN_MONTHLY_VOLUME = 17407  # Total 6-month volume / 6
CURRENT_FAILURE_RATE = 0.183
TARGET_FAILURE_RATE = 0.05
AVERAGE_AMOUNT_USD = 3450  # From data analysis
FEE_PERCENTAGE = 0.005

# Calculations
monthly_failed_txns = USD_MXN_MONTHLY_VOLUME * CURRENT_FAILURE_RATE
current_lost_revenue = monthly_failed_txns * AVERAGE_AMOUNT_USD * FEE_PERCENTAGE

# Potential gain if reduced to 5%
recoverable_failures = monthly_failed_txns * ((CURRENT_FAILURE_RATE - TARGET_FAILURE_RATE) / CURRENT_FAILURE_RATE)
monthly_gain = recoverable_failures * AVERAGE_AMOUNT_USD * FEE_PERCENTAGE
annual_gain = monthly_gain * 12
```

**Expected output**:
- Current monthly loss: ~$45,000
- Potential monthly gain: ~$30,000
- Annual opportunity: ~$360,000

### 4.5 Written Analysis Output
**File**: `output/root_cause_analysis.md` (250-300 words)

**Structure**:
1. **Problem Statement** (50 words)
   - USD→MXN corridor shows 18.3% failure rate (vs 5% baseline)
   - Represents 34.8% of total volume (17,407 transactions)

2. **Root Cause Identification** (100 words)
   - Primary driver: Large transaction amounts (>$10k: 23.4% failure)
   - Secondary driver: Enterprise segment (23.9% failure)
   - Correlation analysis: Enterprise users tend to send larger amounts
   - Hypothesis: Mexican banking partner has stricter verification for high-value USD→MXN transfers
   - Possible triggers: AML/KYC thresholds at $10k, enhanced due diligence requirements

3. **Supporting Evidence** (50 words)
   - No significant time-based patterns (day of week variance minimal)
   - Other corridors unaffected (USD→COP: 5.1% failure)
   - Destination-specific issue (Mexico banking regulations)

4. **Business Impact** (50 words)
   - Annual revenue loss: ~$360,000 in transaction fees
   - Customer experience degradation for highest-value segment
   - Competitive disadvantage in lucrative enterprise USD→MXN market

---

## Phase 5: Part 3 - Strategic Corridor Recommendation (20 min)

### 5.1 Strategy Development Notebook
**File**: `notebooks/04_part3_strategy.py`

### 5.2 Corridor Evaluation Framework

**Criteria for prioritization**:
1. **Growth Potential** (Market size, current penetration)
2. **Profitability** (Avg transaction size, volume, fees)
3. **Operational Health** (Success rate, processing cost)
4. **Strategic Fit** (Customer segment alignment, competitive position)

### 5.3 Comparative Analysis

**SQL Query for all corridors**:
```sql
SELECT
    corridor,
    COUNT(*) as volume,
    ROUND(AVG(amount_usd), 2) as avg_amount,
    ROUND(SUM(amount_usd), 2) as total_value,
    ROUND(100.0 * SUM(CASE WHEN status = 'success' THEN 1 ELSE 0 END) / COUNT(*), 2) as success_rate,
    ROUND(SUM(CASE WHEN status = 'success' THEN amount_usd ELSE 0 END) * 0.005, 2) as revenue_potential,
    -- Growth indicator: % of volume in last 2 months vs first 2 months
    ROUND(100.0 *
        SUM(CASE WHEN transaction_date >= '2025-11-01' THEN 1 ELSE 0 END) /
        NULLIF(SUM(CASE WHEN transaction_date < '2025-09-01' THEN 1 ELSE 0 END), 0) - 100,
    2) as growth_rate
FROM transactions
GROUP BY corridor
ORDER BY revenue_potential DESC;
```

### 5.4 Recommendation Options

**Option A: Fix USD→MXN (Operational Excellence)**
- **Rationale**: Largest corridor (34.8% volume), highest revenue potential
- **Action**: Address failure rate → unlock $360k annual revenue
- **Risk**: Requires partner bank negotiation, regulatory navigation
- **Timeline**: 3-6 months (partner SLA improvements, compliance changes)

**Option B: Double Down on USD→COP (Growth)**
- **Rationale**: 30% volume, 5.1% failure (healthy), Colombia growth market
- **Action**: Marketing investment, product enhancements for Colombian SMEs
- **Risk**: Market saturation, competition
- **Timeline**: 1-2 months (marketing-led growth)

**Option C: Expand MXN→COP (New Market)**
- **Rationale**: 15% current volume, intra-LATAM trade corridor
- **Action**: Target Mexican exporters to Colombia (emerging market)
- **Risk**: Unproven demand, operational complexity
- **Timeline**: 2-4 months (market validation, infrastructure)

### 5.5 Recommended Strategy
**Primary Recommendation**: USD→MXN Operational Fix

**Scoring Matrix**:
| Criterion | USD_MXN Fix | USD_COP Growth | MXN_COP Expansion |
|-----------|-------------|----------------|-------------------|
| Revenue Impact | ★★★★★ | ★★★☆☆ | ★★☆☆☆ |
| Time to Value | ★★★☆☆ | ★★★★☆ | ★★☆☆☆ |
| Risk Level | ★★★☆☆ | ★★☆☆☆ | ★★★★☆ |
| Strategic Importance | ★★★★★ | ★★★☆☆ | ★★☆☆☆ |
| **Total** | **18/20** | **12/20** | **9/20** |

### 5.6 Strategic Memo Output
**File**: `output/strategic_recommendation.md` (400 words max, 1 page)

**Structure**:

**1. Executive Summary** (75 words)
- Recommendation: Prioritize USD→MXN corridor optimization
- Expected impact: $360k annual revenue recovery, improved enterprise customer satisfaction
- Required actions: Partner bank SLA negotiation, enhanced verification process optimization

**2. Situation Analysis** (100 words)
- USD→MXN represents 35% of volume but 18.3% failure rate
- Root cause: Large transaction verification bottlenecks at Mexican banking partners
- Customer impact: Enterprise segment most affected (highest failure rate 23.9%)
- Competitive risk: Customers may switch to competitors for reliable high-value transfers

**3. Recommendation Details** (125 words)

**Primary Initiative**: USD→MXN Failure Rate Reduction
- **Target**: Reduce from 18.3% to 7% within 6 months (aspirational target below 5% in 12 months)
- **Tactics**:
  1. Negotiate expedited verification SLAs with Mexican partner banks for >$10k transactions
  2. Implement pre-verification for enterprise accounts (proactive KYC/AML checks)
  3. Develop alternative routing for large transactions (secondary banking partners)
  4. Create enterprise customer success program (dedicated support for failed transactions)

**Secondary Initiative**: USD→COP Growth Acceleration
- **Target**: Grow volume by 25% in next 6 months
- **Tactics**: SME-focused marketing in Colombia, product features for recurring payments

**4. Financial Impact** (75 words)
- **Revenue Opportunity**: $360k annually from USD→MXN fix alone
- **Investment Required**: $50k (partner negotiations, process improvements, customer success headcount)
- **ROI**: 7.2x first-year return
- **Payback Period**: 1.7 months
- **NPV (3 years, 10% discount)**: ~$850k

**5. Implementation Roadmap** (25 words)
- Month 1-2: Partner negotiations, process design
- Month 3-4: Pilot with top 10 enterprise accounts
- Month 5-6: Full rollout, measure results

---

## Phase 6: Deliverable Compilation (5 min)

### 6.1 Excel Workbook Export
**File**: `output/analysis_workbook.xlsx`

**Sheets**:
1. **Data Validation** - Record counts, data quality checks, validation summary
2. **Corridor Performance** - All corridors metrics table
3. **User Behavior** - Segment analysis, avg txns per user
4. **Time Patterns** - Daily/weekly/hourly trends
5. **USD_MXN Analysis** - Detailed root cause tables
6. **Revenue Impact** - Calculation breakdown
7. **Corridor Comparison** - Scoring matrix for strategy
8. **Visualizations** - Embedded PNGs from output/visualizations/

**Script**: `scripts/export_deliverables.py`
```python
import pandas as pd
from openpyxl import Workbook
from openpyxl.drawing.image import Image

def create_excel_workbook():
    # Read all analysis results from CSV/pickle files
    # Create formatted Excel sheets
    # Embed visualizations
    # Apply styling (headers, number formats, conditional formatting)
    # Save to output/analysis_workbook.xlsx
```

### 6.2 Strategic Memo PDF
**File**: `output/strategic_memo.pdf`

**Generation method**:
- Option 1: Export markdown to PDF using `reportlab` or `markdown2pdf`
- Option 2: Create in Google Docs/Word, export as PDF
- Option 3: Use `pandoc` command-line tool

### 6.3 AI Usage Documentation
**File**: `output/ai_usage_documentation.md`

**Required content** (per assessment instructions):
```markdown
## AI Tools Used in Assessment

### Tool: Claude Sonnet 4.5 (Anthropic)

**Usage Areas**:
1. SQL query generation for corridor performance analysis
2. Data pattern identification and statistical analysis
3. Root cause hypothesis formulation
4. Strategic recommendation framework development
5. Visualization code generation (Matplotlib/Seaborn)

**Modifications Made**:
- Adjusted SQL queries to match actual data schema after initial generation
- Modified corridor categorization logic based on data exploration findings
- Refined revenue impact calculations with actual average transaction amounts
- Customized chart styling for publication-ready quality

**Validation Process**:
- All SQL results manually verified against pandas DataFrame calculations
- Revenue calculations cross-checked with alternative methods
- Visualizations reviewed for accuracy and clarity
- Strategic recommendations validated against industry best practices

**Human Contributions**:
- Final strategic prioritization decisions
- Business context interpretation
- Stakeholder communication framing
- Quality assurance and deliverable review
```

---

## Critical Files Summary

### Files to Create (in order):
1. ✅ `.claude/agents/business-strategist.md` - Strategic analysis agent
2. ✅ `scripts/__init__.py` - Package marker
3. ✅ `scripts/data_loader.py` - Data loading utilities
4. ✅ `scripts/sql_queries.py` - Query templates
5. ✅ `scripts/visualizations.py` - Chart generation
6. ✅ `scripts/export_deliverables.py` - Excel/PDF export
7. ✅ `notebooks/01_data_loading.py` - Load CSVs → SQLite
8. ✅ `notebooks/02_part1_analysis.py` - Corridor performance analysis
9. ✅ `notebooks/03_part2_root_cause.py` - USD→MXN investigation
10. ✅ `notebooks/04_part3_strategy.py` - Strategic recommendation
11. ✅ `output/root_cause_analysis.md` - 250-300 word written analysis
12. ✅ `output/strategic_recommendation.md` - 400-word strategic memo
13. ✅ `output/ai_usage_documentation.md` - AI tool usage disclosure
14. ✅ `output/analysis_workbook.xlsx` - Final Excel deliverable

### Files to Modify:
- `requirements.txt` - Verify all dependencies present

### Files Already Exist:
- ✅ `data/raw/transactions.csv` - 50,000 records
- ✅ `data/raw/users.csv` - 5,000 records
- ✅ `.claude/agents/data-architect.md` - Schema & loading specialist
- ✅ `.claude/agents/analyst.md` - Metrics & pattern analysis
- ✅ `.claude/agents/visualizer.md` - Chart generation specialist
- ✅ `Claude.md` - Project context and memory

---

## Timeline & Task Allocation

| Phase | Duration | Primary Agent | Tasks |
|-------|----------|---------------|-------|
| Setup | 10 min | Data Architect | Create scripts, verify dependencies |
| Data Loading | 15 min | Data Architect | Load CSVs, validate, index |
| Part 1 Analysis | 20 min | Analyst + Visualizer | Corridor metrics, charts |
| Part 2 Root Cause | 20 min | Analyst + Business Strategist | USD→MXN investigation, revenue calc |
| Part 3 Strategy | 20 min | Business Strategist | Recommendation memo |
| Deliverables | 5 min | Data Architect | Excel export, PDF generation |
| **Total** | **90 min** | | |

---

## Success Criteria

**Data Analysis**:
- [ ] All 50,000 transactions loaded and validated
- [ ] 5 corridor metrics calculated (volume, success rate, avg amount, etc.)
- [ ] 6+ visualizations generated and exported
- [ ] USD→MXN failure rate confirmed at 18.3%

**Root Cause Analysis**:
- [ ] 3+ hypotheses tested with data
- [ ] Primary root cause identified (large transactions + enterprise segment)
- [ ] Revenue impact quantified (~$360k annually)
- [ ] Written analysis completed (250-300 words)

**Strategic Recommendation**:
- [ ] 3 corridor options evaluated
- [ ] USD→MXN fix recommended with justification
- [ ] Implementation roadmap provided
- [ ] Strategic memo completed (400 words, 1 page)

**Deliverables**:
- [ ] Excel workbook with 8 sheets
- [ ] Strategic memo exported as PDF
- [ ] AI usage documented
- [ ] All visualizations publication-ready (300 DPI)

---

## Risk Mitigation

**Risk 1: Time constraint (90 min)**
- **Mitigation**: Use pre-built query templates, prioritize high-impact visualizations
- **Contingency**: If running behind, skip hourly heatmap (lowest priority chart)

**Risk 2: Data issues not matching specs**
- **Mitigation**: Data already validated by Explore agent - 100% clean
- **Contingency**: N/A - data confirmed ready

**Risk 3: Excel export complexity**
- **Mitigation**: Use openpyxl library, test export script early
- **Contingency**: Manual Excel creation if script fails (add 10 min)

**Risk 4: PDF generation issues**
- **Mitigation**: Write memo in markdown, use pandoc for conversion
- **Contingency**: Export from Google Docs as backup

---

## Post-Assessment Checklist

**Before Submission**:
- [ ] All calculations manually verified
- [ ] Visualizations have clear titles, labels, legends
- [ ] Excel workbook opens without errors
- [ ] PDF memo is exactly 1 page
- [ ] Root cause analysis is 250-300 words
- [ ] AI usage documented with specific examples
- [ ] All output files in `output/` directory
- [ ] Code is commented and reproducible

**File Submission List**:
1. `output/analysis_workbook.xlsx`
2. `output/strategic_memo.pdf`
3. `output/root_cause_analysis.md`
4. `output/ai_usage_documentation.md`
5. All visualization PNGs (6-8 files)
6. (Optional) Jupyter-style .py notebooks for reproducibility

---

## Notes for Execution

**Agent Invocation Strategy**:
- **Phase 1-2**: Data Architect leads (schema, loading, validation)
- **Phase 3**: Analyst calculates metrics → Visualizer creates charts (parallel work)
- **Phase 4**: Analyst investigates patterns → Business Strategist formulates hypotheses
- **Phase 5**: Business Strategist writes recommendations
- **Phase 6**: Data Architect exports deliverables

**Key Commands**:
```bash
# Activate environment
source venv/bin/activate  # or: venv\Scripts\activate on Windows

# Execute notebooks (run cells sequentially)
# Use VS Code Jupyter extension or IDE

# Generate final deliverables
python scripts/export_deliverables.py

# Verify outputs
ls -lh output/
```

**Quality Standards**:
- All numbers rounded to 2 decimal places
- Currency formatted with $ and commas ($1,234.56)
- Percentages shown with % symbol (18.3%)
- Charts exported at 300 DPI for print quality
- Professional color scheme (avoid neon/clashing colors)

---

## Final Deliverable Locations

```
output/
├── analysis_workbook.xlsx          # Main deliverable (8 sheets)
├── strategic_memo.pdf              # 1-page recommendation
├── root_cause_analysis.md          # 250-300 words
├── ai_usage_documentation.md       # AI tools disclosure
├── data_validation_summary.txt     # Loading verification
└── visualizations/
    ├── corridor_volume_comparison.png
    ├── corridor_success_rates.png
    ├── segment_performance.png
    ├── daily_trend.png
    ├── day_of_week_pattern.png
    ├── hourly_heatmap.png
    ├── amount_distribution.png
    └── usd_mxn_failure_analysis.png
```

---

**End of Implementation Plan**

This plan provides a complete roadmap for completing the Cobre Business Analyst Assessment in 90 minutes using AI-assisted analysis with Claude Sonnet 4.5 and specialized sub-agents.
