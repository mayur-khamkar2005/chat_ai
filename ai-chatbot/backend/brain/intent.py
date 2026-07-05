import re
from dataclasses import dataclass, field
from typing import List, Pattern


@dataclass
class Intent:
    intent: str
    priority: int = 0
    enabled: bool = True
    category: str = "general"
    description: str = ""
    patterns: List[str] = field(default_factory=list)
    responses: List[str] = field(default_factory=list)
    version: str = "1.0"
    source: str = ""
    compiled_patterns: List[Pattern[str]] = field(default_factory=list, repr=False)

    def compile_patterns(self) -> None:
        self.compiled_patterns = [
            re.compile(pattern, re.IGNORECASE | re.UNICODE)
            for pattern in self.patterns
            if pattern
        ]

    def match(self, text: str) -> int:
        matches = 0
        for pattern in self.compiled_patterns:
            if pattern.search(text):
                matches += 1
        return matches

    def score(self, text: str) -> int:
        return self.priority * 10 + self.match(text)
