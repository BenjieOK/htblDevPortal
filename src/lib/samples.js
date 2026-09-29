import { API_BASE } from '../data/site.js';

export function buildUrl(e) {
  let path = e.path;
  for (const p of e.params.filter((x) => x.in === 'path')) path = path.replace(`{${p.name}}`, p.example);
  const query = e.params.filter((x) => x.in === 'query');
  if (query.length) path += '?' + query.map((q) => `${q.name}=${encodeURIComponent(q.example)}`).join('&');
  return API_BASE + path;
}

export function codeSamples(e) {
  const url = buildUrl(e);
  const json = e.body ? JSON.stringify(e.body, null, 2) : null;

  const curl = [
    `curl -X ${e.method} "${url}" \\`,
    `  -H "Authorization: Bearer $SECRET_KEY"${json ? ' \\' : ''}`,
    ...(json ? ['  -H "Content-Type: application/json" \\', `  -d '${JSON.stringify(e.body)}'`] : []),
  ].join('\n');

  const node = [
    `const res = await fetch("${url}", {`,
    `  method: "${e.method}",`,
    '  headers: {',
    '    Authorization: `Bearer ${process.env.SECRET_KEY}`,',
    ...(json ? ['    "Content-Type": "application/json",'] : []),
    '  },',
    ...(json ? [`  body: JSON.stringify(${json.replace(/\n/g, '\n  ')}),`] : []),
    '});',
    'const data = await res.json();',
  ].join('\n');

  const python = [
    'import os, requests',
    '',
    `res = requests.${e.method.toLowerCase()}(`,
    `    "${url}",`,
    '    headers={"Authorization": f"Bearer {os.environ[\'SECRET_KEY\']}"},',
    ...(json ? [`    json=${json.replace(/\n/g, '\n    ').replace(/\btrue\b/g, 'True').replace(/\bfalse\b/g, 'False')},`] : []),
    ')',
    'data = res.json()',
  ].join('\n');

  return { cURL: curl, 'Node.js': node, Python: python };
}
