#!/usr/bin/env python3
# -*- coding: utf-8 -*-

with open('lib/caseStudies/fast-track-ai.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Find and replace the subtitle line
for i, line in enumerate(lines):
    if 'subtitle:' in line and 'It\'s not a module' in line:
        # Replace the straight quotes with typographic quotes
        # Find the opening quote after the backtick
        start_idx = line.find('`"') + 1
        if start_idx > 0:
            # Replace opening quote
            line = line[:start_idx] + '"' + line[start_idx+1:]
            # Find and replace closing quote before the em dash
            close_idx = line.find('" —')
            if close_idx > 0:
                line = line[:close_idx] + '"' + line[close_idx+1:]
        lines[i] = line
        break

with open('lib/caseStudies/fast-track-ai.ts', 'w', encoding='utf-8') as f:
    f.writelines(lines)

print('Updated with typographic quotes')




