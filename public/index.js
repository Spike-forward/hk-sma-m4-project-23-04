//Scroll down for the dropdown menu
// When the user scrolls down 20px from the top of the document, slide down the navbar
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
    document.getElementById("dropdown").style.top = "0";
  } else {
    document.getElementById("dropdown").style.top = "-50px";
  }
}
