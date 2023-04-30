const { response, request } = require("express");
//Importación del modelo
const Servicios = require("../models/servicios");

const getServicios = async (req = request, res = response) => {
  try {
    //condiciones del get
    const query = { estado: true };

    const listaServicios = await Servicios.find(query);

    res.json({
      msg: "Lista de productos activos",
      listaServicios,
    });
  } catch (err) {
    res.status(404).send({
      msg: "No se pudo listar los servicios",
      err,
    });
  }
};
const postSerivicos = async (req = request, res = response) => {
  try {
      //Desestructuración
      const { nombreServicio, descripcion, precio } = req.body;
    
      const servicioGuardadoDB = new Servicios({
        nombreServicio,
        descripcion,
        precio,
      });
    
      //Guardar en BD
      await servicioGuardadoDB.save();
    
      res.json({
        msg: "Post Api - Post Servicio",
        servicioGuardadoDB,
      });
  } catch (err) {
    res.status(404).send({
        msg: "No se pudo agregar el Servicios",
        err,
      });
  }
};
const putServicios = async (req = request, res = response) => {
  try {
      const { id } = req.params;
      const { ...resto } = req.body;
      //Los parametros img, rol, estado y google no se modifican, el resto de valores si (nombre, correo y password)
    
      const servicioEditado = await Servicios.findByIdAndUpdate(id, resto);
      return res.json({
        msg: "PUT editar Servicio",
        servicioEditado,
      });
  } catch (err) {
    res.status(404).send({
        msg: "No se pudo editar el Servicios",
        err,
      });
  }
};
const deleteServicio = async (req = request, res = response) => {
  try {
      //Req.params sirve para traer parametros de las rutas
      const { id } = req.params;
    
      //Eliminar cambiando el estado a false
      const servicioEliminado = await Servicios.findByIdAndDelete(id);
    
      return res.json({
        msg: "DELETE eliminar user",
        servicioEliminado,
      });
  } catch (err) {
    res.status(404).send({
        msg: "No se pudo eliminar el Servicio",
        err,
      });
  }
};

module.exports = {
  getServicios,
  postSerivicos,
  putServicios,
  deleteServicio,
};
