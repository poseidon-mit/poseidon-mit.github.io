現在のUIに関し、MITのユーザがQRコード経由でアクセスした際にUI/UXを最大化することで私のMIT最終プレゼンのインパクトを最大化するためのWebシステム全体を通じたレビューを行なってほしい。

開発コストは度外視で問題ないため、発見事項はabc/配下のどこかのファイルに実行AIが対応できるように全文を保存してほしい。まずは現状理解のDeep Researchから開始せよ。モバイルのレイアウトに問題があること、全体的に画面が明るすぎてユーザが見ていて疲れること、文字が多いこと、は対応が必要な課題と認識している。

必要な確認事項は質問してください。

---

```plaintext
================================================================================
POSEIDON.AI — COMPLETE PROJECT HANDOFF DOCUMENT FOR LOVABLE
================================================================================
Version: 1.0
Date: March 2026
Purpose: Full system review and implementation in Lovable
================================================================================


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PART 1: PROJECT OVERVIEW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1.1 WHAT IS POSEIDON.AI
───────────────────────────────────────────────────────────────────────────────

Poseidon.AI is an AI-native personal finance platform prototype built for the
MIT Professional Education CTO Program capstone project (Group 7).

TAGLINE: "The Trusted AI-Native Money Platform"

CORE VALUE PROPOSITION:
Poseidon solves the COORDINATION GAP in personal finance:
- Banks, credit cards, investments, and budgets are fragmented
- Users manually integrate across these services
- Poseidon uses AI to coordinate with full auditability

ARCHITECTURE PRINCIPLE:
"Deterministic models compute. GenAI explains. AI Agents execute. 
 Humans confidently approve."

PROTOTYPE NATURE:
- Fully interactive demo with hardcoded mock data
- NOT connected to real bank APIs
- Must feel like a production-ready fintech app
- Users should think "I would trust this with my money"

AUDIENCE:
- MIT faculty and program directors
- Fintech industry professionals
- Potential investors and partners
- CTO Program peers


1.2 SUCCESS CRITERIA
───────────────────────────────────────────────────────────────────────────────

1. IMMEDIATE WOW — First impression impresses in 3-5 seconds
2. TRUST — Looks like a real fintech app users would trust
3. CLARITY — AI value proposition understood instantly
4. CONSISTENCY — Every screen follows the same design system
5. PERFORMANCE — Works smoothly on mobile (QR code demo assumed)
6. CROSS-PLATFORM — Windows, Mac, iOS, Android, Safari, Chrome, Edge


1.3 FOUR ENGINES + DASHBOARD ARCHITECTURE
───────────────────────────────────────────────────────────────────────────────

┌─────────────┬────────────┬──────────────┬─────────────────────────────────────┐
│ Engine      │ Color      │ Icon         │ Purpose                             │
├─────────────┼────────────┼──────────────┼─────────────────────────────────────┤
│ Dashboard   │ Cyan       │ LayoutDash   │ Command center: unified view        │
│             │ #06B6D4    │              │ of top risk + savings + action      │
├─────────────┼────────────┼──────────────┼─────────────────────────────────────┤
│ Protect     │ Green      │ Shield       │ ML threat detection: fraud,         │
│             │ #22C55E    │              │ anomalies, subscription waste       │
├─────────────┼────────────┼──────────────┼─────────────────────────────────────┤
│ Grow        │ Purple     │ TrendingUp   │ Financial recommendations:          │
│             │ #8B5CF6    │              │ savings, debt, portfolio            │
├─────────────┼────────────┼──────────────┼─────────────────────────────────────┤
│ Execute     │ Yellow     │ Zap          │ Human-approval-first automated      │
│             │ #EAB308    │              │ execution of all actions            │
├─────────────┼────────────┼──────────────┼─────────────────────────────────────┤
│ Govern      │ Blue       │ FileText     │ Full auditability: every AI         │
│             │ #3B82F6    │              │ decision logged with evidence       │
└─────────────┴────────────┴──────────────┴─────────────────────────────────────┘


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PART 2: PERSONA & MOCK DATA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

2.1 PRIMARY PERSONA: SHINJI FUJIWARA
───────────────────────────────────────────────────────────────────────────────

Name:           Shinji Fujiwara
Age:            42
Location:       Palo Alto, CA
Occupation:     VP of Engineering at Stripe
Income:         $350,000/year + equity
Family:         Wife (40), two daughters (10 and 8), toy poodle named Cocoa
Risk Tolerance: Moderate

Goals:
- Maximize tax efficiency
- Fund daughters' education (529 plans)
- Build retirement wealth
- Maintain 6-month emergency fund

Pain Points:
- Too busy to manually track multiple accounts
- Worried about security across fragmented accounts
- Knows idle cash is losing value to inflation
- Wants automation but with full control


2.2 ACCOUNT DATA (USE ACROSS ALL SCREENS)
───────────────────────────────────────────────────────────────────────────────

CHECKING & SAVINGS:
┌─────────────────────────────────┬────────────────┬───────────────────────────┐
│ Account                         │ Balance        │ Notes                     │
├─────────────────────────────────┼────────────────┼───────────────────────────┤
│ Chase Total Checking (...4521)  │ $24,680.50     │ Primary account           │
│ Chase Savings (...7654)         │ $18,500.00     │ 0.01% APY (low)           │
│ Marcus High-Yield (...3398)     │ $35,000.00     │ 4.5% APY                  │
│ Emergency Fund (...8821)        │ $42,000.00     │ 6-month runway            │
└─────────────────────────────────┴────────────────┴───────────────────────────┘

CREDIT CARDS:
┌─────────────────────────────────┬────────────────┬───────────────────────────┐
│ Card                            │ Balance        │ Limit / Due               │
├─────────────────────────────────┼────────────────┼───────────────────────────┤
│ Amex Platinum (...4821)         │ -$4,892.30     │ $50K / Mar 25             │
│ Chase Sapphire Reserve (...9012)│ -$2,156.45     │ $35K / Mar 18             │
└─────────────────────────────────┴────────────────┴───────────────────────────┘

INVESTMENTS (Fidelity):
┌─────────────────────────────────┬────────────────┬───────────────────────────┐
│ Account                         │ Balance        │ YTD Return                │
├─────────────────────────────────┼────────────────┼───────────────────────────┤
│ 401(k) (...8832)                │ $485,230.18    │ +8.2%                     │
│ Roth IRA (...6654)              │ $128,540.92    │ +7.8%                     │
│ Brokerage (...2201)             │ $92,850.67     │ +5.4%                     │
└─────────────────────────────────┴────────────────┴───────────────────────────┘

EDUCATION (529 Plans):
┌─────────────────────────────────┬────────────────┬───────────────────────────┐
│ Account                         │ Balance        │ Beneficiary               │
├─────────────────────────────────┼────────────────┼───────────────────────────┤
│ Daughter 1 - 529 (...1122)      │ $45,000.00     │ Sakura (10)               │
│ Daughter 2 - 529 (...3344)      │ $38,000.00     │ Hana (8)                  │
└─────────────────────────────────┴────────────────┴───────────────────────────┘

BALANCE SHEET SUMMARY:
┌─────────────────────────────────┬────────────────┐
│ Total Assets                    │ $909,802.27    │
│ Total Liabilities               │ -$7,048.75     │
│ Net Worth                       │ $902,753.52    │
└─────────────────────────────────┴────────────────┘


2.3 SUBSCRIPTION DATA
───────────────────────────────────────────────────────────────────────────────

┌────────────────────┬──────────┬────────────┬─────────────────────────────────┐
│ Service            │ Monthly  │ Annual     │ Status / Issues                 │
├────────────────────┼──────────┼────────────┼─────────────────────────────────┤
│ Netflix            │ $22.99   │ $275.88    │ Active (Premium)                │
│ Spotify Family     │ $16.99   │ $203.88    │ Active                          │
│ NYTimes            │ $17.00   │ $204.00    │ PRICE INCREASE (+$5)            │
│ Amazon Prime       │ $14.99   │ $179.88    │ Active                          │
│ Adobe Creative     │ $59.99   │ $719.88    │ DUPLICATE CHARGE DETECTED       │
│ iCloud 2TB         │ $9.99    │ $119.88    │ Active                          │
│ YouTube Premium    │ $22.99   │ $275.88    │ Active (Family)                 │
│ Equinox Gym        │ $285.00  │ $3,420.00  │ LOW USAGE (2x in 3 months)      │
├────────────────────┼──────────┼────────────┼─────────────────────────────────┤
│ TOTAL              │ $449.94  │ $5,399.28  │                                 │
└────────────────────┴──────────┴────────────┴─────────────────────────────────┘


2.4 MONTHLY SPENDING (February 2026)
───────────────────────────────────────────────────────────────────────────────

┌────────────────────┬────────────┬──────────┬─────────────────────────────────┐
│ Category           │ Amount     │ % Total  │ Notable                         │
├────────────────────┼────────────┼──────────┼─────────────────────────────────┤
│ Housing            │ $8,500.00  │ 42.5%    │ Mortgage + HOA                  │
│ Food & Dining      │ $2,890.45  │ 14.5%    │ +12% vs last month              │
│ Transportation     │ $1,450.00  │ 7.3%     │ Tesla lease + charging          │
│ Subscriptions      │ $449.94    │ 2.2%     │ +$5 (NYT increase)              │
│ Shopping           │ $1,567.23  │ 7.8%     │ Kids activities, household      │
│ Entertainment      │ $734.50    │ 3.7%     │ FLAGGED: Oslo Electronics       │
│ Utilities          │ $456.78    │ 2.3%     │ —                               │
│ Healthcare         │ $389.00    │ 1.9%     │ —                               │
│ Education (529)    │ $1,666.67  │ 8.3%     │ Monthly contribution            │
│ Pet Care           │ $269.00    │ 1.3%     │ Cocoa grooming + vet            │
│ Travel             │ $1,200.00  │ 6.0%     │ —                               │
│ Other              │ $426.43    │ 2.1%     │ —                               │
├────────────────────┼────────────┼──────────┼─────────────────────────────────┤
│ TOTAL              │ $20,000.00 │ 100%     │                                 │
└────────────────────┴────────────┴──────────┴─────────────────────────────────┘


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PART 3: ENGINE-SPECIFIC SCENARIOS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

3.1 PROTECT ENGINE — ACTIVE THREATS (OSLO STORY)
───────────────────────────────────────────────────────────────────────────────

The "Oslo Story" is our primary demo narrative: A coordinated fraud attempt
from Oslo, Norway that Poseidon detected and blocked.

THREAT #1 — HIGH SEVERITY [PENDING]
ID: THR-001
Title: Unusual Login from New Device
Description: Login detected from Oslo, Norway using Chrome on Windows
Timestamp: March 10, 2026 at 3:42 AM PST
Account: Chase Total Checking (...4521)
Device: Windows 11, Chrome 122.0
Location: Oslo, Norway (IP: 194.19.235.xxx)
Confidence: 94% (High)
Model: POSEIDON-THREATDETECT V1.0

Decision Drivers (SHAP-style):
  Geographic Anomaly:     +0.35
  Device Fingerprint:     +0.28
  Time Pattern:           +0.18
  Velocity Check:         +0.13
  ─────────────────────────────
  Final Risk Score:       0.94

Actions: "This was Me" / "Block & Secure"


THREAT #2 — HIGH SEVERITY [PENDING]
ID: THR-002
Title: Suspicious Transaction at Unknown Merchant
Description: Card-not-present transaction at OSLO ELECTRONICS
Amount: $734.50
Timestamp: March 10, 2026 at 3:47 AM PST
Card: Amex Platinum (...4821)
Merchant: OSLO ELECTRONICS (Oslo, Norway)
Confidence: 91% (High)
Model: POSEIDON-THREATDETECT V1.0

Decision Drivers:
  Merchant History:       +0.32
  Geographic Pattern:     +0.28
  Transaction Type:       +0.18
  Timing Correlation:     +0.13
  ─────────────────────────────
  Final Risk Score:       0.91

Actions: "This was Me" / "Block & Secure"


THREAT #3 — MEDIUM SEVERITY [PENDING]
ID: THR-003
Title: Subscription Price Increase Detected
Description: NYTimes increased from $12.00 to $17.00/month (+41.7%)
Amount Change: +$5.00/month (+$60/year)
First Noticed: January 15, 2026
Times Charged at New Rate: 2
Confidence: 78% (Medium)

Actions: "Keep Subscription" / "Cancel"


THREAT #4 — MEDIUM SEVERITY [PENDING]
ID: THR-004
Title: Duplicate Charge Detected
Description: Adobe Creative Cloud charged twice on Feb 15
Amount: $59.99 x 2 = $119.98
Recommended: Request refund
Confidence: 85% (High)

Actions: "Request Refund" / "Dismiss"


THREAT #5 — LOW SEVERITY [DISMISSED]
ID: THR-005
Title: Password Changed on Linked Account
Description: Fidelity password changed from Palo Alto IP
Timestamp: March 8, 2026 at 2:15 PM PST
Status: Dismissed by user (intentional)


PROTECT SUMMARY:
- Transactions Monitored: 1,247
- Threats Detected: 5
- Threats Blocked: 2
- Potential Loss Prevented: $734.50
- Coverage: 100% of linked accounts


3.2 GROW ENGINE — ACTIVE RECOMMENDATIONS
───────────────────────────────────────────────────────────────────────────────

RECOMMENDATION #1 — HIGH VALUE [PENDING]
ID: GRW-001
Title: Move Idle Cash to High-Yield Savings
Description: Transfer $18,500 from Chase Savings (0.01% APY) to Marcus (4.50% APY)
Annual Benefit: $831.43 in additional interest
Risk: None (FDIC insured)
Effort: 5 minutes
Confidence: High

Calculation:
  Idle Cash:              $18,500
  Current Interest:       $1.85/year (0.01%)
  Proposed Interest:      $832.50/year (4.50%)
  Net Benefit:            $830.65/year


RECOMMENDATION #2 — HIGH VALUE [PENDING]
ID: GRW-002
Title: Maximize 529 Contribution
Description: Increase monthly 529 contribution by $500/child
Current: $833.33/child/month
Proposed: $1,333.33/child/month
Tax Benefit: $600/year (CA state deduction)
Confidence: High


RECOMMENDATION #3 — MEDIUM VALUE [PENDING]
ID: GRW-003
Title: Review Underused Gym Membership
Description: Equinox used only 2 times in 3 months
Monthly Cost: $285.00
Cost per Visit: $427.50
Alternative: Bay Club at $175/month
Annual Savings: $1,320.00
Confidence: Medium


RECOMMENDATION #4 — MEDIUM VALUE [APPROVED]
ID: GRW-004
Title: Tax-Loss Harvesting Opportunity
Description: Sell VTI to harvest $3,200 tax loss
Tax Savings: $1,065.60
Status: Approved March 5, 2026
Confidence: High


GROW SUMMARY:
- Total Savings Identified: $3,601.68/year
- Savings Realized: $1,065.60
- Pending Opportunities: $2,536.08
- Recommendations Generated: 12 (this quarter)
- Acceptance Rate: 67%


3.3 EXECUTE ENGINE — PENDING APPROVALS
───────────────────────────────────────────────────────────────────────────────

ACTION #1 — TAX-LOSS HARVEST [PENDING]
ID: EXE-001
Title: Tax-Loss Harvesting Opportunity
Description: Sell VTI to harvest $3,200 tax loss
Account: Fidelity Individual Brokerage (...2201)
Position: 120 shares VTI
Cost Basis: $25,450
Current Value: $22,250
Unrealized Loss: -$3,200
Confidence: 87%
Model: POSEIDON-TAXOPTIMIZER V2.3

Tax Benefit Calculation:
  Federal (32%):          $1,024.00
  State CA (9.3%):        $297.60
  NIIT (3.8%):            $121.60
  Total Tax Savings:      $1,443.20

Deadline: March 31, 2026 (Q1 end)

Decision Drivers:
  Tax Bracket Optimization:  +0.32
  Market Timing:             +0.24
  Wash Sale Compliance:      +0.18
  Loss Magnitude:            +0.13
  ─────────────────────────────
  Final Confidence:          0.87

Actions: "Approve" / "Reject"


ACTION #2 — AUTOMATIC TRANSFER [PENDING]
ID: EXE-002
Title: Monthly High-Yield Savings Transfer
Description: Transfer $2,000 to Marcus HYSA
From: Chase Total Checking (...4521)
To: Marcus High-Yield Savings (...3398)
Schedule: Monthly on 15th
Status: Awaiting first approval

Actions: "Approve" / "Reject"


ACTION #3 — 529 CONTRIBUTION [COMPLETED]
ID: EXE-003
Title: Monthly 529 Contribution
Description: Contributed $1,666.67 to daughters' 529 plans
Amount: $833.33 x 2 accounts
Status: Auto-executed March 1, 2026
Approval: Pre-approved via settings


ACTION #4 — DISPUTE FILING [PENDING]
ID: EXE-004
Title: Request Adobe Duplicate Charge Refund
Description: Automated dispute via Amex
Amount: $59.99
Status: Awaiting approval

Actions: "Approve" / "Reject"


EXECUTE SUMMARY:
- Pending Approvals: 3
- Completed This Month: 7
- Total Value Executed: $42,847.32
- Tax Savings (Pending): $1,443.20
- Automation Rate: 45%


3.4 GOVERN ENGINE — AUDIT RECORDS
───────────────────────────────────────────────────────────────────────────────

RECORD #AUD-2026-0312-001
Timestamp: March 10, 2026 at 3:42:17 AM PST
Engine: Protect
Action: Threat Detection
Model: POSEIDON-THREATDETECT V1.0
Confidence: 0.94
Processing: 234ms
Status: Pending user action

RECORD #AUD-2026-0312-002
Timestamp: March 10, 2026 at 3:47:23 AM PST
Engine: Protect
Action: Transaction Analysis
Model: POSEIDON-THREATDETECT V1.0
Confidence: 0.91
Processing: 187ms
Status: Pending user action

RECORD #AUD-2026-0310-001
Timestamp: March 10, 2026 at 9:15:00 AM PST
Engine: Grow
Action: Opportunity Analysis
Model: POSEIDON-WEALTHOPTIMIZER V1.2
Confidence: 0.92
Processing: 1,247ms
Status: Pending user action

RECORD #AUD-2026-0309-001
Timestamp: March 9, 2026 at 4:30:00 PM PST
Engine: Execute
Action: 529 Contribution
Model: POSEIDON-EXECUTOR V1.1
Confidence: 0.98
Processing: 89ms
Status: Completed

RECORD #AUD-2026-0308-001
Timestamp: March 8, 2026 at 9:00:00 AM PST
Engine: Protect
Action: Account Change Detection
Model: POSEIDON-THREATDETECT V1.0
Confidence: 0.76
Processing: 156ms
Status: Dismissed by user

RECORD #AUD-2026-0307-001
Timestamp: March 7, 2026 at 11:20:00 AM PST
Engine: Grow
Action: Tax Optimization Analysis
Model: POSEIDON-TAXOPTIMIZER V2.3
Confidence: 0.87
Processing: 2,341ms
Status: Approved by user


GOVERN SUMMARY:
- Total Audit Records: 2,847
- Records This Month: 342
- Average Processing: 456ms
- Model Accuracy (90-day): 97.2%
- User Override Rate: 8.3%
- Coverage: 100% Auditable


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PART 4: DESIGN SYSTEM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

4.1 COLOR PALETTE
───────────────────────────────────────────────────────────────────────────────

BACKGROUNDS:
  Page:        #F8F7F4  (warm off-white)
  Card:        #FFFFFF  (white)
  Hover:       #F9FAFB  (gray-50)
  Selected:    #F3F4F6  (gray-100)

TEXT:
  Primary:     text-gray-900   (headings, important)
  Secondary:   text-gray-600   (body, descriptions)
  Tertiary:    text-gray-500   (captions, timestamps)
  Muted:       text-gray-400   (placeholders)
  Link:        text-blue-600   hover:text-blue-700

ENGINE COLORS (background / icon / badge):
  Dashboard:   bg-cyan-100   / text-cyan-600   / cyan badge
  Protect:     bg-green-100  / text-green-600  / green badge
  Grow:        bg-purple-100 / text-purple-600 / purple badge
  Execute:     bg-yellow-100 / text-yellow-600 / yellow badge
  Govern:      bg-blue-100   / text-blue-600   / blue badge

SEMANTIC COLORS:
  Success:     green-500/600
  Warning:     amber-500/600
  Danger:      red-500/600
  Info:        blue-500/600

SEVERITY BADGES:
  High:        bg-red-100 text-red-700 border-red-200
  Medium:      bg-amber-100 text-amber-700 border-amber-200
  Low:         bg-blue-100 text-blue-700 border-blue-200


4.2 TYPOGRAPHY
───────────────────────────────────────────────────────────────────────────────

FONTS:
  Sans:        'Geist', system-ui, sans-serif
  Mono:        'Geist Mono', monospace (for numbers, IDs)

HEADINGS:
  Page Title:  text-2xl font-bold text-gray-900
  Section:     text-lg font-semibold text-gray-900
  Card Title:  text-base font-semibold text-gray-900

BODY:
  Primary:     text-sm text-gray-600
  Secondary:   text-xs text-gray-500

NUMBERS (CRITICAL):
  Large Stats: text-2xl sm:text-4xl font-bold font-mono
  Currency:    font-mono tabular-nums


4.3 SPACING SYSTEM
───────────────────────────────────────────────────────────────────────────────

PAGE CONTAINER:
  mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8

SECTION GAP:
  Between major sections: mt-8
  Between related items:  mt-6
  Between cards in grid:  gap-4

CARD PADDING:
  Standard:    p-4 sm:p-6
  Compact:     p-4
  List items:  p-4


4.4 ICON SYSTEM
───────────────────────────────────────────────────────────────────────────────

ICON SIZES:
  Page header:     h-5 w-5 (in h-10 w-10 container)
  Summary card:    h-5 w-5 or h-6 w-6 (in h-10/h-12 container)
  List item:       h-5 w-5 (in h-10 w-10 container)
  Button inline:   h-4 w-4
  Badge inline:    h-3 w-3

ENGINE ICONS (lucide-react):
  Dashboard:   LayoutDashboard
  Protect:     Shield
  Grow:        TrendingUp
  Execute:     Zap
  Govern:      FileText

ICON CONTAINERS:
  Page header:  rounded-xl
  Others:       rounded-full


4.5 COMPONENT STANDARDS
───────────────────────────────────────────────────────────────────────────────

PAGE HEADER:
<div className="flex items-center gap-3">
  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-{engine}-100">
    <Icon className="h-5 w-5 text-{engine}-600" />
  </div>
  <div>
    <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
    <p className="text-gray-600">{description}</p>
  </div>
</div>

SUMMARY CARD:
<Card className="bg-white border-gray-200">
  <CardContent className="flex items-center gap-3 p-4">
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-{color}-100">
      <Icon className="h-5 w-5 text-{color}-600" />
    </div>
    <div>
      <p className="text-2xl font-bold text-gray-900 font-mono">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  </CardContent>
</Card>

ACTION BUTTONS (for detail pages):
<div className="flex flex-col gap-3 sm:flex-row">
  <Button 
    size="lg" 
    className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold 
               py-4 rounded-xl shadow-lg shadow-green-500/25"
  >
    Positive Action
  </Button>
  <Button 
    size="lg" 
    variant="destructive"
    className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold 
               py-4 rounded-xl shadow-lg shadow-red-500/25"
  >
    Negative Action
  </Button>
</div>


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PART 5: UX PATTERNS (CRITICAL)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

5.1 INFORMATION HIERARCHY
───────────────────────────────────────────────────────────────────────────────

DETAIL PAGE LAYOUT (Top to Bottom):
1. BACK LINK — Always at top
2. SUMMARY   — Brief overview, key metrics (always visible)
3. ACTIONS   — Primary decision buttons (prominent, ABOVE FOLD)
4. DETAILS   — Detailed information (COLLAPSIBLE by default, CLOSED)

USE COLLAPSIBLE FOR:
- Transaction details
- Device/location information
- Decision drivers / AI reasoning
- Historical data
- Technical information

RATIONALE:
Users make decisions based on summary.
Details are for verification, not primary consumption.


5.2 NUMBER DISPLAY RULES (CRITICAL)
───────────────────────────────────────────────────────────────────────────────

NEVER DISPLAY:
- Percentage scores that imply incompleteness (92%, 96%)
  -> Users think "What about the other 8%?"
- Raw confidence scores (0.87, 0.94) visible to users
- Technical metrics that only developers understand

ALWAYS DISPLAY:
- Absolute counts with positive framing
  -> "1,247 Transactions Protected"
  -> "5 Threats Detected & Blocked"
- 100% coverage statements
  -> "100% Monitored"
  -> "100% Auditable"
- Relative improvements
  -> "+$2,400/year in savings"
  -> "15% better than average"

EXAMPLE TRANSFORMATION:
  WRONG: "Protection Score: 92"
  RIGHT: "1,247 Transactions Protected | 100% Monitored"
  
  WRONG: "Confidence: 0.87"
  RIGHT: "High Confidence" (with badge)


5.3 MOBILE-FIRST RESPONSIVE
───────────────────────────────────────────────────────────────────────────────

BREAKPOINT STRATEGY:
- Default: Mobile (< 640px)
- sm: Tablet (>= 640px)
- lg: Desktop (>= 1024px)

COMMON PATTERNS:
- flex-col sm:flex-row
- w-full sm:w-auto
- text-center sm:text-left
- grid-cols-2 sm:grid-cols-4
- px-4 sm:px-6

TOUCH TARGETS:
- Minimum 44x44px for buttons
- Adequate spacing between interactive elements


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PART 6: SCREEN-BY-SCREEN SPECIFICATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

6.1 LANDING PAGE (/)
───────────────────────────────────────────────────────────────────────────────

PURPOSE: First impression. Must achieve WOW in 3 seconds.

STRUCTURE:
- MIT CTO Badge at top center
- Logo: Poseidon.AI (Trident icon + text with cyan accent)
- Hero: "The Trusted AI-Native Money Platform"
- Subheadline: Brief value proposition (1-2 sentences)
- Primary CTA: "Explore Demo" (blue, prominent, shadow)
- Secondary CTA: "Get Started" (frosted glass style)
- 4 Engine preview cards in grid
- Trust signals (no percentages)
- MIT Professional Education logo at bottom

VISUAL STYLE:
- Dark background (slate-900) with subtle pattern
- White/light text
- Blue glow on primary CTA
- Frosted glass effect on secondary CTA


6.2 ONBOARDING FLOW (/onboarding)
───────────────────────────────────────────────────────────────────────────────

PURPOSE: Simulate account connection. For demo, pre-filled/skippable.

STEPS:
1. Welcome — "Welcome to Poseidon, Shinji"
2. Connect Accounts — Show pre-connected accounts (Chase, Amex, Fidelity)
3. Preferences — Risk tolerance, notification settings
4. Ready — Setup complete, enter dashboard

FEATURES:
- Progress indicator (1/2/3/4)
- "Demo Mode" badge visible
- Skip option on each step
- Smooth animations between steps


6.3 DASHBOARD (/dashboard)
───────────────────────────────────────────────────────────────────────────────

PURPOSE: Command center. Shows unified view of all engines at a glance.

STRUCTURE:
- Sidebar (left, 240px on desktop)
- Page header with LayoutDashboard icon (cyan)
- 4 summary stat cards in grid (2x2 mobile, 4x1 desktop):
  - Net Worth: $902,753.52
  - Monthly Spending: $20,000
  - Savings Rate: calculated
  - Pending Actions: 3
- Top Risk card (links to /protect/alert-detail?id=THR-001)
- Top Savings card (links to /grow)
- Pending Approval card (links to /execute/approval?id=EXE-001)


6.4 PROTECT ENGINE
───────────────────────────────────────────────────────────────────────────────

PROTECT OVERVIEW (/protect):
- Shield icon (green), "Protect", description
- Summary stats (4 cards):
  - "1,247 Transactions Protected" (NOT a percentage)
  - "100% Monitored"
  - "5 Threats Detected"
  - "2 Threats Blocked"
- Active threats list

THREATS LIST (/protect/threats):
- Back link to /protect
- Filters (Severity, Status)
- All 5 threats with severity badges
- "Review" button on each

ALERT DETAIL (/protect/alert-detail/:id):
CRITICAL PAGE — Demo centerpiece
Structure:
1. Back link
2. Summary card (icon, title, key metrics)
3. ACTION CARD (ABOVE FOLD):
   - "Is this activity legitimate?"
   - "This was Me" (green) / "Block & Secure" (red)
4. COLLAPSIBLE details (closed by default):
   - Transaction details
   - Device information
   - Location data
   - Decision Drivers visualization


6.5 GROW ENGINE
───────────────────────────────────────────────────────────────────────────────

GROW OVERVIEW (/grow):
- TrendingUp icon (purple)
- Summary stats:
  - "$3,601/year in savings identified"
  - "$1,065 realized"
  - "4 Active Recommendations"
  - "67% Acceptance Rate"
- Recommendations list

RECOMMENDATION DETAIL (/grow/recommendation/:id):
1. Back link
2. Summary card
3. Action card: "Accept" (purple) / "Decline" (outline)
4. Collapsible details (calculation breakdown)


6.6 EXECUTE ENGINE
───────────────────────────────────────────────────────────────────────────────

EXECUTE OVERVIEW (/execute):
- Zap icon (yellow) with PULSING GLOW animation
- Summary stats:
  - "3 Pending Approvals"
  - "7 Completed This Month"
  - "$42,847 Executed"
  - "45% Automation Rate"
- Pending actions list

APPROVAL DETAIL (/execute/approval/:id):
1. Back link
2. Summary card
3. Action card: "Approve" (green) / "Reject" (red)
4. Collapsible details (tax calculation, Decision Drivers)


6.7 GOVERN ENGINE
───────────────────────────────────────────────────────────────────────────────

GOVERN OVERVIEW (/govern):
- FileText icon (blue)
- Summary stats:
  - "2,847 Audit Records"
  - "100% Auditable"
  - "97.2% Model Accuracy"
  - "8.3% Override Rate"
- Recent audit entries preview

AUDIT TRAIL (/govern/audit):
- Back link
- Filters (Engine, Status, Time Period)
- Export button
- Full audit list


6.8 CHAT / ASK TO MONEY (/chat)
───────────────────────────────────────────────────────────────────────────────

PURPOSE: Natural language interface to all Poseidon features

STRUCTURE:
- Chat history sidebar (desktop)
- Messages area
- Input with suggested prompts
- Rich card responses (BalanceCard, ThreatCard, etc.)

SIMULATED RESPONSES (no real AI):
- Pattern match user input for keywords
- Return pre-scripted responses
- Simulate typing delay
- Show rich cards when appropriate

SUGGESTED PROMPTS:
- "What's my net worth?"
- "Any threats I should know about?"
- "How much did I spend on dining?"
- "Show me savings opportunities"
- "What actions are pending?"


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PART 7: NAVIGATION & LAYOUT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

7.1 SIDEBAR (LEFT PANEL)
───────────────────────────────────────────────────────────────────────────────

DESKTOP (>= 1024px):
Width: 240px (fixed)
Always visible

Structure:
- Logo at top
- Main navigation (Dashboard, Protect, Grow, Execute, Govern)
- Divider
- Chat link
- Settings, Help
- Divider
- User section at bottom (avatar, name, email)

Active state: bg-{engine}-100 + text-{engine}-700
Inactive state: text-gray-600 hover:bg-gray-100


7.2 MOBILE NAVIGATION
───────────────────────────────────────────────────────────────────────────────

Header bar:
[Hamburger] [Logo] [User Avatar]

Drawer (opens from left):
- Same structure as desktop sidebar
- Close button
- Touch-friendly spacing


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PART 8: GOVERNANCE FOOTER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

8.1 PURPOSE
───────────────────────────────────────────────────────────────────────────────

The Governance Footer provides trust and transparency:
- Every AI decision (Protect, Grow, Execute) is logged
- 100% auditability for user confidence
- Links to full audit trail

8.2 BEHAVIOR
───────────────────────────────────────────────────────────────────────────────

WHEN TO SHOW:
- On detail pages (alert-detail, recommendation, approval)
- Shows the audit record for that specific decision

WHAT TO DISPLAY:
- "100% Auditable" badge
- Model name and version
- Processing time
- Link to /govern for full audit

DESIGN:
- Fixed at bottom of content (not viewport)
- Subtle, non-intrusive
- Blue accent (Govern color)


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PART 9: DEMO MODE vs REAL MODE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

9.1 DEMO MODE (via "Explore Demo" button)
───────────────────────────────────────────────────────────────────────────────

- URL: /dashboard?demo=true
- Shows "Demo Mode" badge (amber) in top right
- All data is pre-loaded (Shinji Fujiwara)
- Actions show toast "Not available in demo mode"
- CTA to "Start Your Own Journey" always visible

9.2 ONBOARDING MODE (via "Get Started" button)
───────────────────────────────────────────────────────────────────────────────

- URL: /onboarding
- 4-step onboarding flow
- Simulated account connection
- Leads to /dashboard (no demo badge)


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PART 10: ANTI-PATTERNS (WHAT TO AVOID)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

VISUAL:
- Dark theme for cards when page is light
- Gradients mixing opposing temperatures (pink->green)
- More than 5 colors total
- Purple/violet as primary (unless Grow engine)
- Emojis as icons
- Hand-drawn SVG maps or complex illustrations
- Abstract decorative shapes (gradient circles, blurry blobs)

LAYOUT:
- Action buttons at bottom of long scrolling content
- Critical information hidden in collapsed sections by default
- Buttons that wrap to 2 lines
- Icons and text vertically stacked when they should be inline
- Inconsistent padding/margins

DATA DISPLAY:
- Raw percentages that imply incompleteness (92%, 96%)
- Developer-facing metrics (confidence: 0.87)
- Technical jargon without explanation
- Inconsistent data across screens
- Lorem ipsum or placeholder text

UX:
- Multiple buttons pointing to same destination
- Scroll indicators (mouse icon + "SCROLL")
- Waitlist forms in demo prototypes
- Features that don't exist in the prototype


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PART 11: TECHNICAL REQUIREMENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

11.1 RECOMMENDED STACK FOR LOVABLE
───────────────────────────────────────────────────────────────────────────────

Framework:     Vite + React + TypeScript
Routing:       react-router-dom v6
Styling:       Tailwind CSS
Components:    shadcn/ui
Icons:         lucide-react
State:         React hooks (useState, useEffect)
Charts:        Recharts (for any data visualization)


11.2 FILE STRUCTURE (SUGGESTED)
───────────────────────────────────────────────────────────────────────────────

src/
├── components/
│   ├── ui/              # shadcn components
│   ├── shared/          # DecisionDrivers, GovernanceFooter, etc.
│   ├── layout/          # Sidebar, Header, PageContainer
│   └── chat/            # Chat components
├── pages/
│   ├── Landing.tsx
│   ├── Onboarding.tsx
│   ├── Dashboard.tsx
│   ├── protect/
│   │   ├── Protect.tsx
│   │   ├── Threats.tsx
│   │   └── AlertDetail.tsx
│   ├── grow/
│   │   ├── Grow.tsx
│   │   └── Recommendation.tsx
│   ├── execute/
│   │   ├── Execute.tsx
│   │   └── Approval.tsx
│   ├── govern/
│   │   ├── Govern.tsx
│   │   └── Audit.tsx
│   └── chat/
│       └── Chat.tsx
├── data/
│   ├── persona.ts
│   ├── accounts.ts
│   ├── threats.ts
│   ├── recommendations.ts
│   ├── actions.ts
│   └── audit.ts
├── lib/
│   └── utils.ts
└── styles/
    └── globals.css


11.3 PERFORMANCE REQUIREMENTS
───────────────────────────────────────────────────────────────────────────────

- Page load < 2 seconds
- Mobile-first (QR code access assumed)
- Support: iOS Safari, Android Chrome, Desktop browsers
- Avoid heavy animations that drain battery
- Lazy load non-critical content


11.4 ACCESSIBILITY
───────────────────────────────────────────────────────────────────────────────

- ARIA labels on icon-only buttons
- Keyboard navigation support
- Focus visible states
- Color contrast WCAG AA
- Screen reader text (sr-only class)


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PART 12: CURRENT STATE (v0 PROJECT)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

12.1 WHAT EXISTS NOW
───────────────────────────────────────────────────────────────────────────────

The current v0 project is a Next.js 16 project with:

IMPLEMENTED:
- app/page.tsx (Landing page with CTAs)
- app/protect/threats/page.tsx (Threats list)
- components/ui/* (Full shadcn/ui component library)
- Tailwind CSS 4 with design tokens
- Geist font configured

NOT IMPLEMENTED:
- Dashboard
- Alert Detail
- Grow engine
- Execute engine
- Govern engine
- Chat/Ask to Money
- Onboarding
- Sidebar/Navigation
- Mock data files


12.2 GAP ANALYSIS
───────────────────────────────────────────────────────────────────────────────

NEEDS TO BE BUILT:
1. Full navigation system (Sidebar, mobile drawer)
2. Dashboard page with summary cards
3. All detail pages (alert-detail, recommendation, approval)
4. Governance Footer component
5. Decision Drivers component
6. Centralized mock data
7. Chat interface (simulated)
8. Onboarding flow
9. Demo mode vs real mode handling


================================================================================
END OF DOCUMENT
================================================================================


SUMMARY FOR LOVABLE:

This is a comprehensive handoff document for the Poseidon.AI prototype.
Key points:

1. It's a demo prototype for MIT, not a real product
2. 4 engines (Protect, Grow, Execute, Govern) + Dashboard
3. Primary demo narrative: "Oslo Story" (fraud detection)
4. Persona: Shinji Fujiwara, VP of Engineering at Stripe
5. All data is mock/hardcoded
6. Mobile-first, Apple-like clean design
7. Chat feature should be simulated (no real AI calls)
8. Never show raw percentages that imply incompleteness
9. Action buttons always ABOVE THE FOLD
10. Details always in COLLAPSIBLE sections (closed by default)

Build priority:
1. Navigation/Layout (Sidebar)
2. Dashboard
3. Protect engine (with Alert Detail)
4. Grow engine
5. Execute engine
6. Govern engine
7. Chat (simulated)
8. Onboarding

================================================================================
```

---

以上がLovableに渡すための包括的なプロジェクトハンドオフドキュメントです。プロダクト概要、ペルソナ、モックデータ、エンジン別シナリオ、デザインシステム、UXパターン、画面仕様、ナビゲーション、技術要件、現状分析まで全てを含んでいます。