//Variabelen
let handpose;
let video;
let predictions = [];
let examplesAdded = false;
let outputLabel = "";
let label;
let addLike = 0;
// let audioLiked = new Audio('audio_file.mp3');
let addDislike = 0;
// let audioDisliked = new Audio('audio_file.mp3');
let warning = "";

const knnClassifier = ml5.KNNClassifier();

let synth = window.speechSynthesis

//Speech
function speak(text) {
  if (synth.speaking) {
      console.log('still speaking...')
      return
  }
  if (text !== '') {
      let utterThis = new SpeechSynthesisUtterance(text)
      synth.speak(utterThis)
  }
}

//Random images of food
var element= document.getElementById("img"),
    myImages = [
      "https://www.recettesetcabas.com/data/recettes/366-1-fiche@615306FB-Hamburger-maison-au-boeuf-sucrines.jpg",
      "https://www.allrecipes.com/thmb/Y9Au9IU6J6abhx9-92bwx3jeYdk=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/219634-chef-johns-french-fries-ddmfs-3144-4x3-fb44842390d6434f9691f42917186265.jpg",
      "https://www.okokorecepten.nl/i/recipegroups/themas/groenten/spruitjes-750.jpg",
      "https://www.landidee.nl/wp-content/uploads/sites/7/2018/07/shutterstock_716092798-1024x576.jpg",
      "https://www.modernhoney.com/wp-content/uploads/2019/08/Classic-Lasagna-14-scaled.jpg",
      "https://img.hellofresh.com/f_auto,fl_lossy,q_auto,w_1200/hellofresh_s3/image/wok-met-knoflookgarnalen-en-pindas-5ebb49f6-49678eab.jpg",
      "https://www.avocadovandeduivel.be/wp-content/uploads/2021/02/P2070006.jpg",
      "https://recipes.timesofindia.com/thumb/59736398.cms?width=1200&height=900",
      "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.fit.nl%2Frecept%2Fspinazie-smoothie&psig=AOvVaw2LC5yRvo3bi3kZCgCYBmc2&ust=1679334723177000&source=images&cd=vfe&ved=0CBAQjRxqFwoTCMjhqMHH6P0CFQAAAAAdAAAAABAD"
    ];
function changeImg(element,myImages)
{
  
  setInterval(function()
    {
    var randomNum = Math.floor(Math.random() * myImages.length);
     element.src = myImages[randomNum];
  },3000);
}
changeImg(element,myImages);

async function setup() {
  //Set up Video
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(windowWidth, windowHeight);

  const handpose = ml5.handpose(video, modelReady);
  handpose.on('predict', gotResults);

  video.hide();

  //Like & Dislike Buttons
  let likeBtn = createButton("Train Like", 'like');
  let dislikeBtn = createButton("Train Dislike", 'dislike');
  likeBtn.mousePressed(likedFunction);
  dislikeBtn.mousePressed(dislikedFunction);
  likeBtn.className = "button";
  dislikeBtn.className = "button";
}

//Function Like & Dislike
function likedFunction() {
    addExample('like')
    addLike = knnClassifier.getCountByLabel().like;
  }
  
  function dislikedFunction() {
    addExample('dislike')
    addDislike = knnClassifier.getCountByLabel().dislike;
  }
  
//Draw + add Text
function draw() {
  image(video, 0, 0, width, height);
  drawKeypoints();
  
  textSize(18);
  text('Like : ' + addLike + ' trained times', 20, height - 50);
  text('Dislike : ' + addDislike + ' trained times', 20, height - 30);

  textSize(120);
  text(outputLabel, 20, height - 120 );
  if (examplesAdded) {
    classify();
  }
}

//Draw the keypoints of the hand
function drawKeypoints() {
  for (let i = 0; i < predictions.length; i += 1) {
    const prediction = predictions[i];
    for (let j = 0; j < prediction.landmarks.length; j += 1) {
      const keypoint = prediction.landmarks[j];
      fill(255,204,0);
      stroke(255,150,0);
      ellipse(keypoint[0], keypoint[1], 10, 10);
    }
  }
}

//Model ready
function modelReady() {
  console.log("Model ready!");
}
//Results
function gotResults(results) {
  predictions = results;
}

//Add the examples for a Like or Dislike
function addExample(label) {
  if(predictions.length > 0){
    warning = "";
  for (let i = 0; i < predictions.length; i += 1) {
    const landmarks = predictions[0].landmarks;
    const predictionArray = landmarks.map(p => [p[0], p[1]]);
    knnClassifier.addExample(predictionArray, label);
  }
  examplesAdded = true;
}
}

//Classify 
function classify() {
  if(predictions.length > 0){
  for (let i = 0; i < predictions.length; i += 1) {
    const landmarks = predictions[0].landmarks;
    const predictionArray = landmarks.map(p => [p[0], p[1]]);
    knnClassifier.classify(predictionArray, (err, result) => {
      label = result.label;
    });

    if (label == "like") {
      outputLabel = '👍';
      // audioLiked.play();
      speak(`I Like that!`)
    } else if (label == "dislike") {
      outputLabel = '👎';
      speak(`I do not like that...!`)
      // audioDisliked.play();
    } 
}
  }
  else{
    outputLabel = "";
  }
  }
