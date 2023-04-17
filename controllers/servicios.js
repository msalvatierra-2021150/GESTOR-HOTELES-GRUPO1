const { response, request } = require('express');
//Importación del modelo
const Servicios = require('../models/servicios');

const getServicios = async (req = request, res = response) => {

    //condiciones del get
    const query = { estado: true };

    const listaServicios = await Promise.all([
        Servicios.countDocuments(query),
        Servicios.find(query)
           
    ]);
    
    res.json({
        msg: 'Lista de productos activos',
        listaServicios
    });

}
const postSerivicos = async (req = request, res = response) => {
    //Desestructuración
    const { nombreServicio, descripcion, precio } = req.body;

    const servicioGuardadoDB = new Servicios({
        nombreServicio, descripcion, precio
    });


    //Guardar en BD
    await servicioGuardadoDB.save();

    res.json({
        msg: 'Post Api - Post Usuario',
        servicioGuardadoDB
    });

}
const putServicios = async (req = request, res = response) => {
    const { id } = req.params;
    const { ...resto } = req.body;
    //Los parametros img, rol, estado y google no se modifican, el resto de valores si (nombre, correo y password)


    const servicioEditado = await Servicios.findByIdAndUpdate(id, resto);
    return res.json({
        msg: 'PUT editar user',
        servicioEditado
    });
}
const deleteServicio = async(req = request, res = response) => {
    //Req.params sirve para traer parametros de las rutas
    const { id } = req.params;

    //Eliminar cambiando el estado a false
    const servicioEliminado = await Servicios.findByIdAndDelete(id);

    return res.json({
        msg: 'DELETE eliminar user',
        servicioEliminado
    });
}

module.exports = {
    getServicios,
    postSerivicos,
    putServicios,
    deleteServicio
 }
