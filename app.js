(function(){
  function fmt(n){return Math.round(n).toLocaleString('cs-CZ')+' Kč';}
  function pct(n){return n.toFixed(1).replace('.',',')+' %';}
  // Anuitni faktor pro libovolnou splatnost. Hypoteka 360 mesicu, stavebko 240.
  function factor(rate,mesicu){var i=rate/100/12;if(i===0)return 1/mesicu;return i/(1-Math.pow(1+i,-mesicu));}

  document.querySelectorAll('.calc').forEach(function(box){
    var PROVOZ=parseFloat(box.getAttribute('data-provoz'))||0;
    var EXTRA=parseFloat(box.getAttribute('data-extra'))||0;
    function q(s){return box.querySelector(s);}
    function calc(){
      var cena=+q('.c_cena').value,adr=+q('.c_adr').value,occ=+q('.c_occ').value,ur=+q('.c_ur').value;
      var ako=q('.c_ako')?+q('.c_ako').value/100:0.10, urs=q('.c_urs')?+q('.c_urs').value:6.2;
      q('.v_cena').textContent=Math.round(cena).toLocaleString('cs-CZ');
      q('.v_adr').textContent=Math.round(adr).toLocaleString('cs-CZ');
      q('.v_occ').textContent=occ+' %';
      q('.v_ur').textContent=ur.toFixed(1).replace('.',',')+' %';
      if(q('.v_ako'))q('.v_ako').textContent=Math.round(ako*100)+' %';
      if(q('.v_urs'))q('.v_urs').textContent=urs.toFixed(1).replace('.',',')+' %';

      // Banka pujci nejvys 90 %. Co nepokryje hypoteka ani stavebko, jde z vlastniho.
      var podilH=Math.min(0.90,1-ako), podilVlastni=Math.max(0,1-podilH-ako);
      var splatkaH=cena*podilH*factor(ur,360), splatkaS=cena*ako*factor(urs,240);
      var splatka=splatkaH+splatkaS;
      var gross=adr*30*(occ/100),platform=gross*0.03;
      var naklady=splatka+PROVOZ+platform,zisk=gross-naklady,rok=zisk*12;
      var invest=cena*podilVlastni+EXTRA,roi=invest>0?(rok/invest*100):0;
      var zvrat=(splatka+PROVOZ)/(adr*30*0.97)*100;

      q('.o_gross').textContent=fmt(gross);
      q('.o_spl').textContent=fmt(splatkaH);
      if(q('.o_spls'))q('.o_spls').textContent=ako>0?fmt(splatkaS):'nic';
      if(q('.o_dluh'))q('.o_dluh').textContent=fmt(splatka);
      q('.o_nak').textContent=fmt(naklady);
      q('.o_zisk').textContent=fmt(zisk);
      q('.o_rok').textContent=fmt(rok);
      if(q('.o_zvrat')){
        q('.o_zvrat').textContent=zvrat>100?'nikdy':pct(zvrat);
        var zb=q('.o_zvrat').parentNode;
        if(zvrat>55){zb.classList.add('negative');}else{zb.classList.remove('negative');}
      }
      q('.o_roi').textContent=invest<=EXTRA+1?'nelze, vlastní 0':(zisk<0?'ztráta':pct(roi));
      q('.o_inv').textContent=fmt(invest);
      var hl=q('.o_zisk').parentNode;
      if(zisk<0){hl.classList.add('negative');}else{hl.classList.remove('negative');}
    }
    box.querySelectorAll('input[type=range]').forEach(function(el){el.addEventListener('input',calc);});
    calc();
  });

  var sekce=document.querySelectorAll('.reveal');
  function odkryjVse(){sekce.forEach(function(s){s.classList.add('in');});}
  if('IntersectionObserver' in window){
    // Trida .anim zapina skryvani. Pridava se az tady, takze kdyz cokoliv vys
    // spadne, obsah zustane videt misto prazdne stranky.
    document.documentElement.classList.add('anim');
    // threshold musi byt 0. Sekce se seznamem je vyssi nez okno prohlizece,
    // takze procentualni prah by se u ni nikdy nesplnil a nezobrazila by se.
    var io=new IntersectionObserver(function(es){
      es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});
    },{threshold:0,rootMargin:'0px 0px -80px 0px'});
    sekce.forEach(function(s){io.observe(s);});
    setTimeout(odkryjVse,1200);  // pojistka, kdyby observer nesepnul
  }
})();
