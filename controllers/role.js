const { request, response } = require('express');
const Roles = require('../models/role');

const getRoles = async (req = request, res = response) => {
     try {
         const listarRoles = await 
             Roles.find();
     
         res.json({
             msg: 'get Api - Controlador Roles',
             listarRoles
         });
     } catch (err) {
        res.status(404).send({
            msg: "No se pudo obtener los roles",
            err,
          });
     }
}

const postRoles= async (req = request, res = response) => {
    try {
        //toUpperCase para todo a Mayusculas
        const rol = req.body.rol.toUpperCase();
    
        // Generar la data a guardar
        const data = { rol }
    
        const role = new Roles(data);
        //Guardar en DB
        await role.save();
    
        res.status(201).json(role);
    } catch (err) {
        res.status(404).send({
            msg: "No se pudo agregar el rol",
            err,
          });
    }

}


const putRoles = async (req = request, res = response) => {
    try {
        const { id } = req.params;
    
        const { ...resto } = req.body;
    
        resto.rol = resto.rol.toUpperCase();
    
        //Editar o actualiar la cateogira
        const rolEditado = await Roles.findByIdAndUpdate(id, resto, { new: true });
    
        res.status(201).json({msg: 'Rol Editado: ' ,rolEditado});
    } catch (err) {
        res.status(404).send({
            msg: "No se pudo editar el rol",
            err,
          });
    }
}

const deleteRoles = async (req = request, res = response) => {
    try {
        const { id } = req.params;
    
        //Editar o actualiar la cateogira: Estado FALSE
        const rolBorrado = await Roles.findByIdAndDelete(id);
    
        res.status(201).json({msg: 'Rol borrado: ' ,rolBorrado});
    } catch (err) {
        res.status(404).send({
            msg: "No se pudo eliminar el rol",
            err,
          });
    }
}

module.exports = {
    getRoles,
    postRoles,
    putRoles,
    deleteRoles
}
