const { request, response } = require("express");
//Importación del modelo
const Usuario = require("../models/usuario");
const Reservaciones = require("../models/reservacion");
const usuario = require("../models/usuario");
const Habitacion = require("../models/habitacion");

const getCarrito = async (req = request, res = response) => {
  try {
    const idUsuario = req.usuario.id;
    const { cart_reservaciones } = await Usuario.findById(idUsuario)

    return res.status(200).json({  cart_reservaciones });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const postCarrito = async (req = request, res = response) => {
  const { itemId } = req.params;

  try {
    const item = await Reservaciones.findById(itemId);

    if (!item) {
      return res.status(404).json({ message: "Reservacion no existente" });
    }

    const idUsuario = req.usuario.id;
    const { cart_reservaciones }= await Usuario.findById(idUsuario);

    const existeEnCarrito = cart_reservaciones.find((item) => item.itemId === itemId);

    if (existeEnCarrito) {
      return res.status(200).json({ message: "Reservacion ya existente en el carrito" });
    } else {
      //Cuando se agrega por primera vez
      precio = item.total;
      cart_reservaciones.push({ itemId, quantity: 1, precio});
    }

    await Usuario.findByIdAndUpdate(idUsuario, { cart_reservaciones });
    return res.status(200).json({ message: "Reservacion agregada al carrito" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const putCarrito = async (req = request, res = response) => {
    const { itemId } = req.params;

    try {
      const item = await Reservaciones.findById(itemId);
  
      if (!item) {
        return res.status(404).json({ message: "Producto no existente" });
      }
  
      const idUsuario = req.usuario.id;
      const {  cart_reservaciones } = await Usuario.findById(idUsuario);
  
      const existeEnCarrito = cart_reservaciones.find((item) => item.itemId === itemId);
  
      if (existeEnCarrito) {
        if( existeEnCarrito.quantity <= 1) {
            deleteCarrito(req, res);
            return;
        }
        existeEnCarrito.quantity -= 1;
      }
  
      await Usuario.findByIdAndUpdate(idUsuario, { cart_reservaciones });
      return res.status(200).json({ message: "Producto degradado en 1 al carrito" });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal server error" });
    }
};

const deleteCarrito = async (req = request, res = response) => {
  const { itemId } = req.params;

  try {
    const idUsuario = req.usuario.id;
    const { cart_reservaciones } = await usuario.findById(idUsuario);

    //Filter crea un nuevo array con los items que cumplan con la condicion
    const carritoActualizado = cart_reservaciones.filter((item) => item.itemId !== itemId);

    await Usuario.findByIdAndUpdate(idUsuario, { cart_reservaciones: carritoActualizado });
    return res.status(200).json({ message: "Item eliminado del carrito" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};  

module.exports = {
  getCarrito,
  postCarrito,
  putCarrito,
  deleteCarrito,
};
