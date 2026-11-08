import json

with open('data/cards.json', encoding='utf-8') as f:
    cards = json.load(f)

with open('lib/cardRewardRules.js', encoding='utf-8') as f:
    rules_text = f.read()

missing = []
for c in cards:
    slug = c['slug']
    if f'"{slug}"' not in rules_text and f"'{slug}'" not in rules_text and f"{slug}:" not in rules_text:
        missing.append(slug)

print('Total cards in json:', len(cards))
print('Missing from CARD_RULES:', missing)

