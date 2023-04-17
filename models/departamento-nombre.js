const { Schema, model } = require('mongoose');

const DepartamentoNombreSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    estado: {
        type: Boolean,
        default: true
    },
});


module.exports = model('DepartamentoNombre', DepartamentoNombreSchema);