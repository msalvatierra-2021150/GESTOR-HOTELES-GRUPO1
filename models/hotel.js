const { Schema, model } = require('mongoose')

const HotelSchema = Schema({
    nombre: {
        type: String,
        Default: 'Hotel'
    },
    direccion: {
        type: String,
        Default: 'Guatemala',
        required: true
    },
    departamento: {
        type: Schema.Types.ObjectId,
        ref: 'DepartamentoNombre',
        required: true
    },
    nit: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        default: 0
    },
    numero_reservaciones: {
        type: Number,
        default: 0
    },
    img: {
        type: String,
        default: "N/A"
    },
    descripcion: {
        type: String,
        default: 'Hotel by in6bm'
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    eventos: [{
        type: Schema.Types.ObjectId,
<<<<<<< HEAD
        ref: 'TipoEvento'
=======
        ref: 'Evento'
>>>>>>> origin/consandy
    }]
});

module.exports = model('Hotel', HotelSchema);