#!/usr/bin/env python3
# -*- coding: utf-8 -*-

with open('lib/caseStudies/fast-track-ai.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the exact substring and replace it
old_substring = '`"It\'s not a module or a feature; it\'s a platform. And it\'s the industry\'s first natural language CRM platform" —'
new_substring = '`"It\'s not a module or a feature; it\'s a platform. And it\'s the industry\'s first natural language CRM platform" —'

if old_substring in content:
    content = content.replace(old_substring, new_substring)
    print('Found and replaced')
else:
    print('Pattern not found')
    # Try without the backtick
    old_substring2 = '"It\'s not a module or a feature; it\'s a platform. And it\'s the industry\'s first natural language CRM platform" —'
    new_substring2 = '"It\'s not a module or a feature; it\'s a platform. And it\'s the industry\'s first natural language CRM platform" —'
    if old_substring2 in content:
        content = content.replace(old_substring2, new_substring2)
        print('Found and replaced (without backtick)')
    else:
        print('Still not found')

with open('lib/caseStudies/fast-track-ai.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print('Done')




