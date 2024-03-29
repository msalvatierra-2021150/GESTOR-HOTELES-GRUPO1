/*
    Reservacion Routes
    host + /api/reservaciones
*/
//Importaciones
const { Router } = require('express');
const { check } = require('express-validator');
//Controllers
const { getReservaciones, getReservacionesClient, postReservacion, putReservacion, deleteReservacion, deleteReservacionHabitacion, postHabitacionReservacion, getReservacionesActivas, getReservaPorId, getReservacionesByHotel } = require('../controllers/reservacion');
const { existeHabitacionById, existeReservacionById, existeUsuarioPorId } = require('../helpers/db-validators');
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
    tieneRole('ADMIN_HOTEL'),
    validarCampos
], getReservaciones);

//Muestra la reservacion segun el ID - metodo privado - cualquier persona
router.get('/:id', [
    validarJWT,
    tieneRole('USUARIO_ROLE', 'ADMIN_HOTEL'),
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeReservacionById),
    validarCampos
], getReservaPorId);

//Mostrar el listado de reservaciones activas en los hoteles que administra el admin hoteles buscando con el id del usuario 
//(CLIENT) - metodo privado - cualquier persona de user ADMIN_HOTEL
router.get('/buscar/user/:id', [
    validarJWT,
    tieneRole('ADMIN_HOTEL'),
    check('id', 'No es un ID valido').isMongoId(),
    //check('userId').custom(existeUsuarioPorId),
    validarCampos
], getReservacionesActivas);

router.get('/hotel/:id', [
    validarJWT,
    tieneRole('ADMIN_HOTEL'),
    check('id', 'No es un ID valido').isMongoId(),
    validarCampos
], getReservacionesByHotel);

//Mostrar el listado de reservaciones por cliente que se encuentren activas - metodo privado - cualquier persona de user CLIENT
router.get('/client/reservacion/:id', [
    validarJWT,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeReservacionById),
    tieneRole('USUARIO_ROLE'),
    validarCampos
], getReservacionesClient);

//Crea una reservacion - metodo privado - cualquier persona de user CLIENT
router.post('/agregar/:id', [
    validarJWT,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeHabitacionById),
    check('fechaStart', 'Agregue una fecha de inicio de su estancia').not().isEmpty(),
    check('horaStart', 'Agregue la hora de inicio de su estancia').not().isEmpty(),
    check('fechaEnd', 'Agregue una fecha de fin de su estancia').not().isEmpty(),
    check('horaEnd', 'Agregue la hora de fin de su estancia').not().isEmpty(),
    tieneRole('USUARIO_ROLE'),
    validarCampos
], postReservacion);

//Agregar una habitacion a una reserva creada - metodo privado - cualquier persona de user CLIENT
router.post('/agregarHabitacion/:id', [
    validarJWT,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeReservacionById),
    check('habitacion_id').custom(existeHabitacionById),
    tieneRole('USUARIO_ROLE'),
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
    //tieneRole('USUARIO_ROLE'),
    validarCampos
], putReservacion);

//Elimina una habitacion de la reservacion - metodo privado - cualquier persona de user CLIENT
router.delete('/eliminar/habitacion/:id', [
    validarJWT,
    tieneRole('USUARIO_ROLE'),
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeReservacionById),
    check('habitacion_id').custom(existeHabitacionById),
    validarCampos
], deleteReservacionHabitacion);

//Elimina la reservacion - metodo privado - cualquier persona de user CLIENT
router.delete('/eliminar/:id', [
    validarJWT,
    tieneRole('USUARIO_ROLE'),
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeReservacionById),
    validarCampos
], deleteReservacion);

module.exports = router;