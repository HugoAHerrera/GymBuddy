const { Wit } = require('node-wit');

const client = new Wit({ accessToken: process.env.WIT_ACCESS_TOKEN });

const respuestas = {
    'ejercicio_de_brazo': [
        'Puedes hacer ejercicios como flexiones, curl de bíceps con mancuernas, y tríceps en banco.',
        'Los mejores ejercicios para bíceps son el curl de bíceps con barra, y para tríceps puedes hacer fondos o press francés.',
        'Te recomiendo hacer rutinas que incluyan curl de bíceps, dominadas y press militar para hombros.'
    ],

    'ejercicio_de_pierna': [
        'Puedes hacer sentadillas, press de pierna y estocadas para trabajar las piernas.',
        'Los mejores ejercicios para piernas incluyen sentadillas, peso muerto y extensiones de pierna.',
        'Para un entrenamiento completo de piernas, incluye ejercicios como las sentadillas, el press de pierna y las zancadas.'
    ],

    'ejercicio_de_pecho': [
        'Te recomiendo hacer press de banca, flexiones y aperturas con mancuernas para el pecho.',
        'Los mejores ejercicios para el pecho incluyen el press de banca y las flexiones.',
        'Para pecho, puedes hacer press de banca plano, inclinada o declinada, y flexiones.'
    ],

    'ejercicio_de_espalda': [
        'Para la espalda, realiza dominadas, remo con barra y peso muerto.',
        'Los mejores ejercicios para la espalda son las dominadas, el remo y el peso muerto.',
        'Te recomiendo hacer ejercicios como pull-ups, remo con barra y peso muerto.'
    ],

    'ejercicio_de_abdomen': [
        'Haz abdominales, planchas y levantamientos de piernas para trabajar el abdomen.',
        'Para el abdomen, las planchas, crunches y elevaciones de pierna son muy efectivos.',
        'Los ejercicios como los crunches, las planchas y los levantamientos de piernas ayudan a tonificar el abdomen.'
    ],

    'ejercicio_de_cuerpo_completo': [
        'Una rutina de cuerpo completo podría incluir sentadillas, press de banca, remo, y abdominales.',
        'Para un entrenamiento de cuerpo completo, puedes hacer ejercicios como flexiones, burpees, y peso muerto.',
        'Te recomiendo ejercicios como sentadillas, press de banca y dominadas para un entrenamiento completo de cuerpo.'
    ],

    'informacion_gymbuddy': [
        'Gymbuddy es una aplicación web diseñada para ayudarte a ponerte en forma, crear rutinas y seguir tu progreso.',
        'Gymbuddy te permite crear un plan de entrenamiento personalizado y seguir tus metas fitness.',
        'Gymbuddy es una plataforma que te ayuda a mejorar tu rendimiento en el gimnasio mediante ejercicios, rutinas y seguimiento del progreso.'
    ],

    'funciones_sociales': [
        'En Gymbuddy, puedes hablar con tus amigos a través de chats, compartir tus rutinas y seguir su progreso.',
        'Gymbuddy te permite comunicarte con tus amigos, intercambiar consejos de entrenamiento y mantenerte motivado.',
        'Además de entrenar, puedes tener chats con tus amigos y compartir fotos y logros de tu entrenamiento.'
    ],

    'perfil_usuario': [
        'Puedes personalizar tu perfil en Gymbuddy añadiendo una foto y ver tus estadísticas.'
    ],

    'consejos_generales': [
        'Es importante calentar antes de cada entrenamiento y estirar al final para evitar lesiones.',
        'Recuerda siempre mantener una buena postura durante los ejercicios y escucha a tu cuerpo.',
        'No te olvides de descansar y permitir que tu cuerpo se recupere entre entrenamientos.'
    ],

    'dieta_y_nutricion': [
        'Una buena dieta es clave para tus resultados. Asegúrate de incluir proteínas, carbohidratos y grasas saludables.',
        'Recuerda mantenerte hidratado y comer alimentos ricos en proteínas para ayudar a la recuperación muscular.',
        'La nutrición juega un papel crucial en tu rendimiento físico, asegúrate de comer adecuadamente según tus metas.'
    ],

    'motivacion': [
        'No te rindas, cada entrenamiento te acerca más a tus objetivos. ¡Sigue adelante!',
        'Recuerda que el progreso lleva tiempo. ¡Cada día es una oportunidad para mejorar!',
        'Mantén la motivación alta, ¡el éxito está en la constancia y el esfuerzo diario!'
    ],

    'default': [
        'No estoy seguro de cómo responder a eso. Solo se sobre el gimnasio y gymbuddy',
        'No tengo la respuesta exacta para eso, búscalo en Internet.'
    ]
};

const handleMessage = (req, res) => {
    const mensaje = req.body.message;

    client.message(mensaje, {})
        .then(response => {
            const intent = response.intents[0]?.name || 'default';
            const respuesta = respuestas[intent] || respuestas['default'];
            res.json({ respuesta: respuesta[Math.floor(Math.random() * respuesta.length)] });
        })
        .catch(err => {
            console.error('Error con Wit.ai:', err);
            res.status(500).json({ error: 'Error con Wit.ai' });
        });
};

module.exports = {
    handleMessage
};
