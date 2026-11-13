// Os vídeos originais do dono ocupam as molduras; SVGs ficam apenas como cartazes estáticos.
const media = [
  ['globo-compensacao', 'global', 'hero-story'],
  ['globo-corredores-brasil', 'brazil', ''],
  ['grafo-multirrede', 'network', ''],
];
export const visuals = media.map(([file, label, className]) => `<figure class="story-figure ${className}"><div class="story-frame" data-playing="false"><video class="story-video" autoplay muted loop playsinline preload="metadata" poster="/videos/${file}.svg" width="1080" height="1920" data-i18n-aria-label="video.${label}"><source data-src="/videos/${file}.mp4" type="video/mp4"></video><div class="story-controls"><button type="button" class="story-toggle" aria-pressed="true" data-i18n-aria-label="video.play"><svg class="play-icon" aria-hidden="true" viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="m8 5 11 7-11 7z"/></svg><svg class="pause-icon" aria-hidden="true" viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M6 5h4v14H6zm8 0h4v14h-4z"/></svg></button></div></div><figcaption><span data-i18n="video.${label}"></span><span class="story-disclaimer" data-i18n="video.concept"></span></figcaption></figure>`);
