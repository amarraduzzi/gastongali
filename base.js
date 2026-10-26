(()=>{
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

/* intro (home only) */
const intro=$('#intro');
if(intro){let seen=false;try{seen=!!sessionStorage.getItem('gg-m');sessionStorage.setItem('gg-m','1')}catch(e){}
  if(seen||reduce)intro.remove();else{setTimeout(()=>intro.classList.add('done'),2300);setTimeout(()=>intro.remove(),3400)}}

/* reveal */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('on');io.unobserve(e.target)}}),{threshold:.1,rootMargin:'0px 0px -5% 0px'});
$$('.reveal').forEach((el,i)=>{el.style.transitionDelay=(i%3)*80+'ms';io.observe(el)});

/* whatsapp button */
const wa=$('.wa');if(wa){let hid=false;const f=()=>wa.classList.toggle('hide',scrollY<300||hid);addEventListener('scroll',f,{passive:true});f();/* devis-hide */const vis=new Set(),z=$$('#devis,footer');if(z.length){const o=new IntersectionObserver(es=>{es.forEach(e=>e.isIntersecting?vis.add(e.target):vis.delete(e.target));hid=vis.size>0;f()},{threshold:.05});z.forEach(e=>o.observe(e))}}

/* café tabs scrollspy */
const tabs=$$('.tabs a');
if(tabs.length){
  const groups=tabs.map(a=>$(a.getAttribute('href')));
  const spy=()=>{
    const y=scrollY+innerHeight*.3;let cur=-1;
    groups.forEach((g,i)=>{if(g&&g.offsetTop<=y)cur=i});
    tabs.forEach((a,i)=>{const on=i===cur;if(on&&!a.classList.contains('on')){const box=a.parentElement;box.scrollTo({left:a.offsetLeft-box.clientWidth/2+a.clientWidth/2,behavior:'smooth'})}a.classList.toggle('on',on)});
  };
  addEventListener('scroll',spy,{passive:true});spy();
}

/* pâtisserie hero rotation */
const ps=$('#pstage');
if(ps){
  const L=ps.dataset.imgs.split(',');let i=0;
  const add=()=>{const d=document.createElement('div');d.className='p e';d.innerHTML=`<img src="../img/cut/${L[i]}.webp" alt="">`;ps.appendChild(d);requestAnimationFrame(()=>requestAnimationFrame(()=>d.classList.remove('e')))};
  L.forEach(n=>new Image().src=`../img/cut/${n}.webp`);add();
  if(!reduce)setInterval(()=>{if(document.hidden)return;const prev=ps.querySelector('.p:not(.l)');prev.classList.add('l');setTimeout(()=>prev.remove(),1200);i=(i+1)%L.length;add()},5000);
}

/* réceptions parallax */
const ri=$('#recImg');
if(ri&&!reduce)addEventListener('scroll',()=>{const r=ri.parentElement.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)return;ri.style.transform=`translateY(${(r.top/innerHeight)*-8}%)`},{passive:true});

/* devis */
const typeEl=$('#type');
if(typeEl){
  const needsEl=$('#needs'),g=$('#guests');
  typeEl.addEventListener('click',e=>{if(e.target.tagName!=='BUTTON')return;[...typeEl.children].forEach(b=>b.classList.toggle('on',b===e.target));upd()});
  needsEl.addEventListener('click',e=>{if(e.target.tagName!=='BUTTON')return;e.target.classList.toggle('on');upd()});
  ['input','change'].forEach(ev=>['guests','date','city','name'].forEach(id=>$('#'+id).addEventListener(ev,upd)));
  const LG=document.documentElement.lang,I={
   fr:{ev:'Événement',g:n=>n+' personnes',d:'Date à définir',c:'Lieu à définir',nd:'À définir ensemble',loc:'fr-FR',m:(name,t,n,ds,city,needs)=>`Bonjour Gaston Gali,${name?' je suis '+name+'.':''} Je prépare : ${t}, environ ${n} invités, ${ds}, ${city}. Prestations souhaitées : ${needs||'à définir'}. Pouvez-vous me proposer un devis ? Merci.`},
   en:{ev:'Event',g:n=>n+' guests',d:'Date to be set',c:'Venue to be set',nd:'To be agreed together',loc:'en-GB',m:(name,t,n,ds,city,needs)=>`Hello Gaston Gali,${name?' my name is '+name+'.':''} I am planning: ${t}, about ${n} guests, ${ds}, ${city}. Services wanted: ${needs||'to be agreed'}. Could you send me a quote? Thank you.`},
   ar:{ev:'مناسبة',g:n=>n+' ضيفاً',d:'التاريخ يُحدَّد لاحقاً',c:'المكان يُحدَّد لاحقاً',nd:'نتفق عليها معاً',loc:'ar-MA-u-nu-latn',m:(name,t,n,ds,city,needs)=>`السلام عليكم غاستون غالي،${name?' أنا '+name+'.':''} أحضّر لـ: ${t}، حوالي ${n} ضيفاً، ${ds}، ${city}. الخدمات المطلوبة: ${needs||'نتفق عليها'}. هل يمكنكم إرسال عرض سعر؟ شكراً.`}
  }[LG]||null;
  const T=I||{ev:'Événement',g:n=>n+' personnes',d:'Date à définir',c:'Lieu à définir',nd:'À définir ensemble',loc:'fr-FR',m:null};
  function upd(){
    const t=typeEl.querySelector('.on')?.textContent||T.ev;
    const needs=[...needsEl.querySelectorAll('.on')].map(b=>b.textContent);
    const n=g.value;$('#gOut').textContent=n;g.style.setProperty('--p',((n-g.min)/(g.max-g.min)*100)+'%');
    const d=$('#date').value;
    const ds=d?new Date(d+'T12:00').toLocaleDateString(T.loc,{day:'numeric',month:'long',year:'numeric'}):T.d;
    const city=$('#city').value||T.c,name=$('#name').value;
    $('#sType').textContent=t;$('#sGuests').textContent=T.g(n);
    $('#sNeeds').textContent=needs.join(', ')||T.nd;$('#sWhen').textContent=ds+', '+city;
    const msg=T.m?T.m(name,t,n,ds,city,needs.join(', ')):`Bonjour Gaston Gali,${name?' je suis '+name+'.':''} Je prépare : ${t}, environ ${n} invités, ${ds}, ${city}. Prestations souhaitées : ${needs.join(', ')||'à définir'}. Pouvez-vous me proposer un devis ? Merci.`;
    $('#send').href='https://wa.me/212661392231?text='+encodeURIComponent(msg);
  }
  upd();
}
/* café : film de la maison */
const fv=$('.film video');
if(fv){
  const sb=$('.film-snd');
  if(reduce){fv.controls=true;fv.preload='metadata';sb&&sb.remove()}
  else{
    new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)fv.play().catch(()=>{});else fv.pause()}),{threshold:.35}).observe(fv);
    sb&&sb.addEventListener('click',()=>{fv.muted=!fv.muted;sb.setAttribute('aria-pressed',String(!fv.muted));sb.setAttribute('aria-label',fv.muted?sb.dataset.on:sb.dataset.off);if(!fv.muted)fv.play().catch(()=>{})});
  }
}
})();

