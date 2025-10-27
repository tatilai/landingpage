(function () {
  function runIO() {
    const els = document.querySelectorAll('[data-io]');
    if (!els.length) return;

    // Fallback para navegadores sin IntersectionObserver
    if (!('IntersectionObserver' in window)) {
      els.forEach(el => el.classList.add('in-view'));
      return;
    }

    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in-view');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.2 });

    els.forEach(el => io.observe(el));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runIO);
  } else {
    runIO();
  }
})();

(function(){
  const root  = document.getElementById('screensSlider2');
  if(!root) return;

  const track = root.querySelector('.ss2-track');
  const pages = Array.from(root.querySelectorAll('.ss2-page'));
  const prev  = root.querySelector('.ss2-prev');
  const next  = root.querySelector('.ss2-next');
  const dotsW = root.querySelector('.ss2-dots');

  let index = 0;
  let timer = null;
  const AUTOPLAY_MS = 5000;

  // Dots
  pages.forEach((_,i)=>{
    const b = document.createElement('button');
    b.setAttribute('aria-label','Ir a página ' + (i+1));
    b.addEventListener('click', ()=>goTo(i,true));
    dotsW.appendChild(b);
  });

  function update(){
    track.style.transform = `translateX(${-index * 100}%)`;
    dotsW.querySelectorAll('button').forEach((d,i)=>d.classList.toggle('is-active', i===index));
  }
  function goTo(i, stopAuto=false){
    index = (i + pages.length) % pages.length;
    update();
    if(stopAuto) restartAutoplay();
  }
  function nextPage(){ goTo(index+1); }
  function prevPage(){ goTo(index-1); }

  prev.addEventListener('click', prevPage);
  next.addEventListener('click', nextPage);

  // teclado
  root.addEventListener('keydown', (e)=>{
    if(e.key === 'ArrowRight') nextPage();
    if(e.key === 'ArrowLeft')  prevPage();
  });
  root.setAttribute('tabindex','0');

  // autoplay (pausa en hover/focus)
  function startAutoplay(){ stopAutoplay(); timer=setInterval(nextPage, AUTOPLAY_MS); }
  function stopAutoplay(){ if(timer){ clearInterval(timer); timer=null; } }
  function restartAutoplay(){ stopAutoplay(); startAutoplay(); }
  root.addEventListener('mouseenter', stopAutoplay);
  root.addEventListener('mouseleave', startAutoplay);
  root.addEventListener('focusin',  stopAutoplay);
  root.addEventListener('focusout', startAutoplay);

  // swipe
  let startX=0, dx=0, drag=false;
  root.addEventListener('pointerdown', e=>{ drag=true; startX=e.clientX; track.style.transition='none'; });
  root.addEventListener('pointermove', e=>{
    if(!drag) return;
    dx = e.clientX - startX;
    track.style.transform = `translateX(calc(${-index*100}% + ${dx}px))`;
  });
  const endDrag = ()=>{
    if(!drag) return;
    drag=false; track.style.transition='';
    if(Math.abs(dx)>60){ dx<0 ? nextPage() : prevPage(); } else { update(); }
    dx=0; restartAutoplay();
  };
  root.addEventListener('pointerup', endDrag);
  root.addEventListener('pointerleave', endDrag);
  root.addEventListener('pointercancel', endDrag);

  // init
  update();
  startAutoplay();
})();


document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav-links");
  const links = document.querySelectorAll(".nav-links a");

  // menú hamburguesa
  toggle.addEventListener("click", () => {
    nav.classList.toggle("open");
  });

  // cerrar menú al hacer click en un link
  links.forEach(link => {
    link.addEventListener("click", () => nav.classList.remove("open"));
  });

  // scroll suave
  links.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
});