const header = document.querySelector(".header");
const menuButton = document.querySelector(".menu-button");
menuButton.addEventListener('click', function(){
    header.classList.toggle('active');
})