/* header: logorij klapt in bij naar beneden scrollen (mobiel) */
(()=>{const nav=document.querySelector('.nav');if(!nav)return;let y=scrollY,t=0;
const f=()=>{t=0;const c=scrollY;if(!matchMedia('(max-width:820px)').matches){nav.classList.remove('min');y=c;return}
 if(c<60)nav.classList.remove('min');else if(c>y+6)nav.classList.add('min');else if(c<y-6)nav.classList.remove('min');y=c};
addEventListener('scroll',()=>{if(!t)t=requestAnimationFrame(f)},{passive:true})})();

/* taalkiezer: uitklapmenu */
(()=>{const names={fr:'Français',en:'English',ar:'العربية'};
const gl='<svg class="gl" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9.5"/><path d="M2.5 12h19M12 2.5c2.6 2.6 4 5.9 4 9.5s-1.4 6.9-4 9.5c-2.6-2.6-4-5.9-4-9.5s1.4-6.9 4-9.5z"/></svg>';
const ch='<svg class="ch" viewBox="0 0 10 10" aria-hidden="true"><path d="M1.5 3.5 5 7l3.5-3.5"/></svg>';
const groups=[...document.querySelectorAll('.nav .lang')];
const closeAll=()=>groups.forEach(g=>{g.classList.remove('open');const b=g.querySelector('.lang-btn');if(b)b.setAttribute('aria-expanded','false')});
groups.forEach((g,i)=>{const links=[...g.querySelectorAll('a')];if(!links.length)return;
 const cur=links.find(a=>a.classList.contains('on'))||links[0];
 const lab=g.getAttribute('aria-label')||'Language';
 const btn=document.createElement('button');btn.type='button';btn.className='lang-btn';
 btn.setAttribute('aria-haspopup','true');btn.setAttribute('aria-expanded','false');btn.setAttribute('aria-controls','lang-menu-'+i);
 btn.setAttribute('aria-label',lab+' : '+(names[cur.hreflang]||cur.textContent.trim()));
 btn.innerHTML=gl+'<span class="lb-t" data-l="'+cur.hreflang+'">'+cur.textContent.trim()+'</span>'+ch;
 const menu=document.createElement('div');menu.className='lang-menu';menu.id='lang-menu-'+i;
 links.forEach(a=>{a.textContent=names[a.hreflang]||a.textContent;a.setAttribute('lang',a.hreflang);menu.appendChild(a)});
 g.textContent='';g.append(btn,menu);g.classList.add('dd');
 btn.addEventListener('click',e=>{e.stopPropagation();const open=!g.classList.contains('open');closeAll();if(open){g.classList.add('open');btn.setAttribute('aria-expanded','true')}});
});
document.addEventListener('click',e=>{if(!e.target.closest('.lang'))closeAll()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){const o=groups.find(g=>g.classList.contains('open'));closeAll();if(o){const b=o.querySelector('.lang-btn');if(b)b.focus()}}});
addEventListener('scroll',closeAll,{passive:true});
})();
