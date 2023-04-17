const { Schema, model } = require('mongoose');

const TipoEventoSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    estado: {
        type: Boolean,
        default: true
    },
    precio: {
        type: Number,
        default: 0
    }
});


module.exports = model('TipoEvento', TipoEventoSchema);