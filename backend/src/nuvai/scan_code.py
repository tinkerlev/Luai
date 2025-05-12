# File: backend/src/nuvai/scan_code.py

"""
Description:
This module performs static code analysis and identifies security vulnerabilities
based on language-specific scanning strategies. It is fully aligned with
ISO/IEC 27001, NIST 800-53, and OWASP Secure Coding Practices.

Security Compliance:
- No code is executed (static only)
- Safe defaults, fail-closed logic
- Language detection occurs before scanning
- Logs are sanitized, structured, and redact sensitive info
- Supports future plugin-based extensibility
"""

import re
from typing import List, Dict
from nuvai.untils.logger import get_logger


logger = get_logger("Scanner")


def scan_code(code: str, language: str) -> List[Dict[str, str]]:
    """
    Perform static analysis on the given code snippet based on language.

    Parameters:
        code (str): The source code to scan.
        language (str): The detected language of the code (e.g., "python").

    Returns:
        List[Dict[str, str]]: A list of vulnerability findings with severity, title, description, recommendation.
    """
    try:
        logger.info(f"Starting scan for language: {language}")

        if not code.strip():
            logger.warning("Empty code input provided.")
            return [{
                "severity": "info",
                "title": "Empty File",
                "description": "The file contains no code.",
                "recommendation": "Ensure you're uploading the correct file."
            }]

        # Basic dispatch mechanism
        if language.lower() == "python":
            return scan_python(code)
        else:
            logger.warning(f"Unsupported language for scanning: {language}")
            return [{
                "severity": "low",
                "title": "Unsupported Language",
                "description": f"The language '{language}' is not supported yet.",
                "recommendation": "Use Python or wait for a future update supporting more languages."
            }]

    except Exception as e:
        logger.error(f"Critical scan error: {str(e)}")
        return [{
            "severity": "critical",
            "title": "Internal Scanner Error",
            "description": "An unexpected error occurred during scanning.",
            "recommendation": "Please try again later or contact support."
        }]


def scan_python(code: str) -> List[Dict[str, str]]:
    """
    Basic Python static analyzer (rule-based).
    Looks for dangerous functions, insecure practices, and bad patterns.
    """
    findings = []

    # Example Rule 1: Dangerous eval usage
    if re.search(r"\beval\(", code):
        findings.append({
            "severity": "high",
            "title": "Use of eval()",
            "description": "The eval() function can execute arbitrary code, posing a major security risk.",
            "recommendation": "Avoid using eval(). Consider safer alternatives like ast.literal_eval()."
        })

    # Example Rule 2: Hardcoded passwords or tokens
    if re.search(r"(?i)(password|token|secret)[\s]*=[\s]*['\"]{1}[^'\"]{4,}['\"]{1}", code):
        findings.append({
            "severity": "medium",
            "title": "Hardcoded Secret",
            "description": "Sensitive credentials should not be hardcoded in source code.",
            "recommendation": "Store secrets securely using environment variables or secret managers."
        })

    # Example Rule 3: Use of input() without validation
    if re.search(r"\binput\(\)", code):
        findings.append({
            "severity": "medium",
            "title": "Unvalidated User Input",
            "description": "Using input() without validation may allow malicious input.",
            "recommendation": "Always sanitize and validate user input."
        })

    logger.info(f"Scan completed. Total findings: {len(findings)}")
    return findings
