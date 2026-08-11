#!/usr/bin/env python3
"""Generate the public one-page handoff PDF."""

from pathlib import Path

from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4, landscape
from reportlab.pdfbase.pdfmetrics import stringWidth
from reportlab.pdfgen.canvas import Canvas


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "output" / "pdf" / "AI-Enablement-Handoff-One-Page.pdf"

PAPER = HexColor("#FBFAF7")
INK = HexColor("#14221F")
MUTED = HexColor("#61706B")
GREEN = HexColor("#123F3A")
GREEN_2 = HexColor("#1E574F")
GREEN_SOFT = HexColor("#E5EEEA")
LIME = HexColor("#DFFF75")
LINE = HexColor("#D8DDD8")
AMBER_SOFT = HexColor("#FFF0D9")
AMBER = HexColor("#A86018")
WHITE = HexColor("#FFFFFF")


def fit_text(text: str, font: str, size: float, max_width: float) -> str:
    if stringWidth(text, font, size) <= max_width:
        return text
    suffix = "..."
    while text and stringWidth(text + suffix, font, size) > max_width:
        text = text[:-1]
    return text.rstrip() + suffix


def wrapped_lines(text: str, font: str, size: float, max_width: float) -> list[str]:
    words = text.split()
    lines: list[str] = []
    current = ""
    for word in words:
        candidate = f"{current} {word}".strip()
        if not current or stringWidth(candidate, font, size) <= max_width:
            current = candidate
        else:
            lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def draw_text(
    canvas: Canvas,
    text: str,
    x: float,
    y: float,
    width: float,
    *,
    font: str = "Helvetica",
    size: float = 7.2,
    color=INK,
    leading: float | None = None,
    max_lines: int | None = None,
) -> float:
    leading = leading or size * 1.35
    lines = wrapped_lines(text, font, size, width)
    if max_lines and len(lines) > max_lines:
        lines = lines[:max_lines]
        lines[-1] = fit_text(lines[-1], font, size, width)
    canvas.setFillColor(color)
    canvas.setFont(font, size)
    for line in lines:
        canvas.drawString(x, y, line)
        y -= leading
    return y


def label(canvas: Canvas, text: str, x: float, y: float, color=GREEN_2) -> None:
    canvas.setFillColor(color)
    canvas.setFont("Courier-Bold", 6.2)
    canvas.drawString(x, y, text.upper())


def round_box(canvas: Canvas, x: float, y: float, width: float, height: float, fill=WHITE, stroke=LINE) -> None:
    canvas.setFillColor(fill)
    canvas.setStrokeColor(stroke)
    canvas.setLineWidth(0.65)
    canvas.roundRect(x, y, width, height, 8, stroke=1, fill=1)


def checklist_row(canvas: Canvas, x: float, y: float, text: str, width: float) -> float:
    canvas.setFillColor(GREEN_SOFT)
    canvas.circle(x + 5, y + 2, 5, stroke=0, fill=1)
    canvas.setFillColor(GREEN)
    canvas.setFont("Helvetica-Bold", 5.7)
    canvas.drawCentredString(x + 5, y, "+")
    return draw_text(canvas, text, x + 14, y + 1, width - 14, size=6.5, leading=8.2, max_lines=2)


