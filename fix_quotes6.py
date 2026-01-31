#!/usr/bin/env python3
# -*- coding: utf-8 -*-

with open('lib/caseStudies/fast-track-ai.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Use Unicode escape sequences for typographic quotes
opening_quote = '\u201c'  # "
closing_quote = '\u201d'   # "

# Replace opening quote: `" becomes `"
content = content.replace('`"', '`' + opening_quote, 1)

# Find the closing quote before the em dash and replace it
# Look for the pattern: " — (quote followed by space and em dash)
import re
pattern = r'(") (—)'
replacement = closing_quote + r' \2'
content = re.sub(pattern, replacement, content, count=1)

with open('lib/caseStudies/fast-track-ai.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print('Updated with typographic quotes')




