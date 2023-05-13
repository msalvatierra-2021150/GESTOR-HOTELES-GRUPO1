const { request, response } = require('express');
const { ObjectId } = require('mongoose').Types;

const Hotel = require('../models/hotel');
const Usuario = require('../models/usuario');

const coleccionesPermitidas = [
    'hoteles',
    'usuarios'
]

const buscarHotel = async (termino = '', res = response) => {

    const esMongoId = ObjectId.isValid(termino);

    if (esMongoId) {
        const hotel = await Hotel.findById(termino);
        return res.json({
            results: (hotel) ? [hotel] : []
        });
    }

    const regex = new RegExp(termino, 'i')

    const hoteles = await
        Hotel.find({
            $or: [{ nombre: regex }, { direccion: regex }]
        });

    res.json({
        results: hoteles
    });

}

const buscarUser = async (termino = '', res = response) => {

    const esMongoId = ObjectId.isValid(termino);

    if (esMongoId) {
        const usuario = await Usuario.findById(termino);
        return res.json({
            results: (usuario) ? [usuario] : []
        });
    }

    const regex = new RegExp(termino, 'i')
    const rolUser = 'USUARIO_ROLE'

    const usuarios = await
        Usuario.find({
            $or: [{ nombre: regex }],
            $and: [{rol: rolUser}]
        });

    res.json({
        results: usuarios
    });

}

const buscar = (req = request, res = response) => {

    const { coleccion, termino } = req.params;

    if (!coleccionesPermitidas.includes(coleccion)) {
        return res.status(400).json({
            msg: `La colección: ${coleccion} no existe en la DB.\nLas colecciones permitidas son: ${coleccionesPermitidas}`
        });
    }

    switch (coleccion) {
        case 'hoteles':
            buscarHotel(termino, res);
            break;
        case 'usuarios': 
            buscarUser(termino, res);
            break
        default:
            res.status(500).json({
                msg: 'Aún no se ha establecido esta busqueda...'
            });
            break;
    }

}

module.exports = {
    buscar
}