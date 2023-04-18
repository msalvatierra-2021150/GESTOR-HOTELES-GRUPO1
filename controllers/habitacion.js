// Exportaciones
const { request, response } = require('express')
// Modelo
const Habitacion = require('../models/habitacion');
const Hotel = require('../models/hotel');

//------------------------------READ habitaciones-------------------------------------
const getHabitaciones = async (req = request, res = response) => {

    const query = { disponible: true };

    const listaHabitaciones = await Promise.all([
        Habitacion.countDocuments(query),
        Habitacion.find(query).populate('hotel', 'nombre')
    ]);

    res.json({
        msg: 'GET API - Controlador habitacion',
        listaHabitaciones
    });

}

//------------------------------READ by ID habitacion---------------------------------
const getHabitacionById = async (req = request, res = response) => {

    const { id } = req.params;

    const habitacionById = await Promise.all([
        Habitacion.findOne({
            _id: id,
            $and: [
                // Comprobando que la habitacion a buscar se encuentre disponible
                { disponible: true }
            ]
        })
    ]);

    res.json({
        msg: 'GET BY ID API - Controlador habitacion',
        habitacionById
    })

}

//------------------------------READ by ID habitacion---------------------------------
const getHabitacionesActivas = async (req = request, res = response) => {
    //Condiciones del get, devuelve todas las reservaciones realizadas
    const query = { disponible: true };
    const hotelAdminBD = await Hotel.find({ usuario: req.usuario._id }).lean();
    const habitacionesDB = await Habitacion.find(query).lean();

    if (hotelAdminBD.length === 0) {
        return res.status(400).json({
            msg: "No se encontró ningún hotel para el usuario administrador proporcionado.",
        });
    }

    const matchs = [];
    //Nos posicionamos en el arreglo de hoteles
    for (let k = 0; k < hotelAdminBD.length; k++) {
        const hotelAdmin = hotelAdminBD[k];
        //Se recorre el arreglo de reservaciones
        for (let j = 0; j < habitacionesDB.length; j++) {
            const habitaciones = habitacionesDB[j];
            //Buscar las habitaciones que estan en el arreglo segun su id
            const hotelHabitacionClient = await Hotel.findById(habitaciones.hotel).lean();
            if (!hotelHabitacionClient) {
                return res.status(400).json({ msg: 'No se encontró el hotel de la habitación.' });
            }
            if (hotelHabitacionClient._id.toString() === hotelAdmin._id.toString()) {
                matchs.push(habitaciones);
            }
        }
    }
    //Devolvemos las reservaciones si todo ha ido bien
    if (matchs.length === 0) {
        return res.status(400).json({
            msg: "El usuario cliente proporcionado, no tiene ninguna habitacion activa en sus hoteles.",
        });
    } else {
        return res.json({ habitacionesActivas: matchs });
    }
}

//------------------------------READ habitaciones BY Hotel-------------------------------------
const getHabitacionesByHotel = async (req = request, res = response) => {

    const { id } = req.params;

    const query = { hotel: id };

    const listaHabitacionesHotel = await Promise.all([
        Habitacion.countDocuments(query),
        Habitacion.find(query).populate('usuario', 'nombre').populate('hotel', 'nombre')
    ]);

    res.json({
        msg: 'GET API - Controlador habitacion',
        listaHabitacionesHotel
    });
}

//------------------------------CREATE habitacion-------------------------------------
const postHabitacion = async (req = request, res = response) => {

    const { ...resto } = req.body;

    const habitacionDb = await Habitacion(resto);
    await habitacionDb.save();

    res.status(201).json({
        msg: 'POST API - Controlador habitacion',
        habitacionDb
    });

}

//------------------------------UPDATE habitaciones-----------------------------------
const putHabitacion = async (req = request, res = response) => {

    const { id } = req.params;

    const { hotel, ...resto } = req.body;

    const habitacionEditada = await Habitacion.findByIdAndUpdate(id, resto, { new: true });
    res.status(201).json({
        msg: 'PUT API - Controlador habitacion',
        habitacionEditada
    });

}

//------------------------------DELETE habitacion-------------------------------------
const deleteHabitacion = async (req = request, res = response) => {

    const { id } = req.params;

    // Se elimina físicamente de la DB
    const habitacionEliminada = await Habitacion.findByIdAndDelete(id);

    // Se elimina lógicamente de la DB
    //const habitacionEliminada = await Habitacion.findByIdAndUpdate(id, { disponible: false });

    res.json({
        msg: 'DELETE API - Controlador habitacion',
        habitacionEliminada
    })

}

//------------------------------Exportanciones----------------------------------------

module.exports = {
    getHabitaciones,
    getHabitacionById,
    getHabitacionesActivas,
    getHabitacionesByHotel,
    postHabitacion,
    putHabitacion,
    deleteHabitacion
}