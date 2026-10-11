// js/tienda.js

// 1. FUNCIÓN DE LOGIN / REGISTRO
function iniciarSesion(event) {
    event.preventDefault(); // Evita que la página se recargue
    const usuario = document.getElementById("username").value;
    const pass = document.getElementById("password").value;

    if (usuario && pass) {
        // Guardamos el usuario en LocalStorage
        localStorage.setItem("fate_user", usuario);
        alert("¡Bienvenido Master " + usuario + "! Acceso concedido.");
        window.location.href = "tienda.html"; // Redirige al catálogo
    } else {
        alert("Por favor ingresa tu usuario y contraseña.");
    }
}

// 2. FUNCIÓN PARA AGREGAR AL CARRITO
function agregarAlCarrito(nombreProducto, precio, idInputCantidad) {
    const cantidad = parseInt(document.getElementById(idInputCantidad).value);
    
    if (cantidad > 0) {
        // Recuperamos el carrito actual o creamos uno vacío
        let carrito = JSON.parse(localStorage.getItem("fate_carrito")) || [];
        
        // Agregamos el nuevo producto
        carrito.push({
            producto: nombreProducto,
            precio: parseFloat(precio),
            cantidad: cantidad,
            subtotal: parseFloat(precio) * cantidad
        });

        // Guardamos de nuevo en LocalStorage
        localStorage.setItem("fate_carrito", JSON.stringify(carrito));
        alert("Se agregaron " + cantidad + " unidad(es) de " + nombreProducto + " a tu carrito.");
    } else {
        alert("Por favor ingresa una cantidad válida.");
    }
}

// 3. FUNCIÓN PARA MOSTRAR EL CARRITO Y CALCULAR TOTALES
function cargarCarrito() {
    const cuerpoTabla = document.getElementById("cuerpo-carrito");
    const totalElemento = document.getElementById("total-pagar");
    const carrito = JSON.parse(localStorage.getItem("fate_carrito")) || [];
    const usuario = localStorage.getItem("fate_user") || "Master Desconocido";
    
    document.getElementById("nombre-cliente").textContent = usuario;

    let totalGral = 0;
    cuerpoTabla.innerHTML = ""; // Limpiamos la tabla

    if (carrito.length === 0) {
        cuerpoTabla.innerHTML = "<tr><td colspan='4' style='text-align:center;'>Tu carrito está vacío.</td></tr>";
    } else {
        carrito.forEach((item, index) => {
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

// 4. FUNCIÓN PARA VACIAR EL CARRITO
function vaciarCarrito() {
    if(confirm("¿Estás seguro de eliminar todos los artículos de tu carrito?")) {
        localStorage.removeItem("fate_carrito");
        cargarCarrito();
    }
}

// 5. FUNCIÓN PARA IMPRIMIR LA FACTURA
function imprimirFactura() {
    window.print();
}