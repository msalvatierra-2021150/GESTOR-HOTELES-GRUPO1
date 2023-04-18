// Exportaciones
const { request, response } = require('express')
// Modelo
const Hotel = require('../models/hotel');
const Evento = require('../models/evento');

//------------------------ver los eventos del hotel-------------------------------------
const getEventoH = async (req = request, res = response) => {
    const { id } = req.params;
    const hotelById = await Hotel.findById(id)

    const arreglo = hotelById.eventos
    const eventos = [];
    for(let x = 0; x< arreglo.length;x++){
        const eventoH = await Promise.all([
            Evento.findById(arreglo[x])
        ]);
        eventos.push(eventoH)
    }
    res.json({
            
        msg:eventos
    })

    
}
//------------------------------READ HOTELES-------------------------------------
const getHoteles = async (req = request, res = response) => {

    const listaHoteles = await Promise.all([
        Hotel.countDocuments({}),
        Hotel.find({}).populate('usuario', 'nombre')
            // Ordenando en base al rating (mayor rating aparece al inicio)
            .sort({ rating: -1 })
    ]);

    res.json({
        msg: 'GET API - Controlador hotel',
        listaHoteles
    });

}

//------------------------------READ by ID hotele---------------------------------
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

//------------------------------CREATE hoteles-------------------------------------
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

//------------------------------UPDATE hoteles-----------------------------------
const putHotel = async (req = request, res = response) => {

    const { id } = req.params;

    const { usuario, ...resto } = req.body;

    const hotelEditado = await Hotel.findByIdAndUpdate(id, resto, { new: true });

    res.status(201).json({
        msg: 'PUT API - Controlador hotel',
        hotelEditado
    });

}

//------------------------------DELETE hoteles-------------------------------------
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
    deleteHotel,
    getEventoH
}