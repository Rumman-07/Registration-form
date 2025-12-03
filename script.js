// script.js — polished form interactions, validation, theme, and preview flow
const $ = id => document.getElementById(id);

// Theme
const themeToggle = $('themeToggle');
function currentTheme(){ return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark'; }
function setTheme(t){ document.documentElement.setAttribute('data-theme', t); localStorage.setItem('site-theme', t); themeToggle.textContent = t === 'light' ? '🌑 Dark mode' : '💡 Light mode'; }
if(themeToggle) themeToggle.addEventListener('click', ()=> setTheme(currentTheme()==='light' ? 'dark' : 'light'));
setTheme(currentTheme());

// Simple validators
function isEmail(v){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
function isPhone(v){ return /^\d{10,}$/.test(v.replace(/\D/g,'')); }
function isDate(v){ const m=v.match(/^(\d{2})\/(\d{2})\/(\d{4})$/); if(!m) return false; const d=+m[1], mo=+m[2], y=+m[3]; if(mo<1||mo>12) return false; const md=new Date(y,mo,0).getDate(); return d>=1 && d<=md && y>=1900 && y<=new Date().getFullYear(); }

// bind floating label behavior for prefilled values
function bindFloating(){
  document.querySelectorAll('.input').forEach(el=>{
    const field = el.querySelector('input,textarea,select');
    if(!field) return;
    const update = ()=> {
      if(field.value && field.value.toString().trim()!=='') field.setAttribute('data-has','1'); else field.removeAttribute('data-has');
    };
    update();
    field.addEventListener('input', update);
    field.addEventListener('change', update);
  });
}

// prefill from sessionStorage
(function prefill(){
  try{
    const raw = sessionStorage.getItem('registrationResult');
    if(!raw) return;
    const d = JSON.parse(raw);
    if(d.fullname) document.getElementById('fullName').value = d.fullname;
    if(d.email) document.getElementById('email').value = d.email;
    if(d.phone) document.getElementById('phone').value = d.phone;
    if(d.dob) document.getElementById('dob').value = d.dob;
    if(d.address) document.getElementById('address').value = d.address;
    if(d.course) document.getElementById('course').value = d.course;
    if(d.bio) document.getElementById('bio').value = d.bio;
    if(d.theme) setTheme(d.theme);
  }catch(e){ console.warn(e); }
})();

// ensure floats bound after DOM loaded
document.addEventListener('DOMContentLoaded', bindFloating);

// form handling
const form = document.getElementById('registrationForm');
if(form){
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    // clear errors
    ['nameError','emailError','phoneError','dobError','addressError','courseError','bioError'].forEach(id=>{
      const el = document.getElementById(id); if(el) el.textContent='';
    });

    let ok = true;
    const fullname = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const dob = document.getElementById('dob').value.trim();
    const address = document.getElementById('address').value.trim();
    const course = document.getElementById('course').value;
    const bio = document.getElementById('bio').value.trim();

    if(!fullname){ document.getElementById('nameError').textContent='Full name required'; ok=false; }
    if(!isEmail(email)){ document.getElementById('emailError').textContent='Valid email required'; ok=false; }
    if(!isPhone(phone)){ document.getElementById('phoneError').textContent='Enter 10+ digits'; ok=false; }
    if(!isDate(dob)){ document.getElementById('dobError').textContent='Use DD/MM/YYYY'; ok=false; }
    if(address.length < 8){ document.getElementById('addressError').textContent='Address is too short'; ok=false; }
    if(!course){ document.getElementById('courseError').textContent='Choose a course'; ok=false; }
    if(bio.length < 10){ document.getElementById('bioError').textContent='Write at least 10 characters'; ok=false; }

    if(!ok){
      // small feedback
      form.animate([{transform:'translateX(0)'},{transform:'translateX(-6px)'},{transform:'translateX(6px)'},{transform:'translateX(0)'}],{duration:320});
      bindFloating();
      return;
    }

    // save to sessionStorage and redirect to result
    const payload = { fullname,email,phone,dob,address,course,bio,theme:currentTheme() };
    try{ sessionStorage.setItem('registrationResult', JSON.stringify(payload)); }catch(e){ console.warn(e); }
    // nice small success animation before redirect
    document.querySelector('.card').style.transform='scale(.998)';
    setTimeout(()=> window.location.href='result.html', 260);
  });

  // reset handling
  document.getElementById('resetBtn').addEventListener('click', ()=>{
    setTimeout(()=> bindFloating(), 80);
    sessionStorage.removeItem('registrationResult');
  });
}
