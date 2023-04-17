//Importaciones de nodejs
const express = require('express');
const cors = require('cors');
const { dbConection } = require('../database/config');

class Server {

    constructor() {
        //Configuración inicial
        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            auth:    '/api/auth',
            adminApp:   '/api/admin',
            cliente: '/api/clientes',
            roles: '/api/roles',
            reservacion: '/api/reservaciones',
            habitacion: '/api/habitacion',
            adminHotel:   '/api/adminHotel',
            servicios:'/api/servicios',
            evento:'/api/evento',
            departamentos: '/api/departamentos',
            tipoEvento: '/api/tipoEvento',
            habitaciones: '/api/habitaciones',
            hoteles: '/api/hoteles',
            carritoServicios:    '/api/cartServicios',
            carritoReservaciones:    '/api/cartReservaciones',
            factura: '/api/facturas',
            buscar:'/api/buscar/'
        }


        //Conectar a base de datos
        this.conectarDB();

        // Middlewares
        this.middlewares();

        //Rutas de mi app
        this.routes();

    }

    //Función de conexión
    async conectarDB() {
        await dbConection();
    }

    //Un middleware es una función que se ejecuta antes de las rutas
    middlewares() {

        // CORS
        this.app.use(cors());

        // Lectura y parseo del Body
        this.app.use(express.json());

        //Directorio publico
        this.app.use(express.static('public'));

    }


    routes() {
        this.app.use(this.paths.auth , require('../routes/auth'));
        this.app.use(this.paths.adminApp, require('../routes/admin'));
        this.app.use(this.paths.cliente, require('../routes/cliente')); 
        this.app.use(this.paths.roles, require('../routes/role')); 
        this.app.use(this.paths.adminHotel, require('../routes/adminHotel'));
        this.app.use(this.paths.habitacion, require('../routes/habitacion'));
        this.app.use(this.paths.reservacion, require('../routes/reservacion'));
        this.app.use(this.paths.servicios, require('../routes/servicios'));
        this.app.use(this.paths.evento, require('../routes/evento'));
        this.app.use(this.paths.departamentos, require('../routes/departamento-nombre'));
        this.app.use(this.paths.tipoEvento, require('../routes/tipoEvento'));
        this.app.use(this.paths.habitaciones, require('../routes/habitacion'));
        this.app.use(this.paths.hoteles, require('../routes/hotel'));
        this.app.use(this.paths.carritoServicios, require('../routes/cartServicios'));
        this.app.use(this.paths.carritoReservaciones, require('../routes/cartReservaciones'));
        this.app.use(this.paths.factura, require('../routes/factura')); 
        this.app.use(this.paths.buscar , require('../routes/buscar'));
    }


    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en puerto ', this.port);
        })
    }


}


//Importamos la clase Server
module.exports = Server;