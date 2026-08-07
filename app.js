(function(){
  function fmt(n){return Math.round(n).toLocaleString('cs-CZ')+' Kč';}
  function pct(n){return n.toFixed(1).replace('.',',')+' %';}
  function factor(rate){var i=rate/100/12;return i/(1-Math.pow(1+i,-360));}

  document.querySelectorAll('.calc').forEach(function(box){
    var PROVOZ=parseFloat(box.getAttribute('data-provoz'))||0;
    var EXTRA=parseFloat(box.getAttribute('data-extra'))||0;
    function q(s){return box.querySelector(s);}
    function calc(){
      var cena=+q('.c_cena').value,adr=+q('.c_adr').value,occ=+q('.c_occ').value,ur=+q('.c_ur').value;
      q('.v_cena').textContent=Math.round(cena).toLocaleString('cs-CZ');
      q('.v_adr').textContent=Math.round(adr).toLocaleString('cs-CZ');
      q('.v_occ').textContent=occ+' %';
      q('.v_ur').textContent=ur.toFixed(1).replace('.',',')+' %';
      var splatka=cena*0.9*factor(ur),gross=adr*30*(occ/100),platform=gross*0.03;
      var naklady=splatka+PROVOZ+platform,zisk=gross-naklady,rok=zisk*12;
      var invest=cena*0.1+EXTRA,roi=invest>0?(rok/invest*100):0;
      q('.o_gross').textContent=fmt(gross);
      q('.o_spl').textContent=fmt(splatka);
      q('.o_nak').textContent=fmt(naklady);
      q('.o_zisk').textContent=fmt(zisk);
      q('.o_rok').textContent=fmt(rok);
      q('.o_roi').textContent=zisk<0?'ztráta':pct(roi);
      q('.o_inv').textContent=fmt(invest);
      var hl=q('.o_zisk').parentNode;
      if(zisk<0){hl.classList.add('negative');}else{hl.classList.remove('negative');}
    }
    box.querySelectorAll('input[type=range]').forEach(function(el){el.addEventListener('input',calc);});
    calc();
  });

  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});
  },{threshold:.12});
  document.querySelectorAll('.reveal').forEach(function(s){io.observe(s);});
})();
