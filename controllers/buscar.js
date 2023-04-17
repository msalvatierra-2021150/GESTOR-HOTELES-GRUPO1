const { request, response } = require('express');
const { ObjectId } = require('mongoose').Types;

const Hotel = require('../models/hotel');

const coleccionesPermitidas = [
    'hoteles'
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
    // const palabras = termino.trim().split(/\s+/);
    // const regex = new RegExp(palabras.join('|'), 'i');

    const hoteles = await Promise.all([
        Hotel.countDocuments({
            $or: [{ nombre: regex }, { direccion: regex }]
        }),
        Hotel.find({
            $or: [{ nombre: regex }, { direccion: regex }]
        }),
    ])

    res.json({
        results: hoteles
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