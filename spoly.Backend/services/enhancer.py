import re
import requests
import json
from utils.config import GROQ_API_KEY


def extract_clean_json(raw_output):
    """Safely extracts JSON without triggering markdown crashes."""
    raw_output = raw_output.strip()
    start = raw_output.find("{")
    end = raw_output.rfind("}")
    if start != -1 and end != -1:
        return raw_output[start : end + 1]
    return raw_output


# =====================================================================
# 🚀 THE ULTIMATE TEMPLATE DICTIONARY (26 CUSTOM AI PERSONAS)
# =====================================================================
TEMPLATE_CONFIGS = {
    "System Sequence Diagram": {
        "notes": "📌 System Overview\n📌 Actors & Components\n📌 Step-by-Step Execution Flow\n📌 Technical Details & Payloads",
        "diagram": "sequenceDiagram",
        "diagram_rules": "Use `sequenceDiagram`. Define actors first. Use `Actor->>Target: Message`.",
        "flashcards": False,
    },
    "Microservices": {
        "notes": "📌 Architecture Overview\n📌 Individual Services & Roles\n📌 Data Flow & Communication\n📌 Tech Stack & Infrastructure",
        "diagram": "flowchart TD",
        "diagram_rules": "Use `flowchart TD`. Map the services and how they connect. Use `-->`.",
        "flashcards": False,
    },
    "Database ERD": {
        "notes": "📌 Database Overview\n📌 Entities & Tables\n📌 Attributes & Primary/Foreign Keys\n📌 Relationships (1:1, 1:N, M:N)",
        "diagram": "erDiagram",
        "diagram_rules": "Use `erDiagram`. Map the entities and their relationships using standard Mermaid ERD syntax.",
        "flashcards": False,
    },
    "Bug Triage": {
        "notes": "📌 Issue Description\n📌 Steps to Reproduce (Numbered)\n📌 Expected vs. Actual Behavior\n📌 Priority, Impact & Root Cause\n📌 Proposed Resolution / Next Steps",
        "diagram": "flowchart TD",
        "diagram_rules": "Use `flowchart TD`. Visually map the steps that cause the bug to occur, or the proposed fix pipeline.",
        "flashcards": False,
    },
    "Sales Discovery Call": {
        "notes": "📌 Prospect/Company Overview\n📌 Budget (Financial constraints)\n📌 Authority (Decision makers)\n📌 Need (Pain points & solutions)\n📌 Timeline (Urgency & deadlines)\n📌 Next Steps",
        "diagram": "mindmap",
        "diagram_rules": "Use `mindmap`. Root node is the Prospect. EXACTLY 4 main branches: Budget, Authority, Need, Timeline.",
        "flashcards": False,
    },
    "SWOT Analysis": {
        "notes": "📌 Executive Summary\n📌 Strengths (Internal advantages)\n📌 Weaknesses (Internal disadvantages)\n📌 Opportunities (External prospects)\n📌 Threats (External risks)",
        "diagram": "mindmap",
        "diagram_rules": "Use `mindmap`. Root node is the Subject. EXACTLY 4 main branches: Strengths, Weaknesses, Opportunities, Threats.",
        "flashcards": False,
    },
    "Client Onboarding": {
        "notes": "📌 Client Profile & Objectives\n📌 Phase 1: Kickoff & Setup\n📌 Phase 2: Implementation\n📌 Phase 3: Handover & Support\n📌 Action Items & Deliverables",
        "diagram": "timeline",
        "diagram_rules": "Use `timeline`. Map the onboarding phases chronologically.",
        "flashcards": False,
    },
    "Medical Consultation": {
        "notes": "📌 Chief Complaint\n📌 Patient History\n📌 Symptoms & Vitals (Detailed)\n📌 Diagnosis & Assessment\n📌 Treatment Plan & Prescriptions",
        "diagram": "sequenceDiagram",
        "diagram_rules": "Use `sequenceDiagram`. Map the dialogue and actions between `Doctor` and `Patient`.",
        "flashcards": False,
    },
    "SOAP Note": {
        "notes": "📌 Subjective (Patient's statements & history)\n📌 Objective (Measurable data, vitals, physical exam)\n📌 Assessment (Medical diagnosis & reasoning)\n📌 Plan (Treatment, meds, follow-up)",
        "diagram": "mindmap",
        "diagram_rules": "Use `mindmap`. Root is the Patient/Issue. EXACTLY 4 branches: Subjective, Objective, Assessment, Plan.",
        "flashcards": False,
    },
    "Therapy Session": {
        "notes": "📌 Client Mood & Presentation\n📌 Key Topics & Traumas Discussed\n📌 Therapeutic Interventions Used\n📌 Client Response & Breakthroughs\n📌 Homework & Next Session Goals",
        "diagram": "sequenceDiagram",
        "diagram_rules": "Use `sequenceDiagram`. Map the conversational flow and emotional shifts between `Therapist` and `Client`.",
        "flashcards": False,
    },
    "Legal Contract Review": {
        "notes": "📌 Contract Overview & Parties Involved\n📌 Key Clauses & Obligations\n📌 Liabilities, Risks & Loopholes\n📌 Amendments & Redlines Needed\n📌 Final Verdict / Next Steps",
        "diagram": "flowchart TD",
        "diagram_rules": "Use `flowchart TD`. Map the logical conditions of the contract (If X happens -> Y is liable).",
        "flashcards": False,
    },
    "Deposition Summary": {
        "notes": "📌 Deponent Information & Context\n📌 Key Testimonies & Admissions\n📌 Contradictions & Credibility Issues\n📌 Evidence & Exhibits Mentioned\n📌 Counsel Summary",
        "diagram": "sequenceDiagram",
        "diagram_rules": "Use `sequenceDiagram`. Map the critical Q&A back-and-forth between `Lawyer` and `Deponent`.",
        "flashcards": False,
    },
    "Compliance Audit": {
        "notes": "📌 Audit Scope & Objectives\n📌 Regulatory Frameworks Checked\n📌 Passed Checks (Compliant)\n📌 Violations & Risks (Non-Compliant)\n📌 Remediation Plan",
        "diagram": "flowchart LR",
        "diagram_rules": "Use `flowchart LR`. Map the audit process pipeline passing from step to step, branching into Pass/Fail.",
        "flashcards": False,
    },
    "Employee 1-on-1": {
        "notes": "📌 Well-being & General Check-in\n📌 Wins & Achievements\n📌 Roadblocks & Frustrations\n📌 Feedback (Two-way)\n📌 Action Items & Career Goals",
        "diagram": "mindmap",
        "diagram_rules": "Use `mindmap`. Root is Employee. Branches: Wins, Blockers, Goals, Feedback.",
        "flashcards": False,
    },
    "HR Candidate Screen": {
        "notes": "📌 Candidate Background & Role Match\n📌 Technical/Hard Skills Assessment\n📌 Soft Skills & Cultural Fit\n📌 Red Flags & Concerns\n📌 Recommendation (Advance or Reject)",
        "diagram": "mindmap",
        "diagram_rules": "Use `mindmap`. Root is Candidate. Branches: Experience, Skills, Culture, Verdict.",
        "flashcards": False,
    },
    "Exit Interview": {
        "notes": "📌 Primary Reason for Departure\n📌 Feedback on the Role & Responsibilities\n📌 Feedback on Management & Leadership\n📌 Feedback on Company Culture & Comp\n📌 Handover Status",
        "diagram": "mindmap",
        "diagram_rules": "Use `mindmap`. Root is Departure. Branches: Reasons, Positives, Negatives, Suggestions.",
        "flashcards": False,
    },
    "UX Research Interview": {
        "notes": "📌 User Profile & Demographics\n📌 Tasks Performed & Behaviors Observed\n📌 Pain Points & Friction Areas\n📌 Positive Feedback & Delights\n📌 Feature Requests & Insights",
        "diagram": "mindmap",
        "diagram_rules": "Use `mindmap`. Root is the Feature/Product. Branches: Pain Points, Successes, Requests, Observations.",
        "flashcards": False,
    },
    "Video Storyboard": {
        "notes": "📌 Video Concept & Target Audience\n📌 Scene-by-Scene Breakdown (Visuals & Script)\n📌 Audio, Music & Voiceover Notes\n📌 Required Assets & Equipment\n📌 Production Timeline",
        "diagram": "timeline",
        "diagram_rules": "Use `timeline`. Map the scenes chronologically.",
        "flashcards": False,
    },
    "Creative Brainstorm": {
        "notes": "📌 Brainstorm Objective/Prompt\n📌 Raw Idea Dump (No bad ideas)\n📌 Shortlisted / Winning Concepts\n📌 Feasibility & Constraints\n📌 Action Items to Execute",
        "diagram": "mindmap",
        "diagram_rules": "Use `mindmap`. Create a deeply nested web of all the creative ideas discussed.",
        "flashcards": False,
    },
    "Daily Standup": {
        "notes": "📌 Yesterday (Completed tasks)\n📌 Today (Planned tasks)\n📌 Blockers (Issues preventing progress)\n📌 General Team Updates",
        "diagram": "flowchart LR",
        "diagram_rules": "Use `flowchart LR`. Map a Kanban-style flow: ToDo -> Doing -> Blocked -> Done.",
        "flashcards": False,
    },
    "Weekly Sync": {
        "notes": "📌 Last Week's Review & Metrics\n📌 High-Level Project Updates\n📌 Roadblocks & Escalations\n📌 Goals & Priorities for This Week\n📌 Open Discussion",
        "diagram": "flowchart LR",
        "diagram_rules": "Use `flowchart LR`. Map the progression of weekly initiatives.",
        "flashcards": False,
    },
    "Study Mind Map": {
        "notes": "📌 Core Topic Overview\n📌 Major Sub-Topics & Concepts\n📌 Key Definitions & Terminology\n📌 Important Examples & Applications\n📌 Summary & Takeaways",
        "diagram": "mindmap",
        "diagram_rules": "Use `mindmap`. Create a structured, educational mindmap of the material.",
        "flashcards": False,
    },
    "Historical Timeline": {
        "notes": "📌 Era / Historical Context\n📌 Key Events & Chronology\n📌 Important Figures & Roles\n📌 Causes & Consequences\n📌 Historical Impact",
        "diagram": "timeline",
        "diagram_rules": "Use `timeline`. Map the historical events precisely with dates/eras.",
        "flashcards": False,
    },
    "Math/Physics Proof": {
        "notes": "📌 Theorem / Problem Statement\n📌 Given Variables & Assumptions\n📌 Step-by-Step Derivation & Logic\n📌 Final Proof / Answer\n📌 Real-World Application",
        "diagram": "flowchart TD",
        "diagram_rules": "Use `flowchart TD`. Map the logical progression of the proof from step to step.",
        "flashcards": False,
    },
    "Flashcard Generator": {
        "notes": "📌 Topic Overview\n📌 Key Terminology\n📌 Crucial Facts & Metrics\n📌 Summary Outline",
        "diagram": "DYNAMIC",  # 🟢 NEW: Allow diagrams in Flashcards
        "diagram_rules": "Generate exactly 1 core diagram (flowchart TD, sequenceDiagram, or timeline) that visually summarizes the entire study material.",
        "flashcards": True,
    },
    "AI Auto-Detect": {
        "notes": "📌 Overview\n📌 Key Themes & Concepts\n📌 Detailed Analysis\n📌 Action Items / Summary",
        "diagram": "DYNAMIC",
        "diagram_rules": "DYNAMIC: Analyze the content and intelligently select the BEST Mermaid format (`flowchart TD`, `sequenceDiagram`, or `timeline`). NEVER use `mindmap` or `gantt` charts to prevent frontend crashes.",
        "flashcards": False,
    },
}


