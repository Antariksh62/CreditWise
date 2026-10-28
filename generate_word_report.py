import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import parse_xml, OxmlElement
from docx.oxml.ns import nsdecls, qn

def create_report():
    doc = docx.Document()
    
    # Page setup - Margins
    for section in doc.sections:
        section.top_margin = Inches(0.8)
        section.bottom_margin = Inches(0.8)
        section.left_margin = Inches(0.8)
        section.right_margin = Inches(0.8)
        
        # Add page borders
        pg_borders_xml = f'''
        <w:pgBorders {nsdecls("w")}>
            <w:top w:val="single" w:sz="8" w:space="18" w:color="0F5741"/>
            <w:left w:val="single" w:sz="8" w:space="18" w:color="0F5741"/>
            <w:bottom w:val="single" w:sz="8" w:space="18" w:color="0F5741"/>
            <w:right w:val="single" w:sz="8" w:space="18" w:color="0F5741"/>
        </w:pgBorders>
        '''
        section._sectPr.append(parse_xml(pg_borders_xml))
        
        # Header & Footer
        header = section.header
        hp = header.paragraphs[0]
        hp.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        hrun = hp.add_run("CardWise | Comprehensive Project Report")
        hrun.font.name = "Calibri"
        hrun.font.size = Pt(8.5)
        hrun.font.color.rgb = RGBColor(120, 120, 120)
        
        footer = section.footer
        fp = footer.paragraphs[0]
        fp.alignment = WD_ALIGN_PARAGRAPH.CENTER
        frun = fp.add_run("Page — Project Report: CardWise (CreditWise) Insights")
        frun.font.name = "Calibri"
        frun.font.size = Pt(8.5)
        frun.font.color.rgb = RGBColor(120, 120, 120)

    # Helper styling functions
    def set_cell_shading(cell, color_hex):
        shd_xml = f'<w:shd {nsdecls("w")} w:fill="{color_hex}"/>'
        cell._tc.get_or_add_tcPr().append(parse_xml(shd_xml))

    def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
        tcPr = cell._tc.get_or_add_tcPr()
        tcMar = parse_xml(f'''
        <w:tcMar {nsdecls("w")}>
            <w:top w:w="{top}" w:type="dxa"/>
            <w:bottom w:w="{bottom}" w:type="dxa"/>
            <w:left w:w="{left}" w:type="dxa"/>
            <w:right w:w="{right}" w:type="dxa"/>
        </w:tcMar>
        ''')
        tcPr.append(tcMar)

    def set_table_borders(table, color="D1D5DB", sz="4"):
        tblPr = table._tbl.tblPr
        borders_xml = f'''
        <w:tblBorders {nsdecls("w")}>
            <w:top w:val="single" w:sz="{sz}" w:space="0" w:color="{color}"/>
            <w:bottom w:val="single" w:sz="{sz}" w:space="0" w:color="{color}"/>
            <w:left w:val="none"/>
            <w:right w:val="none"/>
            <w:insideH w:val="single" w:sz="{sz}" w:space="0" w:color="{color}"/>
            <w:insideV w:val="none"/>
        </w:tblBorders>
        '''
        tblPr.append(parse_xml(borders_xml))

    def add_callout(text, title="KEY PRINCIPLE"):
        tbl = doc.add_table(rows=1, cols=1)
        tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
        cell = tbl.cell(0, 0)
        set_cell_shading(cell, "F2F8F5")
        set_cell_margins(cell, top=140, bottom=140, left=200, right=160)
        
        # Left border accent
        tcPr = cell._tc.get_or_add_tcPr()
        tcBorders = parse_xml(f'''
        <w:tcBorders {nsdecls("w")}>
            <w:top w:val="none"/>
            <w:left w:val="single" w:sz="24" w:space="0" w:color="0F5741"/>
            <w:bottom w:val="none"/>
            <w:right w:val="none"/>
        </w:tcBorders>
        ''')
        tcPr.append(tcBorders)
        
        cp = cell.paragraphs[0]
        cp.paragraph_format.space_before = Pt(0)
        cp.paragraph_format.space_after = Pt(2)
        run_title = cp.add_run(f"[{title}] ")
        run_title.bold = True
        run_title.font.name = "Calibri"
        run_title.font.size = Pt(10)
        run_title.font.color.rgb = RGBColor(15, 87, 65)
        
        run_text = cp.add_run(text)
        run_text.font.name = "Calibri"
        run_text.font.size = Pt(10.5)
        run_text.font.italic = True
        run_text.font.color.rgb = RGBColor(30, 41, 59)
        
        p_space = doc.add_paragraph()
        p_space.paragraph_format.space_before = Pt(0)
        p_space.paragraph_format.space_after = Pt(4)

    def add_code_block(code_text):
        tbl = doc.add_table(rows=1, cols=1)
        tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
        cell = tbl.cell(0, 0)
        set_cell_shading(cell, "F8FAFC")
        set_cell_margins(cell, top=120, bottom=120, left=160, right=160)
        
        tcPr = cell._tc.get_or_add_tcPr()
        tcBorders = parse_xml(f'''
        <w:tcBorders {nsdecls("w")}>
            <w:top w:val="single" w:sz="6" w:space="0" w:color="CBD5E1"/>
            <w:left w:val="single" w:sz="18" w:space="0" w:color="64748B"/>
            <w:bottom w:val="single" w:sz="6" w:space="0" w:color="CBD5E1"/>
            <w:right w:val="single" w:sz="6" w:space="0" w:color="CBD5E1"/>
        </w:tcBorders>
        ''')
        tcPr.append(tcBorders)
        
        cp = cell.paragraphs[0]
        cp.paragraph_format.space_before = Pt(0)
        cp.paragraph_format.space_after = Pt(0)
        run = cp.add_run(code_text)
        run.font.name = "Consolas"
        run.font.size = Pt(9.5)
        run.font.color.rgb = RGBColor(30, 41, 59)
        
        p_space = doc.add_paragraph()
        p_space.paragraph_format.space_before = Pt(0)
        p_space.paragraph_format.space_after = Pt(4)

    # ------------------ DOCUMENT CONTENT ------------------

    # Document Header / Title
    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.LEFT
    p_title.paragraph_format.space_before = Pt(12)
    p_title.paragraph_format.space_after = Pt(2)
    r_tag = p_title.add_run("ACADEMIC PROJECT REPORT\n")
    r_tag.bold = True
    r_tag.font.name = "Calibri"
    r_tag.font.size = Pt(10)
    r_tag.font.color.rgb = RGBColor(15, 87, 65)

    r_title = p_title.add_run("CardWise (CreditWise)")
    r_title.bold = True
    r_title.font.name = "Calibri"
    r_title.font.size = Pt(24)
    r_title.font.color.rgb = RGBColor(17, 18, 17)

    p_sub = doc.add_paragraph()
    p_sub.paragraph_format.space_before = Pt(0)
    p_sub.paragraph_format.space_after = Pt(12)
    r_sub = p_sub.add_run("An Explainable, Privacy-First Credit Card Recommendation & Spending-to-Value Optimization Engine")
    r_sub.font.name = "Calibri"
    r_sub.font.size = Pt(12.5)
    r_sub.font.color.rgb = RGBColor(80, 90, 100)

    # Metadata Strip (Table)
    meta_table = doc.add_table(rows=2, cols=3)
    meta_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(meta_table, color="0F5741", sz="6")
    meta_headers = ["Domain / Framework", "Target Ecosystem", "Technology Stack"]
    meta_values = ["Consumer Financial Technology", "Indian Credit Card Market", "Next.js App Router, React, Tailwind, jQuery"]
    
    for c_idx in range(3):
        c_head = meta_table.cell(0, c_idx)
        set_cell_shading(c_head, "0F5741")
        set_cell_margins(c_head, top=80, bottom=80, left=100, right=100)
        p = c_head.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r = p.add_run(meta_headers[c_idx])
        r.bold = True
        r.font.name = "Calibri"
        r.font.size = Pt(9.5)
        r.font.color.rgb = RGBColor(255, 255, 255)

        c_val = meta_table.cell(1, c_idx)
        set_cell_shading(c_val, "F8FAFC")
        set_cell_margins(c_val, top=80, bottom=80, left=100, right=100)
        p2 = c_val.paragraphs[0]
        p2.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r2 = p2.add_run(meta_values[c_idx])
        r2.font.name = "Calibri"
        r2.font.size = Pt(9.5)
        r2.font.color.rgb = RGBColor(30, 41, 59)

    doc.add_paragraph().paragraph_format.space_after = Pt(12)

    add_callout(
        '"What if your expenses could earn too? Don’t change how you spend. Change how you’re rewarded. '
        'CardWise optimizes existing expenditure through verified data, transparent scoring algorithms, and zero affiliate distortion."',
        title="CORE PRODUCT MOTTO"
    )

    # ------------------ SECTION 1 ------------------
    h1 = doc.add_heading("1. Problem Statement", level=1)
    h1.paragraph_format.space_before = Pt(14)
    h1.paragraph_format.space_after = Pt(6)
    for run in h1.runs:
        run.font.name = "Calibri"
        run.font.color.rgb = RGBColor(15, 87, 65)

    p_p1 = doc.add_paragraph(
        "The contemporary retail credit ecosystem in India features intense competition, with dozens of scheduled banks "
        "and non-banking financial institutions (NBFCs) issuing hundreds of co-branded, cashback, travel, and lifestyle cards. "
        "However, rather than benefiting the consumer, this surplus of choices creates acute friction and systemic market failures:"
    )
    p_p1.paragraph_format.space_after = Pt(6)
    p_p1.paragraph_format.line_spacing = 1.15

    problems = [
        ("Information Asymmetry & Fine-Print Complexity", 
         "Credit card reward structures are intentionally intricate. Annual fees, spend-based renewal waivers, category reward caps, exclusions (fuel, utilities, wallet loads, rent), and differing point valuations (e.g., 1 reward point varying from ₹0.20 to ₹1.00) make it virtually impossible for consumers to calculate their true net monetary returns."),
        ("Commercial Affiliate Bias & Conflict of Interest", 
         "Most comparison engines and aggregators operate on commission-driven lead generation. They actively steer consumers toward cards offering the highest affiliate payout or costliest joining fees, rather than what aligns with the applicant’s actual monthly expenditure."),
        ("The 'Induced Spending' Trap", 
         "Standard financial advertisements employ marketing rhetoric like 'Maximize spending,' 'Unlock elite purchasing power,' or 'Spend more to earn more.' This induces lifestyle inflation and dangerous revolving debt rather than optimizing expenses users already incur."),
        ("Opaque 'Black-Box' Algorithms", 
         "Aggregators frequently claim 'AI-driven matches' or display misleading figures like '98% match' or 'Pre-approved approval odds' without revealing the underlying scoring criteria, eligibility requirements, or exclusionary policies."),
        ("Under-Served Financial Literacy", 
         "First-time applicants and salaried professionals frequently acquire credit cards without understanding revolving credit mechanics, billing cycle grace periods, credit utilization ratios, or the true cost of credit, directly impairing their creditworthiness.")
    ]

    for title, desc in problems:
        bp = doc.add_paragraph(style='List Bullet')
        bp.paragraph_format.space_after = Pt(4)
        bp.paragraph_format.line_spacing = 1.15
        r_bt = bp.add_run(f"{title}: ")
        r_bt.bold = True
        r_bt.font.name = "Calibri"
        r_bt.font.size = Pt(11)
        r_bt.font.color.rgb = RGBColor(20, 30, 40)
        r_bd = bp.add_run(desc)
        r_bd.font.name = "Calibri"
        r_bd.font.size = Pt(11)
        r_bd.font.color.rgb = RGBColor(50, 50, 50)

    # ------------------ SECTION 2 ------------------
    h2 = doc.add_heading("2. Objectives", level=1)
    h2.paragraph_format.space_before = Pt(16)
    h2.paragraph_format.space_after = Pt(6)
    for run in h2.runs:
        run.font.name = "Calibri"
        run.font.color.rgb = RGBColor(15, 87, 65)

    p_obj = doc.add_paragraph(
        "CardWise was conceptualized and developed as an ethical, consumer-aligned financial decision utility. "
        "The project is structured around five tangible, verifiable objectives:"
    )
    p_obj.paragraph_format.space_after = Pt(6)
    p_obj.paragraph_format.line_spacing = 1.15

    objectives = [
        ("Deterministic, Auditable Scoring Engine", 
         "Implement an explainable, 5-dimension recommendation algorithm (Priority, Category Alignment, Fee Tolerance, Travel/Lifestyle, and Base Earn Rate) scoring out of 100 points with zero opaque ML or arbitrary percentages."),
        ("Transparent Spending-to-Value Calculator", 
         "Develop a mathematical engine that accepts category spending inputs and computes exact net annual value: Gross Returns minus Annual Fee, integrating genuine spend waiver thresholds, category caps, and verified Rupee point valuations."),
        ("Interactive Multi-Card Comparison Matrix", 
         "Build a side-by-side comparative table supporting up to 3 cards simultaneously across 12 verified parameters (fees, waivers, domestic/intl lounge access, forex markup, reward rates, milestones, and eligibility)."),
        ("Embedded Financial Literacy Hub", 
         "Curate a library of educational articles and embedded instructional videos covering foundational personal finance concepts (Credit Scores, Utilization Ratios, Annual Fees, Points vs. Cashback)."),
        ("Robust, Accessible Full-Stack Architecture", 
         "Deliver a production-ready Next.js App Router application with static generation (SSG) for sub-second page delivery, asynchronous jQuery AJAX for live user validation, semantic HTML5, and WCAG AA accessibility compliance.")
    ]

    for title, desc in objectives:
        bp = doc.add_paragraph(style='List Bullet')
        bp.paragraph_format.space_after = Pt(4)
        bp.paragraph_format.line_spacing = 1.15
        r_bt = bp.add_run(f"{title}: ")
        r_bt.bold = True
        r_bt.font.name = "Calibri"
        r_bt.font.size = Pt(11)
        r_bt.font.color.rgb = RGBColor(20, 30, 40)
        r_bd = bp.add_run(desc)
        r_bd.font.name = "Calibri"
        r_bd.font.size = Pt(11)
        r_bd.font.color.rgb = RGBColor(50, 50, 50)

    # ------------------ SECTION 3 ------------------
    h3 = doc.add_heading("3. Methodology Approach", level=1)
    h3.paragraph_format.space_before = Pt(16)
    h3.paragraph_format.space_after = Pt(6)
    for run in h3.runs:
        run.font.name = "Calibri"
        run.font.color.rgb = RGBColor(15, 87, 65)

    doc.add_paragraph(
        "The project follows a modular, decoupled architecture separating client presentation, server-side generation, "
        "business logic computation, and structured data storage."
    ).paragraph_format.line_spacing = 1.15

    # Architecture Overview Table
    h3_sub1 = doc.add_heading("3.1 System Architecture Breakdown", level=2)
    h3_sub1.paragraph_format.space_before = Pt(10)
    h3_sub1.paragraph_format.space_after = Pt(4)
    for run in h3_sub1.runs:
        run.font.name = "Calibri"
        run.font.color.rgb = RGBColor(30, 58, 95)

    arch_table = doc.add_table(rows=5, cols=3)
    arch_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(arch_table, color="CBD5E1", sz="4")
    
    headers = ["Layer", "Technical Components", "Responsibilities & Data Flow"]
    for i, h in enumerate(headers):
        c = arch_table.cell(0, i)
        set_cell_shading(c, "0F5741")
        set_cell_margins(c, top=80, bottom=80, left=100, right=100)
        p = c.paragraphs[0]
        r = p.add_run(h)
        r.bold = True
        r.font.name = "Calibri"
        r.font.size = Pt(10)
        r.font.color.rgb = RGBColor(255, 255, 255)

    arch_rows = [
        ("Presentation Layer\n(Client Side)", 
         "React 18, Tailwind CSS, Lucide Icons, Shadcn tokens", 
         "Renders dynamic UI views: 5-step Recommendation Quiz, Interactive Spend Calculator, 3-Card Comparison Matrix, LocalStorage bookmark state."),
        ("Application Layer\n(Next.js App Router)", 
         "app/**, Server Components, Route Handlers (API)", 
         "Provides file-based routing, static pre-rendering (generateStaticParams) for 31 card pages & 5 blog articles, and asynchronous REST endpoints."),
        ("Logic & Business Engine\n(Deterministic Service)", 
         "lib/recommendation.js,\nlib/rewardCalculator.js,\nlib/cardRewardRules.js", 
         "Executes 5-factor scoring algorithm, age/income eligibility filtering, spend category normalization, fee waiver checking, and net Rupee return calculations."),
        ("Data Layer\n(Single Source of Truth)", 
         "data/cards.json,\ndata/blogs.json,\ndata/users.json", 
         "Stores structured, verified attributes for 31 Indian credit cards, educational content metadata, and demo authentication records.")
    ]

    for r_idx, (layer, comps, resp) in enumerate(arch_rows, start=1):
        bg = "FFFFFF" if r_idx % 2 != 0 else "F8FAFC"
        for c_idx, val in enumerate([layer, comps, resp]):
            c = arch_table.cell(r_idx, c_idx)
            set_cell_shading(c, bg)
            set_cell_margins(c, top=70, bottom=70, left=90, right=90)
            p = c.paragraphs[0]
            r = p.add_run(val)
            r.font.name = "Calibri"
            r.font.size = Pt(9.5)
            r.font.color.rgb = RGBColor(30, 41, 59)
            if c_idx == 0:
                r.bold = True

    doc.add_paragraph().paragraph_format.space_after = Pt(8)

    # Architecture Diagram Visual Block
    add_callout(
        "Presentation (Client React Components) <---> Next.js App Router (SSG / SSR / API Handlers)\n"
        "                                  | \n"
        "                                  v\n"
        "Business Logic (Scoring Engine 5-Dimensions + Spend-to-Value Net Calculator)\n"
        "                                  | \n"
        "                                  v\n"
        "Data Layer (31 Verified Credit Cards JSON + Verified Reward Rules & Exclusions)",
        title="SYSTEM ARCHITECTURE DIAGRAM (BLOCK FLOW)"
    )

    # Flow Diagram Breakdown
    h3_sub2 = doc.add_heading("3.2 User & Recommendation Decision Flow", level=2)
    h3_sub2.paragraph_format.space_before = Pt(10)
    h3_sub2.paragraph_format.space_after = Pt(4)
    for run in h3_sub2.runs:
        run.font.name = "Calibri"
        run.font.color.rgb = RGBColor(30, 58, 95)

    doc.add_paragraph(
        "The end-to-end user evaluation flow is designed with transparent guardrails:"
    ).paragraph_format.line_spacing = 1.15

    flow_steps = [
        ("Step 1: Benefit Intent", "User specifies primary outcome (Cashback, Airline Miles, Daily Grocery, Fuel, Zero Annual Fee)."),
        ("Step 2: Category Spend Profiling", "User provides rough monthly expenditure across Online Shopping, Dining/Delivery, Groceries, Travel, Fuel, and Bills."),
        ("Step 3: Fee Tolerance & Expectations", "User indicates willingness to pay fees in exchange for premium benefits or strictly seeks zero-fee/waivable cards."),
        ("Step 4: Travel & Lifestyle Perks", "User indicates domestic/international airport lounge frequency and forex spending needs."),
        ("Step 5: Eligibility Verification", "System captures age bracket, annual income range, and employment type to execute strict eligibility gates."),
        ("Evaluation Pipeline Execution", "The engine filters ineligible cards, evaluates the 5 scoring dimensions, simulates spend-to-value calculations, and sorts matches."),
        ("Transparent Output Presentation", "User receives top ranked cards with Match Score, 'Why it fits you', 'What to watch for', and estimated annual net value.")
    ]

    for title, desc in flow_steps:
        bp = doc.add_paragraph(style='List Bullet')
        bp.paragraph_format.space_after = Pt(3)
        bp.paragraph_format.line_spacing = 1.15
        r_bt = bp.add_run(f"{title} -> ")
        r_bt.bold = True
        r_bt.font.name = "Calibri"
        r_bt.font.size = Pt(10.5)
        r_bt.font.color.rgb = RGBColor(20, 30, 40)
        r_bd = bp.add_run(desc)
        r_bd.font.name = "Calibri"
        r_bd.font.size = Pt(10.5)
        r_bd.font.color.rgb = RGBColor(50, 50, 50)

    # ------------------ SECTION 4 ------------------
    h4 = doc.add_heading("4. Implementation", level=1)
    h4.paragraph_format.space_before = Pt(16)
    h4.paragraph_format.space_after = Pt(6)
    for run in h4.runs:
        run.font.name = "Calibri"
        run.font.color.rgb = RGBColor(15, 87, 65)

    doc.add_paragraph(
        "CardWise is implemented with meticulous adherence to engineering quality, clean separation of concerns, "
        "and strict data integrity."
    ).paragraph_format.line_spacing = 1.15

    # 4.1 Scoring Engine Mathematics
    h4_sub1 = doc.add_heading("4.1 Multi-Criteria Scoring Engine Implementation", level=2)
    h4_sub1.paragraph_format.space_before = Pt(10)
    h4_sub1.paragraph_format.space_after = Pt(4)
    for run in h4_sub1.runs:
        run.font.name = "Calibri"
        run.font.color.rgb = RGBColor(30, 58, 95)

    doc.add_paragraph(
        "The scoring algorithm in `lib/recommendation.js` evaluates candidates against 5 distinct dimensions, "
        "normalizing to an exact 100-point index without arbitrary scaling:"
    ).paragraph_format.line_spacing = 1.15

    score_dims = [
        ("1. Benefit Priority Alignment (Weight: 30 Points)", 
         "Calculates how closely a card’s core value proposition matches user goals (e.g., 30 pts for pure cashback cards when cashback is selected; 25 pts for high-earn point cards)."),
        ("2. Top Spend Category Synergy (Weight: 25 Points)", 
         "Awards up to 25 points if the user's highest monthly expenditure category (e.g. Dining, Travel, Groceries) matches the card’s accelerated reward multipliers."),
        ("3. Fee Tolerance & Waiver Attainability (Weight: 20 Points)", 
         "Awards 20 points for lifetime free cards to fee-sensitive users, or cards whose annual fee waiver threshold (e.g. ₹1,00,000 p.a.) is easily surpassed by the user's projected annual spend."),
        ("4. Travel & Lounge Perks (Weight: 15 Points)", 
         "Awards 15 points for cards providing complimentary domestic/international lounge access and low foreign exchange markup (<= 2%) for frequent travelers."),
        ("5. Baseline Earn Rate (Weight: 10 Points)", 
         "Awards 10 points for superior base reward rates on general non-category spending (>= 1.5% to 2% cash-equivalent value).")
    ]

    for title, desc in score_dims:
        bp = doc.add_paragraph(style='List Bullet')
        bp.paragraph_format.space_after = Pt(3)
        bp.paragraph_format.line_spacing = 1.15
        r_bt = bp.add_run(f"{title}: ")
        r_bt.bold = True
        r_bt.font.name = "Calibri"
        r_bt.font.size = Pt(10.5)
        r_bd = bp.add_run(desc)
        r_bd.font.name = "Calibri"
        r_bd.font.size = Pt(10.5)

    # 4.2 Spending-to-Value Engine
    h4_sub2 = doc.add_heading("4.2 Spending-to-Value Net Calculation Engine", level=2)
    h4_sub2.paragraph_format.space_before = Pt(10)
    h4_sub2.paragraph_format.space_after = Pt(4)
    for run in h4_sub2.runs:
        run.font.name = "Calibri"
        run.font.color.rgb = RGBColor(30, 58, 95)

    doc.add_paragraph(
        "Implemented in `lib/rewardCalculator.js`, the net return calculation follows the rigorous formula:\n"
        "Net Annual Value = Gross Annual Rewards - Applicable Annual Fee\n"
        "Where Gross Annual Rewards = Sum over categories [min(Monthly Spend * Rate * 12 * Point Valuation, Annual Category Cap)].\n"
        "Applicable Annual Fee = 0 if Annual Spend >= Spend Waiver Threshold, otherwise Base Annual Fee."
    ).paragraph_format.line_spacing = 1.15

    # 4.3 jQuery AJAX Implementation
    h4_sub3 = doc.add_heading("4.3 Asynchronous jQuery AJAX Username Verification", level=2)
    h4_sub3.paragraph_format.space_before = Pt(10)
    h4_sub3.paragraph_format.space_after = Pt(4)
    for run in h4_sub3.runs:
        run.font.name = "Calibri"
        run.font.color.rgb = RGBColor(30, 58, 95)

    doc.add_paragraph(
        "To provide instant feedback during registration without page reloads, CardWise implements a client-side jQuery AJAX interaction "
        "paired with a Next.js App Router API Route Handler:"
    ).paragraph_format.line_spacing = 1.15

    add_code_block(
        "// Next.js API Route: app/api/check-username/route.js\n"
        "export async function GET(request) {\n"
        "  const { searchParams } = new URL(request.url);\n"
        "  const username = searchParams.get('username')?.toLowerCase().trim();\n"
        "  const users = require('@/data/users.json');\n"
        "  const exists = users.some(u => u.username.toLowerCase() === username);\n"
        "  return Response.json({ username, available: !exists, reason: exists ? 'Username already taken' : null });\n"
        "}\n\n"
        "// Client Component: components/SignupForm.jsx (Debounced $.ajax)\n"
        "useEffect(() => {\n"
        "  import('jquery').then(({ default: $ }) => {\n"
        "    $.ajax({\n"
        "      url: `/api/check-username?username=${encodeURIComponent(val)}`,\n"
        "      method: 'GET',\n"
        "      dataType: 'json',\n"
        "      success: (data) => setAvailability(data.available),\n"
        "      error: () => setStatus('Error verifying username')\n"
        "    });\n"
        "  });\n"
        "}, [username]);"
    )

    # ------------------ SECTION 5 ------------------
    h5 = doc.add_heading("5. Results & Outputs", level=1)
    h5.paragraph_format.space_before = Pt(16)
    h5.paragraph_format.space_after = Pt(6)
    for run in h5.runs:
        run.font.name = "Calibri"
        run.font.color.rgb = RGBColor(15, 87, 65)

    doc.add_paragraph(
        "The CardWise web application delivers a comprehensive suite of working, tested interfaces:"
    ).paragraph_format.line_spacing = 1.15

    results_table = doc.add_table(rows=7, cols=3)
    results_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(results_table, color="CBD5E1", sz="4")

    res_headers = ["Feature Module", "Route / Component", "Verified Functional Output"]
    for i, h in enumerate(res_headers):
        c = results_table.cell(0, i)
        set_cell_shading(c, "0F5741")
        set_cell_margins(c, top=80, bottom=80, left=100, right=100)
        p = c.paragraphs[0]
        r = p.add_run(h)
        r.bold = True
        r.font.name = "Calibri"
        r.font.size = Pt(10)
        r.font.color.rgb = RGBColor(255, 255, 255)

    res_rows = [
        ("Homepage & Previews", "/ (app/page.jsx)", "Hero with interactive CSS credit card artifact, spend widget, and live previews of quiz, comparison, and calculator."),
        ("Card Catalogue", "/cards (app/cards/page.jsx)", "Full directory of 31 verified cards with instant category filtering (?category=cashback/travel) and bookmark toggling."),
        ("Card Detail Pages", "/cards/[slug]", "SSG pre-rendered deep dives with verified fee structures, spend-based waiver rules, and reward category rates."),
        ("Recommendation Quiz", "/recommend", "5-step accessible questionnaire with step validation, back/forward navigation, and local profile aggregation."),
        ("Results Engine", "/results", "Animated SVG match score ring, plain-English 'Why it fits you', cautionary advisories, and net annual value projection."),
        ("Comparison & Calculator", "/compare", "3-card side-by-side comparison across 12 criteria, plus real-time spend-to-value annual reward calculator.")
    ]

    for r_idx, (feat, route, out) in enumerate(res_rows, start=1):
        bg = "FFFFFF" if r_idx % 2 != 0 else "F8FAFC"
        for c_idx, val in enumerate([feat, route, out]):
            c = results_table.cell(r_idx, c_idx)
            set_cell_shading(c, bg)
            set_cell_margins(c, top=70, bottom=70, left=90, right=90)
            p = c.paragraphs[0]
            r = p.add_run(val)
            r.font.name = "Calibri"
            r.font.size = Pt(9.5)
            r.font.color.rgb = RGBColor(30, 41, 59)
            if c_idx == 0:
                r.bold = True

    doc.add_paragraph().paragraph_format.space_after = Pt(8)

    # Key Performance Achievements
    h5_sub1 = doc.add_heading("5.1 Technical & Usability Achievements", level=2)
    h5_sub1.paragraph_format.space_before = Pt(10)
    h5_sub1.paragraph_format.space_after = Pt(4)
    for run in h5_sub1.runs:
        run.font.name = "Calibri"
        run.font.color.rgb = RGBColor(30, 58, 95)

    achievements = [
        ("Sub-Second Route Transitions", "Pre-rendering 31 card detail pages and 5 blog posts at build time via Next.js SSG ensures instant page loading."),
        ("WCAG AA Accessibility Compliance", "Built with semantic landmarks (<header>, <nav>, <main>, <footer>), visible focus indicators, screen-reader alert bindings (role='alert', aria-describedby), and a complete prefers-reduced-motion bypass."),
        ("Zero Layout Shift Typography", "Self-hosted variable Inter font configurations eliminate Cumulative Layout Shift (CLS) on initial paint."),
        ("High-Fidelity Restrained Design", "Eliminated generic AI gradients and neon glassmorphism in favor of a trustworthy, editorial visual identity inspired by Stripe and Ramp.")
    ]

    for title, desc in achievements:
        bp = doc.add_paragraph(style='List Bullet')
        bp.paragraph_format.space_after = Pt(3)
        bp.paragraph_format.line_spacing = 1.15
        r_bt = bp.add_run(f"{title}: ")
        r_bt.bold = True
        r_bt.font.name = "Calibri"
        r_bt.font.size = Pt(10.5)
        r_bd = bp.add_run(desc)
        r_bd.font.name = "Calibri"
        r_bd.font.size = Pt(10.5)

    # ------------------ SECTION 6 ------------------
    h6 = doc.add_heading("6. Conclusion", level=1)
    h6.paragraph_format.space_before = Pt(16)
    h6.paragraph_format.space_after = Pt(6)
    for run in h6.runs:
        run.font.name = "Calibri"
        run.font.color.rgb = RGBColor(15, 87, 65)

    doc.add_paragraph(
        "CardWise demonstrates that modern financial web applications can deliver exceptional consumer utility without resorting "
        "to predatory affiliate tactics, opaque algorithms, or deceptive spending incentives. By rooting recommendations strictly "
        "in verified bank data, deterministic scoring across 5 auditable dimensions, and realistic net-value calculations, the platform "
        "empowers users to optimize their existing expenses responsibly."
    ).paragraph_format.line_spacing = 1.15

    h6_sub1 = doc.add_heading("6.1 Future Scope & Enhancements", level=2)
    h6_sub1.paragraph_format.space_before = Pt(10)
    h6_sub1.paragraph_format.space_after = Pt(4)
    for run in h6_sub1.runs:
        run.font.name = "Calibri"
        run.font.color.rgb = RGBColor(30, 58, 95)

    future_work = [
        ("Live Bank & API Integration", "Incorporate direct connections via the RBI Account Aggregator (AA) framework to automatically synchronize verified user spend categories without requiring manual input."),
        ("Multi-Card Combo Optimization", "Expand the scoring engine to evaluate wallet combos (e.g. Card A for online dining + Card B for fuel and travel) to maximize combined net yield."),
        ("Encrypted Account Authentication", "Transition mock client profiles to a secure, enterprise-grade authentication backend (NextAuth / Supabase) with encrypted persistence and password hashing.")
    ]

    for title, desc in future_work:
        bp = doc.add_paragraph(style='List Bullet')
        bp.paragraph_format.space_after = Pt(3)
        bp.paragraph_format.line_spacing = 1.15
        r_bt = bp.add_run(f"{title}: ")
        r_bt.bold = True
        r_bt.font.name = "Calibri"
        r_bt.font.size = Pt(10.5)
        r_bd = bp.add_run(desc)
        r_bd.font.name = "Calibri"
        r_bd.font.size = Pt(10.5)

    # Save document
    output_path = r"d:\Desktop\cardwise-insights\CardWise_Project_Report.docx"
    doc.save(output_path)
    print(f"Document successfully saved to {output_path}")

if __name__ == "__main__":
    create_report()

