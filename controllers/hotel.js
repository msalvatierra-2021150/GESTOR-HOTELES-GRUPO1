// Exportaciones
const { request, response } = require('express')
// Modelo
const Hotel = require('../models/hotel');

//------------------------------READ habitaciones-------------------------------------
const getHoteles = async (req = request, res = response) => {

    const listaHoteles = await Promise.all([
        Hotel.countDocuments({}),

        Hotel.find({}).populate('usuario', 'nombre').populate('departamento', 'nombre')
            // Ordenando en base al rating (mayor rating aparece al inicio)
            .sort({ rating: -1 })
    ]);

    res.json({
        msg: 'GET API - Controlador hotel',
        listaHoteles
    });

}

//------------------------------READ by ID habitacion---------------------------------
const getHotelById = async (req = request, res = response) => {

    const { id } = req.params;

    const hotelById = await Promise.all([
        Hotel.findOne({
            _id: id
        })
    ]);

    res.json({
        msg: 'GET BY ID API - Controlador hotel',
        hotelById
    })

}

//------------------------------CREATE habitacion-------------------------------------
const postHotel = async (req = request, res = response) => {

    const { usuario, ...resto } = req.body;

    const data = {
        ...resto,
        usuario: req.usuario._id
    }

    const hotelDB = await Hotel(data);

    await hotelDB.save();

    res.status(201).json({
        msg: 'POST API - Controlador hotel',
        hotelDB
    });

}

//------------------------------UPDATE habitaciones-----------------------------------
const putHotel = async (req = request, res = response) => {

    const { id } = req.params;

    const { usuario, ...resto } = req.body;

    const hotelEditado = await Hotel.findByIdAndUpdate(id, resto, { new: true });

    res.status(201).json({
        msg: 'PUT API - Controlador hotel',
        hotelEditado
    });

}

//------------------------------DELETE habitacion-------------------------------------
const deleteHotel = async (req = request, res = response) => {

    const { id } = req.params;

    // Se elimina físicamente de la DB
    const hotelEliminado = await Hotel.findByIdAndDelete(id);

    res.json({
        msg: 'DELETE API - Controlador hotel',
        hotelEliminado
    })

}

//------------------------------Exportanciones----------------------------------------

module.exports = {
    getHoteles,
    getHotelById,
    postHotel,
    putHotel,
    deleteHotel
}