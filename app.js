(function(){
  function fmt(n){return Math.round(n).toLocaleString('cs-CZ')+' Kč';}
  function pct(n){return n.toFixed(1).replace('.',',')+' %';}
  function factor(rate){var i=rate/100/12;return i/(1-Math.pow(1+i,-360));}
  function g(id){return document.getElementById(id);}

  var calcEl=document.getElementById('calc');
  if(calcEl){
    var PROVOZ=parseFloat(calcEl.getAttribute('data-provoz'))||11000;
    var EXTRA=parseFloat(calcEl.getAttribute('data-extra'))||325000;
    function calc(){
      var cena=+g('c_cena').value,adr=+g('c_adr').value,occ=+g('c_occ').value,ur=+g('c_ur').value;
      g('v_cena').textContent=Math.round(cena).toLocaleString('cs-CZ');
      g('v_adr').textContent=Math.round(adr).toLocaleString('cs-CZ');
      g('v_occ').textContent=occ+' %';
      g('v_ur').textContent=ur.toFixed(1)+' %';
      var splatka=cena*0.9*factor(ur),gross=adr*30*(occ/100),platform=gross*0.03;
      var naklady=splatka+PROVOZ+platform,zisk=gross-naklady,rok=zisk*12;
      var invest=cena*0.1+EXTRA,roi=invest>0?(rok/invest*100):0;
      g('o_gross').textContent=fmt(gross);g('o_spl').textContent=fmt(splatka);
      g('o_nak').textContent=fmt(naklady);g('o_zisk').textContent=fmt(zisk);
      g('o_rok').textContent=fmt(rok);g('o_roi').textContent=pct(roi);
    }
    document.querySelectorAll('#calc input').forEach(function(el){el.addEventListener('input',calc);});
    calc();
  }

  function countUp(el){
    var target=+el.getAttribute('data-count'),suf=el.getAttribute('data-suffix')||'',pre=el.getAttribute('data-prefix')||'';
    var t0=null,dur=1100;
    function step(ts){if(!t0)t0=ts;var p=Math.min((ts-t0)/dur,1);var v=Math.round(target*p);
      el.textContent=pre+v.toLocaleString('cs-CZ')+suf;if(p<1)requestAnimationFrame(step);}
    requestAnimationFrame(step);
  }

  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){if(e.isIntersecting){
      e.target.classList.add('in');
      e.target.querySelectorAll('.pf .bar').forEach(function(b){b.style.height=b.getAttribute('data-h')+'px';});
      e.target.querySelectorAll('[data-count]').forEach(countUp);
      io.unobserve(e.target);
    }});
  },{threshold:.15});
  document.querySelectorAll('.reveal').forEach(function(s){io.observe(s);});

  window.addEventListener('load',function(){
    document.querySelectorAll('.hero [data-count]').forEach(countUp);
  });
})();
