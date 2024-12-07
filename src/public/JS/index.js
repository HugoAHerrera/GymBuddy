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
            <button type="submit" id="submit-btn-inicio-sesion">Iniciar sesión</button>
            <p class="cambio-contraseña"> Cambiar contraseña</p>
            <p id="contraseñas-vacias" style="color: red; display: none;">La contraseña no puede estar vacía</p>
            <p id="email-error" style="color: red; display: none;">Ingrese un email válido</p>
            <p id="credenciales-incorrectas" style="color: red; display: none;">Email o contraseña incorrecto</p>
        </form>
    `;

    const cambiarContraseña = `
        <form>
            <label for="email">Email:</label><br>
            <input type="email" id="email" class="pass" required>
            
            <label for="contraseña_original">Contraseña original:</label><br>
            <div class="contraseña">
                <input type="password" id="contraseña_original" class="pass" required>
                <i class="bx bx-show-alt"></i>
            </div>
            
            <label for="contraseña_nueva">Nueva contraseña:</label><br>
            <div class="contraseña">
                <input type="password" id="contraseña_nueva" class="pass" required>
                <i class="bx bx-show-alt"></i>
            </div>

            <label for="contraseña_nueva2">Repetir contraseña:</label><br>
            <div class="contraseña">
                <input type="password" id="contraseña_nueva2" class="pass" required>
                <i class="bx bx-show-alt"></i>
            </div>

            <button type="submit" id="submit-btn-cambiar-contraseña">Cambiar contraseña</button>
            <p id="contraseñas-vacias" style="color: red; display: none;">Rellene las contraseñas </p>
            <p id="credenciales-incorrectas" style="color: red; display: none;">Email o contraseña original incorrecto</p>
            <p id="cambio-exitoso" style="color: green; display: none;">Contraseña cambiada correctamente</p>
            <p id="contraseñas-no-valid" style="color: red; display: none;">Contraseña inválida: 1 mayúscula, 1 número, 8 letras mínimo</p>
            <p id="contraseñas-error" style="color: red; display: none;">Las contraseñas no coinciden</p>
        </form>
    `;

    const crearCuentaHTML = `
        <form>
            <label for="nombre_usuario">Nombre usuario:</label><br>
            <input type="nombre_usuario" id="nombre_usuario" class="pass" required><br>

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
                <label for="terms" class="terms-label"> Aceptar términos y condiciones</label>
            </div>

            <button type="submit" id="submit-btn">Registrarse</button>
            <p id="usuario-repetido" style="color: red; display: none;">Nombre de usuario ya en uso</p>
            <p id="usuario-vacio" style="color: red; display: none;">Inserte un nombre de usuario</p>
            <p id="contraseñas-error" style="color: red; display: none;">Las contraseñas no coinciden</p>
            <p id="contraseñas-vacias" style="color: red; display: none;">Las contraseñas no pueden estar vacías: 1 mayúscula, 1 número, 8 letras mínimo</p>
            <p id="email-error" style="color: red; display: none;">Ingrese un email válido</p>
            <p id="email-repetido" style="color: red; display: none;">Email ya en uso</p>
            <p id="terms-error" style="color: red; display: none;">Debe aceptar los términos y condiciones</p>
        </form>
    `;

    $(document).on('click', '.cambio-contraseña', function (event) {
        $("#formulario").html(cambiarContraseña);
    });

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

    $("#formulario").on("click", ".bx", function () {
        const pass = $(this).siblings(".pass")[0];
        if (pass.type === "password") {
            pass.type = "text";
            $(this).removeClass('bx-show-alt').addClass('bx-hide');
        } else {
            pass.type = "password";
            $(this).removeClass('bx-hide').addClass('bx-show-alt');
        }
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

        const userData = {
            email: email,
            contraseña: contraseñaUsuario
        };
    
        $.ajax({
            url: '/api/login',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(userData),
            success: function(response) {
                window.location.href = "inicio";
            },
            error: function(xhr, status, error) {
                if (xhr.status === 401) { //No autorizado
                    $("#credenciales-incorrectas").show();
                } else {
                    alert('Hubo un error al iniciar sesión: ' + xhr.responseJSON.message);
                }
            }
        });
    });

    $("#formulario").on("click", "#submit-btn-cambiar-contraseña", function(event) {
        event.preventDefault();

        const contraseñaUsuario = document.getElementById('contraseña_original').value;
        const email = document.getElementById('email').value;
        const contraseñaNueva = document.getElementById('contraseña_nueva').value;
        const contraseñaNueva2 = document.getElementById('contraseña_nueva2').value;
        
        $("#contraseñas-vacias, #contraseñas-error, #credenciales-incorrectas, #cambio-exitoso, #contraseñas-no-valid").hide();

        if (contraseñaUsuario.length === 0 || contraseñaNueva.length === 0 || contraseñaNueva2.length === 0) {
            $("#contraseñas-vacias").show();
            return;
        }

        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailRegex.test(email)) {
            $("#email-error").show();
            return;
        }

        let regexContraseña = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d\W]{8,}$/;
        if (contraseñaNueva.length === 0 || contraseñaNueva2.length === 0 || !regexContraseña.test(contraseñaUsuario)) {
            $("#contraseñas-no-valid").show();
            return;
        }

        if (contraseñaNueva !== contraseñaNueva2) {
            $("#contraseñas-error").show();
            return;
        }

        const userData = {
            email: email,
            contraseña: contraseñaUsuario,
            contraseña_nueva: contraseñaNueva
        };
    
        $.ajax({
            url: '/api/cambiar-contrasena',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(userData),
            success: function(response) {
                $("#cambio-exitoso").show();
            },
            error: function(xhr, status, error) {
                if (xhr.status === 401) { //No autorizado
                    $("#credenciales-incorrectas").show();
                } else {
                    alert('Hubo un error al iniciar sesión');
                }
            }
        });
    });

    function verificarUsuarioExistente(nombre_usuario) {
        return $.ajax({
            url: '/api/usuario-existe',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ nombre_usuario: nombre_usuario }),
        });
    }
    
    function verificarCorreoExistente(correo) {
        return $.ajax({
            url: '/api/correo-existe',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ correo: correo }),
        });
    }

    $("#formulario").on("click", "#submit-btn", function(event) {
        event.preventDefault();

        const nombreUsuario = document.getElementById('nombre_usuario').value;
        const contraseñaUsuario = document.getElementById('contraseña_original').value;
        const contraseñaRepeticion = document.getElementById('contraseña_repeticion').value;
        const email = document.getElementById('email').value;
        const aceptarTerminos = document.getElementById('terms').checked;

        $("#usuario-repetido, #usuario-vacio, #contraseñas-error, #contraseñas-vacias, #email-error, #email-repetido, #terms-error").hide();

        if (nombreUsuario.length==0) {
            $("#usuario-vacio").show();
            return;
        }

        let regexContraseña = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d\W]{8,}$/;
        if (contraseñaUsuario.length === 0 || contraseñaRepeticion.length === 0 || !regexContraseña.test(contraseñaUsuario)) {
            $("#contraseñas-vacias").show();
            return;
        }

        if (contraseñaUsuario !== contraseñaRepeticion) {
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

        const userData = {
            nombre_usuario: nombreUsuario,
            contraseña: contraseñaUsuario,
            correo: email,
        };
    
        // Verificar nombre usuario
        verificarUsuarioExistente(userData.nombre_usuario)
        .done(function() {

            // Verificar correo
            verificarCorreoExistente(userData.correo)
                .done(function() {

                    // Registrar el usuario
                    $.ajax({
                        url: '/api/registro',
                        method: 'POST',
                        contentType: 'application/json',
                        data: JSON.stringify(userData),
                        success: function() {
                            window.location.href = "inicio";
                        }
                    });
                })
                .fail(function(xhr) {
                    $("#email-repetido").show();
                });
        })
        .fail(function(xhr) {
            $("#usuario-repetido").show();
        });
    });

    function cargarCrearCuenta() {
        $("#formulario").html(crearCuentaHTML);
        $('#div-crear-cuenta').addClass('boton-pulsado');
        $('#div-iniciar-sesion').removeClass('boton-pulsado');
    }

    cargarCrearCuenta();
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

$(document).on('click', '.terms-label', function (event) {
    event.preventDefault();
    window.open('/previewTerminosCondiciones', '_blank');
});
