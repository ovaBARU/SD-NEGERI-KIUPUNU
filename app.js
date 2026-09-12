const KEY='kiupunu_school_v3';const ADMIN_SESSION='kiupunu_admin_session';const ADMIN_USER='admin';const ADMIN_PASS='admin123';let isAdmin=sessionStorage.getItem(ADMIN_SESSION)==='1';const state={headers:[],rows:[],filtered:[],page:1,pageSize:15,school:{},principal:{},teachers:[],staff:[],facilities:[]};const $=id=>document.getElementById(id),norm=s=>String(s??'').trim().toLowerCase(),esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
const schoolFields=[['nama','Nama Sekolah'],['npsn','NPSN'],['nss','NSS/NIS'],['jenjang','Jenjang'],['status','Status Sekolah'],['akreditasi','Akreditasi'],['alamat','Alamat'],['desa','Desa/Kelurahan'],['kecamatan','Kecamatan'],['kabupaten','Kabupaten/Kota'],['provinsi','Provinsi'],['kodepos','Kode Pos'],['telepon','Telepon'],['email','Email'],['website','Website'],['kurikulum','Kurikulum'],['tahunBerdiri','Tahun Berdiri'],['kodeSekolah','Kode Sekolah'],['rekening','Nomor Rekening Sekolah']];const principalFields=[['nama','Nama Kepala Sekolah'],['nip','NIP'],['nuptk','NUPTK'],['pangkat','Pangkat/Golongan'],['pendidikan','Pendidikan Terakhir'],['tmt','TMT Kepala Sekolah'],['periode','Periode Tugas'],['telepon','No. Telepon'],['email','Email']];
function toast(m){$('toast').textContent=m;$('toast').classList.add('show');setTimeout(()=>$('toast').classList.remove('show'),2300)}function saveAll(){localStorage.setItem(KEY,JSON.stringify(state))}function load(){try{const x=JSON.parse(localStorage.getItem(KEY)||'{}');Object.assign(state,x);state.school??={};state.principal??={};state.teachers??=[];state.staff??=[];state.facilities??=[];state.headers??=[];state.rows??=[]}catch(e){}renderAll()}
function findHeader(q){return state.headers.find(h=>norm(h).includes(norm(q)))||''}function getGroups(){const rb=findHeader('Rombel Saat Ini'),g={};state.rows.forEach(r=>{const k=String(r[rb]||'Tidak diisi').trim()||'Tidak diisi';g[k]=(g[k]||0)+1});return Object.entries(g).sort((a,b)=>a[0].localeCompare(b[0],undefined,{numeric:true}))}
function dashboard(){const a=getGroups();$('total').textContent=state.rows.length;$('teacherCount').textContent=state.teachers.length;$('staffCount').textContent=state.staff.length;$('facilityCount').textContent=state.facilities.length;$('dashSchoolName').textContent=state.school.nama||'SD Negeri Kiupunu';$('dashNpsn').textContent=state.school.npsn?`NPSN ${state.school.npsn}`:'Profil Sekolah';const required=[['Identitas Sekolah',!!state.school.nama],['Kepala Sekolah',!!state.principal.nama],['Data Guru',state.teachers.length>0],['Tenaga Kependidikan',state.staff.length>0],['Sarana & Prasarana',state.facilities.length>0],['Peserta Didik',state.rows.length>0]];const pct=Math.round(required.filter(x=>x[1]).length/required.length*100);$('profilePercent').textContent=pct+'%';$('profileBar').style.width=pct+'%';$('profileChecks').innerHTML=required.map(x=>`<span class="check ${x[1]?'ok':''}">${x[1]?'✓':'○'} ${x[0]}</span>`).join('');const cc=$('classCards');if(!a.length)cc.innerHTML='<div class="empty-card">Belum ada data siswa.</div>';else{const max=Math.max(...a.map(x=>x[1]));cc.innerHTML=a.map(([n,c])=>`<div class="class-card"><b>${esc(n)}</b><span>${c} siswa</span><div class="mini-bar"><i style="width:${Math.round(c/max*100)}%"></i></div></div>`).join('')}}
function formHTML(fields,data){return fields.map(([k,l])=>`<label class="field-input"><span>${l}</span><input data-field="${k}" value="${esc(data[k]||'')}" placeholder="${l}"></label>`).join('')}
function renderForms(){
$('schoolForm').innerHTML=formHTML(schoolFields,state.school);
$('principalForm').innerHTML=formHTML(principalFields,state.principal);
document.querySelectorAll('#schoolForm input,#principalForm input').forEach(e=>e.readOnly=!isAdmin);
}function readForm(id){const o={};document.querySelectorAll(`#${id} [data-field]`).forEach(e=>o[e.dataset.field]=e.value.trim());return o}
function rowTable(type){
const arr=state[type],body=$(type==='teachers'?'teacherBody':'staffBody');
body.innerHTML=arr.map((x,i)=>`<tr><td>${i+1}</td><td class="name">${esc(x.nama)}</td><td>${esc(x.nip||x.nuptk)}</td><td>${esc(x.jabatan||x.mapel)}</td><td>${esc(x.status)}</td><td>${isAdmin?`<button class="linkbtn" onclick="editPerson('${type}',${i})">Edit</button> <button class="dangerbtn" onclick="removeItem('${type}',${i})">Hapus</button>`:'<span class="muted">Publik</span>'}</td></tr>`).join('')||`<tr><td colspan="6" class="empty-row">Belum ada data.</td></tr>`}
function renderFacilities(){
const b=$('facilityBody');
b.innerHTML=state.facilities.map((x,i)=>`<tr><td>${i+1}</td><td class="name">${esc(x.nama)}</td><td>${esc(x.kategori)}</td><td>${esc(x.jumlah)}</td><td>${esc(x.kondisi)}</td><td>${esc(x.lokasi)}</td><td>${isAdmin?`<button class="linkbtn" onclick="editFacility(${i})">Edit</button> <button class="dangerbtn" onclick="removeItem('facilities',${i})">Hapus</button>`:'<span class="muted">Publik</span>'}</td></tr>`).join('')||'<tr><td colspan="7" class="empty-row">Belum ada data sarana prasarana.</td></tr>'}
function renderData(){filters();const q=norm($('search').value),rb=findHeader('Rombel Saat Ini'),name=findHeader('Nama'),nipd=findHeader('NIPD'),nisn=findHeader('NISN'),nik=findHeader('NIK'),cf=$('classFilter').value;state.filtered=state.rows.filter(r=>(!q||[r[name],r[nipd],r[nisn],r[nik]].some(v=>norm(v).includes(q)))&&(!cf||String(r[rb]||'')===cf));const pages=Math.max(1,Math.ceil(state.filtered.length/state.pageSize));state.page=Math.min(state.page,pages);const start=(state.page-1)*state.pageSize,p=state.filtered.slice(start,start+state.pageSize);$('tbody').innerHTML=p.map((r,i)=>`<tr><td>${start+i+1}</td><td class="name">${esc(r[name])}</td><td>${esc(r[nipd])}</td><td>${esc(r[nisn])}</td><td>${esc(r[findHeader('JK')])}</td><td>${esc(r[rb])}</td><td><button class="linkbtn" onclick='showDetail(${JSON.stringify(r).replace(/'/g,"&#039;")})'>Detail</button></td></tr>`).join('')||'<tr><td colspan="7" class="empty-row">Tidak ada data.</td></tr>';$('countInfo').textContent=`${state.filtered.length} data • halaman ${state.page}/${pages}`;$('prev').disabled=state.page<=1;$('next').disabled=state.page>=pages}
function filters(){const rb=findHeader('Rombel Saat Ini'),cur=$('classFilter').value,vals=[...new Set(state.rows.map(r=>String(r[rb]||'').trim()).filter(Boolean))].sort((a,b)=>a.localeCompare(b,undefined,{numeric:true}));$('classFilter').innerHTML='<option value="">Semua Rombel</option>'+vals.map(v=>`<option value="${esc(v)}">${esc(v)}</option>`).join('');if(vals.includes(cur))$('classFilter').value=cur}
function showDetail(r){$('detail').innerHTML=`<div class="detail-head"><h2>${esc(r[findHeader('Nama')]||'Data Siswa')}</h2><p>Detail lengkap peserta didik</p></div><div class="detail-grid">${state.headers.map(h=>`<div class="field"><label>${esc(h)}</label><b>${esc(r[h])||'—'}</b></div>`).join('')}</div>`;$('modal').classList.remove('hidden')}
function editPerson(type,i){if(!requireAdmin())return;const x=state[type][i];const fields=type==='teachers'?[['nama','Nama'],['nip','NIP'],['nuptk','NUPTK'],['jabatan','Jabatan'],['mapel','Mata Pelajaran'],['status','Status Kepegawaian']]:[['nama','Nama'],['nip','NIP'],['nuptk','NUPTK'],['jabatan','Jabatan'],['status','Status Kepegawaian']];const vals=fields.map(([k,l])=>`${l}: ${x[k]||''}`).join('\n');const answer=prompt('Edit data. Masukkan nilai dalam urutan:\n'+fields.map(f=>f[1]).join(' | '),fields.map(f=>x[f[0]]||'').join(' | '));if(answer!==null){const v=answer.split('|').map(s=>s.trim());fields.forEach((f,j)=>x[f[0]]=v[j]||'');saveAll();renderAll();toast('Data diperbarui')}}
function addPerson(type){if(!requireAdmin())return;const fields=type==='teachers'?[['nama','Nama'],['nip','NIP'],['nuptk','NUPTK'],['jabatan','Jabatan'],['mapel','Mata Pelajaran'],['status','Status Kepegawaian']]:[['nama','Nama'],['nip','NIP'],['nuptk','NUPTK'],['jabatan','Jabatan'],['status','Status Kepegawaian']];const a=prompt('Masukkan data dengan pemisah |\n'+fields.map(f=>f[1]).join(' | '));if(a){const v=a.split('|').map(s=>s.trim()),x={};fields.forEach((f,j)=>x[f[0]]=v[j]||'');state[type].push(x);saveAll();renderAll();toast('Data ditambahkan')}}
function editFacility(i){if(!requireAdmin())return;const x=state.facilities[i],fields=[['nama','Nama/Item'],['kategori','Kategori'],['jumlah','Jumlah'],['kondisi','Kondisi'],['lokasi','Lokasi']];const a=prompt('Edit sarpras. Urutan:\n'+fields.map(f=>f[1]).join(' | '),fields.map(f=>x[f[0]]||'').join(' | '));if(a){const v=a.split('|').map(s=>s.trim());fields.forEach((f,j)=>x[f[0]]=v[j]||'');saveAll();renderAll();toast('Data sarpras diperbarui')}}function addFacility(){if(!requireAdmin())return;const fields=[['nama','Nama/Item'],['kategori','Kategori'],['jumlah','Jumlah'],['kondisi','Kondisi'],['lokasi','Lokasi']],a=prompt('Masukkan data sarpras dengan pemisah |\n'+fields.map(f=>f[1]).join(' | '));if(a){const v=a.split('|').map(s=>s.trim()),x={};fields.forEach((f,j)=>x[f[0]]=v[j]||'');state.facilities.push(x);saveAll();renderAll();toast('Sarpras ditambahkan')}}function removeItem(type,i){if(!requireAdmin())return;if(confirm('Hapus data ini?')){state[type].splice(i,1);saveAll();renderAll();toast('Data dihapus')}}
function readExcel(file){if(!requireAdmin())return;const fr=new FileReader();fr.onload=e=>{try{const wb=XLSX.read(e.target.result,{type:'array',cellDates:true});const ws=wb.Sheets['Daftar Peserta Didik']||wb.Sheets[wb.SheetNames[0]],aoa=XLSX.utils.sheet_to_json(ws,{header:1,defval:'',raw:false});if(aoa.length<7)throw Error('Format file tidak sesuai.');const top=aoa[4]||[],sub=aoa[5]||[];state.headers=top.map((v,i)=>{const a=String(v||'').trim(),b=String(sub[i]||'').trim();return a&&b?`${a} - ${b}`:(a||b||`Kolom ${i+1}`)});state.rows=aoa.slice(6).filter(r=>String(r[0]??'').trim()!=='').map(r=>Object.fromEntries(state.headers.map((h,i)=>[h,r[i]??''])));state.page=1;saveAll();renderAll();$('preview').innerHTML=`<div class="preview"><h3>Hasil Import</h3><p><b>${state.rows.length}</b> siswa terbaca.</p></div>`;toast(`Berhasil mengimpor ${state.rows.length} data siswa.`);showView('data')}catch(err){toast('Gagal membaca Excel: '+err.message)}};fr.readAsArrayBuffer(file)}
function exportExcel(){if(!state.rows.length)return toast('Belum ada data siswa.');const aoa=[state.headers,...state.rows.map(r=>state.headers.map(h=>r[h]??''))],ws=XLSX.utils.aoa_to_sheet(aoa),wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'Data Siswa');XLSX.writeFile(wb,'Data_Siswa_SD_Negeri_Kiupunu.xlsx')}

