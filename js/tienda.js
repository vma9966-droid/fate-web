// 0. VERIFICACIÓN DE SEGURIDAD
// Comprueba si el usuario ha iniciado sesión antes de permitirle entrar a páginas
//  Si no existe una sesión activa,
// se redirige al login para proteger el acceso.

function verificarSesion() {
    const usuarioActivo = localStorage.getItem("fate_user");
    const rutaActual = window.location.pathname;

    // Si intenta entrar a la tienda o carrito sin haberse logueado

    if (!usuarioActivo && (rutaActual.includes("tienda.html") || rutaActual.includes("carrito.html"))) {
        alert("Acceso denegado. Debes registrarte e iniciar sesión para acceder al Almacén Mágico.");
        window.location.href = "login.html";
    }
}
// Ejecutamos la verificación inmediatamente al cargar cualquier página
verificarSesion();

// ==========================================
// FUNCIONES DE LOGIN, REGISTRO Y SESIÓN
// ==========================================

// mostrarRegistro() y mostrarLogin()
// Cambian la vista del formulario de acceso entre el panel de login y el panel de registro.
// También actualizan el texto de encabezado para indicar qué operación está realizando el usuario.

function mostrarRegistro() {
    document.getElementById('login-container').style.display = 'none';
    document.getElementById('register-container').style.display = 'block';
    document.getElementById('form-title').textContent = 'Registro de Usuario';
    document.getElementById('form-subtitle').textContent = 'Crea tus credenciales de Master para acceder a la tienda.';
}

function mostrarLogin() {
    document.getElementById('register-container').style.display = 'none';
    document.getElementById('login-container').style.display = 'block';
    document.getElementById('form-title').textContent = 'Identificación de Master';
    document.getElementById('form-subtitle').textContent = 'Inicia sesión o regístrate para acceder a los suministros mágicos.';
}

// Revisa si el input es de tipo "password" (oculto con los puntos)
// y lo cambia a tipo "text" para que se pueda ver la contraseña al usuario.

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    if (input.type === "password") {
        input.type = "text";
    } else {
        input.type = "password";
    }
}

// Registrar un nuevo usuario en la base local del navegador.
// Se almacena una estructura en localStorage con el formato { usuario: password }.

function registrarUsuario(event) {
    event.preventDefault(); // Evita que el formulario se envíe y recargue la página
    const usuario = document.getElementById("reg-username").value.trim();
    const pass = document.getElementById("reg-password").value;

    // Validamos que el usuario y la contraseña no estén vacíos antes de guardar
    if (usuario && pass) {
        let usuariosBD = JSON.parse(localStorage.getItem("fate_usuarios_bd")) || {};

    // Recuperamos la base de datos de usuarios desde localStorage o 
    // inicializamos un objeto vacío

        if (usuariosBD[usuario]) {
            alert("Este usuario ya existe. Por favor, elige otro nombre.");
        } else {


            usuariosBD[usuario] = pass;
            // Guardamos la base de datos actualizada en localStorage
            localStorage.setItem("fate_usuarios_bd", JSON.stringify(usuariosBD));
            // Mensaje de éxito y limpieza de campos

            alert("¡Registro exitoso! Ahora puedes iniciar sesión con tus nuevos datos.");
            document.getElementById("reg-username").value = '';
            document.getElementById("reg-password").value = '';
            mostrarLogin();
        }
    }
}

// Inicia sesión validando las credenciales del usuario contra la base local.

// Si todo es correcto, se guarda el usuario activo en localStorage.
function iniciarSesion(event) {
    event.preventDefault();
    const usuario = document.getElementById("username").value.trim();
    const pass = document.getElementById("password").value;

    let usuariosBD = JSON.parse(localStorage.getItem("fate_usuarios_bd")) || {};

    if (!usuariosBD[usuario]) {
        alert("El usuario ingresado no existe. Por favor ve a 'Registrarse' para crear una cuenta.");
    } else if (usuariosBD[usuario] !== pass) {
        alert("La contraseña es incorrecta. Inténtalo nuevamente.");
    } else {
        localStorage.setItem("fate_user", usuario);
        alert("Login es correcto. ¡Bienvenido Master " + usuario + "!");
        window.location.href = "tienda.html";
    }
}

