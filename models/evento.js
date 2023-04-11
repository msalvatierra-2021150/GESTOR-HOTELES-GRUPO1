const { Schema, model } = require('mongoose');

const EventoSchema = Schema({
    nombreEvento: {
        type: String,
        required: [true , 'El nombre del evento es obligatorio']
    },
    cantidadUsuarios: {
        type: Number,
        required: [true , 'La cantidad del evento es obligatorio']
    },
    estado: {
        type: Boolean,
        default:true
    },
    fechaHoraInicio: {
        type: Date,
        required: true
    },
    fechaHoraFin: {
        type: Date,
        required: true
    },
    tipoEvento: {
        type: Schema.Types.ObjectId,
        ref: 'TipoDeEvento ',
        required: false
    },

});


module.exports = model('Evento', EventoSchema);