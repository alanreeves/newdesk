from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm


def build_pdf():
    pdf_path = r"d:\NEW SOUND DESK\Sound_Desk_Cutting_List.pdf"

    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=A4,
        leftMargin=11 * mm,
        rightMargin=11 * mm,
        topMargin=10 * mm,
        bottomMargin=10 * mm,
    )

    styles = getSampleStyleSheet()

    emerald_dark = colors.HexColor("#064e3b")
    emerald_mid = colors.HexColor("#065f46")
    emerald = colors.HexColor("#059669")
    emerald_bg = colors.HexColor("#ecfdf5")
    emerald_row = colors.HexColor("#f0fdf4")
    emerald_border = colors.HexColor("#a7f3d0")
    slate_text = colors.HexColor("#0f172a")
    slate_muted = colors.HexColor("#475569")
    amber_qty = colors.HexColor("#b45309")

    title_style = ParagraphStyle(
        "DocTitle",
        parent=styles["Heading1"],
        fontName="Helvetica-Bold",
        fontSize=15.5,
        leading=18,
        textColor=emerald_dark,
        spaceAfter=1,
    )

    subtitle_style = ParagraphStyle(
        "DocSubTitle",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=8.8,
        leading=11,
        textColor=emerald,
        spaceAfter=0,
    )

    meta_style = ParagraphStyle(
        "DocMeta",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=8,
        leading=10.5,
        alignment=2,
        textColor=slate_muted,
    )

    section_style = ParagraphStyle(
        "SectionHeading",
        parent=styles["Heading2"],
        fontName="Helvetica-Bold",
        fontSize=9.2,
        leading=11.5,
        textColor=emerald_mid,
        spaceBefore=6,
        spaceAfter=3,
    )

    cell_style = ParagraphStyle(
        "TableCell",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=7.8,
        leading=9.6,
        textColor=slate_text,
    )

    cell_bold = ParagraphStyle(
        "TableCellBold",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=7.8,
        leading=9.6,
        textColor=slate_text,
    )

    cell_qty = ParagraphStyle(
        "TableCellQty",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=8,
        leading=9.6,
        alignment=1,
        textColor=amber_qty,
    )

    header_cell = ParagraphStyle(
        "HeaderCell",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=7.6,
        leading=9.5,
        textColor=colors.white,
    )

    note_title = ParagraphStyle(
        "NoteTitle",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=8,
        leading=10,
        textColor=emerald_mid,
        spaceAfter=2,
    )

    note_body = ParagraphStyle(
        "NoteBody",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=7.3,
        leading=9.5,
        textColor=colors.HexColor("#334155"),
    )

    footer_style = ParagraphStyle(
        "FooterStyle",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=7.2,
        leading=9,
        textColor=colors.HexColor("#64748b"),
    )

    story = []

    # 1. Header
    header_data = [
        [
            Paragraph("SOUND DESK — 1-PAGE CUTTING LIST", title_style),
            Paragraph(
                "<b>Project:</b> Sound Desk (Alan Reeves)<br/>"
                "<b>Boards:</b> 3 × 2800 × 2070 mm (18mm)<br/>"
                "<b>Total Parts:</b> 38 Pieces (incl. 3 Drawers)",
                meta_style,
            ),
        ],
        [
            Paragraph(
                "2730 × 900 × 760 mm Workstation • Single Material: <b>18mm Egger Natural Kendal Oak MFC (H3170)</b>",
                subtitle_style,
            ),
            Paragraph("", meta_style),
        ],
    ]
    header_table = Table(header_data, colWidths=[126 * mm, 62 * mm])
    header_table.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "BOTTOM"),
                ("SPAN", (1, 0), (1, 1)),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 0),
            ]
        )
    )
    story.append(header_table)
    story.append(Spacer(1, 3))
    story.append(HRFlowable(width="100%", thickness=2, color=emerald, spaceAfter=5))

    # 2. Summary Card
    summary_data = [
        [
            Paragraph("<b>Single-Material Build:</b> 3 × 18mm Egger MFC (2800×2070mm) · Ø 23% waste", cell_style),
            Paragraph("<b>Layout (2730mm):</b> 450 Ped · 515 Op · 300 PC · 500 Rack · 515 Op · 450 Ped", cell_style),
        ],
        [
            Paragraph("<b>Separate Drawer Sheets:</b> 0 (all 3 drawer boxes cut from same 3 boards)", cell_style),
            Paragraph("<b>Edge Banding:</b> ~55m Egger 2mm Natural Kendal Oak ABS (exposed edges)", cell_style),
        ],
    ]
    summary_table = Table(summary_data, colWidths=[94 * mm, 94 * mm])
    summary_table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), emerald_bg),
                ("BOX", (0, 0), (-1, -1), 0.8, emerald_border),
                ("LINEBEFORE", (0, 0), (0, -1), 3, emerald),
                ("TOPPADDING", (0, 0), (-1, -1), 3),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
                ("LEFTPADDING", (0, 0), (-1, -1), 6),
                ("RIGHTPADDING", (0, 0), (-1, -1), 6),
            ]
        )
    )
    story.append(summary_table)

    def create_section_table(headers, rows_data, col_widths):
        table_data = [[Paragraph(h, header_cell) for h in headers]]
        for row in rows_data:
            formatted_row = []
            for i, val in enumerate(row):
                if i == 0:
                    formatted_row.append(Paragraph(f"<b>{val}</b>", cell_bold))
                elif i == 2:
                    formatted_row.append(Paragraph(str(val), cell_qty))
                elif i in (3, 4):
                    formatted_row.append(Paragraph(f"<b>{val}</b>", cell_bold))
                else:
                    formatted_row.append(Paragraph(str(val), cell_style))
            table_data.append(formatted_row)

        t = Table(table_data, colWidths=col_widths)
        t.setStyle(
            TableStyle(
                [
                    ("BACKGROUND", (0, 0), (-1, 0), emerald_mid),
                    ("ALIGN", (0, 0), (-1, -1), "LEFT"),
                    ("ALIGN", (2, 0), (2, -1), "CENTER"),
                    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                    ("TOPPADDING", (0, 0), (-1, -1), 2.6),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 2.6),
                    ("LEFTPADDING", (0, 0), (-1, -1), 4),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 4),
                    ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#e2e8f0")),
                    ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, emerald_row]),
                ]
            )
        )
        return t

    col_widths = [16 * mm, 56 * mm, 10 * mm, 17 * mm, 17 * mm, 13 * mm, 59 * mm]

    # 3. Section A: Carcass, Worktop & Structural Panels (23 parts)
    story.append(
        Paragraph("A · CARCASS, WORKTOP & STRUCTURAL PANELS (18mm Egger MFC — 23 Parts)", section_style)
    )
    a_headers = ["Ref", "Description", "Qty", "L (mm)", "W (mm)", "Thk", "Position / Machining Notes"]
    a_rows = [
        ["A1", "<b>Desktop Panel (cable trench routed)</b>", "1", "2730", "900", "18mm", "Seamless top; 150mm trench routed from underside"],
        ["A2", "<b>Cable Trench Hinged Lid</b>", "1", "2730", "150", "18mm", "12 U-slots (25×60mm); rear 2730mm piano hinge"],
        ["A3–A4", "Outer Left & Right End Panels (Gables)", "2", "860", "742", "18mm", "Visible outer ends; H = 760 − 18mm top"],
        ["A5–A9", "Internal Vertical Dividers (5 Off)", "5", "860", "742", "18mm", "At 450, 965, 1265, 1765 & 2280mm from left"],
        ["A10, A12", "Base Plinths — Left & Right Pedestals", "2", "860", "450", "18mm", "Full 860mm depth under pedestals"],
        ["A11", "Base Plinth — Centre PC & Rack Bay", "1", "860", "800", "18mm", "Full 860mm depth under centre equipment bay"],
        ["A13–A14", "Base Plinths — Operator Leg Recesses", "2", "515", "300", "18mm", "Rear 300mm depth kickers under 515mm footwells"],
        ["A15, A18", "Back Panels — Left & Right Pedestals", "2", "450", "760", "18mm", "Full-height 760mm rear closure panels"],
        ["A16–A17", "Back Panels — Operator Recesses", "2", "515", "760", "18mm", "Full-height rear panels for 515mm footwells"],
        ["A19", "Equipment Bay Fixed Shelf", "1", "780", "480", "18mm", "Supports induction loop & house speaker amps"],
        ["A20", "Tower PC Pull-Out Tray", "1", "780", "260", "18mm", "Mounted on 750mm heavy-duty telescopic slides"],
        ["A21", "Drawer Front Panels", "3", "404", "290", "18mm", "2 in left pedestal, 1 top right (open recess below)"],
    ]
    story.append(create_section_table(a_headers, a_rows, col_widths))

    # 4. Section B: Precision Drawer Boxes (15 parts)
    story.append(
        Paragraph("B · PRECISION DRAWER BOXES (18mm Egger MFC — 15 Parts, 3 Drawers)", section_style)
    )
    b_headers = ["Ref", "Component", "Qty", "L (mm)", "W (mm)", "Thk", "Notes"]
    b_rows = [
        ["B1", "Drawer Box Side Walls", "6", "570", "220", "18mm", "2 sides × 3 drawers (sized for 600mm runners)"],
        ["B2", "Drawer Box Front & Back", "6", "368", "220", "18mm", "1 front + 1 back × 3 drawers"],
        ["B3", "Drawer Box Base Panels", "3", "546", "340", "18mm", "1 base × 3 drawers (rebated/grooved into sides)"],
    ]
    story.append(create_section_table(b_headers, b_rows, col_widths))
    story.append(Spacer(1, 5))

    # 5. Two-column Hardware & Workshop Notes Box
    hw_block = [
        Paragraph("HARDWARE SCHEDULE", note_title),
        Paragraph(
            "• <b>Piano Hinge:</b> 1× 2730mm stainless continuous hinge (150mm lid rear).<br/>"
            "• <b>Trench Divider:</b> 1× 2730mm (or 2× 1365mm) × 48mm × 1.5–2mm alu sheet.<br/>"
            "• <b>Floor Hatches:</b> 2× liftable plug-access hatches (PC & rack bays) w/ finger pulls.<br/>"
            "• <b>Slides:</b> 3 pairs 600mm soft-close drawer (35kg) + 1 pair 750mm PC (45kg+).<br/>"
            "• <b>Handles &amp; Grommets:</b> 3× black bar pulls (120mm) + 24× 25×60mm grommets.<br/>"
            "• <b>Fixings:</b> 50mm Confirmat / 4×45mm screws, 8× M6×50mm bolts, PVA, ~55m 2mm ABS.",
            note_body,
        ),
    ]
    notes_block = [
        Paragraph("WORKSHOP & CABLE SEGREGATION NOTES", note_title),
        Paragraph(
            "• <b>Grain Direction:</b> Continuous grain along 2730mm length on desktop (A1) & lid (A2).<br/>"
            "• <b>150mm Dual-Channel Trench:</b> Route 3–4mm × 6mm groove along trench floor centreline "
            "(75mm) for aluminium divider — Rear 75mm = 230V AC Mains, Front 75mm = Clean Audio/Data.<br/>"
            "• <b>Zero-Chip MFC Cutting:</b> Use 80T triple-chip grind (TCG) blade or score lines first.<br/>"
            "• <b>Pilot Drilling:</b> Pre-drill all MFC screw holes with 3.5mm bit & countersink cleanly.<br/>"
            "• <b>Board Nesting:</b> All 38 pieces cut from 3× 2800×2070mm Egger MFC boards.",
            note_body,
        ),
    ]

    notes_table = Table([[hw_block, notes_block]], colWidths=[93 * mm, 95 * mm])
    notes_table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#f8fafc")),
                ("BOX", (0, 0), (0, 0), 0.6, colors.HexColor("#e2e8f0")),
                ("BOX", (1, 0), (1, 0), 0.6, colors.HexColor("#e2e8f0")),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("TOPPADDING", (0, 0), (-1, -1), 5),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
                ("LEFTPADDING", (0, 0), (-1, -1), 6),
                ("RIGHTPADDING", (0, 0), (-1, -1), 6),
            ]
        )
    )
    story.append(notes_table)
    story.append(Spacer(1, 5))
    story.append(HRFlowable(width="100%", thickness=0.6, color=colors.HexColor("#cbd5e1"), spaceAfter=3))

    footer_table = Table(
        [
            [
                Paragraph("Sound Desk — 18mm Egger Natural Kendal Oak MFC (H3170) · 2730 × 900 × 760 mm", footer_style),
                Paragraph(
                    "1-Page Workshop Summary · Rev C",
                    ParagraphStyle("FooterR", parent=footer_style, alignment=2),
                ),
            ]
        ],
        colWidths=[132 * mm, 56 * mm],
    )
    footer_table.setStyle(
        TableStyle(
            [
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
            ]
        )
    )
    story.append(footer_table)

    doc.build(story)
    print("PDF generated successfully at:", pdf_path)


if __name__ == "__main__":
    build_pdf()
