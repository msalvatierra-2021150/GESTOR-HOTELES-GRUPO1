const { response, request } = require('express');
const bcrypt = require('bcryptjs');
//Importación del modelo
const Usuario = require('../models/usuario');

const Factura = require('../models/factura');
const Habitaciones = require('../models/habitacion');
const Servicios = require('../models/servicios');
const Reservaciones = require('../models/reservacion');
const Hotel = require('../models/hotel');

const getServiciosHoteles = async (req = request, res = response) => {
    try {
        //id usuario
        const query = {usuario:req.usuario.id }
        //obtenes 
        const listaFactura = await Factura.findOne(query);
    
        const reservacionF = listaFactura.cart_reservaciones;
        
        const hoteles = [];
        const ids=[];
        for(let x = 0; x< reservacionF.length;x++){       
            const reservaciones = await Reservaciones.findById(reservacionF[x].itemId);       
            const habitacion = await reservaciones.habitaciones;
            for(let i = 0; i< habitacion.length;i++){
                const habitaciones = await Habitaciones.findById(habitacion[i].habitacion_id);
                const hotels = await Hotel.find(habitaciones.hotel);
                if(hotels){        
                    if(!ids.includes((habitaciones.hotel).toString())){
                        ids.push((habitaciones.hotel).toString());
                        hoteles.push(hotels);
                    }
                }          
            }
        }
        return res.json({
            msg: 'Hoteles:',hoteles 
        });
    } catch (err) {
        res.status(404).send({
            msg: "No se pudo obtener",
            err,
          });
    }
}

const getServiciosUser = async (req = request, res = response) => {
     try {
         //id usuario
         const query = {usuario:req.usuario.id }
         //obtenes 
         const listaFactura = await Factura.find(query);
        const serviciosU = [];
        const ids = [];
         for(let x = 0; x< listaFactura.length;x++){
            
            const serviciosF = listaFactura[x].cart_servicios;
            for(let i = 0; i< serviciosF.length;i++){
                const serviciosC = await Servicios.findById( (serviciosF[i].itemId));
                if(serviciosC){
                    if(!ids.includes((serviciosF[i].itemId).toString())){
                        ids.push((serviciosF[i].itemId).toString());
                        serviciosU.push(serviciosC);
                    }
                }
                
            }
         }
         res.json({
            msg: 'Servicios:',serviciosU       
        });
     } catch (err) {
        res.status(404).send({
            msg: "No se pudo obtener los servicios que ha consumido el cliente",
            err,
          });
     }
}

const getUsuarios = async (req = request, res = response) => {
    try {
        //condiciones del get
        const query = { estado: true , _id: req.usuario.id};
    
        const listaUsuarios = await Usuario.findById(query);
            return res.json({
                msg: 'get Api - Controlador Usuario',
                listaUsuarios
            });
    } catch (err) {
        res.status(404).send({
            msg: "No se pudo listar los Clientes",
            err,
          });
    }
}

const postUsuario = async (req = request, res = response) => {

    try {
        //Desestructuración
        const { nombre, correo, password} = req.body;
        rol = 'USUARIO_ROLE';
        const usuarioGuardadoDB = new Usuario({ nombre, correo, password, rol });
    
        //Encriptar password
        const salt = bcrypt.genSaltSync();
        usuarioGuardadoDB.password = bcrypt.hashSync(password, salt);
    
        //Guardar en BD
        await usuarioGuardadoDB.save();
    
        res.json({
            msg: 'Post Api - Post Usuario',
            usuarioGuardadoDB
        });
    } catch (err) {
        res.status(404).send({
            msg: "No se pudo agregar el cliente",
            err,
          });
    }

}


const putUsuario = async (req = request, res = response) => {
    try {
        //Req.params sirve para traer parametros de las rutas
        const { id } = req.usuario;
        const { _id, img,  rol,  estado, google, ...resto } = req.body;
        //Los parametros img, rol, estado y google no se modifican, el resto de valores si (nombre, correo y password)
    
        //Si la password existe o viene en el req.body, la encripta
        if ( resto.password ) {
            //Encriptar password
            const salt = bcrypt.genSaltSync();
            resto.password = bcrypt.hashSync(resto.password, salt);
        }
    
            //Editar al usuario por el id
            const usuarioEditado = await Usuario.findByIdAndUpdate(id, resto);
            return res.json({
                msg: 'PUT editar user',
                usuarioEditado
            });
    } catch (err) {
        res.status(404).send({
            msg: "No se pudo editar el cliente",
            err,
          });
    }
}

const deleteUsuario = async(req = request, res = response) => {
    try {
        //Req.params sirve para traer parametros de las rutas
        const { id } = req.usuario;
    
            //Eliminar cambiando el estado a false
            const usuarioEliminado = await Usuario.findByIdAndDelete(id);
    
            return res.json({
                msg: 'DELETE eliminar user',
                usuarioEliminado
            });
    } catch (err) {
        res.status(404).send({
            msg: "No se pudo eliminar el Cliente",
            err,
          });
    }
}

module.exports = {
    getUsuarios,
    postUsuario,
    putUsuario,
    deleteUsuario,
    getServiciosHoteles,
    getServiciosUser
}


// CONTROLADOR