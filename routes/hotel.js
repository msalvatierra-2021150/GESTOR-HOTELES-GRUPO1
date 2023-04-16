// Exportaciones
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { existeHotelById } = require('../helpers/db-validators');

const { getHoteles, getHotelById, postHotel, putHotel, deleteHotel } = require('../controllers/hotel');
const { esAdminHotelRole, esAdminAppRole } = require('../middlewares/validar-roles');

const router = Router();

//------------------------------GET route---------------------------------
router.get('/', [
    validarJWT,
    // validarCampos
], getHoteles);

//------------------------------READ by ID route---------------------------------
router.get('/:id', [
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeHotelById),
    validarJWT,
    validarCampos
], getHotelById);

//------------------------------POST route---------------------------------
router.post('/agregar',  [
    check('eventos', 'No es un id valido').isMongoId(),
    check('departamento', 'No es un id valido').isMongoId(),
    check('departamento', 'La direccion es obligatoria').not().isEmpty(),
    check('direccion', 'La direccion es obligatoria').not().isEmpty(),
    check('rating', 'El rating debe ser un dígito menor a 6').isInt({ min: 0, max: 5 }),
    check('nit', 'El nit es obligatorio').not().isEmpty(),
    validarJWT,
    esAdminAppRole,
    //esAdminHotelRole,
    validarCampos
], postHotel);

//------------------------------PUT route---------------------------------
router.put('/editar/:id', [
    check('id', 'No es un id valido').isMongoId(),
    check('eventos', 'No es un id valido').isMongoId(),
    check('departamento', 'No es un id valido').isMongoId(),
    check('rating', 'El rating debe ser un dígito menor a 6').isInt({ min: 0, max: 5 }),
    check('nit', 'El nit es obligatorio').not().isEmpty(),
    check('id').custom(existeHotelById),
    validarJWT,
    esAdminAppRole,
    //esAdminHotelRole,
    validarCampos
], putHotel);

//------------------------------DELETE route---------------------------------
router.delete('/eliminar/:id', [
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeHotelById),
    validarJWT,
    esAdminAppRole,
    //esAdminHotelRole,
    validarCampos
], deleteHotel);

//------------------------------Exportacion-------------------------------------------
module.exports = router;