// script.js — validation, theme, redirect-to-result

const $ = id => document.getElementById(id);

// Theme handling
const themeToggle = $('themeToggle');
function getTheme(){ return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark'; }
function applyTheme(t){
  document.documentElement.setAttribute('data-theme', t);
  localStorage.setItem('site-theme', t);
  themeToggle.textContent = t === 'light' ? 'Light' : 'Dark';
}
themeToggle.addEventListener('click', ()=> applyTheme(getTheme() === 'light' ? 'dark' : 'light'));
applyTheme(getTheme());

// Small helpers for errors
function showError(id, text){
  const el = $(id);
  if(!el) return;
  el.textContent = text;
  el.style.display = 'block';
}
function hideError(id){
  const el = $(id);
  if(!el) return;
  el.textContent = '';
  el.style.display = 'none';
}

// Validators
function validateEmail(e){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }
function validatePhone(p){ return /^\d{10,}$/.test(p.replace(/[^\d]/g,'')); }
function validateDate(d){
  const m = d.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if(!m) return false;
  const day = +m[1], mon = +m[2], yr = +m[3];
  if(mon < 1 || mon > 12) return false;
  const mdays = new Date(yr, mon, 0).getDate();
  if(day < 1 || day > mdays) return false;
  if(yr < 1900 || yr > new Date().getFullYear()) return false;
  return true;
}

// Form handling: validate, store, redirect
const form = $('registrationForm');
form.addEventListener('submit', function(ev){
  ev.preventDefault();

  // clear errors
  ['nameError','emailError','phoneError','dobError','addressError','courseError','bioError'].forEach(hideError);

  let ok = true;
  const fullname = $('fullName').value.trim();
  const email = $('email').value.trim();
  const phone = $('phone').value.trim();
  const dob = $('dob').value.trim();
  const address = $('address').value.trim();
  const course = $('course').value;
  const bio = $('bio').value.trim();

  if(!fullname){ showError('nameError','Full name required'); ok = false; }
  if(!validateEmail(email)){ showError('emailError','Enter valid email'); ok = false; }
  if(!validatePhone(phone)){ showError('phoneError','Phone must contain at least 10 digits'); ok = false; }
  if(!validateDate(dob)){ showError('dobError','Enter valid date as DD/MM/YYYY'); ok = false; }
  if(address.length < 8){ showError('addressError','Address must be at least 8 characters'); ok = false; }
  if(!course){ showError('courseError','Select a course'); ok = false; }
  if(bio.length < 10){ showError('bioError','Bio must be at least 10 characters'); ok = false; }

  if(!ok) return;

  // prepare payload
  const payload = { fullname, email, phone, dob, address, course, bio, theme: getTheme() };

  // store in sessionStorage (temporary; cleared when browser tab closed)
  try{
    sessionStorage.setItem('registrationResult', JSON.stringify(payload));
    // redirect to results page
    window.location.href = 'result.html';
  } catch(err){
    alert('Failed to save data locally — please try again.');
    console.error(err);
  }
});

// Reset
$('resetBtn').addEventListener('click', ()=> {
  if(confirm('Clear the form?')) form.reset();
});
