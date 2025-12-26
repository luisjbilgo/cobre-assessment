# Cobre Business Analyst Assessment - Payment Corridor Analysis

## Executive Summary

**Project**: Transaction Corridor Analysis for Cobre Fintech
**Objective**: Analyze 50,000 cross-border payment transactions across 6 months to identify optimization opportunities and strategic growth corridors
**Timeline**: 90 minutes assessment divided into 3 parts
**Critical Problem**: USD→MXN corridor showing 15% failure rate vs 5% company average
**Expected Output**: Data analysis workbook + root cause analysis (250-300 words) + strategic recommendation memo (1 page)

## Project Architecture

### Tech Stack
- **Python 3.12**: Core language
- **Pandas**: Data manipulation and analysis
- **SQLite (in-memory)**: Fast querying without persistent storage overhead
- **SQLAlchemy**: SQL interface and query building
- **Matplotlib/Seaborn**: Visualization library
- **Jupyter-style .py files**: Using `# %%` cells for LLM-friendly format

### Why These Choices?
- **SQLite in-memory**: Faster than file-based DB for 50k records, no cleanup needed
- **.py with # %% instead of .ipynb**: Better git diffs, easier for Claude Code to read/edit, same cell execution
- **Pandas + SQL hybrid**: Pandas for complex transformations, SQL for aggregations and filtering
- **Matplotlib/Seaborn**: Standard, well-documented, sufficient for assessment deliverables

## Data Specifications

### transactions.csv (50,000 records)
```
transaction_id      | String  | TXN_001234 (unique)
user_id            | String  | USR_0045 (FK to users)
transaction_date   | Date    | YYYY-MM-DD (Jul-Dec 2025)
transaction_time   | Time    | HH:MM:SS (24-hour)
corridor           | String  | USD_MXN, USD_COP, MXN_COP, etc.
amount_usd         | Float   | Transaction value in USD
status             | String  | "success" or "failed"
source_country     | String  | US, MX, CO
destination_country| String  | US, MX, CO
user_segment       | String  | enterprise, sme, retail
```

### users.csv (5,000 records)
```
user_id           | String  | USR_0045 (PK)
country           | String  | Mexico, Colombia
user_segment      | String  | enterprise, sme, retail
registration_date | Date    | YYYY-MM-DD
status            | String  | active, inactive
```

### Known Data Patterns
**Corridor Distribution** (by volume):
- USD→MXN: 35%
- USD→COP: 30%
- MXN→COP: 15%
- COP→USD: 12%
- MXN→USD: 8%

**Failure Rate Problem** (USD→MXN corridor):
- Overall average: 5%
- USD→MXN: 15% ⚠️
- Retail segment: 20% failure
- Transactions >$10k: 25% failure
- Fridays: 18% failure

## Project Structure
```
cobre-business-analyst-assessment/
├── data/
│   ├── raw/                    # Original CSVs (not tracked)
│   │   ├── transactions.csv
│   │   └── users.csv
│   └── processed/              # Cleaned/enriched data
│       └── transactions_enriched.csv
├── notebooks/
│   ├── 01_data_loading.py      # Load CSVs → SQLite in-memory
│   ├── 02_part1_analysis.py    # Corridor performance, user behavior, time patterns
│   ├── 03_part2_root_cause.py  # USD→MXN failure investigation
│   └── 04_part3_strategy.py    # Corridor recommendation
├── output/
│   ├── visualizations/         # PNG exports for submission
│   ├── analysis_workbook.xlsx  # Consolidated findings
│   └── strategic_memo.pdf      # Final recommendation
├── scripts/
│   ├── __init__.py
│   ├── data_loader.py          # CSV → DataFrame utilities
│   ├── sql_queries.py          # Reusable query templates
│   └── visualizations.py       # Chart generation functions
├── spec/
│   └── analysis_plan.md        # Detailed implementation plan per part
├── .claude/
│   └── agents/                 # Specialized subagents
│       ├── data-architect.md
│       ├── analyst.md
│       ├── visualizer.md
│       └── business-strategist.md
├── claude.md                    # THIS FILE - persistent memory
├── README.md
├── requirements.txt
└── .gitignore
```

## Key Technical Decisions

### 1. Why SQLite in-memory?
- 50k records = ~10MB, fits comfortably in RAM
- No file I/O overhead, 10-100x faster than pandas for aggregations
- Disposable: No cleanup needed after analysis
- SQL practice: Demonstrates query skills for assessment

### 2. Why .py files with # %% instead of .ipynb?
- Better for Claude Code: Plain text, easier to read/edit/diff
- Version control friendly: No JSON noise in git history
- Same workflow: VS Code and IDEs execute cells identically
- LLM-optimized: Claude can view entire file context efficiently

### 3. Analysis workflow
```
1. Load → SQLite in-memory (data_loader.py)
2. Explore → SQL queries (sql_queries.py)
3. Analyze → Pandas DataFrames (notebooks/*.py)
4. Visualize → Matplotlib/Seaborn (visualizations.py)
5. Export → Excel + PDF (output/)
```

## Critical Findings (Updated During Analysis)

### Part 1: Corridor Performance
<!-- To be filled by Analyst agent -->

### Part 2: USD→MXN Root Cause
<!-- To be filled by Analyst + Business Strategist -->
**Revenue Impact Formula**: 
```
Monthly Loss = (Failed Transactions × Avg Amount × 0.5% fee)
Potential Gain = (Current Loss × (15% - 5%) / 15%)
```

### Part 3: Strategic Recommendation
<!-- To be filled by Business Strategist -->

## Frequent Commands
```bash
# Environment setup
python -m venv .venv
source .venv/bin/activate  # Unix
.venv\Scripts\activate     # Windows
pip install -r requirements.txt

# Run analysis notebooks (execute cells in order)
# Use VS Code Jupyter extension or IDE with Python cell support

# Export final deliverables
python scripts/export_deliverables.py

# Regenerate visualizations
python scripts/visualizations.py --all
```

## Session Checkpoints

- [ ] Environment configured, dependencies installed
- [ ] CSVs loaded into SQLite in-memory successfully
- [ ] Part 1 analysis complete (corridor metrics, user behavior, time patterns)
- [ ] Part 2 root cause analysis complete (USD→MXN failure investigation)
- [ ] Part 3 strategic recommendation complete (1 corridor prioritized)
- [ ] Visualizations exported to output/visualizations/
- [ ] Excel workbook generated with all calculations
- [ ] Strategic memo drafted and exported as PDF
- [ ] AI usage documented in submission

## AI Tools Used (Document for Submission)
<!-- Example format required by assessment:
- Claude Sonnet 4.5: SQL query generation, data pattern analysis, memo drafting
- Modified queries to match actual data structure after initial generation
- Validated all calculations manually before including in deliverables
-->

## Notes for Future Sessions
- Remember to activate .venv before running any scripts
- SQLite database is in-memory, must reload CSVs each session
- All visualizations should be publication-ready (titles, labels, legends)
- Keep memo to exactly 400 words (strategic recommendation)
- Revenue calculations assume 0.5% fee on successful transactions only