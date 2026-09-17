
(function(){
  var tbl=document.getElementById('t'); if(!tbl)return; var rows=Array.from(tbl.querySelectorAll('tbody tr'));
  var fm=document.getElementById('f_mk'),fp=document.getElementById('f_pass'),fc=document.getElementById('f_cena');
  function apply(){
    var mk=fm.value,pa=fp.value,cm=+fc.value||1e12,n=0;
    rows.forEach(function(r){
      var ok=(mk==''||r.dataset.mk==mk)&&(+r.dataset.cena<=cm)&&
        (pa==''||(pa=='dot'&&r.dataset.dot=='1')||(pa=='eq'&&r.dataset.eq=='1')||(pa=='both'&&r.dataset.dot=='1'&&r.dataset.eq=='1'));
      r.style.display=ok?'':'none'; if(ok)n++;
    });
    document.getElementById('cnt').textContent=n;
  }
  [fm,fp,fc].forEach(function(e){e.addEventListener('input',apply);});
  var cur='skore',dir=-1;
  tbl.querySelectorAll('th[data-k]').forEach(function(th){
    th.addEventListener('click',function(){
      var kk=th.dataset.k; if(kk==cur)dir=-dir; else{cur=kk;dir=(kk=='nazev'||kk=='mk')?1:-1;}
      tbl.querySelectorAll('th').forEach(function(x){x.classList.remove('s')}); th.classList.add('s');
      var tb=tbl.querySelector('tbody');
      rows.sort(function(a,b){var x=a.dataset[kk],y=b.dataset[kk];
        if(!isNaN(parseFloat(x))&&!isNaN(parseFloat(y))){x=+x;y=+y;} else {x=(x||'').toString();y=(y||'').toString();}
        return (x>y?1:x<y?-1:0)*dir;});
      rows.forEach(function(r){tb.appendChild(r)});
    });
  });
  apply();
})();


(function(){
  var D=window.__BYT; if(!D)return;
  var P=D.p, b=D.b, m=D.m;
  function an(j,u,r){var i=u/100/12,n=r*12;return j<=0?0:j*i/(1-Math.pow(1+i,-n));}
  function fmt(x){return x==null?'–':Math.round(x).toLocaleString('cs-CZ');}
  function nak(cena){
    var reko=b.plocha*(b.reko_sazba_m2||P.reko_sazba_m2), ako=cena*(1-P.ltv), hyp=cena*P.ltv, ss=ako+reko;
    var sh=an(hyp,P.hyp_urok,P.hyp_roky), sss=an(ss,P.ss_urok,P.ss_roky);
    var fond=(b.fond_oprav!=null)?b.fond_oprav:b.plocha*P.fond_oprav_m2;
    var fix=fond+P.pojisteni+P.dan_nemovitost_mes+b.plocha*P.rezerva_opravy_m2;
    return {reko:reko,hyp:hyp,ss:ss,sh:sh,sss:sss,fix:fix,celkem:sh+sss+fix};
  }
  function allin(cena){var n=nak(cena);var rez=n.reko*P.reko_rezerva;var drz=n.celkem*(b.reko_mesice||P.reko_mesice);
    return {celkem:cena+n.reko+rez+P.pravnik+drz,drz:drz,rez:rez,n:n};}
  var pr=D.prijmy, hod=D.hodnota_real, strop=D.strop;
  function upd(){
    var cena=+document.getElementById('sl').value;
    document.getElementById('slv').textContent=fmt(cena)+' Kč';
    document.getElementById('sld').textContent=((cena/b.cena-1)*100).toFixed(1).replace('.',',')+' % proti inzerátu';
    var a=allin(cena), eq=hod?hod-a.celkem:null, ep=eq!=null?eq/a.celkem:null;
    document.getElementById('o_allin').textContent=fmt(a.celkem);
    document.getElementById('o_splh').textContent=fmt(a.n.sh); document.getElementById('o_spls').textContent=fmt(a.n.sss);
    document.getElementById('o_nak').textContent=fmt(a.n.celkem);
    var eqel=document.getElementById('o_eq'); eqel.textContent=eq==null?'–':fmt(eq)+' ('+(ep*100).toFixed(1).replace('.',',')+' %)';
    eqel.className=(ep!=null&&ep>=P.equity_min)?'b ok':'b bad';
    ['prazdny','dlouhodoby','stredne','airbnb'].forEach(function(v){
      var el=document.getElementById('d_'+v); if(!el)return;
      if(pr[v]==null){el.textContent='–';return;}
      var d=a.n.celkem-pr[v]; el.textContent=fmt(d); el.className=d<=strop?'b ok':'b bad';
    });
  }
  document.getElementById('sl').addEventListener('input',upd); upd();
})();
