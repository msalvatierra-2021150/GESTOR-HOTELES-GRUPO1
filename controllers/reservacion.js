//Desestructuracion de los objetos
const { response, request } = require("express");
const { existeHabitacionById } = require("../helpers/db-validators");
//Importacion de los modelos
const Reservacion = require("../models/reservacion");
const Habitacion = require("../models/habitacion");
const Hotel = require("../models/hotel");

//Mostrar el listado de reservaciones del admin hoteles
const getReservaciones = async (req = request, res = response) => {
  try {
    //Condiciones del get, devuelve todas las reservaciones realizadas
    const query = { estado: true };
    const reservasDB = await Reservacion.find(query).lean();
    const hotelAdminBD = await Hotel.find({ usuario: req.usuario._id }).lean();
  
    if (hotelAdminBD.length === 0) {
      return res.status(400).json({
        msg: "No se encontró ningún hotel para el usuario administrador proporcionado.",
      });
    }
  
    const matchs = [];
    //Nos posicionamos en el arreglo de hoteles
    for (let k = 0; k < hotelAdminBD.length; k++) {
      const hotelAdmin = hotelAdminBD[k];
      //Se recorre el arreglo de reservaciones
      for (let j = 0; j < reservasDB.length; j++) {
        const reservas = reservasDB[j];
        //Se recorre el arreglo de habitaciones
        for (let i = 0; i < reservas.habitaciones.length; i++) {
          //Buscar las habitaciones que estan en el arreglo segun su id
          const habitacion = await Habitacion.findById(
            reservas.habitaciones[i].habitacion_id
          ).lean();
          const hotelHabitacionClient = await Hotel.findById(habitacion.hotel).lean();
          if (!hotelHabitacionClient) {
            return res.status(400).json({ msg: 'No se encontró el hotel de la habitación.' });
          }
          if (hotelHabitacionClient._id.toString() === hotelAdmin._id.toString()) {
            matchs.push(reservas);
            break;
          }
        }
      }
    }
    //Devolvemos las reservaciones si todo ha ido bien
    if (matchs.length === 0) {
      return res.status(400).json({
        msg: "El usuario cliente proporcionado, no tiene ninguna reservacion en sus hoteles.",
      });
    } else {
      return res.json({ reservas: matchs });
    }
  } catch (err) {
    res.status(404).send({
      msg: "No se pudo obtener la reservacion",
      err,
    });
  }
};

//Mostrar el listado de reservaciones del admin hoteles que coincidan con el id del usuario
const getReservacionesActivas = async (req = request, res = response) => {
  try {
    const { userId } = req.body;
    //Condiciones del get, devuelve todas las reservaciones realizadas
    const query = { usuario: userId, estado: true };
    const reservasDB = await Reservacion.find(query).lean();
    const hotelAdminBD = await Hotel.find({ usuario: req.usuario._id }).lean();
  
    if (hotelAdminBD.length === 0) {
      return res.status(400).json({
        msg: "No se encontró ningún hotel para el usuario administrador proporcionado.",
      });
    }
  
    const matchs = [];
    //Nos posicionamos en el arreglo de hoteles
    for (let k = 0; k < hotelAdminBD.length; k++) {
      const hotelAdmin = hotelAdminBD[k];
      //Se recorre el arreglo de reservaciones
      for (let j = 0; j < reservasDB.length; j++) {
        const reservas = reservasDB[j];
        //Se recorre el arreglo de habitaciones
        for (let i = 0; i < reservas.habitaciones.length; i++) {
          //Buscar las habitaciones que estan en el arreglo segun su id
          const habitacion = await Habitacion.findById(
            reservas.habitaciones[i].habitacion_id
          ).lean();
          const hotelHabitacionClient = await Hotel.findById(habitacion.hotel).lean();
          if (!hotelHabitacionClient) {
            return res.status(400).json({ msg: 'No se encontró el hotel de la habitación.' });
          }
          if (hotelHabitacionClient._id.toString() === hotelAdmin._id.toString()) {
            matchs.push(reservas);
            break;
          }
        }
      }
    }
    //Devolvemos las reservaciones si todo ha ido bien
    if (matchs.length === 0) {
      return res.status(400).json({
        msg: "El usuario cliente proporcionado, no tiene ninguna reservacion en sus hoteles.",
      });
    } else {
      return res.json({ reservas: matchs });
    }
  } catch (err) {
    res.status(404).send({
      msg: "No se pudo obtener las reservaciones activas",
      err,
    });
  }
};

