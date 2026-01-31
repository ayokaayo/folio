#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import re

with open('lib/caseStudies/fast-track-ai.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace straight quotes with typographic quotes in the subtitle
# Match: subtitle: `"text" — [link]
# Replace with: subtitle: `"text" — [link]
pattern = r"(subtitle: `)\"([^\"]+)\"( — \[Simon Lidzén, FT CEO\]\(https://igamingfuture\.com/meet-the-first-ai-crm-built-for-igaming/\)`)"
replacement = r'\1"\2"\3'

content = re.sub(pattern, replacement, content)

with open('lib/caseStudies/fast-track-ai.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print('Updated with typographic quotes')




