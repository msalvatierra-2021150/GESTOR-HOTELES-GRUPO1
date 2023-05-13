const { request, response} = require("express");

const Factura = require("../models/factura");
const Usuario = require("../models/usuario");

const getFacturas = async (req = request, res = response) => {
  try {
    //condiciones del get
    const query = { usuario: req.usuario.id };

    const listaFacturas = await
      Factura.find(query).populate("usuario", "nombre");

    return res.json({
      msg: "Lista de Facturas del Cliente",
      listaFacturas,
    });
  } catch (err) {
    res.status(404).send({
      msg: "No se pudo listar las Facturas",
      err,
    });
  }
};

const getFacturaPorId = async (req = request, res = response) => {
  try {
    const { id } = req.params;
    const facturaById = await Factura.findById(id);
    res.status(201).json(facturaById);
  } catch (err) {
    res.status(404).send({
      msg: "No se pudo listar la Factura",
      err,
    });
  }
};

const postFactura = async (req = request, res = response) => {
  const { estado, ...body } = req.body;
  //Omite estado y toma lo demas del body
  const NITEmisor = "1234567-8";

  let totalQuantity = 0;
  let totalServicios = 0;
  let totalReservaciones = 0;

  const {cart_servicios} =  await Usuario.findById(req.usuario.id);;
  try {
    //Hacer la sumatoria para el total Servicios
    for (let i = 0; i < cart_servicios.length; i++) {
      totalQuantity += cart_servicios[i].quantity;
      totalServicios += cart_servicios[i].precio * cart_servicios[i].quantity;
    }
  
  
    const {cart_reservaciones} =  await Usuario.findById(req.usuario.id);
  
      //Hacer la sumatoria para el total Reservaciones
      for (let i = 0; i < cart_reservaciones.length; i++) {
        totalReservaciones += cart_reservaciones[i].precio;
      }
  
      //Generar la data a guardar
      const data = {
        ...body,
        NITEmisor: NITEmisor,
        usuario: req.usuario.id,
        nombreUsuario: req.usuario.nombre,
        cart_reservaciones: cart_reservaciones,
        cart_servicios: cart_servicios,
        total: totalServicios + totalReservaciones,
      };
  
      const factura = await Factura(data);
  
      //Guardar en DB
      await factura.save();
  
      res.status(201).json(factura);
      //Despues de esto puedo vaciar el carrito para que se cree la factura, y la proxima
      //Vez genera una nueva factura
  } catch (err) {
    res.status(404).send({
      msg: "No se pudo agregar la factura",
      err,
    });
  }
};

const putFactura = async (req = request, res = response) => {
  return res.json({
    msg: "Put Factura",
  });
};

const deleteFactura = async (req = request, res = response) => {
  try {
    const { id } = req.params;
    //Eliminar fisicamente de la DB
    const facturaEliminada = await Factura.findByIdAndDelete( id );
    res.json({
      msg: "DELETE",
      facturaEliminada
    });
  } catch (err) {
    res.status(404).send({
      msg: "No se pudo eliminar la factura",
      err,
    });
  }
};
module.exports = {
  postFactura,
  putFactura,
  deleteFactura,
  getFacturas,
  getFacturaPorId,
};
