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
const wa=$('.wa');if(wa){const f=()=>wa.classList.toggle('hide',scrollY<300);addEventListener('scroll',f,{passive:true});f()}

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
  function upd(){
    const t=typeEl.querySelector('.on')?.textContent||'Événement';
    const needs=[...needsEl.querySelectorAll('.on')].map(b=>b.textContent);
    const n=g.value;$('#gOut').textContent=n;g.style.setProperty('--p',((n-g.min)/(g.max-g.min)*100)+'%');
    const d=$('#date').value;
    const ds=d?new Date(d+'T12:00').toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'}):'Date à définir';
    const city=$('#city').value||'Lieu à définir',name=$('#name').value;
    $('#sType').textContent=t;$('#sGuests').textContent=n+' personnes';
    $('#sNeeds').textContent=needs.join(', ')||'À définir ensemble';$('#sWhen').textContent=ds+', '+city;
    const msg=`Bonjour Gaston Gali,${name?' je suis '+name+'.':''} Je prépare : ${t}, environ ${n} invités, ${ds}, ${city}. Prestations souhaitées : ${needs.join(', ')||'à définir'}. Pouvez-vous me proposer un devis ? Merci.`;
    $('#send').href='https://wa.me/212661392231?text='+encodeURIComponent(msg);
  }
  upd();
}
})();
