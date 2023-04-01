// Exportaciones
const { request, response } = require('express')
// Modelo
const Habitacion = require('../models/habitacion');

//------------------------------READ habitaciones-------------------------------------
const getHabitaciones = async (req = request, res = response) => {

    const query = { disponible: true };

    const listaHabitaciones = await Promise.all([
        Habitacion.countDocuments(query),
        Habitacion.find(query).populate('usuario', 'nombre')
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

//------------------------------CREATE habitacion-------------------------------------
const postHabitacion = async ( req = request, res = response ) => {

    const { ...resto } = req.body;

    const data = {
        ...resto,
        usuario: req.usuario._id
    }

    const habitacionDb = await Habitacion(data);

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
    postHabitacion,
    putHabitacion,
    deleteHabitacion
}