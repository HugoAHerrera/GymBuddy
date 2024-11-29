function IMCCalculator() {
    const user_cm = document.getElementById("user-cm-input");
    const user_kg = document.getElementById("user-kg-input");
    const IMC = user_kg.value / (user_cm.value / 100) ** 2;

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
                title: `Te has comvertido en la persona más obesa del mundo con un IMC de: ${IMC.toFixed(2)}`,
                confirmButtonText: 'Okey',
                confirmButtonColor: '#3085d6',
                backdrop: true,
                allowOutsideClick: true,
                allowEscapeKey: true,
            });
    }
    else {
        Swal.fire({
                title: `Tu IMC es: ${IMC.toFixed(2)}`,
                confirmButtonText: 'Okey',
                confirmButtonColor: '#3085d6',
                backdrop: true,
                allowOutsideClick: true,
                allowEscapeKey: true,
            });
    }
}