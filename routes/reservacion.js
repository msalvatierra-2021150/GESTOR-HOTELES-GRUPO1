/*
    Reservacion Routes
    host + /api/reservaciones
*/
//Importaciones
const { Router } = require('express');
const { check } = require('express-validator');
//Controllers
const { getReservaciones, getReservacionesId, postReservacion, putReservacion, deleteReservacion, deleteReservacionHabitacion, postHabitacionReservacion } = require('../controllers/reservacion');
const { existeHabitacionById, existeReservacionById } = require('../helpers/db-validators');
//Middlewares
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { tieneRole } = require('../middlewares/validar-roles');
//Creacion objeto tipo Router()
const router = Router();

//Manejo de rutas
//Mostrar el listado de reservaciones - metodo privado - cualquier persona de user ADMIN_HOTEL
router.get('/', [
    validarJWT,
   // tieneRole('ADMIN_HOTEL'),
    validarCampos
], getReservaciones);

//Mostrar el listado de reservaciones por cliente - metodo privado - cualquier persona de user CLIENT
router.get('/reservacion', [
    validarJWT,
   // tieneRole('CLIENTE'),
    validarCampos
], getReservacionesId);

//Agregar una habitacion - metodo privado - cualquier persona de user CLIENT
router.post('/agregar/:id', [
    validarJWT,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeHabitacionById),
   // tieneRole('CLIENTE'),
    validarCampos
], postReservacion);

router.post('/agregarHabitacion/:id', [
    validarJWT,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeReservacionById),
    check('habitacion_id').custom(existeHabitacionById),
   // tieneRole('CLIENTE'),
    validarCampos
], postHabitacionReservacion);

//Edita la reservacion realizada - metodo privado - cualquier persona de user CLIENT
router.put('/editar/:id', [
    validarJWT,
    check('id', 'No es un ID valido').isMongoId(),
  //  check('cantidadCompra', 'Agregue una cantidad de compra').not().isEmpty(),
  //  check('id').custom(existeHabitacionById),
  //  tieneRole('CLIENTE'),
    validarCampos
], putReservacion);

//Elimina una habitacion de la reservacion - metodo privado - cualquier persona de user CLIENT
router.delete('/eliminar/habitacion/:id', [
    validarJWT,
   // tieneRole('CLIENTE'),
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeReservacionById),
    check('habitacion_id').custom(existeHabitacionById),
    validarCampos
], deleteReservacionHabitacion);

//Cancela la reservacion - metodo privado - cualquier persona de user CLIENT
router.delete('/eliminar/:id', [
    validarJWT,
   // tieneRole('CLIENTE'),
    check('id', 'No es un ID valido').isMongoId(),
   // check('id').custom(existeHabitacionById),
    validarCampos
], deleteReservacion);

module.exports = router;