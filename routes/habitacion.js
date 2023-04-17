// Exportaciones
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { existeHabitacionById } = require('../helpers/db-validators');

const { getHabitaciones, getHabitacionById, postHabitacion, putHabitacion, deleteHabitacion } = require('../controllers/habitacion');

const router = Router();

//------------------------------GET route---------------------------------
router.get('/', [
    validarJWT,
    validarCampos
],getHabitaciones);

//------------------------------READ by ID route---------------------------------
router.get('/:id', [
    check('id', 'No es un id valido').isMongoId(),
    validarJWT,
    validarCampos
],getHabitacionById);

//------------------------------POST route---------------------------------
router.post('/agregar',  [
    check('hotel', 'No es un id valido').isMongoId(),
    validarJWT,
    validarCampos
],postHabitacion);

//------------------------------PUT route---------------------------------
router.put('/editar/:id', [
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeHabitacionById),
    validarJWT,
    validarCampos
],putHabitacion);

//------------------------------DELETE route---------------------------------
router.delete('/eliminar/:id', [
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeHabitacionById),
    validarJWT,
    validarCampos
],deleteHabitacion);

//------------------------------Exportacion-------------------------------------------
module.exports = router;