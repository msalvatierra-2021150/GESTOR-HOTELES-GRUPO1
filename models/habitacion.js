const { Schema, model } = require ('mongoose')

const HabitacionSchema = Schema({
    precio: {
        type: Number,
        required: true
    },
    descripcion: {
        type: String,
        default: 'Habitación de hotel'
    },
    img: {
        type: String
    },
    capacidad: {
        type: Number,
        default: 1
    },
    hotel: {
        type: Schema.Types.ObjectId,
        ref: 'Hotel',
        required: true
    },
    disponible: {
        type: Boolean,
        default: true
    }
});

module.exports = model('Habitacion', HabitacionSchema);