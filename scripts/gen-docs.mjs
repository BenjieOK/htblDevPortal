// Generates AI-readable docs into public/: llms.txt, llms-full.txt,
// one Markdown file per docs page, and an Agent Skill. Runs before dev and build.
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { allPages } from '../src/data/apis.js';
import { SLUG } from '../src/data/site.js';
import { pageToMd, llmsTxt, llmsFullTxt, skillMd } from '../src/lib/markdown.js';

const pub = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');

rmSync(join(pub, 'docs'), { recursive: true, force: true });
rmSync(join(pub, 'skills'), { recursive: true, force: true });
mkdirSync(join(pub, 'docs'), { recursive: true });
mkdirSync(join(pub, 'skills', `${SLUG}-api`), { recursive: true });

for (const page of allPages) writeFileSync(join(pub, 'docs', `${page.id}.md`), pageToMd(page));
writeFileSync(join(pub, 'llms.txt'), llmsTxt());
writeFileSync(join(pub, 'llms-full.txt'), llmsFullTxt());
writeFileSync(join(pub, 'skills', `${SLUG}-api`, 'SKILL.md'), skillMd());

console.log(`Generated ${allPages.length} Markdown pages, llms.txt, llms-full.txt and the ${SLUG}-api skill.`);
