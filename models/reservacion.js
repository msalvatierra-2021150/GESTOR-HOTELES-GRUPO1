const { Schema, model } = require('mongoose');

const ReservacionSchema = Schema({
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    fechaInicio: {
        type: Date,
        required: true
    },
    fechaFin: {
        type: Date,
        required: true
    },
    habitaciones: [{
        type: Schema.Types.ObjectId,
        ref: 'Habitacion',
        required: true
    }],
    estado: {
        type: Boolean,
        default: true
    }
});
//Dejar de ver el __v y el _id
ReservacionSchema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

module.exports = model('Reservacione', ReservacionSchema);