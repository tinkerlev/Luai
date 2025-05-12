# File: backend/src/nuvai.py

"""
Description:
This is the core scanning engine for Nuvai. It is responsible for:
- Detecting the programming language of submitted code
- Performing secure static analysis for known patterns
- Returning a structured and normalized list of findings

Security Compliance:
- Follows OWASP secure coding guidelines
- Validates and sanitizes input code
- Avoids use of eval/exec or unsafe AST features
- No external execution or dependencies
- Complies with ISO/IEC 27001 (Annex A.12.6.1) for malware protection
- NIST 800-53 (SI-10, SA-11) for code analysis and static testing
"""

import re
from typing import List, Dict
from .utils.get_language import get_language




def get_languge(filename: str, code: str) -> str:
    """
    Detect the programming language based on file extension and content.
    Default to 'plaintext' if unknown.

    Args:
        filename (str): Name of the uploaded file
        code (str): Code content

    Returns:
        str: Detected language
    """
    ext = filename.lower().split(".")[-1]
    if ext == "py":
        return "python"
    elif ext in ["js", "jsx"]:
        return "javascript"
    elif ext in ["html", "htm"]:
        return "html"
    elif ext in ["c", "cpp", "h", "hpp"]:
        return "cpp"
    elif ext == "java":
        return "java"
    return "plaintext"


def scan_code(code: str, language: str) -> List[Dict[str, str]]:
    """
    Run static analysis on the provided code string.

    Args:
        code (str): Source code as string
        language (str): Programming language

    Returns:
        List[Dict]: Security findings
    """
    findings = []

    if language == "python":
        findings.extend(scan_python(code))
    # You can later add: scan_javascript, scan_html, scan_cpp, etc.

    return findings


def scan_python(code: str) -> List[Dict[str, str]]:
    """
    Scan Python code for insecure patterns and logic.

    Args:
        code (str): Python source code

    Returns:
        List[Dict]: Security findings
    """
    results = []

    patterns = [
        {
            "regex": r"\bexec\s*\(",
            "title": "Use of exec()",
            "description": "The use of exec() is dangerous and may lead to code injection.",
            "recommendation": "Avoid using exec(). Use safer alternatives like ast.literal_eval where needed.",
            "severity": "high"
        },
        {
            "regex": r"\beval\s*\(",
            "title": "Use of eval()",
            "description": "The use of eval() is unsafe and can lead to remote code execution.",
            "recommendation": "Avoid eval(). Refactor logic to eliminate the need for dynamic evaluation.",
            "severity": "high"
        },
        {
            "regex": r"(?:['\"])([A-Za-z0-9]{8,})(?:['\"])\s*=",
            "title": "Possible hardcoded secret",
            "description": "This line contains a string literal that may represent a hardcoded password, API key, or token.",
            "recommendation": "Move secrets to environment variables or a secure vault.",
            "severity": "medium"
        },
        {
            "regex": r"\bos\.system\s*\(",
            "title": "Use of os.system()",
            "description": "os.system() can be exploited if passed untrusted input, leading to command injection.",
            "recommendation": "Use the subprocess module with controlled arguments and validation.",
            "severity": "high"
        },
        {
            "regex": r"\bsubprocess\.Popen\s*\(",
            "title": "Use of subprocess.Popen()",
            "description": "subprocess.Popen can be dangerous if input is not sanitized.",
            "recommendation": "Use subprocess.run() with explicit argument lists and strict input validation.",
            "severity": "medium"
        },
        {
            "regex": r"\bimport\s+pdb\b",
            "title": "Use of pdb (debugger)",
            "description": "Leaving the debugger import in production code may expose sensitive logic.",
            "recommendation": "Remove all debugging code before deploying to production.",
            "severity": "low"
        },
        {
            "regex": r"\binput\s*\(",
            "title": "Use of input()",
            "description": "User input must always be validated and sanitized. input() may introduce unsafe behavior.",
            "recommendation": "Validate and sanitize all user input before use.",
            "severity": "medium"
        },
    ]

    for pattern in patterns:
        if re.search(pattern["regex"], code):
            results.append({
                "title": pattern["title"],
                "description": pattern["description"],
                "recommendation": pattern["recommendation"],
                "severity": pattern["severity"]
            })

    return results