# =====================================================================
# 🚀 1. NOTES GENERATOR (INTEGRATED FORMATTING)
# =====================================================================
def enhance_notes(notes, template="AI Auto-Detect"):
    if not GROQ_API_KEY:
        return None

    config = TEMPLATE_CONFIGS.get(template, TEMPLATE_CONFIGS["AI Auto-Detect"])
    headers_instruction = config["notes"]

    mismatch_warning = ""
    # 🟢 Excludes Flashcards from strict mismatch checking
    if template not in ["AI Auto-Detect", "Flashcard Generator"]:
        mismatch_warning = f"""
🚨 CRITICAL CONTENT MISMATCH RULE 🚨:
If the input text is COMPLETELY UNRELATED to a "{template}" (e.g., the template is 'Bug Triage' but the audio is about 'Ancient Rome'), YOU MUST STILL GENERATE NOTES.
Do NOT leave it blank. Instead, prepend this EXACT warning at the very top:
"📌 **⚠️ Content Mismatch Indicator**: The provided audio does not align with the '{template}' framework. Notes have been dynamically extracted based on actual content."
"""

    prompt = f"""You are an elite, highly intelligent Note-Taker. The user has selected the "{template}" framework.

{mismatch_warning}

CRITICAL DATA RETENTION RULE:
Do NOT over-summarize. Extract ALL crucial sentences, facts, numbers, and nuances from the input. Keep explanations highly detailed, utilizing complete sentences. Do not drop important data.

REQUIRED FORMATTING STRUCTURE:
Structure the notes using exactly these headers (unless dealing with a total content mismatch):
{headers_instruction}

FORMAT STRICTLY:
- Main Category Headers MUST start with `📌 ` or `# `
- Sub-Category Headers MUST start with `## `
- Minor details/sections MUST start with `### `
- Use detailed, descriptive bullet points (`- ` or `* `).
- Bold **key terms** for readability.

Raw Input Transcript:
{notes}
"""

    try:
        res = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {GROQ_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "model": "llama-3.3-70b-versatile",
                "messages": [{"role": "user", "content": prompt}],
                "temperature": 0.3,
            },
            timeout=30,
        )

        if res.status_code == 200:
            return res.json()["choices"][0]["message"]["content"].strip()
    except Exception as e:
        print("❌ Notes API ERROR:", e)

    return None


