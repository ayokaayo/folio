#!/usr/bin/env python3
# -*- coding: utf-8 -*-

with open('lib/caseStudies/fast-track-ai.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the subtitle line with typographic quotes
old_line = '  subtitle: `"It\'s not a module or a feature; it\'s a platform. And it\'s the industry\'s first natural language CRM platform" — [Simon Lidzén, FT CEO](https://igamingfuture.com/meet-the-first-ai-crm-built-for-igaming/)`,'
new_line = '  subtitle: `"It\'s not a module or a feature; it\'s a platform. And it\'s the industry\'s first natural language CRM platform" — [Simon Lidzén, FT CEO](https://igamingfuture.com/meet-the-first-ai-crm-built-for-igaming/)`,'

content = content.replace(old_line, new_line)

with open('lib/caseStudies/fast-track-ai.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print('Updated with typographic quotes')




