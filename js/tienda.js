// js/tienda.js

// 0. VERIFICACIÓN DE SEGURIDAD (Bloquea el acceso si no estás logueado)
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

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    if (input.type === "password") {
        input.type = "text";
    } else {
        input.type = "password";
    }
}

function registrarUsuario(event) {
    event.preventDefault();
    const usuario = document.getElementById("reg-username").value.trim();
    const pass = document.getElementById("reg-password").value;

    if (usuario && pass) {
        let usuariosBD = JSON.parse(localStorage.getItem("fate_usuarios_bd")) || {};
        
        if (usuariosBD[usuario]) {
            alert("Este usuario ya existe. Por favor, elige otro nombre.");
        } else {
            usuariosBD[usuario] = pass;
            localStorage.setItem("fate_usuarios_bd", JSON.stringify(usuariosBD));
            
            alert("¡Registro exitoso! Ahora puedes iniciar sesión con tus nuevos datos.");
            document.getElementById("reg-username").value = '';
            document.getElementById("reg-password").value = '';
            mostrarLogin();
        }
    }
}

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

function cerrarSesion() {
    if(confirm("¿Estás seguro de que deseas cerrar tu sesión de Master?")) {
        localStorage.removeItem("fate_user"); // Borramos el usuario activo, pero conservamos el carrito en localStorage
        window.location.href = "login.html";
    }
}


// ==========================================
// FUNCIONES DEL CARRITO DE COMPRAS
// ==========================================

function agregarAlCarrito(nombreProducto, precio, idInputCantidad) {
    const cantidad = parseInt(document.getElementById(idInputCantidad).value);
    
    if (cantidad > 0) {
        let carrito = JSON.parse(localStorage.getItem("fate_carrito")) || [];
        
        carrito.push({
            producto: nombreProducto,
            precio: parseFloat(precio),
            cantidad: cantidad,
            subtotal: parseFloat(precio) * cantidad
        });

        localStorage.setItem("fate_carrito", JSON.stringify(carrito));
        alert("Se agregaron " + cantidad + " unidad(es) de " + nombreProducto + " a tu carrito.");
        
        // Opcional: Reiniciar el input a 0 después de agregar
        document.getElementById(idInputCantidad).value = 0;
    } else {
        alert("Por favor ingresa una cantidad válida mayor a 0.");
    }
}

function cargarCarrito() {
    const cuerpoTabla = document.getElementById("cuerpo-carrito");
    const totalElemento = document.getElementById("total-pagar");
    const carrito = JSON.parse(localStorage.getItem("fate_carrito")) || [];
    const usuario = localStorage.getItem("fate_user") || "Master Desconocido";
    
    if (document.getElementById("nombre-cliente")) {
        document.getElementById("nombre-cliente").textContent = usuario;
        let totalGral = 0;
        cuerpoTabla.innerHTML = ""; 

        if (carrito.length === 0) {
            cuerpoTabla.innerHTML = "<tr><td colspan='4' style='text-align:center;'>Tu carrito está vacío.</td></tr>";
        } else {
            carrito.forEach((item) => {
                totalGral += item.subtotal;
                cuerpoTabla.innerHTML += `
                    <tr>
                        <td>${item.producto}</td>
                        <td>$${item.precio.toFixed(2)}</td>
                        <td>${item.cantidad}</td>
                        <td style="color: var(--gold); font-weight: bold;">$${item.subtotal.toFixed(2)}</td>
                    </tr>
                `;
            });
        }
        totalElemento.textContent = "$" + totalGral.toFixed(2);
    }
}

function vaciarCarrito() {
    if(confirm("¿Estás seguro de eliminar todos los artículos de tu carrito?")) {
        localStorage.removeItem("fate_carrito");
        cargarCarrito();
    }
}

function imprimirFactura() {
    window.print();
}