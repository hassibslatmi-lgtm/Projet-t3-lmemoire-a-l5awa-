import sys
try:
    import PyPDF2
except ImportError:
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "PyPDF2"])
    import PyPDF2

with open("project_V5.pdf", "rb") as f:
    reader = PyPDF2.PdfReader(f)
    text = ""
    for i, page in enumerate(reader.pages):
        # We limit to first 10 pages assuming Chapter 1 is in there
        if i >= 10:
            break
        extracted = page.extract_text()
        if extracted:
            text += f"\n\n--- PAGE {i+1} ---\n\n" + extracted

with open("project_V5_extracted.txt", "w", encoding="utf-8") as out:
    out.write(text)
print("Extraction complete.")
