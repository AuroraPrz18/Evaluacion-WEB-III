const azul = "#0081C9";
window.addEventListener('load',()=>{
    var title = document.getElementById('title-second-section');
    var headerNavbar = document.getElementById('headerNavbar');
    var secondBar = document.getElementById('bar2');
    var bar = document.getElementById('bar');
    
    title.style.color = "white";
    title.style.opacity = "0";   

    headerNavbar.style.opacity = "0";
    secondBar.style.opacity = "0";
    
    bar.style.backgroundColor = azul;
    bar.style.width = "100%"
    bar.style.marginTop = "4%";
    bar.style.opacity = "1";

    var aElements = document.querySelectorAll('.menuItems li a');

    aElements.forEach(function(a) {        
        a.style.color = "white";        
    });

    window.addEventListener('scroll', function() {
        var image = document.getElementById('img-carrito');
        var scrolled = window.pageYOffset;
        var rate = scrolled * 0.8;      
        image.style.transform = 'translateX(' + rate + 'px)';        
        bar.style.opacity = 1-(scrolled*0.01);
        title.style.opacity =(scrolled*0.002);
        headerNavbar.style.opacity =(scrolled*0.002);
        secondBar.style.opacity =(scrolled*0.002);

    });                  

})