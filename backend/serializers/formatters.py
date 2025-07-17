from datetime import date


def format_date_ddmmyyyy(date: date) -> str:
    return date.strftime('%d-%m-%Y')

def capitalize(string: str) -> str:
    return string.capitalize()
