const { request, response } = require("express");
//Importación del modelo
const Usuario = require("../models/usuario");
const Servicio = require("../models/servicios");
const usuario = require("../models/usuario");

const getCarrito = async (req = request, res = response) => {
  try {
    const idUsuario = req.usuario.id;
    const { cart_servicios } = await Usuario.findById(idUsuario)

    return res.status(200).json({ cart_servicios });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const postCarrito = async (req = request, res = response) => {
  const { itemId } = req.params;

  try {
    const item = await Servicio.findById(itemId);

    if (!item) {
      return res.status(404).json({ message: "Producto no existente" });
    }

    const idUsuario = req.usuario.id;
    const { cart_servicios }= await Usuario.findById(idUsuario);

    const existeEnCarrito = cart_servicios.find((item) => item.itemId === itemId);

    if (existeEnCarrito) {
      existeEnCarrito.quantity += 1;
      existeEnCarrito.nombre = item.nombreServicio;
      existeEnCarrito.precio = item.precio;
    } else {
      //Cuando se agrega por primera vez
      nombreServicio = item.nombreServicio;
      precio = item.precio;
      cart_servicios.push({ itemId, quantity: 1 , nombreServicio, precio});
    }

    await Usuario.findByIdAndUpdate(idUsuario, { cart_servicios });
    return res.status(200).json({ message: "Producto agregado al carrito" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const putCarrito = async (req = request, res = response) => {
    const { itemId } = req.params;

    try {
      const item = await Servicio.findById(itemId);
  
      if (!item) {
        return res.status(404).json({ message: "Producto no existente" });
      }
  
      const idUsuario = req.usuario.id;
      const { cart_servicios } = await Usuario.findById(idUsuario);
  
      const existeEnCarrito = cart_servicios.find((item) => item.itemId === itemId);
  
      if (existeEnCarrito) {
        if( existeEnCarrito.quantity <= 1) {
            deleteCarrito(req, res);
            return;
        }
        existeEnCarrito.quantity -= 1;
      }
  
      await Usuario.findByIdAndUpdate(idUsuario, { cart_servicios });
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
    const { cart_servicios } = await usuario.findById(idUsuario);

    //Filter crea un nuevo array con los items que cumplan con la condicion
    const carritoActualizado = cart_servicios.filter((item) => item.itemId !== itemId);

    await Usuario.findByIdAndUpdate(idUsuario, { cart_servicios: carritoActualizado });
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
