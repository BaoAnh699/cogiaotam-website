/* Chế độ quản trị: chỉnh sửa bài học ngay trên trình duyệt (mở trang với #admin) */
function initEditor(){
const PIN='linggxinn'; // <-- ĐỔI MẬT KHẨU QUẢN TRỊ Ở ĐÂY
const KEY='linggxinn_hsk2_draft';
const L={title_zh:'Tiêu đề (Hán)',title_vi:'Tiêu đề (Việt)',description:'Mô tả',objectives:'Mục tiêu',warmup:'Khởi động',dialogues:'Bài khóa',title:'Tiêu đề',lines:'Các câu thoại',speaker:'Người nói',hanzi:'Hán tự',pinyin:'Pinyin',vietnamese:'Tiếng Việt',comprehension:'Hỏi đáp đọc hiểu',vocabulary:'Từ vựng',expansion_vocabulary:'Từ mở rộng',grammar:'Ngữ pháp',structure:'Cấu trúc',explanation:'Giải thích',examples:'Ví dụ',exercises:'Trắc nghiệm',exercises_full:'Bài tập mở rộng',fill_blanks:'Điền từ',word_bank:'Ngân hàng từ',sentences:'Câu',reorder:'Sắp xếp câu',chunks:'Các cụm từ',translation:'Dịch câu',qa:'Hỏi đáp',question:'Câu hỏi',options:'Lựa chọn',answer:'Đáp án',meaning:'Nghĩa',type:'Loại',images:'Hình ảnh',caption:'Chú thích',url:'Ảnh',example_zh:'Ví dụ (Hán)',example_py:'Ví dụ (Pinyin)',example_vi:'Ví dụ (Việt)',vi:'Tiếng Việt',zh:'Tiếng Trung',writing_prompt:'Đề viết'};
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
const get=(o,p)=>p.split('.').reduce((a,k)=>a[k],o);
const blank=v=>typeof v==='string'?'':typeof v==='number'?0:Array.isArray(v)?(v.length?[blank(v[0])]:[]):(v&&typeof v==='object')?Object.fromEntries(Object.entries(v).map(([k,x])=>[k,blank(x)])):v;
const clone=o=>JSON.parse(JSON.stringify(o));

// Bản nháp lưu trong trình duyệt (chỉ áp dụng nếu file gốc chưa đổi)
const sig=JSON.stringify([allLessons,specialLessons]).length;
try{const d=JSON.parse(localStorage.getItem(KEY)||'null');
 if(d&&d.sig===sig){allLessons.splice(0,allLessons.length,...d.a);specialLessons.splice(0,specialLessons.length,...d.s);}}catch(e){}
function persist(){try{localStorage.setItem(KEY,JSON.stringify({sig,a:allLessons,s:specialLessons}));}
 catch(e){alert('Bộ nhớ trình duyệt đã đầy. Hãy bấm "Tải file index.html" để lưu bản hiện tại.');}}
function loadJSZip(){return window.JSZip?Promise.resolve():new Promise((ok,no)=>{const e=document.createElement('script');e.src='https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';e.onload=ok;e.onerror=no;document.head.appendChild(e);});}
function refresh(){initNavigation();initHomeGrids();}

let adm=sessionStorage.getItem('hsk_adm')==='1', draft=null; const opened=new Set();
const bar=document.createElement('div');
bar.className='fixed bottom-4 right-4 z-[60] flex flex-col items-end gap-2 text-xs font-bold';
document.body.appendChild(bar);
const B=(t,a,c)=>`<button onclick="${a}" class="${c||'bg-white text-slate-700'} border shadow px-3 py-2 rounded-full hover:opacity-90">${t}</button>`;
function drawBar(){
 if(!adm){bar.innerHTML=location.hash==='#admin'?B('🔑 Đăng nhập quản trị','ED.login()','bg-slate-800 text-white'):'';return;}
 bar.innerHTML=B('✏️ Sửa bài đang mở','ED.edit()','bg-teal-700 text-white')+B('➕ Thêm bài mới','ED.add()')+B('🗑 Xóa bài đang mở','ED.del()')
 +B('💾 Tải bản cập nhật (.zip)','ED.dl()','bg-amber-400 text-slate-900')+B('📤 Xuất JSON','ED.exp()')+B('📥 Nhập JSON','document.getElementById(\'ed-imp\').click()')
 +B('↺ Bỏ thay đổi chưa lưu file','ED.reset()')+B('Đăng xuất','ED.logout()')
 +'<input id="ed-imp" type="file" accept=".json" hidden onchange="ED.imp(this.files[0])">';
}
addEventListener('hashchange',drawBar);

const modal=document.createElement('div');
modal.id='ed-modal';modal.className='hidden fixed inset-0 z-[70] bg-black/60 flex items-center justify-center p-3';
modal.innerHTML=`<div class="bg-slate-50 w-full max-w-4xl h-[92vh] rounded-2xl flex flex-col shadow-2xl">
<div class="flex items-center justify-between gap-2 p-4 border-b bg-white rounded-t-2xl"><h3 id="ed-title" class="font-bold text-slate-900 text-sm"></h3>
<div class="flex gap-2"><button onclick="ED.cancel()" class="px-4 py-2 rounded-lg bg-slate-200 text-xs font-bold">Hủy</button><button onclick="ED.save()" class="px-4 py-2 rounded-lg bg-teal-700 text-white text-xs font-bold">Lưu</button></div></div>
<div id="ed-body" class="flex-1 overflow-auto p-4 space-y-2"></div></div>`;
document.body.appendChild(modal);
const body=modal.querySelector('#ed-body');

const ctl=(p,i,len)=>`<span class="flex gap-1">${i>0?`<button data-a="up" data-p="${p}" data-i="${i}" class="px-1.5 bg-slate-200 rounded">↑</button>`:''}${i<len-1?`<button data-a="down" data-p="${p}" data-i="${i}" class="px-1.5 bg-slate-200 rounded">↓</button>`:''}<button data-a="del" data-p="${p}" data-i="${i}" class="px-1.5 bg-red-100 text-red-700 rounded">✕ Xóa</button></span>`;
const det=(p,lab,inner)=>`<details data-p="${p}" ${opened.has(p)?'open':''} class="border rounded-xl bg-white"><summary class="cursor-pointer px-3 py-2 text-xs font-bold text-teal-800">${lab}</summary><div class="p-3 space-y-2">${inner}</div></details>`;
function node(v,path,key){
 const p=path.join('.'),lab=L[key]||key;
 if(key==='images'&&Array.isArray(v)){
  return det(p,`${lab} (${v.length})`,`<div class="grid grid-cols-2 sm:grid-cols-3 gap-3">${v.map((im,i)=>`<div class="border rounded-lg p-2 bg-slate-50 space-y-1.5"><img src="${esc(im.url)}" class="w-full h-28 object-contain bg-white rounded"><input data-f="${p}.${i}.caption" value="${esc(im.caption||'')}" placeholder="Chú thích" class="w-full border rounded px-2 py-1 text-xs"><div class="flex justify-end text-[11px] font-bold">${ctl(p,i,v.length)}</div></div>`).join('')}
  <label class="border-2 border-dashed border-teal-400 rounded-lg flex items-center justify-center min-h-[10rem] cursor-pointer text-teal-700 font-bold text-sm">+ Thêm ảnh<input type="file" accept="image/*" multiple hidden data-img="${p}"></label></div>`);
 }
 if(Array.isArray(v)){
  return det(p,`${lab} (${v.length})`,v.map((it,i)=>`<div class="border rounded-lg p-2 bg-slate-50 space-y-2"><div class="flex justify-between items-center text-[11px] font-bold text-slate-500"><span>#${i+1}</span>${ctl(p,i,v.length)}</div>${node(it,[...path,i],'#'+(i+1))}</div>`).join('')
   +`<button data-a="add" data-p="${p}" class="text-xs font-bold text-teal-700 bg-teal-50 px-3 py-1.5 rounded-lg">+ Thêm mục</button>`);
 }
 if(v&&typeof v==='object') return det(p,lab,Object.keys(v).map(k=>node(v[k],[...path,k],k)).join(''));
 const num=typeof v==='number',long=String(v).length>60||/description|explanation|writing_prompt/.test(key);
 const dis=p==='id'?'disabled':'';
 return `<label class="block"><span class="text-[11px] font-bold text-slate-500">${esc(lab)}</span>${long?`<textarea data-f="${p}" rows="3" class="w-full border rounded-lg px-2 py-1.5 text-sm">${esc(v)}</textarea>`:`<input data-f="${p}" ${dis} type="${num?'number':'text'}" value="${esc(v)}" class="w-full border rounded-lg px-2 py-1.5 text-sm ${dis?'bg-slate-100':''}">`}</label>`;
}
function draw(){const s=body.scrollTop;body.innerHTML=Object.keys(draft).map(k=>node(draft[k],[k],k)).join('');body.scrollTop=s;}
body.addEventListener('toggle',e=>{const p=e.target.dataset.p;if(!p)return;e.target.open?opened.add(p):opened.delete(p);},true);
body.addEventListener('input',e=>{const f=e.target.dataset.f;if(!f)return;const ps=f.split('.'),last=ps.pop(),o=ps.length?get(draft,ps.join('.')):draft;
 o[last]=e.target.type==='number'?Number(e.target.value):e.target.value;});
body.addEventListener('click',e=>{const b=e.target.closest('[data-a]');if(!b)return;const a=b.dataset.a,arr=get(draft,b.dataset.p),i=+b.dataset.i;
 if(a==='add')arr.push(arr.length?blank(arr[arr.length-1]):'');
 else if(a==='del'){if(!confirm('Xóa mục này?'))return;arr.splice(i,1);}
 else{const j=a==='up'?i-1:i+1;[arr[i],arr[j]]=[arr[j],arr[i]];}
 draw();});
body.addEventListener('change',async e=>{const p=e.target.dataset.img;if(!p)return;const arr=get(draft,p);
 for(const f of e.target.files)arr.push({url:await shrink(f),caption:f.name.replace(/\.[^.]+$/,'')});draw();});
function shrink(f){return new Promise(res=>{const r=new FileReader();r.onload=()=>{const im=new Image();im.onload=()=>{
 const s=Math.min(1,1400/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=im.width*s;c.height=im.height*s;
 const x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);x.drawImage(im,0,0,c.width,c.height);res(c.toDataURL('image/jpeg',.82));};im.src=r.result;};r.readAsDataURL(f);});}

const inLesson=()=>currentLesson&&!document.getElementById('lesson-page').classList.contains('hidden');
const reopen=id=>isSpecialLesson?openSpecialLesson(id):openLesson(id);
function openEditor(){
 draft=clone(currentLesson);if(Array.isArray(draft.images))draft.images=draft.images.map(i=>typeof i==='string'?{url:i,caption:''}:i);
 document.getElementById('ed-title').textContent='Chỉnh sửa: '+(draft.title_vi||draft.title_zh);draw();modal.classList.remove('hidden');
}

window.ED={
 login(){if(prompt('Nhập mật khẩu quản trị:')===PIN){adm=true;sessionStorage.setItem('hsk_adm','1');drawBar();}else alert('Sai mật khẩu.');},
 logout(){adm=false;sessionStorage.removeItem('hsk_adm');drawBar();},
 edit(){if(!inLesson())return alert('Hãy mở một bài học trước, rồi bấm "Sửa bài đang mở".');openEditor();},
 cancel(){if(confirm('Bỏ các thay đổi trong cửa sổ này?'))modal.classList.add('hidden');},
 save(){const arr=isSpecialLesson?specialLessons:allLessons,i=arr.findIndex(l=>l.id===currentLesson.id);arr[i]=draft;persist();refresh();reopen(draft.id);modal.classList.add('hidden');},
 add(){const t=blank(allLessons[0]);t.id=Math.max(...allLessons.map(l=>l.id))+1;t.title_zh='新课';t.title_vi='Bài mới (chưa đặt tên)';t.images=[];
  allLessons.push(t);persist();refresh();openLesson(t.id);openEditor();},
 del(){if(!inLesson())return alert('Hãy mở bài học muốn xóa trước.');
  if(!confirm('Xóa hẳn bài "'+(currentLesson.title_vi||currentLesson.title_zh)+'"?'))return;
  const arr=isSpecialLesson?specialLessons:allLessons;arr.splice(arr.indexOf(currentLesson),1);persist();refresh();goHome();},
 async dl(){
  try{await loadJSZip();}catch(e){return alert('Không tải được thư viện JSZip (cần kết nối Internet).');}
  const zip=new JSZip(),A=clone(allLessons),S=clone(specialLessons),stamp=Date.now().toString(36);let n=0;
  const pack=(list,prefix)=>list.forEach(l=>(l.images||[]).forEach(im=>{
   if(im&&typeof im==='object'&&String(im.url).startsWith('data:')){
    const path='assets/images/lessons/'+prefix+'-'+l.id+'-'+stamp+'-'+(++n)+'.jpg';
    zip.file(path,im.url.split(',')[1],{base64:true});im.url=path;}}));
  pack(A,'lesson');pack(S,'review');
  zip.file('data/lessons.json',JSON.stringify(A,null,2)+'\n');zip.file('data/special-lessons.json',JSON.stringify(S,null,2)+'\n');
  const a=document.createElement('a');a.href=URL.createObjectURL(await zip.generateAsync({type:'blob'}));a.download='hsk2-cap-nhat.zip';a.click();
  alert('Đã tải gói cập nhật. Giải nén và chép đè vào thư mục dự án (data/ và assets/), rồi commit lên GitHub.');},
 exp(){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify({allLessons,specialLessons})],{type:'application/json'}));a.download='hsk2-data.json';a.click();},
 async imp(f){if(!f)return;try{const d=JSON.parse(await f.text());if(!Array.isArray(d.allLessons)||!Array.isArray(d.specialLessons))throw 0;
  allLessons.splice(0,allLessons.length,...d.allLessons);specialLessons.splice(0,specialLessons.length,...d.specialLessons);persist();refresh();goHome();}
  catch(e){alert('File JSON không hợp lệ.');}},
 reset(){if(confirm('Xóa bản nháp trong trình duyệt và quay về dữ liệu trong file hiện tại?')){localStorage.removeItem(KEY);location.reload();}}
};
drawBar();
}
