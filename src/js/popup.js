// This code handles the interactable elements of the popup
function openPopup(id) {
  document.getElementById(id).style.display = 'flex';

  // disable background scroll
  document.body.style.overflow = 'hidden';
}

function closePopup(id) {
  document.getElementById(id).style.display = 'none';

  // re-enable background scroll
  document.body.style.overflow = '';
}

window.onclick = function (event) {
  if (event.target.classList.contains('popup')) {
    event.target.style.display = 'none';  

    // re-enable background scroll
    document.body.style.overflow = '';
  }
};