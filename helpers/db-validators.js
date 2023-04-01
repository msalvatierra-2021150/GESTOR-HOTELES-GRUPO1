const Role = require('../models/role');
const Usuario = require('../models/usuario');
const Habitacion = require('../models/habitacion')
const Servicios = require('../models/servicios');
const Evento = require('../models/evento');
const Departamento =require('../models/departamento-nombre');
const Hotel = require('../models/hotel');

//Este archivo maneja validaciones personalizadas

const esRoleValido = async( rol = '' ) => {

    const existeRol = await Role.findOne( { rol } );

    if ( !existeRol ) {
        throw new Error(`El rol ${ rol } no está registrado en la DB`);
    }

}

const existeServicio = async( nombreServicio = '' ) => {

    const existeServicio = await Servicios.findOne( { nombreServicio } );

    if ( existeServicio ) {
        throw new Error(`El rol ${ nombreServicio }ya  está registrado en la DB`);
    }

}
const existeEvento = async( nombreEvento = '' ) => {

    const existeEvento = await Evento.findOne( { nombreEvento } );

    if ( existeEvento ) {
        throw new Error(`El rol ${ nombreEvento }ya  está registrado en la DB`);
    }

}


const emailExiste = async( correo = '' ) => {

    //Verificamos si el correo ya existe en la DB
    const existeEmail = await Usuario.findOne( { correo } );

    //Si existe (es true) lanzamos excepción
    if ( existeEmail ) {
        throw new Error(`El correo: ${ correo } ya existe y esta registrado en la DB`);
    }

}


const existeUsuarioPorId = async(id) => {

    //Verificar si el ID existe
    const existeUser = await Usuario.findById(id);

    if ( !existeUser ) {
        throw new Error(`El id ${ id } no existe en la DB`);
    }

}

const existeRol = async(rol) => {

    //Verificar si el ID existe
    const existeRol = await Role.findOne({rol: rol});

    if ( existeRol ) {
        throw new Error(`El rol ${ rol } ya existe en la DB`);
    }
}

const existeRolPorId = async(id) => {
    //Verificar si el ID existe
    const existeRol = await Role.findOne({id: id});

    if ( existeRol ) {
        throw new Error(`El rol ${ id } ya existe en la DB`);
    }
}
/*
const existeHabitacionById = async (id) => {
    const existeHabitacion = await Habitacion.findById(id);
    if (!existeHabitacion) {
        throw new Error(`La habitacion con el codigo: ${id}, no existe en la BD`);
    }
    return existeHabitacion;
}*/

const existeDepartamento = async( nombre = '' ) => {

    //Verificamos si el correo ya existe en la DB
    const existeDepartamento = await Departamento.findOne( { nombre } );

    //Si existe (es true) lanzamos excepción
    if ( existeDepartamento ) {
        throw new Error(`El correo: ${ nombre } ya existe y esta registrado en la DB`);
    }
}

const existeHabitacionById = async(id = '') => {
    
    const existeHabitacion = await Habitacion.findById(id);

    if ( !existeHabitacion ) {
        throw new Error(`La habitación no existe en la DB`);
    }
}

const existeHotelById = async(id = '') => {
    
    const existeHotel = await Hotel.findById(id);

    if ( !existeHotel ) {
        throw new Error(`El hotel no existe en la DB`);
    }
}


module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeRol,
    existeHabitacionById,
    existeServicio,
    existeEvento,
    existeDepartamento,
    existeRolPorId,
    existeHotelById
}
