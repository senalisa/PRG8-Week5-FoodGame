var element= document.getElementById("img"),
    myImages = [
        "https://www.recettesetcabas.com/data/recettes/366-1-fiche@615306FB-Hamburger-maison-au-boeuf-sucrines.jpg",
   "https://www.allrecipes.com/thmb/Y9Au9IU6J6abhx9-92bwx3jeYdk=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/219634-chef-johns-french-fries-ddmfs-3144-4x3-fb44842390d6434f9691f42917186265.jpg",
      "https://images.pexels.com/photos/34950/pexels-photo.jpg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      "https://image.shutterstock.com/image-photo/bright-spring-view-cameo-island-260nw-1048185397.jpg"
    ];
function changeImg(element,myImages)
{
  
  setInterval(function()
    {
    var randomNum = Math.floor(Math.random() * myImages.length);
     element.src = myImages[randomNum];
  },5000);
}
changeImg(element,myImages);