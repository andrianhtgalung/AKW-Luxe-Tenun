const $=id=>document.getElementById(id),$$=s=>[...document.querySelectorAll(s)];
// Nomor WhatsApp penjual (ubah di sini). Format internasional tanpa + atau 0 di depan.
const WA="https://wa.me/6282284374150?text=";
const R="#a8141c",K="#1b1515",P="#f6f1ec",G="#c9992f",B="#1f3a5f";

// DAFTAR KAIN: ubah di sini
// code = kode, n = nama, c = kategori (harian / adat / aksesori)
// m = motif (p1 garis, p2 belah ketupat, p3 garis emas, p4 kotak)
// a, b, k = tiga warna motif, d = deskripsi, u = cocok untuk apa
// img = FOTO KAIN (boleh dikosongkan). Taruh file foto di folder "gambar", lalu tulis namanya, contoh:
//   img:"gambar/sarung-01.jpg"
// Untuk beberapa foto sekaligus (foto pertama jadi sampul), pakai daftar, contoh:
//   img:["gambar/sarung-01.jpg","gambar/sarung-01-dekat.jpg"]
// Kalau img tidak diisi, atau nama file salah, kain tampil dengan motif seperti biasa.
const items=[
 {code:"SS-01",n:"Sakkut Marudang 1",img:"gambar/sarung.jpg",c:"adat",m:"p1",a:R,b:K,k:P,d:"Garis tegas merah dan hitam dengan benang putih tipis.",u:"Cocok untuk acara keluarga dan pemakaian sehari-hari."},
 {code:"SS-02",n:"Sakkut Marudang 2",img:"gambar/sarung2.jpg",c:"adat",m:"p2",a:R,b:K,k:G,d:"Pola belah ketupat bertingkat dengan garis emas.",u:"Cocok untuk upacara adat dan pesta."},
 {code:"SS-03",n:"Sakkut Marudang 3",img:"gambar/sarung.jpg",c:"adat",m:"p3",a:R,b:K,k:G,d:"Pita emas di atas dasar merah dan hitam.",u:"Cocok untuk pernikahan dan penyambutan tamu."},
 {code:"SL-04",n:"Sakkut Marudang 4",img:"gambar/sarung2.jpg",c:"adat",m:"p4",a:R,b:P,k:K,d:"Selendang ringan bermotif kotak kecil.",u:"Pelengkap busana adat maupun busana harian."},
 {code:"GT-05",n:"Sakkut Marudang 5",img:"gambar/sarung.jpg",c:"adat",m:"p1",a:K,b:R,k:G,d:"Penutup kepala pria pelengkap pakaian adat.",u:"Dipakai pada acara adat."},
 {code:"SS-06",n:"Sakkut Marudang 6",img:"gambar/sarung2.jpg",c:"adat",m:"p2",a:B,b:K,k:P,d:"Motif tradisional dengan warna biru tua.",u:"Cocok untuk gaya kasual."}
];
const photos=i=>i.bad?[]:[].concat(i.img||[]).filter(Boolean);
const cat={harian:"Harian",adat:"Adat",aksesori:"Aksesori"};
const reduce=matchMedia("(prefers-reduced-motion:reduce)").matches;

let fav=new Set(),cur=null;
try{fav=new Set(JSON.parse(localStorage.getItem("fav-ss")||"[]").filter(x=>items[x]))}catch(e){}
function save(){try{localStorage.setItem("fav-ss",JSON.stringify([...fav]))}catch(e){}}
function sw(el,i,aOverride){el.classList.add("pt",i.m);el.style.setProperty("--a",aOverride||i.a);el.style.setProperty("--b",i.b);el.style.setProperty("--c",i.k)}
const NS="http://www.w3.org/2000/svg";

/* ---------- hiasan gorga: spiral dan cincin belah ketupat ---------- */
function spiral(svg,turns,flip){
 let d="";const n=turns*36;
 for(let i=0;i<=n;i++){const t=i/n,ang=t*turns*Math.PI*2,r=6+t*84;
  const x=100+Math.cos(ang)*r,y=100+Math.sin(ang)*r;d+=(i?"L":"M")+x.toFixed(1)+" "+y.toFixed(1)}
 const p=document.createElementNS(NS,"path");p.setAttribute("d",d);svg.appendChild(p);
 const c=document.createElementNS(NS,"circle");c.setAttribute("cx",100);c.setAttribute("cy",100);c.setAttribute("r",3);svg.appendChild(c);
}
spiral($("sp1"),3.2);spiral($("sp2"),3);spiral($("sp3"),2.4);
(function(){const g=$("ring");let s="";
 for(let i=0;i<24;i++){const a=i/24*360;s+='<path transform="rotate('+a+' 320 170) translate(320 12)" d="M0 0 l6 9 l-6 9 l-6 -9z"/>'}
 g.innerHTML=s})();

