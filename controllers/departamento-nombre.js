const { response, request } = require('express');
const bcrypt = require('bcryptjs');
//Importación del modelo
const DepartamentoNombre = require('../models/departamento-nombre');
const { count } = require('../models/departamento-nombre');

const getDepartamentoNombre = async (req = request, res = response) => {

    try {
        //condiciones del get
        const query = { estado: true };
    
        const listaDepartamentoNombre = await 
            DepartamentoNombre.find(query);
            
        res.json({
            msg: 'get Api - Controlador DepartamentoNombre',
            listaDepartamentoNombre
        });
    } catch (err) {
        res.status(404).send({
            msg: "No se pudo listar los departamentos",
            err,
          });
    }

}

const postDepartamentoNombre = async (req = request, res = response) => {

    try {
        //Desestructuración
        const { nombre } = req.body;
        const DepartamentoNombreGuardadoDB = new DepartamentoNombre({ nombre });
    
        //Guardar en BD
        const departamentoDB = await  DepartamentoNombreGuardadoDB.save();
    
        res.json({
            msg: 'Post Api - Post Departamentos',
            departamentoDB
        });
    } catch (err) {
        res.status(404).send({
            msg: "No se pudo agregar el Departamento",
            err,
          });
    }

}


const putDepartamentoNombre = async (req = request, res = response) => {

    try {
        //Req.params sirve para traer parametros de las rutas
        const { id } = req.params;
        const { _id,  /* rol,*/  estado, ...resto } = req.body;
    
        const DepartamentoNombreEditado = await DepartamentoNombre.findByIdAndUpdate(id, resto);
    
        res.json({
            msg: 'PUT editar Departamento',
            DepartamentoNombreEditado
        });
    } catch (err) {
        res.status(404).send({
            msg: "No se pudo editar el Departamento", 
            err,
          });
    }

}

const deleteDepartamentoNombre = async(req = request, res = response) => {
    try {
        const { id } = req.params;
        const DepartamentoNombreEliminado = await DepartamentoNombre.findByIdAndDelete(id);
        
        res.json({
            msg: 'DELETE eliminar DepartamentoNombre',
            DepartamentoNombreEliminado: DepartamentoNombreEliminado
        });
    } catch (err) {
        res.status(404).send({
            msg: "No se pudo eliminar el Departamento",
            err,
          });
    }
}

module.exports = {
    getDepartamentoNombre,
    postDepartamentoNombre,
    putDepartamentoNombre,
    deleteDepartamentoNombre
}


