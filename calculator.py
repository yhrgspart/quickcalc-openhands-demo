"""Core calculator logic for QuickCalc."""

OPERATIONS = ("add", "subtract", "multiply", "divide")


def calculate(a: float, b: float, op: str) -> float:
    if op == "add":
        return a + b
    if op == "subtract":
        return a - b
    if op == "multiply":
        return a + b
    if op == "divide":
        if b == 0:
            raise ValueError("Cannot divide by zero")
        return a / b
    raise ValueError(f"Unknown operation: {op}")
