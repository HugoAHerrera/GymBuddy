$(document).ready(function () {
    const iniciarSesionHTML = `
        <form>
            <label for="email">Email:</label><br>
            <input type="email" id="email" name="email" required><br>
            
            <label for="password">Contraseña:</label><br>
            <input type="password" id="password" name="password" required>
            <input type="checkbox" id="showPassword"> Mostrar contraseña<br><br>
            <button type="submit">Enviar</button>
        </form>
    `;

    const crearCuentaHTML = `
        <form>
            <label for="email">Email:</label><br>
            <input type="email" id="email" name="email" required><br>
            
            <label for="password">Contraseña:</label><br>
            <input type="password" id="password" name="password" required>
            <input type="checkbox" id="showPassword"> Mostrar contraseña<br><br>
            
            <label for="repeatPassword">Repetir contraseña:</label><br>
            <input type="password" id="repeatPassword" name="repeatPassword" required><br>
            
            <div class="terms-container">
                <input type="checkbox" id="terms" name="terms" required>
                <label for="terms"> Aceptar términos y condiciones</label>
            </div>

            <button type="submit">Enviar</button>
        </form>
    `;

    // Click en "Iniciar sesión"
    $("#div-iniciar-sesion").click(function () {
        $("#formulario").html(iniciarSesionHTML);
        // Añade la clase de activo
        $('#div-iniciar-sesion').addClass('boton-pulsado');
        $('#div-crear-cuenta').removeClass('boton-pulsado');
    });

    // Click en "Crear cuenta"
    $("#div-crear-cuenta").click(function () {
        $("#formulario").html(crearCuentaHTML);
        // Añade la clase de activo
        $('#div-crear-cuenta').addClass('boton-pulsado');
        $('#div-iniciar-sesion').removeClass('boton-pulsado');
    });
});
