import { OrbitControls } from 'three/addons/controls/OrbitControls.js' 
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js' //novo
import * as THREE from 'three'; 

let WIDTH = 500;
let HEIGHT = 500;

/* cena... */
let cena = new THREE.Scene()
cena.background = new THREE.Color(0xcccccc);

/* geometria...  (novo)*/
let portaL = null;
let portaR = null;
let gavetaL = null;
let gavetaR = null;
let plantaAnimacao = null;
let candidatos = [];
let model = null;
let wooden = [];
let wickered = [];
let woodMaterial = null;
let wickerMaterial = null;
let misturador = new THREE.AnimationMixer(cena);
let carregador = new GLTFLoader()
carregador.load(
    './model/vintageDesk.gltf', 
    function ( gltf ) {
        model = gltf.scene;
        cena.traverse( function (elemento) {
            elemento.castShadow = true;
            elemento.receiveShadow = true;
            candidatos.push(elemento);
        });
        model.traverse((elemento) => {
            if(elemento instanceof THREE.Mesh && elemento.material.name == "Wood"){
                wooden.push(elemento);
                woodMaterial = elemento.material;
            }
            else if(elemento instanceof THREE.Mesh && elemento.material.name == "Wicker"){
                wickered.push(elemento);
                wickerMaterial = elemento.material;
            }
        });
        model.position.set(0,-0.32,0)
        cena.add(model)

        let clipe = THREE.AnimationClip.findByName( gltf.animations, 'Porta_R_Abrir' )
        portaR = misturador.clipAction( clipe )
        portaR.setLoop(THREE.LoopOnce);
        portaR.clampWhenFinished = true;
        clipe = THREE.AnimationClip.findByName( gltf.animations, 'Porta_L_Abrir' )
        portaL = misturador.clipAction( clipe )
        portaL.setLoop(THREE.LoopOnce);
        portaL.clampWhenFinished = true;
        clipe = THREE.AnimationClip.findByName( gltf.animations, 'Gaveta_R_Abrir' )
        gavetaR = misturador.clipAction( clipe )
        gavetaR.setLoop(THREE.LoopOnce);
        gavetaR.clampWhenFinished = true;
        clipe = THREE.AnimationClip.findByName( gltf.animations, 'Gaveta_L_Abrir' )
        gavetaL = misturador.clipAction( clipe )
        gavetaL.setLoop(THREE.LoopOnce);
        gavetaL.clampWhenFinished = true;
        clipe = THREE.AnimationClip.findByName( gltf.animations, 'Plant_Action' )
        plantaAnimacao = misturador.clipAction( clipe )
        plantaAnimacao.setLoop(THREE.LoopOnce);
        plantaAnimacao.clampWhenFinished = true;
        plantaAnimacao.paused = true;
    }
)

/* camara.. */
let camara = new THREE.PerspectiveCamera( 50, WIDTH  / HEIGHT, 0.01, 1000 )
camara.position.set(0,0,2.4)

/* renderer... */
let myCanvas = document.getElementById('myCanvas');
let renderer = new THREE.WebGLRenderer({canvas: myCanvas});
renderer.setSize( WIDTH, HEIGHT )
renderer.shadowMap.enabled = true;

let controls = new OrbitControls( camara, renderer.domElement )
controls.panSpeed = 0;
controls.minDistance = 1.45;
controls.maxDistance = 2.4;

// Renderizar e animar
let delta = 0;			  // tempo desde a última atualização
let relogio = new THREE.Clock(); // componente que obtém o delta
let latencia_minima = 1 / 60;    // tempo mínimo entre cada atualização
let luzPonto;
let raycaster = new THREE.Raycaster()
let rato = new THREE.Vector2()
function animar() {
    requestAnimationFrame(animar);  // agendar animar para o próximo animation frame
    delta += relogio.getDelta();    // acumula tempo que passou desde a ultima chamada de getDelta

    if (delta  < latencia_minima)   // não exceder a taxa de atualização máxima definida
        return;                     
    
    //Update da luz

    luzPonto.position.set(camara.position.x, camara.position.y, camara.position.z)
    let center = new THREE.Vector3(0,0,0);
    let distanceFromCenter = camara.position.distanceTo(center)
    luzPonto.intensity = 4 * distanceFromCenter * distanceFromCenter;
    misturador.update(Math.floor(delta / latencia_minima)* latencia_minima)
    renderer.render( cena, camara )
    
    delta = delta % latencia_minima;// atualizar delta com o excedente
}

