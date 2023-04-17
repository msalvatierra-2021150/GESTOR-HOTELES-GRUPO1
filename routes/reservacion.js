/*
    Reservacion Routes
    host + /api/reservaciones
*/
//Importaciones
const { Router } = require('express');
const { check } = require('express-validator');
//Controllers
const { getReservaciones, getReservacionesClient, postReservacion, putReservacion, deleteReservacion, deleteReservacionHabitacion, postHabitacionReservacion, getReservacionesActivas, getReservaPorId } = require('../controllers/reservacion');
const { existeHabitacionById, existeReservacionById, existeUsuarioPorId } = require('../helpers/db-validators');
//Middlewares
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { tieneRole } = require('../middlewares/validar-roles');
//Creacion objeto tipo Router()
const router = Router();

//Manejo de rutas
//Mostrar el listado de reservaciones en los hoteles que administra el admin hoteles - metodo privado - cualquier persona de user ADMIN_HOTEL
router.get('/', [
    validarJWT,
    tieneRole('ADMIN_HOTEL'),
    validarCampos
], getReservaciones);

//Mostrar el listado de reservaciones activas en los hoteles que administra el admin hoteles buscando con el id del usuario (CLIENT) - metodo privado - cualquier persona de user ADMIN_HOTEL
router.get('/buscar/user', [
    validarJWT,
    tieneRole('ADMIN_HOTEL'),
    check('userId').custom(existeUsuarioPorId),
    validarCampos
], getReservacionesActivas);

//Mostrar el listado de reservaciones por cliente que se encuentren activas - metodo privado - cualquier persona de user CLIENT
router.get('/reservacion', [
    validarJWT,
    tieneRole('CLIENTE'),
    validarCampos
], getReservacionesClient);

//Muestra la reservacion segun el ID - metodo privado - cualquier persona
router.get('/:id', [
    validarJWT,
    tieneRole('CLIENTE','ADMIN_HOTEL'),
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeReservacionById),
    validarCampos
], getReservaPorId);

//Agregar una habitacion - metodo privado - cualquier persona de user CLIENT
router.post('/agregar/:id', [
    validarJWT,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeHabitacionById),
    check('fechaStart', 'Agregue una fecha de inicio de su estancia').not().isEmpty(),
    check('horaStart', 'Agregue la hora de inicio de su estancia').not().isEmpty(),
    check('fechaEnd', 'Agregue una fecha de fin de su estancia').not().isEmpty(),
    check('horaEnd', 'Agregue la hora de fin de su estancia').not().isEmpty(),
    tieneRole('CLIENTE'),
    validarCampos
], postReservacion);

router.post('/agregarHabitacion/:id', [
    validarJWT,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeReservacionById),
    check('habitacion_id').custom(existeHabitacionById),
    tieneRole('CLIENTE'),
    validarCampos
], postHabitacionReservacion);

//Edita la reservacion realizada - metodo privado - cualquier persona de user CLIENT
router.put('/editar/:id', [
    validarJWT,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeReservacionById),
    check('fechaStart', 'Agregue una fecha de inicio de su estancia').not().isEmpty(),
    check('horaStart', 'Agregue la hora de inicio de su estancia').not().isEmpty(),
    check('fechaEnd', 'Agregue una fecha de fin de su estancia').not().isEmpty(),
    check('horaEnd', 'Agregue la hora de fin de su estancia').not().isEmpty(),
    tieneRole('CLIENTE'),
    validarCampos
], putReservacion);

//Elimina una habitacion de la reservacion - metodo privado - cualquier persona de user CLIENT
router.delete('/eliminar/habitacion/:id', [
    validarJWT,
    tieneRole('CLIENTE'),
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeReservacionById),
    check('habitacion_id').custom(existeHabitacionById),
    validarCampos
], deleteReservacionHabitacion);

//Elimina la reservacion - metodo privado - cualquier persona de user CLIENT
router.delete('/eliminar/:id', [
    validarJWT,
    tieneRole('CLIENTE'),
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeReservacionById),
    validarCampos
], deleteReservacion);

module.exports = router;