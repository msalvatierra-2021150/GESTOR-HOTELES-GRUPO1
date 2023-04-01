//Desestructuracion de los objetos
const { response, request } = require('express');
const { existeHabitacionById } = require('../helpers/db-validators');
//Importacion de los modelos
const Reservacion = require('../models/reservacion');
const Habitacion = require('../models/habitacion');

//Mostrar el listado de reservaciones del admin hoteles
const getReservaciones = async (req = request, res = response) => {
    //Condiciones del get, devuelve todas las reservaciones realizadas
    const query = { usuario: req.usuario._id, estado: true };
    //Promesa para obtener los registros
    const listaReservas = await Promise.all([
        Reservacion.countDocuments(query),
        Reservacion.find(query).populate('habitaciones', 'precio capacidad disponible').populate('usuario', 'nombre')
    ]);
    //Impresion registros
    res.status(201).json({
        msg: 'Las reservas en su hotel son: ',
        listaReservas
    });
}

//Mostrar el listado de reservaciones por cliente
const getReservacionesId = async (req = request, res = response) => {
    //Condiciones del get, devuelve todas las reservaciones realizadas
    const query = { usuario: req.usuario._id, estado: true };
    //Promesa para obtener los registros
    const listaReservas = await Promise.all([
        Reservacion.countDocuments(query),
        Reservacion.find(query).populate('habitaciones', 'precio capacidad disponible').populate('usuario', 'nombre')
    ]);
    //Impresion registros
    res.status(201).json({
        msg: 'Sus reservas son: ',
        listaReservas
    });
}

//Agregar una habitacion a la reservacion
const postReservacion = async (req = request, res = response) => {
    //Desestructuracion del parametro recibido a travez de la URL
    const { id } = req.params;
    //Desestructuracion de los campos recibidos en el body
    const { fechaStart, fechaEnd, horaStart, horaEnd } = req.body;
    const habitacion = await existeHabitacionById(id);
    const reservas = await Reservacion.find({ usuario: req.usuario._id, estado: true });
    if (habitacion.disponible == true) {
        if (reservas.length >= 1) {
            //Acceder al objeto de reserva en el índice 0 del array
            const reservaExistente = reservas[0];
            if (!reservaExistente.habitaciones.includes(id)) {
                //Agrega el _id de la habitacion al arreglo
                reservaExistente.habitaciones.push(id);
                //Guarda la informacion en el array
                await reservaExistente.save();
                //Modifica el modelo en habitacion, cambiando el atributo disponible a false
                await Habitacion.updateMany({ _id: id }, { disponible: false });
                //Confirmacion de agregacion al array
                res.status(201).json('Se agrego correctamente la habitacion a su reservacion');
            } else {
                res.status(401).json('La habitacion seleccionada ya esta en su reserva');
            }
        } else {
            //Generar la data a guardar
            const fechaInicio = new Date(fechaStart.concat('T', horaStart));
            const fechaFin = new Date(fechaEnd.concat('T', horaEnd));

            const data = {
                usuario: req.usuario._id,
                habitaciones: id,
                fechaInicio,
                fechaFin
            };
            //Se crea una nueva reserva
            const reservaGuardada = await Reservacion(data);
            //Guarda la reserva
            await reservaGuardada.save();
            //Modifica el modelo en habitacion, cambiando el atributo disponible a false
            await Habitacion.updateMany({ _id: id }, { disponible: false });
            res.status(201).json(reservaGuardada);
        }
    } else {
        res.status(409).json({ error: 'Actualmente la habitacion no esta disponible' });
    }
}

//Edita la habitacion en la reservacion
const putReservacion = async (req = request, res = response) => {
    try {
        //Desestructuracion del parametro recibido a travez de la URL
        const { id } = req.params;
        //Desestructuracion de los campos a reemplazar
        const { fechaStart, fechaEnd, horaStart, horaEnd } = req.body;
        const reservas = await Reservacion.find({ usuario: req.usuario._id, estado: true });
        //Acceder al objeto de reserva en el índice 0 del array
        const reservaExistente = reservas[0];
        //Creacion de las fechas, concatenando los parametros recibidos
        const fechaInicio = new Date(fechaStart.concat('T', horaStart));
        const fechaFin = new Date(fechaEnd.concat('T', horaEnd));
        //Evaluaciones necesarias para el correcto funcionamiento
        if (!(reservas.length >= 1)) throw { status: 409, message: 'No puede editar una reservacion si no ha creado una primero' };
        if ((reservaExistente.fechaInicio.getTime() === fechaInicio.getTime())) throw { status: 409, message: 'La fecha de inicio es igual a la ingresada anteriormente' };
        if ((reservaExistente.fechaFin.getTime() === fechaFin.getTime())) throw { status: 409, message: 'La fecha de fin es igual a la ingresada anteriormente' };
        //Generar la data a guardar
        const data = {
            fechaInicio,
            fechaFin
        };
        //Editar usando el id
        const nuevaReserva = await Reservacion.findByIdAndUpdate(id, data, { new: true });
        res.status(200).json(nuevaReserva);
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message });
    }
}

//Borrar una habitacion en la reservacion
const deleteReservacionHabitacion = async (req = request, res = response) => {
    //Desestructuracion del parametro recibido a travez de la URL
    const { id } = req.params;
    const reservas = await Reservacion.find({ usuario: req.usuario._id, estado: true });

    if (reservas.length >= 1) {
        //Acceder al objeto de compra en el índice 0 del array
        const reservaExistente = reservas[0];
        if (reservaExistente.habitaciones.includes(id)) {
            //Obtenemos el indice del producto al arreglo
            let i = reservaExistente.habitaciones.indexOf(id);
            reservaExistente.habitaciones.splice(i, 1);
            await reservaExistente.save();
            //Modifica el modelo en habitacion, cambiando el atributo disponible a true
            await Habitacion.updateMany({ _id: id }, { disponible: true });
            res.status(200).json({ message: 'Habitacion eliminada correctamente' });
        } else {
            res.status(401).json({ error: 'La habitacion no se encuentra en el carrito' });
        }
    } else {
        res.status(401).json({ error: 'No puede eliminar una reservacion si no ha creado una primero' });
    }
}

//Borrar la reservacion
const deleteReservacion = async (req = request, res = response) => {
    //Desestructuracion del parametro recibido a travez de la URL
    const { id } = req.params;
    //Eliminar fisicamente de la DB
    const reservaEliminada = await Reservacion.findByIdAndDelete( id );
    res.status(200).json({ message: 'Reserva eliminada', reserva: reservaEliminada });
}

module.exports = {
    getReservaciones,
    getReservacionesId,
    postReservacion,
    putReservacion,
    deleteReservacionHabitacion,
    deleteReservacion
}