//Mostrar el listado de reservaciones por cliente
const getReservacionesClient = async (req = request, res = response) => {
  try {
    //Condiciones del get, devuelve todas las reservaciones realizadas que esten activas
    const query = { usuario: req.usuario._id, estado: true };
    //Promesa para obtener los registros
    const listaReservas = await 
      Reservacion.find(query)
        .populate("usuario", "nombre");

    //Impresion registros
    res.status(201).json({
      msg: "Sus reservas son: ",
      listaReservas,
    });
  } catch (err) {
    res.status(404).send({
      msg: "No se pudo las reservaciones del Cliente",
      err,
    });
  }
};

const getReservaPorId = async (req = request, res = response) => {
  try {
    const { id } = req.params;
    const reserva = await Reservacion.findById(id).populate("usuario", "nombre");
  
    res.status(201).json({reservation: reserva});
  } catch (err) {
    res.status(404).send({
      msg: "No se pudo obtener la reservacion",
      err,
    });
  }
};

//Realiza la creacion de la reservacion
const postReservacion = async (req = request, res = response) => {
  try {
    //Desestructuracion del parametro recibido a travez de la URL
    const { id } = req.params;
    const habitacion_id = id;
    //Desestructuracion de los campos recibidos en el body
    const { fechaStart, fechaEnd, horaStart, horaEnd } = req.body;
    const habitacion = await existeHabitacionById(id);
    if (habitacion.disponible == true) {
      await Habitacion.updateMany({ _id: id }, { disponible: false });
      //Generar la data a guardar
      const fechaInicio = new Date(fechaStart.concat("T", horaStart));
      const fechaFin = new Date(fechaEnd.concat("T", horaEnd));
      //Inicialmente el total es el precio de la primera habitacion
      const precio = habitacion.precio;
      const hab = { habitacion_id, precio };
      const data = {
        usuario: req.usuario._id,
        fechaInicio,
        fechaFin,
        habitaciones: hab,
        total: precio,
      };
      //Se crea una nueva reserva
      const reservaGuardada = await Reservacion(data);
      //Guarda la reserva
      await reservaGuardada.save();
      res.status(201).json(reservaGuardada);
    } else {
      res
        .status(409)
        .json({ error: "Actualmente la habitacion no esta disponible" });
    }
  } catch (err) {
    res.status(404).send({
      msg: "No se pudo agregar la habitacion",
      err,
    });
  }
};

//Mostrar el listado de reservaciones por cliente
const getReservacionesId = async (req = request, res = response) => {
  try {
    //Condiciones del get, devuelve todas las reservaciones realizadas
    const query = { usuario: req.usuario._id, estado: true };
    //Promesa para obtener los registros
    const listaReservas = await 
      Reservacion.find(query)
        .populate("habitaciones", "precio capacidad disponible")
        .populate("usuario", "nombre");

    //Impresion registros
    res.status(201).json({
      msg: "Sus reservas son: ",
      listaReservas,
    });
  } catch (err) {
    res.status(404).send({
      msg: "No se pudo obtener la reserva por ID",
      err,
    });
  }
};

//Agregar una habitacion a la reservacion
const postHabitacionReservacion = async (req = request, res = response) => {
  try {
    //Desestructuracion del parametro recibido a travez de la URL Es de la reservacion a agregar habitacion
    const { id } = req.params;
    //Desestructuracion de los campos recibidos en el body
    const { habitacion_id } = req.body;
  
    const habitacion = await existeHabitacionById(habitacion_id);
  
    const reservas = await Reservacion.findById(id);
    if (habitacion.disponible === true) {
      if (!reservas.habitaciones.includes(id)) {
        //Agrega el _id de la habitacion al arreglo
        const precio = habitacion.precio;
        reservas.habitaciones.push({ habitacion_id, precio });
        //Guarda la informacion en el array
        await reservas.save();
        //Modifica el modelo en habitacion, cambiando el atributo disponible a false
        await Habitacion.updateMany(
          { _id: habitacion_id },
          { disponible: false }
        );
  
        const totalActualizado = reservas.total + precio;
        const nuevaReserva = await Reservacion.findByIdAndUpdate(id, {
          total: totalActualizado,
        });
        //Confirmacion de agregacion al array
        res
          .status(201)
          .json("Se agrego correctamente la habitacion a su reservacion");
      } else {
        res.status(401).json("La habitacion seleccionada ya esta en su reserva");
      }
    } else {
      res
        .status(409)
        .json({ error: "Actualmente la habitacion no esta disponible" });
    }
  } catch (err) {
    res.status(404).send({
      msg: "No se pudo agregar la habitacion a la reservacion",
      err,
    });
  }
};

