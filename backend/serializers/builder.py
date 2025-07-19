from datetime import date

from backend.serializers.formatters import format_date_ddmmyyyy, capitalize

class FormatRulesBuilder:
    def __init__(self):
        self._field_rules = {}
        self._type_rules = {}
        self._excluded_rules = set()

    def add_field_rule(self, field_name, formatter):
        self._field_rules[field_name] = formatter
        return self

    def add_field_rules(self, field_names, formatter):
        for field_name in field_names:
            self.add_field_rule(field_name, formatter)
        return self

    def add_type_rule(self, field_type, formatter):
        self._type_rules[field_type] = formatter
        return self

    def add_excluded_field(self, field_name):
        self._excluded_rules.add(field_name)
        return self
    
    def add_excluded_fields(self, field_names):
        self._excluded_rules.update(field_names)
        return self

    def with_defaults(self):
        self.add_type_rule(date, format_date_ddmmyyyy)
        self.add_type_rule(str, capitalize)
        return self

    def build(self) -> dict:
        return {
            'field_rules': self._field_rules,
            'type_rules': self._type_rules,
            'excluded_rules': self._excluded_rules
        }