function luzes(cena) {
    /* point light */
    luzPonto = new THREE.PointLight( "white" )
    luzPonto.intensity= 20
    luzPonto.castShadow = true;
    cena.add( luzPonto )
}


luzes(cena)
animar()

let isGavetaRAberta = false;
let isGavetaLAberta = false;
let isPortaRAberta = false;
let isPortaLAberta = false;

function playAnimation(object, isAberto){
    if (isAberto) {
        object.timeScale = -1;
        object.paused = false;
        object.play();
    } else {
        object.timeScale = 1;
        object.paused = false;
        object.play();
    }

    return !isAberto;
}

window.onclick = function(evento){
    rato.x = (evento.clientX / WIDTH) * 2 - 1
    rato.y = -(evento.clientY / HEIGHT) * 2 + 1

    raycaster.setFromCamera(rato, camara)
    let intersetados = raycaster.intersectObjects(candidatos)
    if(intersetados.length > 0){
        if(intersetados[0].object.parent.name.includes("Gaveta_R"))
            isGavetaRAberta = playAnimation(gavetaR, isGavetaRAberta);
        if(intersetados[0].object.parent.name.includes("Gaveta_L"))
            isGavetaLAberta = playAnimation(gavetaL, isGavetaLAberta);
        if(intersetados[0].object.parent.name.includes("Porta_R"))
            isPortaRAberta = playAnimation(portaR, isPortaRAberta);
        if(intersetados[0].object.parent.name.includes("Porta_L"))
            isPortaLAberta = playAnimation(portaL, isPortaLAberta);
        if((intersetados[0].object.parent.name == "Cactus" || intersetados[0].object.parent.name == "Plant") && plantaAnimacao.paused == true){
            plantaAnimacao.paused = false;
            plantaAnimacao.time = 0;
            plantaAnimacao.play();
        }
    } 
}

//Butoes radio e dropdown

var radioCor = document.getElementsByName("radioCor");

function mudarCor(cor){
    if(model){
        model.traverse((child) => {
            if (child instanceof THREE.Mesh && (child.material.name == "Wood" || child.material.name == "Wicker"))
                child.material.color.set(cor);
            
        });
    }
}

radioCor.forEach(function (radioButton) {
    radioButton.addEventListener("change", function (){
        if(this.checked && this.value == "claro")
            mudarCor(new THREE.Color(0xffffff));
        
        else if (this.checked && this.value == "escuro")
            mudarCor(new THREE.Color(0xaaaaaa));
        
        else if (this.checked && this.value == "preto")
            mudarCor(new THREE.Color(0x666666));
    });
});

let dropdown = document.getElementById("dropdown_material");

function extras(){
    let mat=dropdown.value;
    $("#material").attr("value",mat);
    if(mat=='wood1'){
        mat='Nogueira';
    }else{
        mat='Contraplacado';
    }
    $("#material").html(mat);
}


function dropdownMaterial(){
    extras();
    if(dropdown.value == "wood1"){
        wooden.forEach((elemento) => {
            if(woodMaterial)
                elemento.material = woodMaterial;
        });
        wickered.forEach((elemento) => {
            if(wickerMaterial)
                elemento.material = wickerMaterial;
        });
    }
    else{
        wooden.forEach((elemento) => {
            if(wickerMaterial)
                elemento.material = wickerMaterial;
        });
        wickered.forEach((elemento) => {
            if(woodMaterial)
                elemento.material = woodMaterial;
        });
    }
}

dropdown.addEventListener('change', dropdownMaterial);

document.addEventListener("DOMContentLoaded", function () {
    const overlay = document.getElementById("overlay");

    function hideOverlay() {
        overlay.classList.add("hidden");
    }
    
    function showOverlay() {
        overlay.classList.remove("hidden");
    }

    // Add event listeners to hide/show the overlay on mouse events
    overlay.addEventListener("mouseover", hideOverlay);
    overlay.addEventListener("mouseout", showOverlay);
    
    myCanvas.addEventListener("mouseover", hideOverlay);
    myCanvas.addEventListener("mouseout", showOverlay);
});