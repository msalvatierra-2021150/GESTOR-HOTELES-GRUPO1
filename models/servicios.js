const { Schema, model } = require('mongoose');

const ServicioSchema = Schema({
    nombreServicio: {
        type: String,
        required: [true , 'El nombre del servicio es obligatorio']
    },
    descripcion: {
        type: String,
    },
    precio: {
        type: Number,
        required: [true , 'El precio del servicio es obligatorio']
    },
    estado: {
        type: Boolean,
        default: true
    },
});


module.exports = model('Servicio', ServicioSchema);