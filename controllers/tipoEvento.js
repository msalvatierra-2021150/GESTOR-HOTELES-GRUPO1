const { response, request } = require('express');
//Importación del modelo
const TipoEvento = require('../models/tipoEvento');

const getTipoEventos = async (req = request, res = response) => {

    //condiciones del get
    const query = { estado: true };

    const listaTipoEventos = await Promise.all([
        TipoEvento.countDocuments(query),
        TipoEvento.find(query)
    ]);

    res.json({
        msg: 'get Api - Controlador Usuario',
        listaTipoEventos
    });

}

const postTipoEvento = async (req = request, res = response) => {

    //Desestructuración
    const { nombre, precio } = req.body;
    const tipoEventoGuardadoDB = new TipoEvento({ nombre, precio });

    //Guardar en BD
    await tipoEventoGuardadoDB.save();

    res.json({
        msg: 'Post Api - Post Usuario',
        tipoEventoGuardadoDB
    });

}


const putTipoEvento = async (req = request, res = response) => {

    //Req.params sirve para traer parametros de las rutas
    const { id } = req.params;
    const { _id,  /* rol,*/  estado, ...resto } = req.body;

    //Editar al usuario por el id
    const tipoEventoEditado = await TipoEvento.findByIdAndUpdate(id, resto);

    res.json({
        msg: 'PUT editar user',
        tipoEventoEditado
    });

}

const deleteTipoEvento = async(req = request, res = response) => {
    //Req.params sirve para traer parametros de las rutas
    const { id } = req.params;

    //Eliminar fisicamente de la DB
    //const usuarioEliminado = await Usuario.findByIdAndDelete( id);

    //Eliminar cambiando el estado a false
    const tipoEventoEliminado = await TipoEvento.findByIdAndDelete(id);

    res.json({
        msg: 'DELETE eliminar user',
        tipoEventoEliminado
    });
}

module.exports = {
    getTipoEventos,
    postTipoEvento,
    putTipoEvento,
    deleteTipoEvento
}


// CONTROLADOR