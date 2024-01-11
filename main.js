

function home(){
    window.location.href="index.html"
}

function changeQuantity(number){
    $("#quantidade").html(number)
    closeAllModals();
}

let dropdown = document.getElementById("material");

function dropdownMaterial(){
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

function changeMaterial(mat){
    $("#material").attr("value",mat);
    dropdownMaterial();
    if(mat=='wood1'){
        mat='Nogueira';
    }else{
        mat='Contraplacado';
    }
    $("#material").html(mat);
    $("#material_modal").html(mat);
    closeAllModals();
}

// Existing code...

_satellite.pageBottom();

if (navigator.userAgent.indexOf('MSIE ') > 0 || navigator.userAgent.indexOf("Trident/") > 0) {
    // MSIE For IE 10 and lower, Trident for IE 11
    var element = document.getElementById("ie-ending");
    element.style.display = "flex";
    var button = element.getElementsByClassName("ie-ending--close")[0];
    button.addEventListener("click", function () {
        element.style.display = "none";
    });
}

setTimeout(() => {
    let aside = document.getElementsByTagName('aside');
    for (let i = 0; i < aside.length; i++) {
        aside.item(i).style.zIndex = '10003';
        let iframe = $(aside).find('iframe');
    }
}, 3000);

// Function to open the modal
function openModal(id) {

    var modal = document.getElementById('reinsurancePanel_'+id);
    modal.classList.add('modal--isOpen');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('tabindex', '0');
    modal.classList.add('show');
}


// Function to close the modal
function closeModal(id) {
    var modal = document.getElementById('reinsurancePanel_'+id);
    modal.classList.remove('modal--isOpen');
    modal.setAttribute('aria-modal', 'false');
    modal.setAttribute('tabindex', '-1');
    modal.classList.remove('show');
}

function closeAllModals(){
    for(let i = 0; i <= 9; i++){
    var panel = 'reinsurancePanel_' + i;
    var modal = document.getElementById(panel);
    modal.classList.remove('modal--isOpen');
    modal.setAttribute('aria-modal', 'false');
    modal.setAttribute('tabindex', '-1');
    modal.classList.remove('show');
    }
}

// Attach the event listener to the button
document.querySelector(".reinsurance__item").addEventListener("click", openModal);

// Attach the event listener to the close button
document.querySelector(".modal_close").addEventListener("click", closeModal);
