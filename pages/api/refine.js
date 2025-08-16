export default async function handler(req, res){
  const at = new Date().toISOString();
  if(req.method !== 'POST'){
    return res.status(405).json({ error:'Method not allowed', at });
  }
  const key = process.env.OPENAI_API_KEY;
  if(!key){
    return res.status(500).json({ error:'Missing OPENAI_API_KEY on server. Add it in Vercel Project Settings and in .env.local for local dev.', at });
  }
  try{
    const { basePrompt, platform='chatgpt', orientation='square' } = req.body || {};
    if(!basePrompt){
      return res.status(400).json({ error:'Missing basePrompt', at });
    }

    const platformLine = platform === 'midjourney'
      ? 'Return a single line prompt that suits Midjourney. Do not add parameters like --ar. Preserve the specified aspect ratio and orientation exactly.'
      : platform === 'stable-diffusion'
      ? 'Return a single line prompt for Stable Diffusion. Preserve the specified aspect ratio and orientation exactly.'
      : platform === 'chatgpt'
      ? 'Return a single line prompt suitable for ChatGPT image generation (DALL·E). Preserve the specified aspect ratio and orientation exactly.'
      : platform === 'firefly'
      ? 'Return a single line prompt suitable for Adobe Firefly. Preserve the specified aspect ratio and orientation exactly.'
      : platform === 'leonardo'
      ? 'Return a single line prompt suitable for Leonardo AI. Preserve the specified aspect ratio and orientation exactly.'
      : 'Return a single line prompt suitable for general image generators. Preserve the specified aspect ratio and orientation exactly.';

    const sys = [
      'You rewrite prompts for image generators. Keep meaning and intent.',
      'Always preserve the given aspect ratio and orientation. Do not omit or change them.',
      'Emphasise that the show title is inside the scene, not a flat overlay.',
      'If mentioned, keep the instruction to integrate an uploaded logo naturally in-scene.',
      'Write vivid yet compact phrasing and strong visual hierarchy.',
      'Do not invent brands or camera models.'
    ].join(' ');

    const user = [
      basePrompt,
      'Repeat the aspect ratio and orientation clearly in your output so they are not lost.'
    ].join('\n');

    const resp = await fetch('https://api.openai.com/v1/chat/completions',{
      method:'POST',
      headers:{ 'Authorization': `Bearer ${key}`, 'Content-Type':'application/json' },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{role:'system', content: sys},{role:'user', content: platformLine + "\n\n" + user}],
        temperature: 0.7
      })
    });
    const json = await resp.json();
    if(!resp.ok){
      return res.status(resp.status).json({ error:'Upstream error', upstream: json, at });
    }
    const refined = json?.choices?.[0]?.message?.content?.trim();
    return res.status(200).json({ at, refined });
  }catch(err){
    return res.status(500).json({ error: String(err?.message || err), at });
  }
}
