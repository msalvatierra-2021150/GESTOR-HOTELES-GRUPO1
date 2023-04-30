// Exportaciones
const { request, response } = require('express')
// Modelo
const Hotel = require('../models/hotel');
const Evento = require('../models/evento');

//------------------------ver los eventos del hotel-------------------------------------
const getEventoH = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const hotelById = await Hotel.findById(id)
    
        const arreglo = hotelById.eventos
        const eventos = [];
        for(let x = 0; x< arreglo.length;x++){
            const eventoH = await 
                Evento.findById(arreglo[x]);
    
            eventos.push(eventoH)
        }
        res.json({
            msg:eventos
        })
    } catch (err) {
        res.status(404).send({
            msg: "No se pudo obtener los eventos del Hotel",
            err,
          });
    }
}

//------------------------------PUSH EVENTOS-------------------------------------
const putEventosHotel = async (req = request, res = response) => {
    const { id } = req.params;
    const { evento } = req.body;

    const hotelById = await Hotel.findById(id);
    const eventoById = await Evento.findById(evento);
    if (!(hotelById.eventos.includes(eventoById._id))) {
        hotelById.eventos.push(eventoById);
        await hotelById.save();
        res.json({ hotelById });
    }else{
        res.json({msg: 'El evento ya esta agregado'});
    }
};

//------------------------------READ HOTELES-------------------------------------
const getHoteles = async (req = request, res = response) => {

    try {
        const listaHoteles = await 
            Hotel.find().populate('usuario', 'nombre')
            .populate('departamento', 'nombre')
                // Ordenando en base al rating (mayor rating aparece al inicio)
                .sort({ rating: -1 });
    
        res.json({
            msg: 'GET API - Controlador hotel',
            listaHoteles
        });
    } catch (err) {
        res.status(404).send({
            msg: "No se pudo obtener los hoteles",
            err,
          });
    }

}

//------------------------------READ by ID hotele---------------------------------
const getHotelById = async (req = request, res = response) => {

    try {
        const { id } = req.params;
    
        const hotelById = await 
            Hotel.findOne({
                _id: id
            });
    
        res.json({
            msg: 'GET BY ID API - Controlador hotel',
            hotelById
        })
    } catch (err) {
        res.status(404).send({
            msg: "No se pudo Obtener el Hotel",
            err,
          });
    }

}

//------------------------------CREATE hoteles-------------------------------------
const postHotel = async (req = request, res = response) => {

    try {
        const { ...data } = req.body;
    
        const hotelDB = await Hotel(data);
    
        await hotelDB.save();
    
        res.status(201).json({
            msg: 'POST API - Controlador hotel',
            hotelDB
        });
    } catch (err) {
        res.status(404).send({
            msg: "No se pudo Agregar el Hotel",
            err,
          });
    }

}

//------------------------------UPDATE hoteles-----------------------------------
const putHotel = async (req = request, res = response) => {

    try {
        const { id } = req.params;
    
        const { ...data } = req.body;
    
        const hotelEditado = await Hotel.findByIdAndUpdate(id, data, { new: true });
    
        res.status(201).json({
            msg: 'PUT API - Controlador hotel',
            hotelEditado
        });
    } catch (err) {
        res.status(404).send({
            msg: "No se pudo editar el Hotel",
            err,
          });
    }

}

//------------------------------DELETE hoteles-------------------------------------
const deleteHotel = async (req = request, res = response) => {

    try {
        const { id } = req.params;
    
        // Se elimina físicamente de la DB
        const hotelEliminado = await Hotel.findByIdAndDelete(id);
    
        res.json({
            msg: 'DELETE API - Controlador hotel',
            hotelEliminado
        })
    } catch (err) {
        res.status(404).send({
            msg: "No se pudo eliminar el Hotel",
            err,
          });
    }

}

//------------------------------Exportanciones----------------------------------------

module.exports = {
    getHoteles,
    getHotelById,
    postHotel,
    putHotel,
    deleteHotel,
    getEventoH,
    putEventosHotel
}