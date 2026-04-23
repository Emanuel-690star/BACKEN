require('dotenv').config();

const express = require('express');
const cors = require('cors');
const logger = require('morgan');
const bodyParser = require('body-parser');
const db = require('./models');

const http = require('http');
//////////
const app = express();
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res)=> res.status(200).send({
    message: 'Bienvenido a mi api de tienda virtual',
}));

require('./routes/route_categorias')(app);
require('./routes/route_usuarios')(app);
require('./routes/route_productos')(app);
require('./routes/route_carritos')(app);
require('./routes/route_carrito_detalle')(app);

// Crear usuario admin inicial si no existe
db.tbc_usuarios.findOrCreate({
    where: { email: 'admin@admin.com' },
    defaults: {
        nombre: 'Admin',
        direccion: 'Admin',
        telefono: '0000000000',
        email: 'admin@admin.com',
        password: 'admin123',
        rol: 'admin',
        fecha_registro: new Date(),
    }
})
.then(([user, created]) => {
    if (created) {
        console.log('Admin inicial creado: admin@admin.com / admin123');
    }
})
.catch(error => {
    console.error('Error creando admin inicial:', error);
});

const port = parseInt(process.env.PORT, 10) || 8000;
app.set('port', port);

const server = http.createServer(app);
server.listen(port);

server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`El puerto ${port} ya esta en uso. Cambia PORT en BACKEN/.env o cierra el proceso que lo esta ocupando.`);
        process.exit(1);
    }

    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
});

server.on('listening', () => {
    console.log(`API escuchando en http://localhost:${port}`);
});

module.exports = app;
