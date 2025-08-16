import { useEffect, useMemo, useState } from 'react';
import { buildBasePrompt, buildNegative } from '../lib/buildBasePrompt';

const PRESETS = ['Vintage','Modern','Classic','Futuristic','Colourful'];
const PLATFORMS = [
  { value:'chatgpt', label:'ChatGPT (DALL·E)' },
  { value:'midjourney', label:'Midjourney' },
  { value:'stable-diffusion', label:'Stable Diffusion' },
  { value:'firefly', label:'Adobe Firefly' },
  { value:'leonardo', label:'Leonardo' },
  { value:'general', label:'Other / General' },
];

function Step({ children }){ return <div className="card">{children}</div>; }

export default function Home(){
  const total = 11;
  const [step, setStep] = useState(1);

  const [showName, setShowName] = useState('Showtime 2025');
  const [themeDesc, setThemeDesc] = useState('Broadway with a modern twist');
  const [colours, setColours] = useState('deep purple, magenta, electric blue, gold accents');
  const [keywords, setKeywords] = useState('tap, jazz, contemporary, ensemble, spotlight');
  const [orientation, setOrientation] = useState('landscape');
  const [preset, setPreset] = useState('Modern');

  const [complexityChoice, setComplexityChoice] = useState('Simple');
  const [styleEraChoice, setStyleEraChoice] = useState('Modern');
  const [renderingChoice, setRenderingChoice] = useState('Photo-realistic');

  const [colourfulness, setColourfulness] = useState(70);
  const [energy, setEnergy] = useState(75);
  const [motion, setMotion] = useState(70);
  const [lighting, setLighting] = useState(85);

  const [includeLights, setIncludeLights] = useState(true);
  const [includeSmoke, setIncludeSmoke] = useState(true);
  const [includeFlares, setIncludeFlares] = useState(false);
  const [fxConfetti, setFxConfetti] = useState(false);
  const [fxGlitter, setFxGlitter] = useState(false);
  const [fxNeonGlow, setFxNeonGlow] = useState(false);
  const [fxLaserBeams, setFxLaserBeams] = useState(false);
  const [fxCurtain, setFxCurtain] = useState(false);
  const [fxHologram, setFxHologram] = useState(false);
  const [fxSparkles, setFxSparkles] = useState(false);
  const [fxBokeh, setFxBokeh] = useState(false);

  const [embedLogo, setEmbedLogo] = useState(false);
  const [platform, setPlatform] = useState('chatgpt');

  const [refining, setRefining] = useState(false);
  const [refined, setRefined] = useState('');
  const [error, setError] = useState('');
  const [debug, setDebug] = useState('');

  const [toast, setToast] = useState('');
  function showToast(msg){ setToast(msg); setTimeout(()=>setToast(''), 1600); }

  const basePrompt = useMemo(()=>buildBasePrompt({
    showName, themeDesc, colours, keywords,
    orientation, preset, complexityChoice, styleEraChoice, renderingChoice,
    colourfulness, energy, motion, lighting,
    includeLights, includeSmoke, includeFlares,
    fxConfetti, fxGlitter, fxNeonGlow, fxLaserBeams, fxCurtain, fxHologram, fxSparkles, fxBokeh,
    embedLogo
  }), [showName, themeDesc, colours, keywords, orientation, preset, complexityChoice, styleEraChoice, renderingChoice, colourfulness, energy, motion, lighting, includeLights, includeSmoke, includeFlares, fxConfetti, fxGlitter, fxNeonGlow, fxLaserBeams, fxCurtain, fxHologram, fxSparkles, fxBokeh, embedLogo]);

  const fullPrompt = useMemo(()=> basePrompt + '\n\nNegative prompt: ' + buildNegative(), [basePrompt]);

  const pct = Math.round((step-1) / (total-1) * 100);

  async function runRefine(){
    setRefining(true); setRefined(''); setError(''); setDebug('');
    try{
      const res = await fetch('/api/refine',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ basePrompt, platform, orientation })
      });
      const text = await res.text();
      setDebug(text);
      let data = null;
      try{ data = JSON.parse(text) }catch{}
      if(!res.ok){
        setError(data?.error || 'Refinement error');
        return;
      }
      setRefined(data?.refined || '');
    }catch(err){
      setError(String(err));
    }finally{
      setRefining(false);
    }
  }

  useEffect(()=>{ if(step === 11){ runRefine(); } }, [step]); // eslint-disable-line
  useEffect(()=>{ if(step === 11){ runRefine(); } }, [platform]); // eslint-disable-line

  return (
    <div className="container">
      <h1>Dance Show Prompt Wizard</h1>
      <p className="sub">Answer one question at a time. On the last step we rewrite your prompt with ChatGPT for image models.</p>
      <div className="progress" aria-label="progress"><span style={{width: pct + '%'}} /></div>

      {step === 1 && (<Step>
        <label>What is your show called?</label>
        <input className="input-full" value={showName} onChange={e=>setShowName(e.target.value)} placeholder="e.g. This Amazing Show" />
        <div className="row" style={{justifyContent:'space-between', marginTop:12}}>
          <div className="badge">Title will live inside the artwork creatively</div>
          <button onClick={()=>setStep(2)}>Next</button>
        </div>
      </Step>)}

      {step === 2 && (<Step>
        <label>Describe the theme in one sentence</label>
        <input className="input-full" value={themeDesc} onChange={e=>setThemeDesc(e.target.value)} placeholder="e.g. Broadway with a modern twist" />
        <div className="row" style={{justifyContent:'space-between', marginTop:12}}>
          <button className="ghost" onClick={()=>setStep(1)}>Back</button>
          <button onClick={()=>setStep(3)}>Next</button>
        </div>
      </Step>)}

      {step === 3 && (<Step>
        <label>Add 3 to 5 keywords</label>
        <input className="input-full" value={keywords} onChange={e=>setKeywords(e.target.value)} placeholder="tap, jazz, spotlight, sequins" />
        <div className="row" style={{justifyContent:'space-between', marginTop:12}}>
          <button className="ghost" onClick={()=>setStep(2)}>Back</button>
          <button onClick={()=>setStep(4)}>Next</button>
        </div>
      </Step>)}

      {step === 4 && (<Step>
        <label>Colours to feature</label>
        <input className="input-full" value={colours} onChange={e=>setColours(e.target.value)} placeholder="deep purple, magenta, electric blue, gold" />
        <div className="row" style={{justifyContent:'space-between', marginTop:12}}>
          <button className="ghost" onClick={()=>setStep(3)}>Back</button>
          <button onClick={()=>setStep(5)}>Next</button>
        </div>
      </Step>)}

      {step === 5 && (<Step>
        <label>Orientation</label>
        <select value={orientation} onChange={e=>setOrientation(e.target.value)}>
          <option value="landscape">Landscape</option>
          <option value="portrait">Portrait</option>
          <option value="square">Square</option>
        </select>
        <label style={{marginTop:12}}>Style preset</label>
        <select value={preset} onChange={e=>setPreset(e.target.value)}>
          {PRESETS.map(p=>(<option key={p} value={p}>{p}</option>))}
        </select>
        <div className="row" style={{justifyContent:'space-between', marginTop:12}}>
          <button className="ghost" onClick={()=>setStep(4)}>Back</button>
          <button onClick={()=>setStep(6)}>Next</button>
        </div>
      </Step>)}

      {step === 6 && (<Step>
        <label>Complexity</label>
        <select value={complexityChoice} onChange={e=>setComplexityChoice(e.target.value)}>
          <option>Simple</option>
          <option>Quite Complex</option>
          <option>Ornate</option>
        </select>
        <label style={{marginTop:12}}>Style era</label>
        <select value={styleEraChoice} onChange={e=>setStyleEraChoice(e.target.value)}>
          <option>Classic</option>
          <option>Modern</option>
        </select>
        <label style={{marginTop:12}}>Rendering</label>
        <select value={renderingChoice} onChange={e=>setRenderingChoice(e.target.value)}>
          <option>Illustrative</option>
          <option>Photo-realistic</option>
        </select>
        <div className="row" style={{justifyContent:'space-between', marginTop:12}}>
          <button className="ghost" onClick={()=>setStep(5)}>Back</button>
          <button onClick={()=>setStep(7)}>Next</button>
        </div>
      </Step>)}

      {step === 7 && (<Step>
        <label>Colourfulness</label>
        <input className="slider" type="range" min="0" max="100" value={colourfulness} onChange={e=>setColourfulness(Number(e.target.value))} />
        <label>Energy</label>
        <input className="slider" type="range" min="0" max="100" value={energy} onChange={e=>setEnergy(Number(e.target.value))} />
        <label>Motion</label>
        <input className="slider" type="range" min="0" max="100" value={motion} onChange={e=>setMotion(Number(e.target.value))} />
        <label>Lighting</label>
        <input className="slider" type="range" min="0" max="100" value={lighting} onChange={e=>setLighting(Number(e.target.value))} />
        <div className="row" style={{justifyContent:'space-between', marginTop:12}}>
          <button className="ghost" onClick={()=>setStep(6)}>Back</button>
          <button onClick={()=>setStep(8)}>Next</button>
        </div>
      </Step>)}

      {step === 8 && (<Step>
        <label>Effects</label>
        <div className="row">
          <div className="row" style={{gap:8}}>
            <input id="lights" type="checkbox" checked={includeLights} onChange={e=>setIncludeLights(e.target.checked)} />
            <label htmlFor="lights">Stage lights</label>
          </div>
          <div className="row" style={{gap:8}}>
            <input id="smoke" type="checkbox" checked={includeSmoke} onChange={e=>setIncludeSmoke(e.target.checked)} />
            <label htmlFor="smoke">Smoke or haze</label>
          </div>
          <div className="row" style={{gap:8}}>
            <input id="flares" type="checkbox" checked={includeFlares} onChange={e=>setIncludeFlares(e.target.checked)} />
            <label htmlFor="flares">Lens flares</label>
          </div>
        </div>
        <div className="row" style={{marginTop:8}}>
          <div className="row" style={{gap:8}}><input id="confetti" type="checkbox" checked={fxConfetti} onChange={e=>setFxConfetti(e.target.checked)} /><label htmlFor="confetti">Confetti burst</label></div>
          <div className="row" style={{gap:8}}><input id="glitter" type="checkbox" checked={fxGlitter} onChange={e=>setFxGlitter(e.target.checked)} /><label htmlFor="glitter">Glitter dust</label></div>
          <div className="row" style={{gap:8}}><input id="neon" type="checkbox" checked={fxNeonGlow} onChange={e=>setFxNeonGlow(e.target.checked)} /><label htmlFor="neon">Neon glow accents</label></div>
          <div className="row" style={{gap:8}}><input id="laser" type="checkbox" checked={fxLaserBeams} onChange={e=>setFxLaserBeams(e.target.checked)} /><label htmlFor="laser">Laser beams</label></div>
          <div className="row" style={{gap:8}}><input id="curtain" type="checkbox" checked={fxCurtain} onChange={e=>setFxCurtain(e.target.checked)} /><label htmlFor="curtain">Theatre curtain backdrop</label></div>
          <div className="row" style={{gap:8}}><input id="holo" type="checkbox" checked={fxHologram} onChange={e=>setFxHologram(e.target.checked)} /><label htmlFor="holo">Holographic shimmer</label></div>
          <div className="row" style={{gap:8}}><input id="sparkles" type="checkbox" checked={fxSparkles} onChange={e=>setFxSparkles(e.target.checked)} /><label htmlFor="sparkles">Stardust sparkles</label></div>
          <div className="row" style={{gap:8}}><input id="bokeh" type="checkbox" checked={fxBokeh} onChange={e=>setFxBokeh(e.target.checked)} /><label htmlFor="bokeh">Bokeh sparkle</label></div>
        </div>
        <div className="row" style={{justifyContent:'space-between', marginTop:12}}>
          <button className="ghost" onClick={()=>setStep(7)}>Back</button>
          <button onClick={()=>setStep(9)}>Next</button>
        </div>
      </Step>)}

      {step === 9 && (<Step>
        <label>Would you like to embed your logo into the image?</label>
        <div className="row" style={{gap:8}}>
          <input id="embedLogo" type="checkbox" checked={embedLogo} onChange={e=>setEmbedLogo(e.target.checked)} />
          <label htmlFor="embedLogo">Yes, I will upload my logo when I generate the image</label>
        </div>
        <div className="row" style={{justifyContent:'space-between', marginTop:12}}>
          <button className="ghost" onClick={()=>setStep(8)}>Back</button>
          <button onClick={()=>setStep(10)}>Next</button>
        </div>
      </Step>)}

      {step === 10 && (<Step>
        <label>Which image generator will you use?</label>
        <select value={platform} onChange={e=>setPlatform(e.target.value)}>
          {PLATFORMS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
        </select>
        <div className="row" style={{justifyContent:'space-between', marginTop:12}}>
          <button className="ghost" onClick={()=>setStep(9)}>Back</button>
          <button onClick={()=>setStep(11)}>See final prompt</button>
        </div>
      </Step>)}

      {step === 11 && (<Step>
        <label>Your base prompt</label>
        <div className="preview">{fullPrompt}</div>
        <div className="row" style={{marginTop:10}}>
          <button className="ghost" onClick={()=>{navigator.clipboard.writeText(fullPrompt);showToast('Copied base prompt')}}>Copy base prompt</button>
          <div className="badge">We are optimising this with ChatGPT</div>
          <select value={platform} onChange={e=>setPlatform(e.target.value)}>
            {PLATFORMS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select>
        </div>
        {refining && <div className="badge" style={{marginTop:8}}>Refining your prompt...</div>}
        {error && <div className="error" style={{marginTop:8}}>{error}</div>}
        {refined && (
          <>
            <label style={{marginTop:12}}>Final optimised prompt</label>
            <div className="preview">{refined}</div>
            <div className="row" style={{marginTop:10}}>
              <button onClick={()=>{navigator.clipboard.writeText(refined);showToast('Copied final prompt')}}>Copy final prompt</button>
            </div>
          </>
        )}
        <div className="debug" style={{marginTop:10}} aria-label="debug">{debug}</div>
        <div className="row" style={{justifyContent:'space-between', marginTop:12}}>
          <button className="ghost" onClick={()=>setStep(10)}>Back</button>
          <button onClick={()=>setStep(1)}>Start again</button>
        </div>
      </Step>)}

      {toast ? <div className="toast">{toast}</div> : null}

      <div className="footer">Made for DanceShowFilming.uk</div>
    </div>
  );
}
