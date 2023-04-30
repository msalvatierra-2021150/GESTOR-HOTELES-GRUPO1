const { request, response, json } = require("express");
const Producto = require("../models/producto");

const getProductos = async (req = request, res = response) => {
  //condiciones del get
  const query = { estado: true };

  const listaProductos = await Producto.find(query)
    //.populate('usuario', 'nombre')
    .populate("usuario", "correo")
    .populate("categoria", "nombre");

  res.json({
    msg: "Lista de productos activos",
    listaProductos,
  });
};

const getProductosMasVendidos = async (req = request, res = response) => {
  try {
    //condiciones del get
    const query = { estado: true };

    const listaProductos = await Producto.find(query, [
      "nombre",
      "precio",
      "contadorDeVendidos",
    ])
      .sort({ contadorDeVendidos: -1 })
      .limit(2);

    res.json({
      msg: "Lista de productos mas vendidos",
      listaProductos,
    });
  } catch (err) {
    res.status(404).send({
      msg: "No se pudo editar los productos mas vendidos",
      err,
    });
  }
};

const getProductosAgotados = async (req = request, res = response) => {
  //condiciones del get
  const query = { estado: true, stock: 0 };

  const listaProductos = await 
    Producto.find(query, ["nombre", "precio", "contadorDeVendidos"]);

  res.json({
    msg: "Lista de productos mas vendidos",
    listaProductos,
  });
};

const getProductoPorId = async (req = request, res = response) => {
  try {
      const { id } = req.params;
      const prouductoById = await Producto.findById(id)
        .populate("usuario", "nombre")
        .populate("categoria", "nombre");
    
      res.status(201).json(prouductoById);
  } catch (err) {
    res.status(404).send({
        msg: "No se pudo Obtener el producto por ID",
        err,
      });
  }
};

const postProducto = async (req = request, res = response) => {
  try {
      const { estado, usuario, ...body } = req.body;
    
      const productoDB = await Producto.findOne({ nombre: body.nombre });
    
      //validacion si el producto ya existe
      if (productoDB) {
        return res.status(400).json({
          msg: `El producto ${productoDB.nombre}, ya existe en la DB`,
        });
      }
    
      //Generar la data a guardar
      const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario.id,
      };
    
      const producto = await Producto(data);
    
      //Guardar en DB
      await producto.save();
    
      res.status(201).json(producto);
  } catch (err) {
    res.status(404).send({
        msg: "No se pudo Agregar el producto",
        err,
      });
  }
};

const putProducto = async (req = request, res = response) => {
  try {
      const { id } = req.params;
      const { estado, usuario, ...restoData } = req.body;
    
      if (restoData.nombre) {
        restoData.nombre = restoData.nombre.toUpperCase();
        restoData.usuario = req.usuario._id;
      }
    
      const productoActualizado = await Producto.findByIdAndUpdate(id, restoData, {
        new: true,
      });
    
      res.status(201).json({
        msg: "Put Controller Producto",
        productoActualizado,
      });
  } catch (err) {
    res.status(404).send({
        msg: "No se pudo editar el producto",
        err,
      });
  }
};

const deleteProducto = async (req = request, res = response) => {
  try {
      const { id } = req.params;
      //Eliminar fisicamente de la DB
      //const productoEliminado = await Producto.findByIdAndDelete( id );
    
      //Eliminar por el estado:false
      const productoEliminado_ = await Producto.findByIdAndUpdate(
        id,
        { estado: false },
        { new: true }
      );
    
      res.json({
        msg: "DELETE",
        //productoEliminado,
        productoEliminado_,
      });
  } catch (err) {
    res.status(404).send({
        msg: "No se pudo elimianr el producto",
        err,
      });
  }
};

module.exports = {
  postProducto,
  putProducto,
  deleteProducto,
  getProductos,
  getProductoPorId,
  getProductosMasVendidos,
  getProductosAgotados,
};
