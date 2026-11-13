const bases = {
 trade:'pix-fornecedor-transparent.png', fintech:'api-base-transparent.png',
 treasury:'tesouraria-caixa-transparent.png', commerce:'marketplace-americas-transparent.png',
 agro:'agro-commodities-transparent.png',
};
const image = name => `<img src="/img/${name}" width="1254" height="1254" alt="" loading="lazy" decoding="async">`;
export function validatedScene(kind) {
 if(kind==='robot')return `<div class="validated-art validated-art--robot" aria-hidden="true"><div class="validated-robot-rig">${image('mutucoin-mascot-transparent.png')}<span class="validated-robot-coin">${image('token-usdt.jpg')}</span><span class="validated-robot-shadow"></span></div></div>`;
 if(!bases[kind])return '';
 const icons = kind==='trade'?Array(5).fill('pix'):kind==='fintech'||kind==='treasury'?['usdc','usdt','usdc','usdt','usdc','usdt']:kind==='commerce'?['store-gold','store-silver']:[];
 const tokens=icons.map((type,i)=>`<span class="validated-token validated-token--${type} validated-token--${i+1}">${image(type==='pix'?'token-pix.jpg':type==='usdc'?'token-usdc.webp':type==='usdt'?'token-usdt.jpg':`marketplace-${type}-transparent.png`)}</span>`).join('');
 return `<div class="validated-art validated-art--${kind}" aria-hidden="true"><div class="validated-base">${image(bases[kind])}</div><div class="validated-tokens">${tokens}</div></div>`;
}
