// Exportaciones
const { request, response } = require('express')
// Modelo
const Hotel = require('../models/hotel');
const Evento = require('../models/evento');
const Habitacion = require('../models/habitacion');
const Reservacion = require("../models/reservacion");

const getHabitaciones = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const query = { hotel: id }
        //obtiene las habitaciones del hotel 
        const listaHabitaciones = await Habitacion.find(query);
        //console.log(listaHabitaciones);
        //obtiene todas las reservaciones
        const arregloHabitaciones = []
        let cantidades = 1;
        const resevacionHabit = await Reservacion.find();
        const arreglo = [];
        if (listaHabitaciones.length > 0) {
            
            for (let r = 0; r < resevacionHabit.length; r++) {
                
                const retornoHabitacion = resevacionHabit[r].habitaciones
               
                for(let i = 0;i< retornoHabitacion.length;i++){   
                    if(listaHabitaciones.some(h => (h._id).toString() === retornoHabitacion[i].habitacion_id)){
                        if(!arreglo.some(a => a.id === retornoHabitacion[i].habitacion_id)){
                            arreglo.push({
                                id:retornoHabitacion[i].habitacion_id,
                                cantidad:cantidades
                            })
                            
                        }else{
                           arreglo[r]={id:retornoHabitacion[i].habitacion_id,cantidad:cantidades++}
                          
                        }
        
                    }
                }
            }
        }
        console.log(arreglo);
        res.json({
            msg: "La habitaciones reservadas", arreglo
        })
    } catch (err) {
        res.status(404).send({
            msg: "No se pudo obtener los eventos del Hotel",
            err,
        });
    }

}

const getAdminHoteles = async (req = request, res = response) => {

    const user = req.usuario._id;

    const query = { usuario: user };

    try {
        const listaHoteles = await Hotel.find(query).populate('usuario', 'nombre')
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

//------------------------ver los eventos del hotel-------------------------------------
const getEventoH = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const hotelById = await Hotel.findById(id)

        const arreglo = hotelById.eventos
        const eventos = [];
        for (let x = 0; x < arreglo.length; x++) {
            const eventoH = await
                Evento.findById(arreglo[x]);

            eventos.push(eventoH)
        }

        if (eventos[0] === null) {
            eventos.shift();
        }

        res.json({
            eventos
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
        res.status(200).json({msg: "El evento se agrego con exito" });
    }else{
        res.status(500).json({msg: 'El evento seleccionado ya esta agregado en su hotel'});
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
    putEventosHotel,
    getHabitaciones,
    getAdminHoteles
}