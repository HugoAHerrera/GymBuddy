document.addEventListener("DOMContentLoaded", () => {
    // Seleccionar todos los botones de incremento y decremento
    const updateButtons = document.querySelectorAll(".update-input");

    updateButtons.forEach(button => {
        button.addEventListener("click", (event) => {
            // Identificar si se trata de incremento o decremento
            const isIncrement = event.target.textContent.trim() === "🔼";
            const input = event.target.closest(".input-container").querySelector(".user-input");

            // Obtener el valor actual del input y actualizarlo
            let currentValue = parseFloat(input.value) || 0;
            input.value = isIncrement ? currentValue + 1 : Math.max(0, currentValue - 1); // Evitar valores negativos
        });
    });
});

function IMCCalculator() {
    const user_cm = document.getElementById("user-cm-input");
    const user_kg = document.getElementById("user-kg-input");
    const result = document.getElementById("IMC-result");
    const IMC = user_kg.value / (user_cm.value / 100) ** 2;

    var category = IMCType(IMC);

    if (user_cm.value === 0 || user_kg.value === 0 || user_cm.value === '' || user_kg.value === '' ) {
        Swal.fire({
            title: `Es necesario que pongas tu altura y peso para poder hacer el calculo 🤷‍♂️`,
            confirmButtonText: 'Okey',
            confirmButtonColor: '#3085d6',
            backdrop: true,
            allowOutsideClick: true,
            allowEscapeKey: true,
        });
    }
    else if (IMC > 247) {
        Swal.fire({
                title: `Eres la persona más obesa del mundo con un IMC de: ${IMC.toFixed(2)}!!. Superando el máximo histórico de 247.`,
                confirmButtonText: 'Okey',
                confirmButtonColor: '#3085d6',
                backdrop: true,
                allowOutsideClick: true,
                allowEscapeKey: true,
            });
    }
    else {
        result.innerHTML = `Tu IMC es: ${IMC.toFixed(2)}`;
        Swal.fire({
                title: `Tu IMC es: ${IMC.toFixed(2)}, Estas en la categoría: ${category}`,
                confirmButtonText: 'Okey',
                confirmButtonColor: '#3085d6',
                backdrop: true,
                allowOutsideClick: true,
                allowEscapeKey: true,
            });
    }
}

function IMCType(IMC) {
    if (IMC.toFixed(2) > 40) {
        return "Obesidad Clase III";
    }
    else if (40 > IMC.toFixed(2) && IMC.toFixed(2) > 34.9) {
        return "Obesidad Clase II";
    }
    else if (35 > IMC.toFixed(2) && IMC.toFixed(2) > 29.9) {
        return "Obesidad Clase I";
    }
    else if (30 > IMC.toFixed(2) && IMC.toFixed(2) > 24.9) {
        return "Sobrepeso";
    }
    else if (25 > IMC.toFixed(2) && IMC.toFixed(2) > 18.5) {
        return "Normal";
    }
    else {
        return "Bajo peso";
    }
}

// Cargar el header y el footer con fetch
fetch('../HTML/header.html')
.then(res => res.text())
.then(html => {
    document.getElementById('header-container').innerHTML = html;
    const script = document.createElement('script');
    script.src = '../JS/header.js';
    script.defer = true;
    document.body.appendChild(script);
})
fetch('../HTML/footer.html')
.then(response => response.text())
.then(data => document.getElementById('footer-container').innerHTML = data);