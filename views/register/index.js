const registrationForm = document.forms['registrationForm'];
// Validate password matching
registrationForm.addEventListener('submit',(e) => {
  const errMsg = document.getElementById('error');
  const inputs = registrationForm.elements;
  const password = inputs['password'];
  const passwordConfirm = inputs['passwordConfirm'];

  if ( password.value !== passwordConfirm.value ) {
    e.preventDefault();
    errMsg.textContent = 'Passwords must match.';
    setTimeout(function(){
      errMsg.textContent = '';
    },5000);
  }
});
