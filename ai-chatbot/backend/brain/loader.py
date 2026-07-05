import os
from typing import List, Tuple

from intent import Intent
from utils import ensure_list, load_json_file


def discover_intent_files(intents_root: str) -> List[str]:
    files: List[str] = []
    if not os.path.exists(intents_root):
        return files

    for root, _, filenames in os.walk(intents_root):
        for filename in sorted(filenames):
            if filename.endswith(".json"):
                files.append(os.path.join(root, filename))
    return files


def load_intents(intents_root: str) -> Tuple[List[Intent], List[Intent]]:
    intents: List[Intent] = []
    fallback_intents: List[Intent] = []

    for file_path in discover_intent_files(intents_root):
        try:
            data = load_json_file(file_path)
        except Exception:
            continue

        if not isinstance(data, dict):
            continue

        if not data.get("enabled", True):
            continue

        intent = Intent(
            intent=data.get("intent", "UNKNOWN"),
            priority=int(data.get("priority", 0)),
            enabled=bool(data.get("enabled", True)),
            category=str(data.get("category", "general")),
            description=str(data.get("description", "")),
            patterns=ensure_list(data.get("patterns", [])),
            responses=ensure_list(data.get("responses", [])),
            version=str(data.get("version", "1.0")),
            source=file_path,
        )
        intent.compile_patterns()

        if intent.category.lower() in {"fallback", "system"}:
            fallback_intents.append(intent)
        else:
            intents.append(intent)

    intents.sort(key=lambda item: (-item.priority, item.intent.lower()))
    fallback_intents.sort(key=lambda item: (-item.priority, item.intent.lower()))
    return intents, fallback_intents
