function showSection(section) {
    document.getElementById('productos').style.display = 'none';
    document.getElementById('entradas').style.display = 'none';
    document.getElementById('salidas').style.display = 'none';
    document.getElementById('stock').style.display = 'none';

    document.getElementById(section).style.display = 'block';
}

document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        showSection(e.target.getAttribute('href').substring(1));
    });
});

/// agregar producto
async function addProduct() {
    const codigo = document.getElementById('codigo').value;
    const producto = document.getElementById('producto').value;
    const marca = document.getElementById('marca').value;
    const codificacion = document.getElementById('codificacion').value;
    const almacen = document.getElementById('almacen').value;

    if (codigo && producto && marca && codificacion && almacen) {
        try {
            const response = await fetch('http://localhost:3000/addProduct', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ codigo, producto, marca, codificacion, almacen })
            });

            if (response.ok) {
                alert('Producto agregado exitosamente');
                document.getElementById('product-form').reset();
                loadProducts(); // Recargar la lista de productos
            } else {
                alert('Error al agregar el producto');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    } else {
        alert('Por favor, completa todos los campos.');
    }
}

// cargar los datos de producto
async function loadProducts() {
    try {
        const response = await fetch('http://localhost:3000/getProducts');
        const products = await response.json();

        const tableBody = document.getElementById('product-table').querySelector('tbody');
        tableBody.innerHTML = ''; // Limpiar tabla antes de agregar nuevos productos

        products.forEach(product => {
            const newRow = tableBody.insertRow();
            newRow.innerHTML = `
                <td>${product.codigo}</td>
                <td>${product.producto}</td>
                <td>${product.marca}</td>
                <td>${product.codificacion}</td>
                <td>${product.almacen}</td>
            `;
        });
    } catch (error) {
        console.error('Error al cargar productos:', error);
    }
}

// Cargar productos al iniciar la página
document.addEventListener('DOMContentLoaded', loadProducts);


async function addEntry() {
    const codigo = document.getElementById('codigo').value;
    const producto = document.getElementById('producto').value;
    const marca = document.getElementById('marca').value;
    const codificacion = document.getElementById('codificacion').value;
    const cantidad = document.getElementById('entry-cantidad').value.trim();
    const fecha = document.getElementById('entry-fecha').value.trim();
    const documento = document.getElementById('entry-doc').value.trim();
    const observacion = document.getElementById('entry-obs').value.trim();
    const proveedor = document.getElementById('entry-proveedor').value.trim();

    if (codigo & producto & marca & codificacion & cantidad & fecha & documento) {
        alert('Por favor, completa todos los campos obligatorios.');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/addEntry', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ codigo, producto, marca, codificacion, cantidad, fecha, documento, observacion, proveedor })
        });

        if (response.ok) {
            alert('Entrada registrada exitosamente');
            document.getElementById('entry-form').reset();
        } else {
            const errorMessage = await response.text();
            alert('Error al registrar la entrada: ' + errorMessage);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error en la conexión con el servidor.');
    }
}



async function fetchProducts() {
    try {
        const response = await fetch('http://localhost:3000/getProducts');
        productosLista = await response.json();
    } catch (error) {
        console.error('Error al cargar productos:', error);
    }
}

// Función para filtrar y mostrar sugerencias
function mostrarSugerencias() {
    const input = document.getElementById('entry-producto');
    const sugerenciasDiv = document.getElementById('sugerencias-producto');
    const filtro = input.value.toLowerCase();

    sugerenciasDiv.innerHTML = '';

    if (!filtro) return;

    const productosFiltrados = productosLista.filter(producto =>
        producto.producto.toLowerCase().includes(filtro)
    );

    productosFiltrados.forEach(producto => {
        const div = document.createElement('div');
        div.textContent = `${producto.producto} (${producto.marca})`;
        div.onclick = () => seleccionarProducto(producto);
        sugerenciasDiv.appendChild(div);
    });
}

// Función para seleccionar un producto de la lista
function seleccionarProducto(producto) {
    document.getElementById('entry-codigo').value = producto.codigo;
    document.getElementById('entry-producto').value = producto.producto;
    document.getElementById('entry-marca').value = producto.marca;
    document.getElementById('entry-codificacion').value = producto.codificacion;

    document.getElementById('sugerencias-producto').innerHTML = '';
}

// Cargar productos al iniciar la página
document.addEventListener('DOMContentLoaded', fetchProducts);

async function loadEntries() {
    try {
        const response = await fetch('http://localhost:3000/getEntradas');
        const entries = await response.json();

        const tableBody = document.getElementById('entry-table').querySelector('tbody');
        tableBody.innerHTML = ''; // Limpiar la tabla antes de agregar nuevas entradas

        entries.forEach(entry => {
            const newRow = tableBody.insertRow();
            newRow.innerHTML = `
                <td>${entry.codigo}</td>
                <td>${entry.producto}</td>
                <td>${entry.marca}</td>
                <td>${entry.codificacion}</td>
                <td>${entry.fecha}</td>
                <td>${entry.documento}</td>
                <td>${entry.observacion || ''}</td>
                <td>${entry.proveedor || ''}</td>
            `;
        });
    } catch (error) {
        console.error('Error al cargar entradas:', error);
    }
}

// Cargar entradas al iniciar la página
document.addEventListener('DOMContentLoaded', loadEntries);

function addExit() {
    const codigo = document.getElementById('exit-codigo').value;
    const producto = document.getElementById('exit-producto').value;
    const marca = document.getElementById('exit-marca').value;
    const codificacion = document.getElementById('exit-codificacion').value;
    const cantidad = document.getElementById('exit-cantidad').value;
    const recibio = document.getElementById('exit-recibio').value;
    const cliente = document.getElementById('exit-cliente').value;
    const ot = document.getElementById('exit-marca').value;
    const pago = document.getElementById('exit-pago').value;

    if (codigo && producto && cantidad && fecha && obs) {
        const table = document.getElementById('exit-table').querySelector('tbody');
        const newRow = table.insertRow();

        newRow.innerHTML = `
            <td>${codigo}</td>
            <td>${producto}</td>
            <td>${marca}</td>
            <td>${codificacion}</td>
            <td>${cantidad}</td>
            <td>${recibio}</td>
            <td>${cliente}</td>
            <td>${ot}</td>
            <td>${pago}</td>
        `;

        document.getElementById('exit-form').reset();
    } else {
        alert('Por favor, completa todos los campos.');
    }
}
