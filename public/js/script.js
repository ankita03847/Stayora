// Bootstrap client-side form validation
(function () {
  'use strict'

  var forms = document.querySelectorAll('.needs-validation')

  Array.prototype.slice.call(forms).forEach(function (form) {
    form.addEventListener('submit', function (event) {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()

// Interactive Wishlist Heart Toggle
function toggleWishlist(event, btn) {
  event.preventDefault();
  event.stopPropagation();
  const icon = btn.querySelector('i');
  if (icon.classList.contains('fa-regular')) {
    icon.classList.remove('fa-regular');
    icon.classList.add('fa-solid');
    btn.classList.add('active');
  } else {
    icon.classList.remove('fa-solid');
    icon.classList.add('fa-regular');
    btn.classList.remove('active');
  }
}