# =====================================================================
# 🚀 2. DIAGRAM & FLASHCARD GENERATOR (SMART DUAL-MODE)
# =====================================================================
def enhance_diagram(notes, template="AI Auto-Detect"):
    url = "https://api.groq.com/openai/v1/chat/completions"

    config = TEMPLATE_CONFIGS.get(template, TEMPLATE_CONFIGS["AI Auto-Detect"])
    diagram_type = config["diagram"]
    diagram_rules = config["diagram_rules"]
    requires_flashcards = config["flashcards"]

    # 🚀 NEW: DUAL-MODE INTELLIGENCE
    if requires_flashcards:
        necessity_rule = """
🚨 DUAL-MODE INTELLIGENCE (CRITICAL) 🚨:
You must act as both an Educational Architect and a Flashcard Creator.
1. DIAGRAM: Extract the overarching process or structure and map it visually.
2. FLASHCARDS: Extract key definitions, metrics, and facts for study testing.
"""
        diagram_instruction = f"""Generate exactly 1 highly accurate diagram that visually summarizes the text using the `{diagram_type}` format (or dynamic if applicable).
\nSTRICT RULES: {diagram_rules}"""
        flashcard_instruction = "You MUST generate exactly 5-10 highly detailed Q&A flashcards based on the text. Provide a `front` (the question or concept) and `back` (the detailed answer or definition)."
    else:
        necessity_rule = """
🚨 SEMANTIC DIAGRAM REASONING (CRITICAL) 🚨:
You MUST choose the correct visual format based on the specific nature of the data:
1. ALGORITHMS, MATH, LOGIC, OR PROCESSES: You MUST use `flowchart TD` or `flowchart LR`. 
2. CONVERSATIONS OR API CALLS: You MUST use `sequenceDiagram`. DO NOT use sequence diagrams for algorithms.
3. HISTORY OR PHASES: MUST use `timeline`.
"""
        if diagram_type == "DYNAMIC" or template == "AI Auto-Detect":
            diagram_instruction = f"""Generate between 0 and 2 diagrams depending STRICTLY on the necessity of the content. 
If the input covers multiple distinct structural concepts, generate separate diagrams. Mix and match types dynamically based on what fits the data best.
\nSTRICT RULES: {diagram_rules}"""
        else:
            diagram_instruction = f"""Generate between 0 and 2 diagrams using the `{diagram_type}` format, depending STRICTLY on necessity. 
\nSTRICT RULES: {diagram_rules}"""
        flashcard_instruction = "You MUST return an empty array `[]` for `flashcards`."

    mismatch_instruction = ""
    if template not in ["AI Auto-Detect", "Flashcard Generator"]:
        mismatch_instruction = f"""
🚨 TEMPLATE MISMATCH RULE 🚨:
If the input content makes ABSOLUTELY NO SENSE for a "{template}" diagram, ABORT the `{diagram_type}`. 
Do not hallucinate a broken diagram. Instead, fallback to a generic `flowchart TD` that categorizes the actual content of the text.
"""

    prompt = f"""You are a master Data Architect. The user is using the "{template}" framework.
Analyze the notes and output pure JSON.

{necessity_rule}
{mismatch_instruction}

1. DIAGRAM GENERATION:
{diagram_instruction}

UNIVERSAL MERMAID SAFETY RULES (CRITICAL):
- CONNECT YOUR NODES: In flowcharts, EVERY node MUST be connected using an arrow. Do NOT leave nodes floating.
- NO MINDMAPS: NEVER use the `mindmap` format as it causes parser crashes. Use `flowchart TD` instead.
- NO SPACES IN NODE IDs: In flowcharts, the ID *before* the bracket CANNOT have spaces. Use underscores. (Correct: `Step_1["Do this"]`).
- SEPARATE LINES REQUIRED: Every single node definition, connection, participant, and structural keyword MUST be on its own line. Do not combine them.
- NO DOUBLE BRACKETS: You must ONLY use standard single brackets for nodes `A["Text"]`. NEVER use double brackets `A[["Text"]]` or double parentheses `A((Text))`.
- NO TITLES IN CODE: Never use `title=` or `--- title ---` inside the mermaid code.
- NO PIPES: Never use `|text|` for labels on arrows.

2. FLASHCARD GENERATION:
{flashcard_instruction}

YOU MUST RESPOND IN PURE, VALID JSON FORMAT LIKE THIS:
{{
  "diagrams": [
    {{
      "title": "Example Output Flow",
      "code": "flowchart TD\\n  Start_Node[\\"Start Array\\"] --> Split_Node[\\"Split in Half\\"]"
    }}
  ],
  "flashcards": [
    {{
      "front": "What is the capital of France?",
      "back": "Paris"
    }}
  ]
}}

Input Notes:
{notes}
"""

    try:
        res = requests.post(
            url,
            headers={
                "Authorization": f"Bearer {GROQ_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "model": "llama-3.3-70b-versatile",
                "messages": [{"role": "user", "content": prompt}],
                "temperature": 0.2,
                "response_format": {"type": "json_object"},
            },
            timeout=30,
        )

        if res.status_code == 200:
            raw_output = res.json()["choices"][0]["message"]["content"]
            clean_json_str = extract_clean_json(raw_output)
            parsed_json = json.loads(clean_json_str)

            # Guarantee the keys exist so React never crashes
            if "diagrams" not in parsed_json:
                parsed_json["diagrams"] = []
            if "flashcards" not in parsed_json:
                parsed_json["flashcards"] = []

            return json.dumps(parsed_json)

    except Exception as e:
        print("❌ ERROR:", e)

    # 🚀 GUARANTEED CRASH-FREE FALLBACK FOR BOTH DIAGRAMS AND FLASHCARDS
    fallback_title = (
        "General Overview"
        if template == "AI Auto-Detect"
        else "⚠️ Content Mismatch Indicator"
    )
    fallback_node = (
        "Auto Detected Data" if template == "AI Auto-Detect" else "Template Mismatch"
    )

    fallback_json = {
        "diagrams": [
            {
                "title": fallback_title,
                "code": f'flowchart TD\n  Root["{fallback_node}"] --> Notes["Analyzed Notes"]\n  Root --> Themes["Extracted Themes"]\n  Root --> Review["Review Material"]',
            }
        ],
        "flashcards": [
            {
                "front": "⚠️ Generation Error",
                "back": "The AI encountered an error generating flashcards. Please try again.",
            }
        ],
    }
    return json.dumps(fallback_json)