//Edita la informacion de la reservacion
const putReservacion = async (req = request, res = response) => {
  try {
    //Desestructuracion del parametro recibido a travez de la URL
    const { id } = req.params;
    //Desestructuracion de los campos a reemplazar
    const { fechaStart, fechaEnd, horaStart, horaEnd } = req.body;
    const reservas = await Reservacion.find({
      usuario: req.usuario._id,
      estado: true,
    });
    //Acceder al objeto de reserva en el índice 0 del array
    const reservaExistente = reservas[0];
    //Creacion de las fechas, concatenando los parametros recibidos
    const fechaInicio = new Date(fechaStart.concat("T", horaStart));
    const fechaFin = new Date(fechaEnd.concat("T", horaEnd));
    //Evaluaciones necesarias para el correcto funcionamiento
    if (!(reservas.length >= 1))
      throw {
        status: 409,
        message: "No puede editar una reservacion si no ha creado una primero",
      };
    if (reservaExistente.fechaInicio.getTime() === fechaInicio.getTime())
      throw {
        status: 409,
        message: "La fecha de inicio es igual a la ingresada anteriormente",
      };
    if (reservaExistente.fechaFin.getTime() === fechaFin.getTime())
      throw {
        status: 409,
        message: "La fecha de fin es igual a la ingresada anteriormente",
      };
    //Generar la data a guardar
    const data = {
      fechaInicio,
      fechaFin,
    };
    //Editar usando el id
    const nuevaReserva = await Reservacion.findByIdAndUpdate(id, data, {
      new: true,
    });
    res.status(200).json(nuevaReserva);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

//Borrar una habitacion en la reservacion
const deleteReservacionHabitacion = async (req = request, res = response) => {
  try {
    //Desestructuracion del parametro recibido a travez de la URL Es de la reservacion a agregar habitacion
    const { id } = req.params;
    //Desestructuracion de los campos recibidos en el body
    const { habitacion_id } = req.body;
  
    const habitacion = await existeHabitacionById(habitacion_id);
    const reservas = await Reservacion.findById(id);
  
    const existeHabitacion = reservas.habitaciones
      .some(habitacion => habitacion.habitacion_id === habitacion_id);
    //return res.json({existeHabitacion});
    if (existeHabitacion) {
      //Obtiene el precio de la habitacion
      const precio = habitacion.precio;
  
      const indice = reservas.habitaciones.findIndex(habitacion => habitacion.habitacion_id === habitacion_id);
  
      //return res.json({indice});
  
      reservas.habitaciones.splice(indice, 1);
      //Guarda la informacion en el array
      await reservas.save();
  
      //Modifica el modelo en habitacion, cambiando el atributo disponible a true
      await Habitacion.updateMany({ _id: habitacion_id }, { disponible: true });
  
      const totalActualizado = reservas.total - precio;
      const nuevaReserva = await Reservacion.findByIdAndUpdate(id, {
        total: totalActualizado,
      });
      //Confirmacion de agregacion al array
      res
        .status(201)
        .json("Se elimino correctamente la habitacion a su reservacion");
    } else {
      res.status(401).json("La habitacion seleccionada ya esta en su reserva");
    }
  } catch (err) {
    res.status(404).send({
      msg: "No se pudo eliminar la habitacion de su reservacion",
      err,
    });
  }
};

//Borrar la reservacion
const deleteReservacion = async (req = request, res = response) => {
  try {
    //Desestructuracion del parametro recibido a travez de la URL
    const { id } = req.params;
  
    const reservas = await Reservacion.findById(id);
    for (let i = 0; i < reservas.habitaciones.length; i++) {
      const habitacion = await Habitacion.findById(
        reservas.habitaciones[i].habitacion_id
      );
      await Habitacion.updateMany(
        { _id: habitacion._id },
        { disponible: true }
      );
    }
  
    //Eliminar fisicamente de la DB
    const reservaEliminada = await Reservacion.findByIdAndDelete(id);
    res
      .status(200)
      .json({ message: "Reserva eliminada", reserva: reservaEliminada });
  } catch (err) {
    res.status(404).send({
      msg: "No se pudo eliminar la reservacion",
      err,
    });
  }
};

module.exports = {
  getReservaciones,
  getReservacionesActivas,
  getReservacionesClient,
  getReservaPorId,
  postReservacion,
  putReservacion,
  deleteReservacionHabitacion,
  deleteReservacion,
  postHabitacionReservacion,
  getReservacionesId,
};