def build_pdf(path: Path = OUTPUT) -> Path:
    path.parent.mkdir(parents=True, exist_ok=True)
    page_width, page_height = landscape(A4)
    canvas = Canvas(str(path), pagesize=(page_width, page_height))
    canvas.setTitle("AI Enablement Handoff Lab - One-page handoff")
    canvas.setAuthor("Alexander Tian")
    canvas.setSubject("Synthetic AI enablement workflow handoff")

    canvas.setFillColor(PAPER)
    canvas.rect(0, 0, page_width, page_height, stroke=0, fill=1)

    margin = 34
    usable = page_width - margin * 2

    # Header
    canvas.setFillColor(GREEN)
    canvas.roundRect(margin, page_height - 47, 24, 24, 7, stroke=0, fill=1)
    canvas.setFillColor(LIME)
    canvas.setFont("Helvetica-Bold", 12)
    canvas.drawCentredString(margin + 12, page_height - 40, "H")
    canvas.setFillColor(INK)
    canvas.setFont("Helvetica-Bold", 10)
    canvas.drawString(margin + 33, page_height - 39, "AI Enablement Handoff Lab")
    canvas.setFillColor(MUTED)
    canvas.setFont("Courier", 6)
    canvas.drawRightString(page_width - margin, page_height - 34, "HANDOFF V1.0 | 11 AUG 2026")
    canvas.setStrokeColor(LINE)
    canvas.line(margin, page_height - 55, page_width - margin, page_height - 55)

    # Title and owner
    label(canvas, "Reusable pattern | RP-001", margin, page_height - 76)
    canvas.setFillColor(INK)
    canvas.setFont("Helvetica-Bold", 23)
    canvas.drawString(margin, page_height - 101, "Source-grounded delivery-exception briefing")
    draw_text(
        canvas,
        "One recurring task, bounded drafting, visible evidence and mandatory human release.",
        margin,
        page_height - 118,
        500,
        size=8.5,
        color=MUTED,
    )

    owner_w = 185
    owner_h = 52
    owner_x = page_width - margin - owner_w
    owner_y = page_height - 122
    round_box(canvas, owner_x, owner_y, owner_w, owner_h, fill=GREEN, stroke=GREEN)
    label(canvas, "Business owner", owner_x + 14, owner_y + 35, color=LIME)
    canvas.setFillColor(WHITE)
    canvas.setFont("Helvetica-Bold", 10)
    canvas.drawString(owner_x + 14, owner_y + 21, "Priya Nair")
    canvas.setFillColor(HexColor("#B8CEC8"))
    canvas.setFont("Helvetica", 6.5)
    canvas.drawString(owner_x + 14, owner_y + 10, "Operations Enablement Lead | synthetic persona")

    # Row 1
    gap = 9
    col_w = (usable - gap) / 2
    row1_y = page_height - 245
    row1_h = 104
    round_box(canvas, margin, row1_y, col_w, row1_h)
    label(canvas, "Reusable input template", margin + 14, row1_y + row1_h - 17)
    fields = [
        ("Source ID", "SRC-__"),
        ("Time", "__:__"),
        ("Author / system", "________________"),
        ("Exact note", "____________________________________"),
        ("Status / ETA", "confirmed | missing | unknown"),
    ]
    field_y = row1_y + row1_h - 32
    for field, value in fields:
        canvas.setFillColor(MUTED)
        canvas.setFont("Helvetica", 6.2)
        canvas.drawString(margin + 14, field_y, field)
        canvas.setFillColor(INK)
        canvas.setFont("Courier", 6.2)
        canvas.drawString(margin + 88, field_y, value)
        canvas.setStrokeColor(LINE)
        canvas.line(margin + 86, field_y - 3, margin + col_w - 14, field_y - 3)
        field_y -= 14

    row1_x2 = margin + col_w + gap
    round_box(canvas, row1_x2, row1_y, col_w, row1_h, fill=GREEN_SOFT)
    label(canvas, "Approved / prohibited use", row1_x2 + 14, row1_y + row1_h - 17)
    half = (col_w - 42) / 2
    label(canvas, "Approved", row1_x2 + 14, row1_y + 64)
    draw_text(canvas, "Summarise supplied notes. Draft cautious copy. Cite every fact. Label unknowns.", row1_x2 + 14, row1_y + 50, half, size=7, leading=9.2, max_lines=4)
    label(canvas, "Prohibited", row1_x2 + 28 + half, row1_y + 64, color=HexColor("#9E3F37"))
    draw_text(canvas, "Invent timing. Resolve conflicts. Expose personal or access data. Send automatically.", row1_x2 + 28 + half, row1_y + 50, half, size=7, leading=9.2, max_lines=4)

    # Row 2
    row2_y = page_height - 359
    row2_h = 105
    round_box(canvas, margin, row2_y, col_w, row2_h)
    label(canvas, "Reviewer checklist", margin + 14, row2_y + row2_h - 17)
    checks = [
        "Every factual sentence links to a source note.",
        "Timing is explicitly confirmed, not inferred.",
        "No conflicting status remains unresolved.",
        "Personal and access details are absent or redacted.",
        "The owner approves the exact customer-facing draft.",
    ]
    check_y = row2_y + row2_h - 34
    for check in checks:
        check_y = checklist_row(canvas, margin + 14, check_y, check, col_w - 28) - 3

    round_box(canvas, row1_x2, row2_y, col_w, row2_h)
    label(canvas, "Escalation guide", row1_x2 + 14, row2_y + row2_h - 17)
    escalations = [
        ("Dispatch", "Missing ETA or unclear current status"),
        ("Operations", "Mutually exclusive source statuses"),
        ("Privacy", "Names, phone numbers or new personal-data use"),
        ("Security", "Credentials, gate codes or access instructions"),
        ("Engineering", "Invalid schema or unknown source ID"),
    ]
    esc_y = row2_y + row2_h - 35
    for role, trigger in escalations:
        canvas.setFillColor(GREEN_2)
        canvas.setFont("Helvetica-Bold", 6.4)
        canvas.drawString(row1_x2 + 14, esc_y, role)
        canvas.setFillColor(MUTED)
        canvas.setFont("Helvetica", 6.4)
        canvas.drawString(row1_x2 + 88, esc_y, trigger)
        esc_y -= 13

    # Training bar
    training_y = page_height - 418
    training_h = 50
    round_box(canvas, margin, training_y, usable, training_h, fill=GREEN, stroke=GREEN)
    label(canvas, "Five-minute training", margin + 14, training_y + 32, color=LIME)
    canvas.setFillColor(WHITE)
    canvas.setFont("Helvetica-Bold", 10)
    canvas.drawString(margin + 14, training_y + 16, "Run | inspect | challenge | approve")
    training = [
        ("1 min", "Enter exact notes"),
        ("1 min", "Open every source"),
        ("1 min", "Try all controls"),
        ("1 min", "Correct or escalate"),
        ("1 min", "Owner approves"),
    ]
    tx = margin + 225
    tw = (usable - 240) / 5
    for duration, instruction in training:
        canvas.setFillColor(LIME)
        canvas.setFont("Courier-Bold", 5.7)
        canvas.drawString(tx, training_y + 30, duration.upper())
        draw_text(canvas, instruction, tx, training_y + 17, tw - 8, size=6.2, color=HexColor("#D3E0DD"), leading=8, max_lines=2)
        tx += tw

    # Row 3
    row3_y = page_height - 500
    row3_h = 72
    versions_w = col_w * 0.77
    gap_w = usable - versions_w - gap
    round_box(canvas, margin, row3_y, versions_w, row3_h)
    label(canvas, "Version record", margin + 14, row3_y + row3_h - 17)
    versions = [
        ("Model", "seeded-brief-compiler-v1.0.0"),
        ("Prompt", "delivery-brief-v1.2.0"),
        ("Guidance", "handoff-boundary-v1.0.0"),
        ("Output", "briefing-output-v1"),
    ]
    version_y = row3_y + row3_h - 33
    for index, (key, value) in enumerate(versions):
        column = index % 2
        row = index // 2
        vx = margin + 14 + column * (versions_w / 2)
        vy = version_y - row * 17
        canvas.setFillColor(MUTED)
        canvas.setFont("Helvetica", 5.8)
        canvas.drawString(vx, vy, key)
        canvas.setFillColor(INK)
        canvas.setFont("Courier-Bold", 5.8)
        canvas.drawString(vx + 43, vy, value)

    gap_x = margin + versions_w + gap
    round_box(canvas, gap_x, row3_y, gap_w, row3_h, fill=AMBER_SOFT, stroke=HexColor("#E5C898"))
    label(canvas, "Documentation gap | GAP-001", gap_x + 14, row3_y + row3_h - 17, color=AMBER)
    canvas.setFillColor(INK)
    canvas.setFont("Helvetica-Bold", 9)
    canvas.drawString(gap_x + 14, row3_y + 36, "Who owns scan-status reconciliation?")
    draw_text(canvas, "Assign final authority before the pattern is reused.", gap_x + 14, row3_y + 20, gap_w - 28, size=6.5, color=HexColor("#765534"), max_lines=2)

    # Footer outcome
    footer_h = 53
    canvas.setFillColor(GREEN)
    canvas.rect(0, 0, page_width, footer_h, stroke=0, fill=1)
    outcomes = [
        ("2 risks detected", "operational uncertainty | sensitive data"),
        ("1 pattern registered", "source-grounded exception briefing"),
        ("1 gap raised", "status-reconciliation ownership"),
        ("+ Ownership transferred", "owner | controls | training | versions"),
    ]
    outcome_w = page_width / 4
    for index, (headline, detail) in enumerate(outcomes):
        ox = index * outcome_w + 22
        if index:
            canvas.setStrokeColor(HexColor("#35645D"))
            canvas.line(index * outcome_w, 11, index * outcome_w, footer_h - 11)
        canvas.setFillColor(LIME)
        canvas.setFont("Helvetica-Bold", 7.5)
        canvas.drawString(ox, 31, headline)
        canvas.setFillColor(HexColor("#A9C0BA"))
        canvas.setFont("Helvetica", 5.7)
        canvas.drawString(ox, 18, detail)

    canvas.showPage()
    canvas.save()
    return path


if __name__ == "__main__":
    print(build_pdf())
