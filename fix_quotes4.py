#!/usr/bin/env python3
# -*- coding: utf-8 -*-

with open('lib/caseStudies/fast-track-ai.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the subtitle line and replace quotes
# Look for the pattern: `"text" — 
import re

# Replace opening quote: `" becomes `"
content = re.sub(r'(`)"([^"]+)', r'\1"\2', content, count=1)

# Replace closing quote before em dash: " — becomes " —
content = re.sub(r'([^"])" (—)', r'\1" \2', content, count=1)

with open('lib/caseStudies/fast-track-ai.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print('Updated with typographic quotes')




