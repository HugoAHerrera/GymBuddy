document.getElementById("guardar-cambios").addEventListener("click", function () {
    const nuevoNombreUsuario = document.getElementById("nombre-usuario").value;
    const nuevoEmailUsuario = document.getElementById("email-usuario").value;
    const nuevaImagenUsuario = document.getElementById("imagen-usuario").files[0];

    if (nuevoNombreUsuario) {
        document.getElementById("nombre-usuario-mostrado").textContent = nuevoNombreUsuario;
    }

    if (nuevoEmailUsuario) {
        document.getElementById("email-usuario-mostrado").textContent = nuevoEmailUsuario;
    }

    if (nuevaImagenUsuario) {
        const reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById("imagen-mostrada").src = e.target.result;
        };
        reader.readAsDataURL(nuevaImagenUsuario);
    }

    const mensajeConfirmacion = document.getElementById("mensaje-confirmacion");
    mensajeConfirmacion.textContent = "Se ha guardado correctamente.";
    
    
    setTimeout(() => {
        mensajeConfirmacion.textContent = "";
    }, 3000);
});

document.addEventListener('DOMContentLoaded', function() {
    const logoImage = document.getElementById('logotype');
    
    logoImage.addEventListener('click', function() {
        window.location.href = 'perfil.html';
    });
  });

// Cargar el header y el footer con fetch
fetch('../HTML/header.html')
.then(response => response.text())
.then(data => document.getElementById('header-container').innerHTML = data);

fetch('../HTML/footer.html')
.then(response => response.text())
.then(data => document.getElementById('footer-container').innerHTML = data);

// Función para obtener la descripción del usuario
async function obtenerDescripcionUsuario(idUsuario) {
    try {
        const response = await fetch('/api/descripcion-usuario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idUsuario }) // Enviar el ID de usuario al servidor
        });

        const data = await response.json();

        if (response.ok) {
            // Si la respuesta es exitosa, actualiza la información en el HTML
            document.getElementById('nombre-usuario-mostrado').textContent = data.descripcionUsuario.nombre;
            document.getElementById('email-usuario-mostrado').textContent = data.descripcionUsuario.email;
            // Aquí puedes agregar más campos si la respuesta tiene más información
        } else {
            console.error('Error al obtener la descripción del usuario:', data.error);
            alert('Hubo un problema al obtener la información del usuario.');
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
        alert('Hubo un error al procesar la solicitud.');
    }
}



const urlParams = new URLSearchParams(window.location.search);
        const idUsuario = urlParams.get('id_usuario');
        
        console.log('ID de usuario:', idUsuario);
        if (idUsuario) {
            console.log('ID de usuario:', idUsuario);
            // Aquí puedes usar el ID del usuario para mostrar información o hacer una solicitud a la API
        } else {
            console.error('ID de usuario no encontrado en la URL');
        }

        

        if (idUsuario) {
            fetch('/api/perfil', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ idUsuario }) // Enviar el ID del usuario al backend
            })
            .then(response => response.json())
            .then(data => {
                console.log('Descripción del usuario:', data.descripcionUsuario);
                // Aquí puedes actualizar el perfil con la descripción obtenida
            })
            .catch(error => console.error('Error al obtener la descripción del usuario:', error));
        }
        
