export function humanLayout(orientation){
  if(orientation === 'landscape') return {label:'landscape poster', ratio:'3:2'};
  if(orientation === 'portrait') return {label:'portrait poster', ratio:'2:3'};
  return {label:'square poster', ratio:'1:1'};
}

export function buildBasePrompt(state){
  const {
    showName, themeDesc, colours, keywords,
    orientation, preset,
    complexityChoice, styleEraChoice, renderingChoice,
    colourfulness, energy, motion, lighting,
    includeLights, includeSmoke, includeFlares,
    fxConfetti, fxGlitter, fxNeonGlow, fxLaserBeams, fxCurtain, fxHologram, fxSparkles, fxBokeh,
    embedLogo
  } = state;

  const parts = [];
  parts.push(`Design cinematic poster artwork for a dance show titled "${showName}".`);
  parts.push(`The title must live inside the scene creatively, not a flat overlay: neon tubes, marquee bulbs, projection through haze, reflection on a polished stage floor.`);

  if(themeDesc) parts.push(`Theme: ${themeDesc}.`);
  if(colours) parts.push(`Colour palette: ${colours}.`);
  if(keywords) parts.push(`Concept keywords: ${keywords}.`);

  const lay = humanLayout(orientation);
  parts.push(`Layout: ${lay.label} (${lay.ratio} aspect ratio, must remain ${lay.label.split(' ')[0]}).`);
  parts.push(`Keep the complexity ${complexityChoice.toLowerCase()}.`);
  parts.push(`Use a ${styleEraChoice.toLowerCase()} style.`);
  parts.push(`Rendering should be ${renderingChoice.toLowerCase()}.`);

  const scaleWord = (v,a,b)=> v<33? a : v>66? b : `balanced ${a} and ${b}`;
  parts.push(`Colourfulness: ${scaleWord(colourfulness,'limited palette','multi colour')}.`);
  parts.push(`Energy: ${scaleWord(energy,'subtle','high energy')}.`);
  parts.push(`Motion: ${scaleWord(motion,'still','dynamic')}.`);
  parts.push(`Lighting: ${scaleWord(lighting,'soft','dramatic')}.`);

  const fx = [];
  if(includeLights) fx.push('stage spotlights');
  if(includeSmoke) fx.push('smoke or haze for depth');
  if(includeFlares) fx.push('lens flares if helpful');
  if(fxConfetti) fx.push('confetti burst');
  if(fxGlitter) fx.push('glitter dust shimmer');
  if(fxNeonGlow) fx.push('neon glow accents');
  if(fxLaserBeams) fx.push('laser beam accents');
  if(fxCurtain) fx.push('rich theatre curtain backdrop');
  if(fxHologram) fx.push('holographic shimmer');
  if(fxSparkles) fx.push('stardust sparkles');
  if(fxBokeh) fx.push('soft bokeh sparkle');
  if(fx.length) parts.push(`Effects to consider: ${fx.join(', ')}.`);

  const presetMap = {
    Vintage: 'vintage theatre playbill, subtle paper grain, warm inks',
    Modern: 'sleek minimal layout, bold geometric shapes, negative space',
    Classic: 'timeless theatre poster, elegant composition, refined type feel',
    Futuristic: 'neon accents, holographic textures, sci fi energy',
    Colourful: 'vibrant confetti palette, playful shapes, celebratory mood'
  };
  if(preset) parts.push(`Overall direction: ${preset} (${presetMap[preset]}).`);

  if(embedLogo){
    parts.push('Blend the uploaded logo into the composition naturally, as a lighting element, signage, or reflection, not as a flat corner watermark.');
  }

  parts.push(`Aspect ratio must be ${lay.ratio} and orientation must remain ${lay.label.split(' ')[0]}. Do not change these.`);

  parts.push('Avoid brand logos. Avoid flat caption boxes. Avoid readable body copy.');
  parts.push('High quality, sharp details, rich contrast, cinematic light, professional poster look.');
  return parts.join(' ');
}

export function buildNegative(){
  return [
    'low resolution','blurry','dull colors','boring composition','crooked horizon',
    'watermarks','text artifacts','extra limbs','harsh flash look'
  ].join(', ');
}
