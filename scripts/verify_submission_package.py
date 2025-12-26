"""
Verification Script for Cobre Business Analyst Assessment Submission

This script verifies all required deliverables are present and ready for submission.
"""

from pathlib import Path
import sys


def verify_deliverables():
    """Verify all required assessment deliverables are present."""

    print("\n" + "="*80)
    print("COBRE BUSINESS ANALYST ASSESSMENT - SUBMISSION VERIFICATION")
    print("="*80 + "\n")

    # Required deliverables
    required_files = {
        'Core Deliverables': [
            ('output/analysis_workbook.xlsx', 'Excel workbook with 11 analysis sheets'),
            ('output/root_cause_analysis.md', 'USD→MXN root cause analysis (250-300 words)'),
            ('output/strategic_recommendation.md', 'Strategic corridor memo (1 page)'),
            ('output/ai_usage_documentation.md', 'AI transparency report'),
        ],
        'Visualizations (6-8 required)': [
            ('output/visualizations/corridor_volume_comparison.png', 'Corridor volume chart'),
            ('output/visualizations/corridor_failure_rates.png', 'Corridor failure rates'),
            ('output/visualizations/segment_performance.png', 'User segment analysis'),
            ('output/visualizations/daily_trend.png', 'Daily transaction trends'),
            ('output/visualizations/day_of_week_pattern.png', 'Day-of-week patterns'),
            ('output/visualizations/amount_distribution.png', 'Transaction amount distribution'),
            ('output/visualizations/usd_mxn_failure_analysis.png', 'USD→MXN root cause charts'),
        ],
        'Supporting Files (Optional)': [
            ('output/data_validation_summary.txt', 'Data quality report'),
            ('spec/00_general_implementation_plan.md', 'Complete implementation plan'),
        ]
    }

    all_present = True
    missing_files = []

    for category, files in required_files.items():
        print(f"\n{category}:")
        print("-" * 80)

        for file_path, description in files:
            path = Path(file_path)
            if path.exists():
                size = path.stat().st_size
                size_kb = size / 1024
                if size_kb < 1:
                    size_str = f"{size} bytes"
                elif size_kb < 1024:
                    size_str = f"{size_kb:.1f} KB"
                else:
                    size_str = f"{size_kb/1024:.1f} MB"

                print(f"  ✅ {file_path}")
                print(f"     {description} ({size_str})")
            else:
                print(f"  ❌ {file_path}")
                print(f"     {description} - MISSING")
                missing_files.append(file_path)
                if 'Optional' not in category:
                    all_present = False

    # Word count verification for written documents
    print("\n" + "="*80)
    print("WORD COUNT VERIFICATION")
    print("="*80)

    # Root cause analysis (target: 250-300 words)
    root_cause_path = Path('output/root_cause_analysis.md')
    if root_cause_path.exists():
        with open(root_cause_path, 'r', encoding='utf-8') as f:
            content = f.read()
            word_count = len(content.split())
            status = "✅" if 250 <= word_count <= 350 else "⚠️"
            print(f"\n{status} Root Cause Analysis:")
            print(f"   Words: {word_count} (target: 250-300)")
            if word_count < 250:
                print("   Warning: Below minimum word count")
            elif word_count > 350:
                print("   Warning: May exceed 1 page")

    # Strategic memo (target: ~400 words, max 1 page)
    strategic_path = Path('output/strategic_recommendation.md')
    if strategic_path.exists():
        with open(strategic_path, 'r', encoding='utf-8') as f:
            content = f.read()
            word_count = len(content.split())
            status = "✅" if word_count <= 500 else "⚠️"
            print(f"\n{status} Strategic Recommendation:")
            print(f"   Words: {word_count} (target: ~400, max 500)")
            if word_count > 500:
                print("   Warning: May exceed 1-page limit")

    # Summary
    print("\n" + "="*80)
    print("SUBMISSION PACKAGE SUMMARY")
    print("="*80)

    if all_present:
        print("\n✅ ALL REQUIRED DELIVERABLES PRESENT")
        print("\n📦 Your submission package includes:")
        print("   • Excel workbook with comprehensive analysis (11 sheets)")
        print("   • Root cause analysis document (250-300 words)")
        print("   • Strategic recommendation memo (1 page)")
        print("   • AI usage transparency report")
        print("   • 7 publication-ready visualizations (300 DPI)")
        print("   • Supporting documentation")

        print("\n🎯 READY FOR SUBMISSION!")

        print("\n📋 Recommended Submission Package:")
        print("   1. output/analysis_workbook.xlsx")
        print("   2. output/root_cause_analysis.md (or PDF)")
        print("   3. output/strategic_recommendation.md (or PDF)")
        print("   4. output/ai_usage_documentation.md")
        print("   5. output/visualizations/ (entire folder)")
        print("   6. (Optional) notebooks/ for reproducibility")

        return 0
    else:
        print("\n⚠️  SOME REQUIRED DELIVERABLES MISSING")
        print("\nMissing files:")
        for file in missing_files:
            print(f"   • {file}")

        print("\n💡 To generate missing files:")
        print("   1. Run notebooks in order: 01 → 02 → 03 → 04")
        print("   2. Or run: python scripts/generate_all_deliverables.py")

        return 1


if __name__ == "__main__":
    exit_code = verify_deliverables()
    sys.exit(exit_code)
