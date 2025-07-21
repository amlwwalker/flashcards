# This code will generate a PDF with a table of countries, nationalities, and languages.
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter, landscape
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle

# Data for the table
data = [
    ['Χώρα', 'Άντρας', 'Γυναίκα', 'Γλώσσα', 'English'],
    ['Ελλάδα', 'Έλληνας', 'Ελληνίδα', 'ελληνικά', 'Greece'],
    ['Αλβανία', 'Αλβανός', 'Αλβανίδα', 'αλβανικά', 'Albania'],
    ['Ηνωμένες Πολιτείες', 'Αμερικανός', 'Αμερικανίδα', 'αγγλικά', 'United States'],
    ['Γαλλία', 'Γάλλος', 'Γαλλίδα', 'γαλλικά', 'France'],
    ['Γερμανία', 'Γερμανός', 'Γερμανίδα', 'γερμανικά', 'Germany'],
    ['Ισπανία', 'Ισπανός', 'Ισπανίδα', 'ισπανικά', 'Spain'],
    ['Ιταλία', 'Ιταλός', 'Ιταλίδα', 'ιταλικά', 'Italy'],
    ['Ρωσία', 'Ρώσος', 'Ρωσίδα', 'ρωσικά', 'Russia'],
    ['Αυστραλία', 'Αυστραλός', 'Αυστραλέζα', 'αγγλικά', 'Australia'],
    ['Δανία', 'Δανός', 'Δανέζα', 'δανέζικα', 'Denmark'],
    ['Καναδάς', 'Καναδός', 'Καναδέζα', 'αγγλικά και γαλλικά', 'Canada'],
    ['Σουηδία', 'Σουηδός', 'Σουηδέζα', 'σουηδικά', 'Sweden'],
    ['Κίνα', 'Κινέζος', 'Κινέζα', 'κινέζικα', 'China'],
    ['Ολλανδία', 'Ολλανδός', 'Ολλανδέζα', 'ολλανδικά', 'Netherlands'],
    ['Αίγυπτος', 'Αιγύπτιος', 'Αιγύπτια', 'αραβικά', 'Egypt'],
    ['Βουλγαρία', 'Βούλγαρος', 'Βουλγάρα', 'βουλγαρικά', 'Bulgaria'],
    ['Σερβία', 'Σέρβος', 'Σέρβα', 'σερβικά', 'Serbia'],
    ['Τουρκία', 'Τούρκος', 'Τουρκάλα', 'τουρκικά', 'Turkey'],
    ['Ισραήλ', 'Ισραηλινός', 'Ισραηλινή', 'εβραϊκά', 'Israel'],
    ['Ηνωμένο Βασίλειο', 'Βρετανός', 'Βρετανίδα', 'αγγλικά', 'United Kingdom'],
]

# Create the PDF
pdf_path = '/mnt/data/countries_nationalities.pdf'
doc = SimpleDocTemplate(pdf_path, pagesize=landscape(letter))

# Create the table
table = Table(data, repeatRows=1)

# Style the table
style = TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.lightgrey),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.black),
    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
    ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.black),
])
table.setStyle(style)

# Build the PDF
doc.build([table])

print(f"PDF generated at: {pdf_path}")
