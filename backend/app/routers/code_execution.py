"""Code execution endpoints for MockLoop interview platform."""

import subprocess
import tempfile
import os
import sys
from typing import Dict, Any

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/api/code", tags=["code-execution"])


class CodeExecutionRequest(BaseModel):
    code: str
    language: str = "python"
    test_cases: list[str] = []


class CodeExecutionResponse(BaseModel):
    output: str
    error: str = ""
    success: bool
    execution_time_ms: int = 0


@router.post("/execute", response_model=CodeExecutionResponse)
async def execute_code(request: CodeExecutionRequest):
    """Execute code safely and return the output."""

    if request.language.lower() != "python":
        raise HTTPException(status_code=400, detail="Only Python is currently supported")

    try:
        # Create a temporary file for the code
        with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as temp_file:
            # Start with the user's code
            code_to_execute = request.code

            # Add test cases to the code if provided and valid
            if request.test_cases:
                valid_test_cases = []
                for test_case in request.test_cases:
                    # Clean and validate test case
                    cleaned_test_case = test_case.strip()

                    # Skip empty test cases
                    if not cleaned_test_case:
                        continue

                    # Skip comment-only test cases (starts with #)
                    if cleaned_test_case.startswith('#'):
                        continue

                    # Try to validate the test case as a Python expression
                    try:
                        # This will raise SyntaxError if invalid
                        compile(cleaned_test_case, '<string>', 'eval')
                        valid_test_cases.append(cleaned_test_case)
                    except SyntaxError:
                        # If it's not a valid expression, try as a statement
                        try:
                            compile(cleaned_test_case, '<string>', 'exec')
                            valid_test_cases.append(cleaned_test_case)
                        except SyntaxError:
                            # Skip invalid test cases
                            continue

                # Add valid test cases to code
                if valid_test_cases:
                    code_to_execute += "\n\n# Test cases\n"
                    for test_case in valid_test_cases:
                        # For expressions, wrap in print; for statements, execute directly
                        try:
                            compile(test_case, '<string>', 'eval')
                            code_to_execute += f"print({test_case})\n"
                        except SyntaxError:
                            # It's a statement, execute directly
                            code_to_execute += f"{test_case}\n"

            temp_file.write(code_to_execute)
            temp_file_path = temp_file.name

        try:
            # Execute the code with timeout
            result = subprocess.run(
                [sys.executable, temp_file_path],
                capture_output=True,
                text=True,
                timeout=10,  # 10 second timeout
                cwd=tempfile.gettempdir()
            )

            output = result.stdout
            error = result.stderr
            success = result.returncode == 0

            # Clean output
            if not output and not error:
                output = "Code executed successfully (no output)"

            return CodeExecutionResponse(
                output=output,
                error=error,
                success=success,
                execution_time_ms=0  # TODO: Add timing
            )

        except subprocess.TimeoutExpired:
            return CodeExecutionResponse(
                output="",
                error="Code execution timed out after 10 seconds",
                success=False
            )
        except Exception as e:
            return CodeExecutionResponse(
                output="",
                error=f"Execution error: {str(e)}",
                success=False
            )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to execute code: {str(e)}")

    finally:
        # Clean up temporary file
        try:
            if 'temp_file_path' in locals():
                os.unlink(temp_file_path)
        except:
            pass  # Ignore cleanup errors


@router.post("/validate")
async def validate_code(request: CodeExecutionRequest):
    """Validate code syntax without executing."""
    try:
        compile(request.code, '<string>', 'exec')
        return {"valid": True, "error": ""}
    except SyntaxError as e:
        return {
            "valid": False,
            "error": f"Syntax error on line {e.lineno}: {e.msg}"
        }