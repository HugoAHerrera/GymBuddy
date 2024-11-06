$(document).ready(function () {
    const iniciarSesionHTML = `
        <form>
            <label for="email">Email:</label><br>
            <input type="email" id="pass" class="pass" required>
            
            <label for="password">Contraseña:</label><br>
            <div class="contraseña">
                <input type="password" id="pass" class="pass" required>
                <i class = "bx bx-show-alt"></i>
            </div>
            <button type="submit">Enviar</button>
        </form>
    `;

    const crearCuentaHTML = `
        <form>
            <label for="email">Email:</label><br>
            <input type="email" id="pass" class="pass" required>
            
            <label for="password">Contraseña:</label><br>
            <div class="contraseña">
                <input type="password" id="pass" class="pass" required>
                <i class = "bx bx-show-alt"></i>
            </div>
            
            <label for="repeatPassword">Repetir contraseña:</label><br>
            <div class="contraseña">
                <input type="password" id="pass" class="pass" required>
                <i class = "bx bx-show-alt"></i>
            </div>
            
            <div class="terms-container">
                <input type="checkbox" id="terms" name="terms" required>
                <label for="terms"> Aceptar términos y condiciones</label>
            </div>

            <button type="submit">Enviar</button>
        </form>
    `;

    $("#div-iniciar-sesion").click(function () {
        $("#formulario").html(iniciarSesionHTML);
        $('#div-iniciar-sesion').addClass('boton-pulsado');
        $('#div-crear-cuenta').removeClass('boton-pulsado');
    });

    $("#div-crear-cuenta").click(function () {
        $("#formulario").html(crearCuentaHTML);
        $('#div-crear-cuenta').addClass('boton-pulsado');
        $('#div-iniciar-sesion').removeClass('boton-pulsado');
    });
});

const form = document.querySelector("form");
const contraseñaUsuario = document.getElementById("contraseña_original");
const contaseñaRepeticion = document.getElementById("contraseña_repeticion");
const contraseñasDistintas = document.getElementById("contraseñas-error");

document.getElementById('submit-btn').addEventListener('click', function(event) {
    event.preventDefault();

    const contraseñaUsuario = document.getElementById('contraseña_original').value;
    const contaseñaRepeticion = document.getElementById('contraseña_repeticion').value;
    const email = document.getElementById('email').value;
    const aceptarTerminos = document.getElementById('terms').checked;

    const contraseñasDistintas = document.getElementById('contraseñas-error');
    const contraseñasVacias = document.getElementById('contraseñas-vacias');
    const emailError = document.getElementById('email-error');
    const termsError = document.getElementById('terms-error');

    contraseñasDistintas.style.display = "none";
    contraseñasVacias.style.display = "none";
    emailError.style.display = "none";
    termsError.style.display = "none";

    if (contraseñaUsuario.length === 0 || contaseñaRepeticion.length === 0) {
        contraseñasVacias.style.display = "block";
        return;
    }

    if (contraseñaUsuario !== contaseñaRepeticion) {
        contraseñasDistintas.style.display = "block";
        return;
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
        emailError.style.display = "block";
        return;
    }

    if (!aceptarTerminos) {
        termsError.style.display = "block";
        return;
    }

    window.location.href = "rutina.html";
});

const passwordContainers = document.querySelectorAll(".contraseña");

passwordContainers.forEach(container => {
    const pass = container.querySelector(".pass");
    const icon = container.querySelector(".bx");

    icon.addEventListener("click", () => {
        if (pass.type === "password") {
            pass.type = "text";
            icon.classList.remove('bx-show-alt');
            icon.classList.add('bx-hide');
        } else {
            pass.type = "password";
            icon.classList.remove('bx-hide');
            icon.classList.add('bx-show-alt');
        }
    });
});

document.addEventListener("DOMContentLoaded", function() {
    const textos = ["Inscríbete", "TIME TO WORK", "BE STRONGER", "NEVER GIVE UP", "STAY FOCUSED"];
    let indexTexto = 0;
    let textoActual = textos[indexTexto];
    let i = 0;
    const divTexto = document.getElementById("div-texto");
    const tiempo_escribir = 120;
    const tiempo_borrar = 75;
    const tiempo_espera = 2000;

    function borrarTexto() {
        if (divTexto.innerHTML.length > 0) {
            divTexto.innerHTML = divTexto.innerHTML.slice(0, -1);
            setTimeout(borrarTexto, tiempo_borrar);
        } else {
            setTimeout(escribirTexto, 0);
        }
    }

    function escribirTexto() {
        if (i < textoActual.length) {
            divTexto.innerHTML += textoActual.charAt(i);
            i++;
            setTimeout(escribirTexto, tiempo_escribir);
        } else {
            indexTexto = (indexTexto + 1) % textos.length;
            textoActual = textos[indexTexto];
            i = 0; 
            setTimeout(borrarTexto, 2000);
        }
    }

    setTimeout(borrarTexto, 2000);
});


