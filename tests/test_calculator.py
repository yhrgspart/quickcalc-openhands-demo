import pytest

from calculator import calculate


def test_add():
    assert calculate(10, 5, "add") == 15


def test_subtract():
    assert calculate(10, 5, "subtract") == 5


def test_multiply():
    assert calculate(10, 5, "multiply") == 50


def test_multiply_by_zero():
    assert calculate(7, 0, "multiply") == 0


def test_divide():
    assert calculate(10, 5, "divide") == 2


def test_divide_by_zero():
    with pytest.raises(ValueError):
        calculate(10, 0, "divide")


def test_power():
    assert calculate(2, 10, "power") == 1024


def test_power_by_zero():
    assert calculate(5, 0, "power") == 1


def test_unknown_operation():
    with pytest.raises(ValueError):
        calculate(1, 2, "unknown")
