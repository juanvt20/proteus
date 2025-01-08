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

/*function addProduct() {
    const codigo = document.getElementById('codigo').value;
    const producto = document.getElementById('producto').value;
    const marca = document.getElementById('marca').value;
    const codificacion = document.getElementById('codificacion').value;
    const almacen = document.getElementById('almacen').value;

    if (codigo && producto && marca && codificacion && almacen) {
        const table = document.getElementById('product-table').querySelector('tbody');
        const newRow = table.insertRow();

        newRow.innerHTML = `
            <td>${codigo}</td>
            <td>${producto}</td>
            <td>${marca}</td>
            <td>${codificacion}</td>
            <td>${almacen}</td>
        `;

        document.getElementById('product-form').reset();
    } else {
        alert('Por favor, completa todos los campos.');
    }
}*/
async function addProduct() {
    const codigo = document.getElementById('codigo').value;
    const producto = document.getElementById('producto').value;
    const marca = document.getElementById('marca').value;
    const codificacion = document.getElementById('codificacion').value;
    const almacen = document.getElementById('almacen').value;

    if (codigo && producto && marca && codificacion && almacen) {
        try {
            const response = await fetch('http://localhost:3306/addProduct', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ codigo, producto, marca, codificacion, almacen })
            });

            if (response.ok) {
                alert('Producto agregado exitosamente');
                document.getElementById('product-form').reset();
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

async function loadProducts() {
    try {
        const response = await fetch('http://localhost:3306/getProducts');
        const products = await response.json();

        const productSelect = document.getElementById('entry-producto');
        productSelect.innerHTML = '<option value="">Seleccionar Producto</option>';

        products.forEach(product => {
            const option = document.createElement('option');
            option.value = product.id_producto;
            option.textContent = `${product.producto} (${product.codigo})`;
            option.dataset.codigo = product.codigo;
            option.dataset.marca = product.marca;
            option.dataset.codificacion = product.codificacion;
            productSelect.appendChild(option);
        });

        productSelect.addEventListener('change', () => {
            const selectedOption = productSelect.options[productSelect.selectedIndex];
            document.getElementById('entry-codigo').value = selectedOption.dataset.codigo || '';
            document.getElementById('entry-marca').value = selectedOption.dataset.marca || '';
            document.getElementById('entry-codificacion').value = selectedOption.dataset.codificacion || '';
        });
    } catch (error) {
        console.error('Error al cargar productos:', error);
    }
}

// Llamar a loadProducts al mostrar la sección de entradas
document.querySelector('nav a[href="#entradas"]').addEventListener('click', loadProducts);


function addEntry() {
    const codigo = document.getElementById('entry-codigo').value;
    const producto = document.getElementById('entry-producto').value;
    const marca = document.getElementById('entry-marca').value;
    const codificacion = document.getElementById('entry-codificacion').value;
    const cantidad = document.getElementById('entry-cantidad').value;
    const fecha = document.getElementById('entry-fecha').value;
    const doc = document.getElementById('entry-doc').value;
    const obs = document.getElementById('entry-obs').value;
    const proveedor = document.getElementById('entry-proveedor').value;

    if (codigo && producto && cantidad && fecha && doc) {
        const table = document.getElementById('entry-table').querySelector('tbody');
        const newRow = table.insertRow();

        newRow.innerHTML = `
            <td>${codigo}</td>
            <td>${producto}</td>
            <td>${marca}</td>
            <td>${codificacion}</td>
            <td>${cantidad}</td>
            <td>${fecha}</td>
            <td>${doc}</td>
            <td>${obs}</td>
            <td>${proveedor}</td>
        `;

        document.getElementById('entry-form').reset();
    } else {
        alert('Por favor, completa todos los campos.');
    }
}

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
