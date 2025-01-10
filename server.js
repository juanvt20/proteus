const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Configuración de la base de datos
const db = mysql.createConnection({
    host: 'bxofidfdypgw3uodu6cy-mysql.services.clever-cloud.com',
    user: 'unfkim9wp47pp3qx',
    password: '4wzwvUG3iJxyQE6iEeUm',
    database: 'bxofidfdypgw3uodu6cy',
    port:3306
});

db.connect(err => {
    if (err) {
        console.error('Error conectando a la base de datos:', err);
        return;
    }
    console.log('Conectado a la base de datos MySQL');
});

// Endpoints
app.post('/addProduct', (req, res) => {
    const { codigo, producto, marca, codificacion, almacen } = req.body;
    const query = 'INSERT INTO productos (codigo, producto, marca, codificacion, almacen) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [codigo, producto, marca, codificacion, almacen], (err, result) => {
        if (err) return res.status(500).send(err);
        
        // Inicializa el stock del producto en 0
        const id_producto = result.insertId;
        const stockQuery = 'INSERT INTO stock (id_producto, stock) VALUES (?, ?)';
        db.query(stockQuery, [id_producto, 0], (err, stockResult) => {
            if (err) return res.status(500).send(err);
            res.send('Producto agregado exitosamente con stock inicializado');
        });
    });
});

app.post('/addEntry', (req, res) => {
    const { codigo, producto, marca, codificacion, cantidad, fecha, documento, observacion, proveedor } = req.body;

    // Verificar si el producto existe en la tabla de productos
    const getProductQuery = `
        SELECT id_producto 
        FROM productos 
        WHERE codigo = ? AND producto = ? AND marca = ? AND codificacion = ?
    `;

    db.query(getProductQuery, [codigo, producto, marca, codificacion], (err, results) => {
        if (err) {
            console.error('Error buscando el producto:', err);
            return res.status(500).send('Error en la base de datos');
        }

        if (results.length === 0) {
            return res.status(404).send('Producto no encontrado');
        }

        const id_producto = results[0].id_producto;

        // Insertar en la tabla de entradas
        const insertEntryQuery = `
            INSERT INTO entradas (id_producto, cantidad, fecha, documento, observacion, proveedor) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        db.query(insertEntryQuery, [id_producto, cantidad, fecha, documento, observacion, proveedor], (err, result) => {
            if (err) {
                console.error('Error insertando en entradas:', err);
                return res.status(500).send('Error al registrar la entrada');
            }

            // Actualizar el stock del producto
            const updateStockQuery = 'UPDATE stock SET stock = stock + ? WHERE id_producto = ?';

            db.query(updateStockQuery, [cantidad, id_producto], (err, stockResult) => {
                if (err) {
                    console.error('Error actualizando stock:', err);
                    return res.status(500).send('Error al actualizar el stock');
                }

                res.send('Entrada registrada y stock actualizado exitosamente');
            });
        });
    });
});

app.post('/addExit', (req, res) => {
    const { id_producto, cantidad, recibio, cliente, ot, pago } = req.body;
    const query = 'INSERT INTO salidas (id_producto, cantidad, recibio, cliente, ot, pago) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(query, [id_producto, cantidad, recibio, cliente, ot, pago], (err, result) => {
        if (err) return res.status(500).send(err);
        
        // Reduce el stock
        const stockQuery = 'UPDATE stock SET stock = stock - ? WHERE id_producto = ?';
        db.query(stockQuery, [cantidad, id_producto], (err, stockResult) => {
            if (err) return res.status(500).send(err);
            res.send('Salida registrada y stock actualizado exitosamente');
        });
    });
});

app.get('/getProducts', (req, res) => {
    const query = 'SELECT id_producto, codigo, producto, marca, codificacion FROM productos';
    db.query(query, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

app.get('/getEntradas', (req, res) => {
    const query = 'SELECT id_entrada, id_producto, cantidad, producto, marca, codificacion, fecha, documento, observacion,proveedor FROM entradas';
    db.query(query, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

app.get('/getStock', (req, res) => {
    const query = `
        SELECT p.codigo, p.producto, p.marca, s.stock
        FROM stock s
        INNER JOIN productos p ON s.id_producto = p.id_producto
    `;
    db.query(query, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

app.listen(3000, () => {
    console.log('Servidor corriendo en el puerto 3000');
});
