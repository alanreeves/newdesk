import os
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable, KeepTogether
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm

def build_pdf():
    pdf_path = r"d:\NEW SOUND DESK\Sound_Desk_Cutting_List.pdf"
    
    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=A4,
        leftMargin=12 * mm,
        rightMargin=12 * mm,
        topMargin=12 * mm,
        bottomMargin=12 * mm
    )

    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        textColor=colors.HexColor('#78350f'),
        spaceAfter=2
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=13,
        textColor=colors.HexColor('#d97706'),
        spaceAfter=8
    )

    meta_style = ParagraphStyle(
        'DocMeta',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=11,
        alignment=2, # Right
        textColor=colors.HexColor('#475569')
    )

    section_style = ParagraphStyle(
        'SectionHeading',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=14,
        textColor=colors.HexColor('#78350f'),
        spaceBefore=10,
        spaceAfter=4
    )

    cell_style = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor('#1e293b')
    )

    cell_bold = ParagraphStyle(
        'TableCellBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor('#1e293b')
    )

    header_cell = ParagraphStyle(
        'HeaderCell',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=colors.white
    )

    story = []

    # 1. Header Table
    header_data = [
        [
            Paragraph("SOUND DESK CUTTING LIST", title_style),
            Paragraph("<b>Project:</b> Sound Desk Workstation<br/><b>Date:</b> August 10, 2026<br/><b>Spec:</b> Production Approved", meta_style)
        ],
        [
            Paragraph("3.0m Custom Workstation • Timber Spec: <b>Light Oak Faced MDF</b>", subtitle_style),
            Paragraph("", meta_style)
        ]
    ]

    header_table = Table(header_data, colWidths=[120 * mm, 66 * mm])
    header_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'BOTTOM'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 0),
        ('TOPPADDING', (0, 0), (-1, -1), 0),
    ]))
    story.append(header_table)
    story.append(Spacer(1, 4))
    story.append(HRFlowable(width="100%", thickness=2, color=colors.HexColor('#b45309'), spaceAfter=8))

    # 2. Material Estimation Card
    summary_data = [
        [
            Paragraph("<b>30mm Light Oak Faced MDF:</b> 2 Boards (3050 × 1525 mm)", cell_style),
            Paragraph("<b>12mm Light Oak / Birch MDF:</b> 1 Board (2440 × 1220 mm)", cell_style)
        ],
        [
            Paragraph("<b>18mm Light Oak Faced MDF:</b> 3 Boards (2440 × 1220 mm)", cell_style),
            Paragraph("<b>6mm Plain / Oak MDF Backing:</b> 1 Board (2440 × 1220 mm)", cell_style)
        ]
    ]
    summary_table = Table(summary_data, colWidths=[93 * mm, 93 * mm])
    summary_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#fef3c7')),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor('#fde68a')),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
    ]))
    story.append(summary_table)
    story.append(Spacer(1, 6))

    # Helper function to generate standardized tables
    def create_section_table(headers, rows_data, col_widths):
        table_data = [[Paragraph(h, header_cell) for h in headers]]
        for row in rows_data:
            formatted_row = []
            for i, val in enumerate(row):
                if i == 0:
                    formatted_row.append(Paragraph(f"<b>{val}</b>", cell_bold))
                else:
                    formatted_row.append(Paragraph(str(val), cell_style))
            table_data.append(formatted_row)
        
        t = Table(table_data, colWidths=col_widths)
        t.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#78350f')),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('TOPPADDING', (0, 0), (-1, -1), 3),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
            ('LEFTPADDING', (0, 0), (-1, -1), 5),
            ('RIGHTPADDING', (0, 0), (-1, -1), 5),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#e2e8f0')),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#fffbeb')])
        ]))
        return t

    # 3. Section 1: Desktop & Cable Trench
    story.append(Paragraph("1. Desktop & Cable Trench (30mm Light Oak Faced MDF)", section_style))
    d_headers = ["Ref", "Description", "Qty", "Length", "Width", "Thick", "Edge Banding"]
    d_rows = [
        ["D1", "Main Desktop (Straight Edge)", "1", "3000 mm", "900 mm", "30 mm", "2mm Oak ABS (All 4 Edges)"],
        ["D2", "Cable Trench Hinged Lid", "1", "3000 mm", "100 mm", "30 mm", "2mm Oak ABS (All 4 Edges)"],
        ["D3", "Trench Cable Slots (12 Off)", "12", "60 mm (R12.5)", "25 mm", "30 mm", "Rubber Grommets Fitted"]
    ]
    story.append(create_section_table(d_headers, d_rows, [12*mm, 52*mm, 10*mm, 24*mm, 22*mm, 16*mm, 50*mm]))
    story.append(Spacer(1, 6))

    # 4. Section 2: Main Carcase & Uprights
    story.append(Paragraph("2. Main Carcase & Uprights (30mm Light Oak Faced MDF)", section_style))
    v_headers = ["Ref", "Description", "Qty", "Length", "Width", "Thick", "Location / Notes"]
    v_rows = [
        ["V1", "Outer Left Gable Panel", "1", "860 mm", "730 mm", "30 mm", "X = -1500 mm (Left End)"],
        ["V2", "Left Pedestal Inner Wall", "1", "860 mm", "730 mm", "30 mm", "X = -1050 mm"],
        ["V3", "PC Bay Left Divider Wall", "1", "860 mm", "730 mm", "30 mm", "X = -400 mm"],
        ["V4", "Center Divider Panel Wall", "1", "860 mm", "730 mm", "30 mm", "X = -100 mm"],
        ["V5", "Rack Bay Right Divider", "1", "860 mm", "730 mm", "30 mm", "X = +400 mm"],
        ["V6", "Right Pedestal Inner Wall", "1", "860 mm", "730 mm", "30 mm", "X = +1050 mm"],
        ["V7", "Outer Right Gable Panel", "1", "860 mm", "730 mm", "30 mm", "X = +1500 mm (Right End)"]
    ]
    story.append(create_section_table(v_headers, v_rows, [12*mm, 52*mm, 10*mm, 24*mm, 22*mm, 16*mm, 50*mm]))
    story.append(Spacer(1, 6))

    # 5. Section 3: Modesty Panels, Plinths & Shelves
    story.append(Paragraph("3. Modesty Panels, Plinths & Shelves (18mm / 30mm Oak MDF)", section_style))
    m_headers = ["Ref", "Description", "Qty", "Length", "Width", "Thick", "Notes"]
    m_rows = [
        ["B1", "Outer Left Back Modesty", "1", "450 mm", "730 mm", "18 mm", "Flush to rear frame"],
        ["B2", "Left Operator Knee Modesty", "1", "650 mm", "730 mm", "18 mm", "Recessed for legroom"],
        ["B3", "Right Operator Knee Modesty", "1", "650 mm", "730 mm", "18 mm", "Recessed for legroom"],
        ["B4", "Outer Right Back Modesty", "1", "450 mm", "730 mm", "18 mm", "Flush to rear frame"],
        ["P1", "Pedestal Base Plinths", "2", "860 mm", "450 mm", "35 mm", "Doubled 18mm / Solid Base"],
        ["P2", "Operator Recess Base Rails", "2", "650 mm", "300 mm", "35 mm", "Back 300mm depth only"],
        ["P3", "Center PC / Rack Bay Base", "1", "860 mm", "800 mm", "35 mm", "Full depth under equipment"],
        ["S1", "Equipment Bay Fixed Shelf", "1", "780 mm", "480 mm", "30 mm", "Holds Power & Loop Amps"],
        ["S2", "Tower PC Pull-Out Tray", "1", "780 mm", "260 mm", "18 mm", "Mounted on heavy slides"]
    ]
    story.append(create_section_table(m_headers, m_rows, [12*mm, 52*mm, 10*mm, 24*mm, 22*mm, 16*mm, 50*mm]))
    story.append(Spacer(1, 6))

    # 6. Section 4: Drawer Units
    story.append(Paragraph("4. Drawer Units & Drawer Box Assembly", section_style))
    dr_headers = ["Ref", "Component", "Qty", "Length", "Width", "Thick", "Material Spec"]
    dr_rows = [
        ["DF1", "Pedestal Drawer Fronts", "4", "380 mm", "325 mm", "18 mm", "Light Oak Faced MDF"],
        ["DB1", "Drawer Box Side Walls", "8", "600 mm", "250 mm", "12 mm", "Birch / Light Oak MDF"],
        ["DB2", "Drawer Box Front / Back", "8", "336 mm", "250 mm", "12 mm", "Birch / Light Oak MDF"],
        ["DB3", "Drawer Box Base Panels", "4", "576 mm", "336 mm", "6 mm", "Plain / Veneered MDF"]
    ]
    story.append(create_section_table(dr_headers, dr_rows, [12*mm, 52*mm, 10*mm, 24*mm, 22*mm, 16*mm, 50*mm]))
    story.append(Spacer(1, 6))

    # 7. Section 5 & 6: Hardware & Notes
    notes_elements = [
        Paragraph("5. Hardware & Workshop Instructions", section_style),
        Paragraph("• <b>Trench Lid Hinge:</b> 1 × 3000 mm Heavy-Duty Continuous Stainless Steel Piano Hinge.<br/>"
                  "• <b>Drawer Runners:</b> 4 Pairs × 600 mm Heavy-Duty Soft-Close Side-Mount Ball Bearing Slides.<br/>"
                  "• <b>PC Extension Slides:</b> 1 Pair × 750 mm Undermount/Side Heavy Extension Slides (Rated 45kg+).<br/>"
                  "• <b>Grain Direction:</b> Desktop (D1), Lid (D2), Gables (V1-V7), and Drawer Fronts (DF1) must have wood grain running horizontally along 3000mm length.<br/>"
                  "• <b>Desktop Profile:</b> Straight front edge with 2mm Light Oak ABS edge banding applied to all four outer edges.<br/>"
                  "• <b>Ventilation:</b> 80mm circular cutouts routed in rear of PC & amp bay for active air cooling.", cell_style)
    ]
    story.append(KeepTogether(notes_elements))

    doc.build(story)
    print("PDF generated successfully at:", pdf_path)

if __name__ == "__main__":
    build_pdf()
