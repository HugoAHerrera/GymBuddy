$(document).ready(function () {
    const iniciarSesionHTML = `
        <form>
            <label for="email">Email:</label><br>
            <input type="email" id="email" class="pass" required>
            
            <label for="contraseña_original">Contraseña:</label><br>
            <div class="contraseña">
                <input type="password" id="contraseña_original" class="pass" required>
                <i class="bx bx-show-alt"></i>
            </div>
            <button type="submit" id="submit-btn-inicio-sesion">Enviar</button>
            <p id="contraseñas-vacias" style="color: red; display: none;">La contraseña no puede estar vacía</p>
            <p id="email-error" style="color: red; display: none;">Ingrese un email válido</p>
        </form>
    `;

    const crearCuentaHTML = `
        <form>
            <label for="email">Email:</label><br>
            <input type="email" id="email" class="pass" required>
            
            <label for="contraseña_original">Contraseña:</label><br>
            <div class="contraseña">
                <input type="password" id="contraseña_original" class="pass" required>
                <i class="bx bx-show-alt"></i>
            </div>
            
            <label for="contraseña_repeticion">Repetir contraseña:</label><br>
            <div class="contraseña">
                <input type="password" id="contraseña_repeticion" class="pass" required>
                <i class="bx bx-show-alt"></i>
            </div>
            
            <div class="terms-container">
                <input type="checkbox" id="terms" name="terms" required>
                <label> Aceptar términos y condiciones</label>
            </div>

            <button type="submit" id="submit-btn">Enviar</button>
            <p id="contraseñas-error" style="color: red; display: none;">Las contraseñas no coinciden</p>
            <p id="contraseñas-vacias" style="color: red; display: none;">Las contraseñas no pueden estar vacías</p>
            <p id="email-error" style="color: red; display: none;">Ingrese un email válido</p>
            <p id="terms-error" style="color: red; display: none;">Debe aceptar los términos y condiciones</p>
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

    $("#formulario").on("click", "#submit-btn-inicio-sesion", function(event) {
        event.preventDefault();

        const contraseñaUsuario = document.getElementById('contraseña_original').value;
        const email = document.getElementById('email').value;
        
        $("#contraseñas-vacias, #email-error").hide();

        if (contraseñaUsuario.length === 0) {
            $("#contraseñas-vacias").show();
            return;
        }

        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailRegex.test(email)) {
            $("#email-error").show();
            return;
        }

        window.location.href = "inicio.html";
    });

    $("#formulario").on("click", "#submit-btn", function(event) {
        event.preventDefault();

        const contraseñaUsuario = document.getElementById('contraseña_original').value;
        const contaseñaRepeticion = document.getElementById('contraseña_repeticion').value;
        const email = document.getElementById('email').value;
        const aceptarTerminos = document.getElementById('terms').checked;

        $("#contraseñas-error, #contraseñas-vacias, #email-error, #terms-error").hide();

        if (contraseñaUsuario.length === 0 || contaseñaRepeticion.length === 0) {
            $("#contraseñas-vacias").show();
            return;
        }

        if (contraseñaUsuario !== contaseñaRepeticion) {
            $("#contraseñas-error").show();
            return;
        }

        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailRegex.test(email)) {
            $("#email-error").show();
            return;
        }

        if (!aceptarTerminos) {
            $("#terms-error").show();
            return;
        }

        window.location.href = "inicio.html";
    });

    $("#formulario").on("click", ".bx", function() {
        const pass = $(this).siblings(".pass")[0];
        if (pass.type === "password") {
            pass.type = "text";
            $(this).removeClass('bx-show-alt').addClass('bx-hide');
        } else {
            pass.type = "password";
            $(this).removeClass('bx-hide').addClass('bx-show-alt');
        }
    });
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