// Cierra la sesión del usuario activo y lo devuelve a la pantalla de login.
function cerrarSesion() {
    if(confirm("¿Estás seguro de que deseas cerrar tu sesión de Master?")) {
        localStorage.removeItem("fate_user");// Eliminamos la sesión activa del usuario
        window.location.href = "login.html";
    }
}


// ==========================================
// FUNCIONES DEL CARRITO DE COMPRAS
// ==========================================

// El carrito se guarda en localStorage para conservar los productos agregados
// aunque el usuario recargue la página o regrese a la tienda.

// Agrega un producto al carrito tomando el nombre, el precio y la cantidad indicada
// en el input correspondiente en la vista de la tienda.

function agregarAlCarrito(nombreProducto, precio, idInputCantidad) {
    const cantidad = parseInt(document.getElementById(idInputCantidad).value);

    if (cantidad > 0) {
        let carrito = JSON.parse(localStorage.getItem("fate_carrito")) || [];

        carrito.push({
            producto: nombreProducto,
            precio: parseFloat(precio),
            cantidad: cantidad,

            // Calculamos el subtotal multiplicando el precio por la cantidad
            subtotal: parseFloat(precio) * cantidad
        });

        localStorage.setItem("fate_carrito", JSON.stringify(carrito));
        // Mensaje de alerta actualizado
        alert("Se agregaron " + cantidad + " unidad(es) de " + nombreProducto + " a tu carrito.");

        // contador de productos en el carrito
        document.getElementById(idInputCantidad).value = 0;
        //se actualiza el contador de productos en el carrito
    } else {
        alert("Por favor ingresa una cantidad válida mayor a 0.");
    }
}

// Carga el contenido del carrito en la tabla del HTML, muestra el nombre del usuario activo
// y calcula el total general en MXN para mostrarlo al cliente.

function cargarCarrito() {
    const cuerpoTabla = document.getElementById("cuerpo-carrito");
    const totalElemento = document.getElementById("total-pagar");
    const carrito = JSON.parse(localStorage.getItem("fate_carrito")) || [];     //En local storage se guarda el carrito de compras del usuario activo
    const usuario = localStorage.getItem("fate_user") || "Master Desconocido"; // En local storage se guarda el nombre del usuario activo

    if (document.getElementById("nombre-cliente")) {
        document.getElementById("nombre-cliente").textContent = usuario;
        let totalGral = 0; // Inicializamos el total general en 0
        cuerpoTabla.innerHTML = "";

        if (carrito.length === 0) {
            cuerpoTabla.innerHTML = "<tr><td colspan='4' style='text-align:center;'>Tu carrito está vacío.</td></tr>";
        } else {
            carrito.forEach((item) => {
                totalGral += item.subtotal;
                // Formateo con la leyenda MXN
                cuerpoTabla.innerHTML += `
                    <tr>
                        <td>${item.producto}</td>
                        <td>$${item.precio.toLocaleString('es-MX', {minimumFractionDigits: 2, maximumFractionDigits: 2})} MXN</td>
                        <td>${item.cantidad}</td>
                        <td style="color: var(--gold); font-weight: bold;">$${item.subtotal.toLocaleString('es-MX', {minimumFractionDigits: 2, maximumFractionDigits: 2})} MXN</td>
                    </tr>
                `;
            });
        }
        // Suma Total general en pesos MXN
        totalElemento.textContent = "$" + totalGral.toLocaleString('es-MX', {minimumFractionDigits: 2, maximumFractionDigits: 2}) + " MXN";
    }
}

// Elimina todos los productos del carrito con confirmación.
function vaciarCarrito() {
    if(confirm("¿Estás seguro de eliminar todos los artículos de tu carrito?")) {
        localStorage.removeItem("fate_carrito");
        cargarCarrito();
    }
}

// Abre la vista de impresión del navegador para imprimir la factura del carrito.
function imprimirFactura() {
    window.print();
}