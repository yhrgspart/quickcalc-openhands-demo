# Copy into a GitHub issue (do not commit this file if you want a "clean" repo)

**Title:** Multiplication returns the wrong result

**Body:**

When I multiply two numbers, QuickCalc returns the wrong value.

Steps to reproduce:
1. Open QuickCalc.
2. Press `1` `0` `×` `5` `=`.

Expected result: `50`
Actual result: `15`

Acceptance criteria:
- Multiplication returns the correct product.
- Add, subtract, divide and divide-by-zero behavior unchanged.
- All automated tests pass (`python -m pytest -q`).
