const { response, request } = require('express');
const bcrypt = require('bcryptjs');
//Importación del modelo
const DepartamentoNombre = require('../models/departamento-nombre');
const { count } = require('../models/departamento-nombre');

const getDepartamentoNombre = async (req = request, res = response) => {

    //condiciones del get
    const query = { estado: true };

    const listaDepartamentoNombre = await Promise.all([
        DepartamentoNombre.countDocuments(query),
        DepartamentoNombre.find(query)
    ]);

    res.json({
        msg: 'get Api - Controlador DepartamentoNombre',
        listaDepartamentoNombre
    });

}

const postDepartamentoNombre = async (req = request, res = response) => {

    //Desestructuración
    const { nombre } = req.body;
    const DepartamentoNombreGuardadoDB = new DepartamentoNombre({ nombre });

    //Guardar en BD
    const departamentoDB = await  DepartamentoNombreGuardadoDB.save();

    res.json({
        msg: 'Post Api - Post Alumnos',
        departamentoDB
    });

}


const putDepartamentoNombre = async (req = request, res = response) => {

    //Req.params sirve para traer parametros de las rutas
    const { id } = req.params;
    const { _id,  /* rol,*/  estado, ...resto } = req.body;

    const DepartamentoNombreEditado = await DepartamentoNombre.findByIdAndUpdate(id, resto);

    res.json({
        msg: 'PUT editar nombre',
        DepartamentoNombreEditado
    });

}

const deleteDepartamentoNombre = async(req = request, res = response) => {
    const { id } = req.params;
     const DepartamentoNombreEliminado = await DepartamentoNombre.findByIdAndUpdate(id, { estado: false });

    res.json({
        msg: 'DELETE eliminar DepartamentoNombre',
        DepartamentoNombreEliminado: DepartamentoNombreEliminado
    });
}

module.exports = {
    getDepartamentoNombre,
    postDepartamentoNombre,
    putDepartamentoNombre,
    deleteDepartamentoNombre
}