/* ---------- teks berjalan ---------- */
const tk=items.map(i=>"<span>"+i.n+"</span>").join("");
$("tk").innerHTML=tk+tk+tk+tk;

/* ---------- navigasi ---------- */
const burger=$("burger"),menu=$("menu");
burger.onclick=()=>{const o=menu.classList.toggle("open");burger.setAttribute("aria-expanded",o);burger.setAttribute("aria-label",o?"Tutup menu":"Buka menu")};
$$("#menu a").forEach(a=>a.addEventListener("click",()=>{menu.classList.remove("open");burger.setAttribute("aria-expanded",false)}));
const secs=["koleksi","proses"].map($);
function onScroll(){
 const h=document.documentElement;
 $("prog").style.width=(h.scrollTop/(h.scrollHeight-h.clientHeight)*100||0)+"%";
 let on=null;secs.forEach(s=>{if(s.getBoundingClientRect().top<innerHeight*.4)on=s.id});
 $$("#menu a").forEach(a=>a.classList.toggle("on",a.getAttribute("href")==="#"+on));
}
addEventListener("scroll",onScroll,{passive:true});onScroll();

/* ---------- parallax rumah adat ---------- */
const art=$("art");
if(!reduce)document.addEventListener("pointermove",e=>{
 const x=e.clientX/innerWidth-.5,y=e.clientY/innerHeight-.5;
 art.querySelector(".house").style.transform="rotateY("+x*8+"deg) rotateX("+(-y*6)+"deg)";
 $("sp1").style.transform="translate("+x*-24+"px,"+y*-24+"px)";
 $("sp3").style.transform="translate("+x*18+"px,"+y*18+"px)";
});

/* ---------- kartu koleksi ---------- */
items.forEach((i,x)=>{
 const a=document.createElement("article");a.className="card rv";
 a.innerHTML='<div class="fabric"><div class="pat"></div><span class="code">'+i.code+'</span></div>'+
 '<div class="cbody"><span class="tag">'+cat[i.c]+'</span><h3>'+i.n+'</h3><p>'+i.d+'</p>'+
 '<div class="crow"><button class="btn main open">Lihat dari dekat</button><button class="fav" aria-pressed="false" aria-label="Tandai favorit '+i.n+'">♥</button></div></div>';
 sw(a.querySelector(".pat"),i);
 const cover=photos(i)[0];
 if(cover){
  const f=a.querySelector(".fabric"),im=new Image();
  im.className="pic";im.alt=i.n;im.loading="lazy";im.decoding="async";
  im.onload=()=>f.classList.add("has-img");
  im.onerror=()=>{im.remove();i.bad=true;f.classList.remove("has-img")};
  f.prepend(im);im.src=cover;
 }
 a.querySelector(".open").onclick=()=>openD(x);
 a.querySelector(".fav").onclick=()=>tog(x);
 a.querySelector(".fabric").onclick=e=>{if(e.target.closest(".fabric"))openD(x)};
 a.querySelector(".fabric").style.cursor="zoom-in";
 i.el=a;$("grid").appendChild(a);
});
["semua","harian","adat","aksesori"].forEach((f,x)=>{
 const b=document.createElement("button");b.textContent=f[0].toUpperCase()+f.slice(1);b.setAttribute("aria-pressed",x===0);
 b.onclick=()=>{$$("#flt button").forEach(y=>y.setAttribute("aria-pressed",y===b));let n=0;
  items.forEach(i=>{const s=f==="semua"||i.c===f;i.el.hidden=!s;if(s)n++});count(n)};
 $("flt").appendChild(b)});
function count(n){$("cnt").textContent=n+" kain tersedia. Ketuk untuk melihat dari dekat."}
count(items.length);

/* ---------- favorit ---------- */
function tog(x){fav.has(x)?fav.delete(x):fav.add(x);save();sync(true)}
function sync(pulse){
 items.forEach((i,x)=>i.el.querySelector(".fav").setAttribute("aria-pressed",fav.has(x)));
 $("favc").textContent=fav.size;
 if(pulse){$("favn").classList.remove("bump");void $("favn").offsetWidth;$("favn").classList.add("bump")}
 const l=[...fav].map(x=>items[x].n);
 $("favtxt").textContent=l.length?"Kain pilihanmu sudah siap dikirim ke penjual:":"Pilih sarung yang kamu suka, lalu kirim daftarnya ke penjual lewat WhatsApp.";
 $("favlist").innerHTML=l.map(n=>"<span>"+n+"</span>").join("");
 $("wa").href=WA+encodeURIComponent(l.length?"Horas! Saya tertarik dengan: "+l.join(", ")+". Mohon info ketersediaan dan harga.":"Horas! Saya ingin bertanya tentang sarung Simalungun.");
 if(cur!=null)$("dfav").textContent=fav.has(cur)?"♥ Hapus dari favorit":"♡ Tambah ke favorit";
}
sync();

