import { getApiBaseUrl } from '../data/apiReferenceSpec';

function sampleFields(endpoint) {
  const params = endpoint.parameters || [];
  const form = params.filter(p => p.type !== 'path');
  const samples = {};
  form.forEach(p => {
    if (p.name === 'user_id') samples[p.name] = 'YOUR_USER_ID';
    else if (p.name === 'source_lang') samples[p.name] = 'en';
    else if (p.name === 'target_langs') samples[p.name] = ['lg'];
    else if (p.type === 'file') samples[p.name] = `@./${p.name}.mp4`;
    else if (p.type === 'number') samples[p.name] = 1.0;
    else if (p.type === 'boolean') samples[p.name] = false;
    else if (p.name === 'doc') samples[p.name] = 'Hello world';
    else samples[p.name] = '...';
  });
  return samples;
}

function pathWithParams(path, endpoint) {
  let p = path;
  (endpoint.parameters || []).forEach(param => {
    if (param.type === 'path') {
      p = p.replace(`{${param.name}}`, param.name === 'user_id' ? 'YOUR_USER_ID' : 'value');
    }
  });
  return p;
}

export function buildSnippets(endpoint) {
  const base = getApiBaseUrl();
  const url = `${base}${pathWithParams(endpoint.path, endpoint)}`;
  const method = endpoint.method;
  const isGet = method === 'GET';
  const isJson = endpoint.contentType === 'application/json';
  const samples = sampleFields(endpoint);

  if (isGet) {
    return {
      curl: `curl -X GET "${url}"`,
      python: `import requests\n\nresponse = requests.get("${url}")\nprint(response.json())`,
      javascript: `const response = await fetch("${url}");\nconst data = await response.json();\nconsole.log(data);`,
    };
  }

  if (isJson) {
    const body = JSON.stringify(samples, null, 2);
    return {
      curl: `curl -X ${method} "${url}" \\\n  -H "Content-Type: application/json" \\\n  -d '${JSON.stringify(samples)}'`,
      python: `import requests\n\nurl = "${url}"\npayload = ${body.replace(/'/g, '"')}\nresponse = requests.${method === 'POST' ? 'post' : 'request'}(url, json=payload)\nprint(response.json())`,
      javascript: `const response = await fetch("${url}", {\n  method: "${method}",\n  headers: { "Content-Type": "application/json" },\n  body: JSON.stringify(${body}),\n});\nconst data = await response.json();\nconsole.log(data);`,
    };
  }

  const curlFields = Object.entries(samples)
    .map(([k, v]) => {
      if (Array.isArray(v)) return `  -F "target_langs=${v[0]}"`;
      if (String(v).startsWith('@')) return `  -F "${k}=${v}"`;
      return `  -F "${k}=${v}"`;
    })
    .join(' \\\n');

  const pyFiles = Object.entries(samples)
    .map(([k, v]) => {
      if (v && String(v).startsWith('@')) return `    '${k}': open('file.bin', 'rb'),`;
      return `    '${k}': (None, '${Array.isArray(v) ? v[0] : v}'),`;
    })
    .join('\n');

  const jsAppend = Object.keys(samples)
    .map(k => `formData.append('${k}', ${samples[k] && String(samples[k]).startsWith('@') ? 'fileInput.files[0]' : JSON.stringify(Array.isArray(samples[k]) ? samples[k][0] : samples[k])});`)
    .join('\n');

  return {
    curl: `curl -X ${method} "${url}" \\\n  -H "Content-Type: multipart/form-data" \\\n${curlFields}`,
    python: `import requests\n\nurl = "${url}"\nfiles = {\n${pyFiles}\n}\nresponse = requests.post(url, files=files)\nprint(response.json())`,
    javascript: `const formData = new FormData();\n${jsAppend}\n\nconst response = await fetch("${url}", {\n  method: "${method}",\n  body: formData,\n});\nconst data = await response.json();\nconsole.log(data);`,
  };
}
