const { request, response } = require('express');
const Eveneto = require('../models/evento');

const getEvento = async (req = request, res = response) => {
    const query = {estado:true}
     const listaEventos = await Promise.all([
         Eveneto.countDocuments(query),
         Eveneto.find(query)
     ]);
 
     res.json({
         msg: 'get Api - Controlador Ecvento',
         listaEventos
     });
}

const postEvento= async (req = request, res = response) => { 
    const { 
        nombreEvento, 
        cantidadUsuarios, 
        fechaHoraStart,
        fechaHoraEnd,
        horaInicio,
        horaFinal,
        tipoEvento } = req.body;

        const fechaHoraInicio = new Date(fechaHoraStart.concat('T',horaInicio));
        const fechaHoraFin = new Date(fechaHoraEnd.concat('T',horaFinal));
        
        
    // Generar la data a guardar
    const data = { nombreEvento, 
        cantidadUsuarios, 
        fechaHoraInicio,
        fechaHoraFin,
        tipoEvento }

    const eventoDb = new Eveneto(data);
    //Guardar en DB
    await eventoDb.save();

   res.status(201).json(eventoDb);

}


const putEvento = async (req = request, res = response) => {
    const { id } = req.params;
    const { estado,nombreEvento,cantidadUsuarios,tipoEvento,...restoData } = req.body;
    const fechaHoraInicio =new Date(restoData.fechaHoraStart.concat('T',restoData.horaInicio));
    const fechaHoraFin = new Date(restoData.fechaHoraEnd.concat('T',restoData.horaFinal));
    const datos = {
        nombreEvento,
        cantidadUsuarios,
        fechaHoraInicio,
        fechaHoraFin,
        tipoEvento
    }
        

    const eventoEditar = await Eveneto.findByIdAndUpdate(id, datos, { new: true });

    res.status(201).json({msg: 'Evento Editado: ',eventoEditar});
}

const deleteEvento = async (req = request, res = response) => {
    const { id } = req.params;

    //Editar o actualiar la cateogira: Estado FALSE
    const eventoDb = await Eveneto.findByIdAndDelete(id);

    res.status(201).json({msg: 'Rol borrado: ' ,eventoDb});
}

module.exports = {
    getEvento,
    postEvento,
    putEvento,
    deleteEvento
}
