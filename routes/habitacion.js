// Exportaciones
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { existeHabitacionById } = require('../helpers/db-validators');

const { getHabitaciones, getHabitacionById, postHabitacion, putHabitacion,
    deleteHabitacion, getHabitacionesByHotel } = require('../controllers/habitacion');
const { esAdminHotelRole, esAdminAppRole } = require('../middlewares/validar-roles');

const router = Router();

//------------------------------GET route---------------------------------
router.get('/', [
    validarJWT,
    validarCampos
], getHabitaciones);

//------------------------------READ by ID route---------------------------------
router.get('/:id', [
    check('id', 'No es un id valido').isMongoId(),
    validarJWT,
    validarCampos
], getHabitacionById);

//------------------------------READ by Hotel route---------------------------------
router.get('/hotel/:id', [
    check('id', 'No es un id valido').isMongoId(),
    validarJWT,
    validarCampos
], getHabitacionesByHotel);

//------------------------------POST route---------------------------------
router.post('/agregar', [
    check('hotel', 'No es un id valido').isMongoId(),
    //check('rol').custom(esAdminAppRole),
    validarJWT,
    validarCampos,
    //esAdminAppRole,
    esAdminHotelRole
], postHabitacion);

//------------------------------PUT route---------------------------------
router.put('/editar/:id', [
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeHabitacionById),
    validarJWT,
    //esAdminAppRole,
    esAdminHotelRole,
    validarCampos
], putHabitacion);

//------------------------------DELETE route---------------------------------
router.delete('/eliminar/:id', [
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeHabitacionById),
    validarJWT,
    //esAdminAppRole,
    esAdminHotelRole,
    validarCampos
], deleteHabitacion);

//------------------------------Exportacion-------------------------------------------
module.exports = router;