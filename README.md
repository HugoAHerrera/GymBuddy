# GymBuddy

## Miembros del Proyecto
- **Daniel Santiago Escribano**  
- **Álvaro Sanz Cortés**  
- **Germán Fábregas Vacas**  
- **Tomás Machín Esteve**  
- **Juan Federico García**  
- **Hugo Andrés Herrera de Miguel**

---

## Información Breve del Proyecto
GymBuddy es una aplicación web diseñada para los entusiastas del deporte. Entre sus funcionalidades principales se incluyen:  
- Un simulador de compra de productos deportivos.  
- Chats para facilitar la comunicación entre usuarios.  
- Herramientas para crear, editar y gestionar rutinas de entrenamiento personalizadas.
- Establecer desafios relacionados con el deporte

---

## Información de Despliegue
La aplicación está desplegada mediante servicios de **Azure** y es accesible en la siguiente URL:  
**[gymbuddy-sw.net](http://gymbuddy-sw.azurewebsites.net)**

---

## Información de Ejecución
### Navegador Web
No se necesita instalación adicional para usar la aplicación. Simplemente accede a la URL proporcionada desde cualquier navegador compatible.  

### Ejecución Local
Para ejecutar el proyecto localmente en **Visual Studio**, sigue estos pasos:  
1. Clona el repositorio del proyecto.
2. Versión de node utilizada: v20.18.0
3. Instalar las dependencias con npm update:
   ```bash
   npm install
   ```
   En caso de no funcionar, las dependencias son:  
   ```bash
   npm install mysql2
   npm install dotenv
   npm install bcrypt
   npm install express-session
   npm install multer
   npm install node-wit
   npm install dayjs
5. npm start