/* ---------- tampilan detail ---------- */
const fab=$("fab"),fin=$("fin"),stg=$("stg"),thumbs=$("thumbs"),zm=$("zm");
let photo=null; // elemen <img> yang sedang tampil (jika kain punya foto)
function showPattern(i){
 photo=null;fab.classList.remove("photo");fin.className="fin";fin.innerHTML="";fin.style.cssText="";
 sw(fin,i);fin.style.setProperty("--s","24px");
 zm.min=12;zm.max=48;zm.step=1;zm.value=24;$("zml").textContent="Perbesar serat kain";
}
function showPhoto(i,src){
 fab.classList.add("photo");fin.className="fin";fin.style.cssText="";fin.innerHTML="";
 photo=new Image();photo.alt=i.n;photo.decoding="async";
 photo.onerror=()=>{if(cur!=null&&items[cur]===i){i.bad=true;thumbs.hidden=true;showPattern(i)}};
 photo.src=src;fin.appendChild(photo);
 zm.min=100;zm.max=250;zm.step=5;zm.value=100;$("zml").textContent="Perbesar foto";
}
function openD(x){
 cur=x;const i=items[x],ph=photos(i);
 fab.style.transform="";
 if(ph.length)showPhoto(i,ph[0]);else showPattern(i);
 // deretan foto kecil bila ada lebih dari satu
 thumbs.innerHTML="";thumbs.hidden=ph.length<2;
 if(ph.length>1)ph.forEach((src,k)=>{
  const b=document.createElement("button");b.className="th";b.setAttribute("aria-label","Foto "+(k+1)+" dari "+ph.length);b.setAttribute("aria-pressed",k===0);
  const im=new Image();im.alt="";im.src=src;b.appendChild(im);
  im.onerror=()=>b.remove();
  b.onclick=()=>{[...thumbs.children].forEach(y=>y.setAttribute("aria-pressed",y===b));showPhoto(i,src)};
  thumbs.appendChild(b);
 });
 $("dc").textContent=cat[i.c]+" · "+i.code;$("dt").textContent=i.n;$("dd").textContent=i.d;$("du").textContent=i.u;
 $("dwa").href=WA+encodeURIComponent("Horas! Saya ingin bertanya tentang "+i.n+" ("+i.code+").");
 sync();$("dlg").showModal();
}
stg.addEventListener("pointermove",e=>{if(reduce)return;const r=stg.getBoundingClientRect(),px=(e.clientX-r.left)/r.width-.5,py=(e.clientY-r.top)/r.height-.5;
 fab.style.transform="rotateY("+px*28+"deg) rotateX("+(-py*28)+"deg)"});
stg.addEventListener("pointerleave",()=>fab.style.transform="");
zm.oninput=e=>{
 if(photo)photo.style.transform="scale("+e.target.value/100+")";
 else fin.style.setProperty("--s",e.target.value+"px");
};
// saat foto diperbesar, bagian yang ditunjuk kursor ikut mendekat
fin.addEventListener("pointermove",e=>{if(!photo)return;const r=fin.getBoundingClientRect();
 photo.style.transformOrigin=((e.clientX-r.left)/r.width*100)+"% "+((e.clientY-r.top)/r.height*100)+"%"});
$("dfav").onclick=()=>tog(cur);$("dx").onclick=()=>$("dlg").close();
$("dlg").addEventListener("click",e=>{if(e.target===$("dlg"))$("dlg").close()});
$("dlg").addEventListener("close",()=>{cur=null});


/* ---------- animasi muncul saat scroll ---------- */
const io=new IntersectionObserver(es=>es.forEach(e=>{
 if(!e.isIntersecting)return;
 const t=e.target;
 if(t.classList.contains("step")){setTimeout(()=>t.classList.add("on"),$$(".step").indexOf(t)*220)}
 else t.classList.add("in");
 io.unobserve(t);
}),{threshold:.2});
$$(".card,.step,.sec-head").forEach((el,x)=>{if(!el.classList.contains("step")){el.classList.add("rv");el.style.transitionDelay=el.classList.contains("card")?(x%3)*90+"ms":"0ms"}io.observe(el)});
