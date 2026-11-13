const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Refactor Sidebar Tabs
html = html.replace(/px-5 py-4 rounded-xl border transition-all duration-300 shrink-0 lg:shrink whitespace-nowrap lg:whitespace-normal icp-tab-active bg-\[#080923\] border-\[#5B8DEF\]\/30 shadow-\[0_0_20px_rgba\(91,141,239,0\.08\)\]/g, 
  'px-5 py-3.5 border-l-2 transition-all duration-300 shrink-0 lg:shrink whitespace-nowrap lg:whitespace-normal icp-tab-active bg-gradient-to-r from-[#5B8DEF]/10 to-transparent border-[#5B8DEF]');

html = html.replace(/px-5 py-4 rounded-xl border transition-all duration-300 shrink-0 lg:shrink whitespace-nowrap lg:whitespace-normal bg-transparent border-transparent hover:bg-\[#080923\] hover:border-\[#1B2A46\]/g, 
  'px-5 py-3.5 border-l-2 transition-all duration-300 shrink-0 lg:shrink whitespace-nowrap lg:whitespace-normal bg-transparent border-transparent hover:bg-white/[0.02] hover:border-white/10');

// 2. Refactor Cards (All 28)
html = html.replace(/group bg-\[#080923\] border border-\[#1B2A46\] rounded-2xl p-6 md:p-7 flex flex-col hover:border-\[#5B8DEF\]\/40 transition-all duration-300 hover:shadow-\[0_8px_32px_rgba\(91,141,239,0\.06\)\] hover:-translate-y-1/g,
  'group bg-gradient-to-b from-white/[0.03] to-transparent border border-white/[0.05] rounded-2xl p-6 md:p-7 flex flex-col hover:border-[#5B8DEF]/30 transition-all duration-300 hover:bg-white/[0.05] hover:-translate-y-1');

html = html.replace(/<div class="flex items-center justify-between mb-3\.5">\s*<div class="text-\[10px\] font-bold text-\[#5B8DEF\] tracking-\[0\.14em\] uppercase bg-\[#5B8DEF\]\/10 border border-\[#5B8DEF\]\/20 px-2\.5 py-0\.5 rounded">(ICP \d{2})<\/div>\s*<\/div>/g,
  '<div class="flex items-center justify-between mb-4">\n                    <div class="text-[11px] font-medium text-[#5B8DEF] tracking-[0.15em] uppercase">$1</div>\n                  </div>');

const estruturaRegex = /<div class="space-y-2 mb-6 mt-auto">\s*<div class="text-\[10px\] font-semibold tracking-\[0\.05em\] text-\[#8898C0\] uppercase flex items-center gap-1\.5">\s*<span class="w-1\.5 h-1\.5 rounded-full bg-\[#5B8DEF\]"><\/span>\s*Estrutura Recomendada\s*<\/div>\s*<div class="flex items-start gap-2\.5 bg-\[#080923\]\/30 border border-\[#1B2A46\]\/50 rounded-xl p-4">\s*<svg[^>]*><polyline[^>]*><\/svg>\s*<p class="text-\[13px\] text-\[#EEF1F9\] leading-\[1\.55\]">([\s\S]*?)<\/p>\s*<\/div>\s*<\/div>/g;
html = html.replace(estruturaRegex, 
  `<div class="mb-6 mt-auto pt-5 border-t border-white/[0.06]">
                    <div class="text-[10px] font-semibold tracking-[0.08em] text-[#8898C0] uppercase mb-3">Estrutura Recomendada</div>
                    <div class="border-l-2 border-[#5B8DEF]/50 pl-4 py-1">
                      <p class="text-[13.5px] text-[#EEF1F9] leading-[1.6]">$1</p>
                    </div>
                  </div>`);

const gatilhosOuterRegex = /<div class="pt-4 border-t border-\[#1B2A46\]\/50">\s*<div class="text-\[10px\] font-semibold tracking-\[0\.05em\] text-\[#8898C0\] uppercase mb-2\.5">Gatilhos de Alerta<\/div>\s*<div class="flex flex-wrap gap-1\.5">\s*([\s\S]*?)\s*<\/div>\s*<\/div>/g;
html = html.replace(gatilhosOuterRegex, (match, spansBlock) => {
  const texts = [];
  const spanRegex = /<span class="inline-flex[^>]*><span[^>]*>·<\/span>\s*(.*?)<\/span>/g;
  let spanMatch;
  while ((spanMatch = spanRegex.exec(spansBlock)) !== null) {
    texts.push(spanMatch[1].trim());
  }
  const formattedGatilhos = texts.join(' <span class="text-[#5B8DEF]/50 mx-1.5 font-light">/</span> ');
  return `<div class="pt-4 mt-4">
                    <div class="text-[10px] font-semibold tracking-[0.08em] text-[#8898C0] uppercase mb-1.5">Gatilhos de Alerta</div>
                    <p class="text-[12px] text-[#A9B6D6] leading-[1.6] font-medium">
                      ${formattedGatilhos}
                    </p>
                  </div>`;
});

// 3. Fix JS using regex that ignores whitespace and newlines!
const jsFindRegex = /\/\/ Remove active classes from all tabs\s*tabs\.forEach\(t => \{\s*t\.classList\.remove\('icp-tab-active', 'bg-\[#080923\]', 'border-\[#5B8DEF\]\/30', 'shadow-\[0_0_20px_rgba\(91,141,239,0\.08\)\]'\);\s*t\.classList\.add\('bg-transparent', 'border-transparent', 'hover:bg-\[#080923\]', 'hover:border-\[#1B2A46\]'\);\s*t\.querySelector\('\.icp-tab-text'\)\.classList\.remove\('text-\[#EEF1F9\]'\);\s*t\.querySelector\('\.icp-tab-text'\)\.classList\.add\('text-\[#8898C0\]'\);\s*t\.querySelector\('\.icp-tab-dot'\)\.classList\.remove\('bg-\[#5B8DEF\]'\);\s*t\.querySelector\('\.icp-tab-dot'\)\.classList\.add\('bg-\[#1B2A46\]'\);\s*\}\);\s*\/\/ Add active class to clicked tab\s*tab\.classList\.remove\('bg-transparent', 'border-transparent', 'hover:bg-\[#080923\]', 'hover:border-\[#1B2A46\]'\);\s*tab\.classList\.add\('icp-tab-active', 'bg-\[#080923\]', 'border-\[#5B8DEF\]\/30', 'shadow-\[0_0_20px_rgba\(91,141,239,0\.08\)\]'\);\s*tab\.querySelector\('\.icp-tab-text'\)\.classList\.remove\('text-\[#8898C0\]'\);\s*tab\.querySelector\('\.icp-tab-text'\)\.classList\.add\('text-\[#EEF1F9\]'\);\s*tab\.querySelector\('\.icp-tab-dot'\)\.classList\.remove\('bg-\[#1B2A46\]'\);\s*tab\.querySelector\('\.icp-tab-dot'\)\.classList\.add\('bg-\[#5B8DEF\]'\);/g;

const newJs = `// Remove active classes from all tabs
            tabs.forEach(t => {
              t.classList.remove('icp-tab-active', 'bg-gradient-to-r', 'from-[#5B8DEF]/10', 'to-transparent', 'border-[#5B8DEF]');
              t.classList.add('bg-transparent', 'border-transparent', 'hover:bg-white/[0.02]', 'hover:border-white/10');
              t.querySelector('.icp-tab-text').classList.remove('text-[#EEF1F9]');
              t.querySelector('.icp-tab-text').classList.add('text-[#8898C0]');
              t.querySelector('.icp-tab-dot').classList.remove('bg-[#5B8DEF]');
              t.querySelector('.icp-tab-dot').classList.add('bg-[#1B2A46]');
            });
            
            // Add active class to clicked tab
            tab.classList.remove('bg-transparent', 'border-transparent', 'hover:bg-white/[0.02]', 'hover:border-white/10');
            tab.classList.add('icp-tab-active', 'bg-gradient-to-r', 'from-[#5B8DEF]/10', 'to-transparent', 'border-[#5B8DEF]');
            tab.querySelector('.icp-tab-text').classList.remove('text-[#8898C0]');
            tab.querySelector('.icp-tab-text').classList.add('text-[#EEF1F9]');
            tab.querySelector('.icp-tab-dot').classList.remove('bg-[#1B2A46]');
            tab.querySelector('.icp-tab-dot').classList.add('bg-[#5B8DEF]');`;

if (jsFindRegex.test(html)) {
  html = html.replace(jsFindRegex, newJs);
  console.log("Successfully replaced JS logic!");
} else {
  console.log("Failed to match JS logic. Regex is wrong.");
}

fs.writeFileSync('index.html', html);
console.log("Done.");
