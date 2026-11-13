import pts from './mascote-points.json';

// Retrato de partículas e grafo de conhecimento do arquivo original do dono.
export function mountMascote(canvas, { onFrame = () => {} } = {}) {
  var offX = 60, offY = 66;

  var nodes = [
    {l:'Mutual', a:0, r:200, c:'a'},
    {l:'MTC', a:0.35, r:195, c:'b'},
    {l:'OHR', a:0.75, r:200, c:'a'},
    {l:'API', a:1.15, r:190, c:'b'},
    {l:'MTC', a:1.55, r:195, c:'n'},
    {l:'Hub', a:1.95, r:190, c:'b'},
    {l:'VASP', a:2.35, r:195, c:'n'},
    {l:'MTC', a:2.75, r:190, c:'n'},
    {l:'API', a:3.15, r:195, c:'n'},
    {l:'MTC', a:3.55, r:190, c:'n'},
    {l:'VASP', a:3.95, r:195, c:'n'},
    {l:'API', a:4.35, r:190, c:'b'},
    {l:'OHR', a:4.75, r:195, c:'n'},
    {l:'MTC', a:5.15, r:190, c:'n'},
    {l:'API', a:5.55, r:195, c:'n'},
    {l:'Mutual', a:5.95, r:190, c:'b'}
  ];
  var cx = offX + 179.5, cy = offY + 144;
  for (var ni=0; ni<nodes.length; ni++){
    var nd = nodes[ni];
    nd.baseX = cx + Math.cos(nd.a) * nd.r;
    nd.baseY = cy + Math.sin(nd.a) * nd.r * 0.82;
  }

  var colors = {a:'rgba(252,183,27,', b:'rgba(104,136,198,', n:'rgba(89,111,156,', d:'rgba(89,111,156,'};
  var baseA = {a:0.95, b:0.85, n:0.7, d:0.28};
  var baseR = {a:1.5, b:1.05, n:0.75, d:0.45};

  
  var ctx = canvas.getContext('2d');
  var thinking = false;
  var t = 0;

  function draw(){
    ctx.fillStyle = '#161D33';
    ctx.fillRect(0,0,480,420);

    for (var i=0;i<nodes.length;i++){
      var nd = nodes[i];
      var drift = Math.sin(t*0.01 + i) * 4;
      nd.x = nd.baseX + drift;
      nd.y = nd.baseY + Math.cos(t*0.008 + i*1.3) * 4;
    }

    ctx.lineWidth = 0.6;
    for (var i=0;i<nodes.length;i++){
      var a2 = nodes[(i+1)%nodes.length];
      var a1 = nodes[i];
      ctx.strokeStyle = 'rgba(89,111,156,0.5)';
      ctx.beginPath(); ctx.moveTo(a1.x,a1.y); ctx.lineTo(a2.x,a2.y); ctx.stroke();
    }

    if (thinking){
      var eyeL = {x: offX+205, y: offY+72};
      var eyeR = {x: offX+254, y: offY+72};
      for (var i=0;i<nodes.length;i+=2){
        var nd = nodes[i];
        var eye = (i % 4 === 0) ? eyeL : eyeR;
        var pulse = 0.35 + 0.35*Math.sin(t*0.12 + i*0.5);
        ctx.strokeStyle = 'rgba(252,183,27,' + pulse + ')';
        ctx.lineWidth = 0.7;
        ctx.beginPath(); ctx.moveTo(nd.x,nd.y); ctx.lineTo(eye.x,eye.y); ctx.stroke();
      }
    }

    ctx.font = '9px sans-serif';
    for (var i=0;i<nodes.length;i++){
      var nd = nodes[i];
      var r = nd.c === 'a' ? 4 : 3;
      ctx.fillStyle = colors[nd.c] + '0.9)';
      ctx.beginPath(); ctx.arc(nd.x, nd.y, r, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = 'rgba(139,150,190,0.85)';
      ctx.fillText(nd.l, Math.min(nd.x + 6, 474 - ctx.measureText(nd.l).width), nd.y + 3);
    }

    if (thinking){
      for (var k = 0; k < 12; k++){
        var p1 = pts[Math.floor(Math.random()*pts.length)];
        var p2 = pts[Math.floor(Math.random()*pts.length)];
        var dx = p1[0]-p2[0], dy = p1[1]-p2[1];
        if (Math.sqrt(dx*dx+dy*dy) > 60) continue;
        ctx.strokeStyle = 'rgba(104,136,198,0.3)';
        ctx.lineWidth = 0.5;
        ctx.beginPath(); ctx.moveTo(offX+p1[0],offY+p1[1]); ctx.lineTo(offX+p2[0],offY+p2[1]); ctx.stroke();
      }
    }

    for (var i = 0; i < pts.length; i++){
      var p = pts[i];
      var cls = p[2];
      var a = baseA[cls];
      var r = baseR[cls];
      var jx = offX + p[0], jy = offY + p[1];
      if (thinking && cls === 'a'){
        var pulse = 0.5 + 0.5*Math.sin(t*0.15 + i*0.4);
        a = 0.6 + 0.4*pulse;
        r = baseR[cls] * (1 + 0.5*pulse);
      } else if (!thinking) {
        var breathe = 0.9 + 0.1*Math.sin(t*0.03 + i*0.05);
        a = a * breathe;
      } else {
        jx += (Math.random()-0.5)*0.6;
        jy += (Math.random()-0.5)*0.6;
      }
      ctx.fillStyle = colors[cls] + a + ')';
      ctx.beginPath();
      ctx.arc(jx, jy, r, 0, Math.PI*2);
      ctx.fill();
    }
  }


  let raf = null;
  let active = false;
  let lastFrame = 0;
  function loop(now) {
    if (!active) return;
    // Limita o desenho a 30 quadros por segundo, sem alterar a velocidade.
    if (now - lastFrame >= 1000 / 30) {
      t += Math.min((now - lastFrame) / (1000 / 60), 3);
      lastFrame = now;
      draw();
      onFrame();
    }
    raf = requestAnimationFrame(loop);
  }
  return {
    start() {
      if (active) return;
      active = true;
      lastFrame = performance.now();
      raf = requestAnimationFrame(loop);
    },
    stop() {
      active = false;
      cancelAnimationFrame(raf);
      raf = null;
    },
    staticFrame() { t = 0; thinking = false; draw(); onFrame(); },
    setThinking(value) { thinking = value; },
  };
}