function updateAccessUI(){
document.querySelectorAll('.admin-only').forEach(e=>e.classList.toggle('hidden',!isAdmin));
$('adminLoginBtn').classList.toggle('hidden',isAdmin);
$('adminLogoutBtn').classList.toggle('hidden',!isAdmin);
$('accessStatus').textContent=isAdmin?'● Mode Admin — Import & Edit aktif':'● Mode Publik — hanya lihat & export';
$('accessStatus').classList.toggle('admin-status',isAdmin);
}
function requireAdmin(){
if(isAdmin)return true;
$('loginModal').classList.remove('hidden');
$('adminUser').focus();
toast('Silakan login sebagai Admin untuk mengubah data.');
return false;
}
function openAdminLogin(){$('loginModal').classList.remove('hidden');$('adminUser').focus()}
function closeAdminLogin(){$('loginModal').classList.add('hidden');$('adminUser').value='';$('adminPass').value=''}
function doLogin(){
const u=$('adminUser').value.trim(),p=$('adminPass').value;
if(u===ADMIN_USER && p===ADMIN_PASS){
isAdmin=true;sessionStorage.setItem(ADMIN_SESSION,'1');closeAdminLogin();updateAccessUI();renderAll();toast('Login Admin berhasil.');
}else{toast('Username atau password Admin salah.')}
}
function doLogout(){
isAdmin=false;sessionStorage.removeItem(ADMIN_SESSION);updateAccessUI();renderAll();showView('dashboard');toast('Anda telah keluar dari mode Admin.');
}
function exportAllData(){
const wb=XLSX.utils.book_new();
const add=(name,rows)=>{const data=rows.length?rows:[{}];const ws=XLSX.utils.json_to_sheet(data);XLSX.utils.book_append_sheet(wb,ws,name)};
add('Identitas Sekolah',[state.school]);
add('Kepala Sekolah',[state.principal]);
add('Data Guru',state.teachers);
add('Tenaga Kependidikan',state.staff);
add('Sarana Prasarana',state.facilities);
if(state.rows.length){
const ws=XLSX.utils.aoa_to_sheet([state.headers,...state.rows.map(r=>state.headers.map(h=>r[h]??''))]);
XLSX.utils.book_append_sheet(wb,ws,'Data Siswa');
}
XLSX.writeFile(wb,'Data_Lengkap_SD_Negeri_Kiupunu.xlsx');
toast('Semua data berhasil diekspor.');
}
const titles={dashboard:['Dashboard','Ringkasan lengkap profil SD Negeri Kiupunu.'],school:['Identitas Sekolah','Data pokok dan profil resmi sekolah.'],principal:['Kepala Sekolah','Informasi kepala sekolah.'],teachers:['Data Guru','Daftar pendidik sekolah.'],staff:['Tenaga Kependidikan','Daftar tenaga pendukung sekolah.'],facilities:['Sarana & Prasarana','Inventaris dan kondisi fasilitas sekolah.'],data:['Data Peserta Didik','Cari, filter, dan lihat detail siswa.'],import:['Import Data Excel','Masukkan data peserta didik dari Excel.'],other:['Data Lainnya','Data pendukung sekolah.'],about:['Tentang Aplikasi','Informasi sistem.']};function showView(id){document.querySelectorAll('.view').forEach(v=>v.classList.add('hidden'));$(id).classList.remove('hidden');document.querySelectorAll('.nav').forEach(n=>n.classList.toggle('active',n.dataset.view===id));$('pageTitle').textContent=titles[id][0];$('pageSub').textContent=titles[id][1]}
function renderAll(){dashboard();renderForms();rowTable('teachers');rowTable('staff');renderFacilities();renderData()}
document.querySelectorAll('.nav').forEach(b=>b.onclick=()=>{if(b.dataset.view==='import'&&!requireAdmin())return;showView(b.dataset.view)});
document.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>showView(b.dataset.go));
$('importTop')?.addEventListener('click',()=>{if(requireAdmin())showView('import')});
$('saveSchool').onclick=()=>{if(!requireAdmin())return;state.school=readForm('schoolForm');saveAll();renderAll();toast('Identitas sekolah disimpan')};
$('savePrincipal').onclick=()=>{if(!requireAdmin())return;state.principal=readForm('principalForm');saveAll();renderAll();toast('Data kepala sekolah disimpan')};
$('addTeacher').onclick=()=>{if(requireAdmin())addPerson('teachers')};
$('addStaff').onclick=()=>{if(requireAdmin())addPerson('staff')};
$('addFacility').onclick=()=>{if(requireAdmin())addFacility()};
$('chooseBtn').onclick=()=>{if(requireAdmin())$('fileInput').click()};$('fileInput').onchange=e=>{if(e.target.files[0])readExcel(e.target.files[0]);e.target.value=''};$('search').oninput=()=>{state.page=1;renderData()};$('classFilter').onchange=()=>{state.page=1;renderData()};$('exportBtn').onclick=exportExcel;$('prev').onclick=()=>{if(state.page>1){state.page--;renderData()}};$('next').onclick=()=>{state.page++;renderData()};$('closeModal').onclick=()=>$('modal').classList.add('hidden');$('modal').onclick=e=>{if(e.target===$('modal'))$('modal').classList.add('hidden')};const dz=$('dropzone');['dragenter','dragover'].forEach(ev=>dz.addEventListener(ev,e=>{e.preventDefault();dz.classList.add('drag')}));['dragleave','drop'].forEach(ev=>dz.addEventListener(ev,e=>{e.preventDefault();dz.classList.remove('drag')}));dz.addEventListener('drop',e=>{const f=e.dataTransfer.files[0];if(f)readExcel(f)});$('adminLoginBtn').onclick=openAdminLogin;
$('adminLogoutBtn').onclick=doLogout;
$('doAdminLogin').onclick=doLogin;
$('closeLogin').onclick=closeAdminLogin;
$('loginModal').onclick=e=>{if(e.target===$('loginModal'))closeAdminLogin()};
$('adminPass').addEventListener('keydown',e=>{if(e.key==='Enter')doLogin()});
$('adminUser').addEventListener('keydown',e=>{if(e.key==='Enter')$('adminPass').focus()});
$('exportAllTop').onclick=exportAllData;
updateAccessUI();
load();
