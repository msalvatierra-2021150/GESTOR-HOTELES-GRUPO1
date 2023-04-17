const { Schema, model } = require('mongoose');

const FacturaSchema = Schema({
    NITEmisor: {
        type: String,
        required: [true , 'El NIT Del Emisor es obligatorio']
    },
    fecha: {
        type: Date,
        default: Date.now  
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    NITReceptor: {
        type: String,
        required: [true , 'El NIT del receptor es obligatorio']
    },    
    cart_reservaciones: {
        type: Array,
        default: []
    },
    cart_servicios: {
        type: Array,
        default: []
    },
    total: {
        type: Number,
        required: [true , 'El total es obligatorio']
    }
});


module.exports = model('Factura', FacturaSchema);