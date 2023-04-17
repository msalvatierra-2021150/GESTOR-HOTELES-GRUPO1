//Importaciones
const { Router } = require('express');
const { check } = require('express-validator');
const { getDepartamentoNombre, postDepartamentoNombre, putDepartamentoNombre, deleteDepartamentoNombre } = require('../controllers/departamento-nombre');
const { existeDepartamento } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWTDepartamentoNombre, validarJWT } = require('../middlewares/validar-jwt');
const { tieneRole, esAdminAppRole } = require('../middlewares/validar-roles');

const router = Router();

router.get('/', getDepartamentoNombre);

router.post('/agregar', [
    //validarJWT,
    //esAdminAppRole,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('nombre').custom( existeDepartamento),
    validarCampos,
] ,postDepartamentoNombre);

router.put('/editar/:id', [
    //validarJWT,
    //esAdminAppRole,
    check('id', 'No es un ID válido').isMongoId(),
    check('nombre').custom( existeDepartamento),
    validarCampos
] ,putDepartamentoNombre);


router.delete('/eliminar/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    //validarJWT,
    //esAdminAppRole,
    validarCampos
] ,deleteDepartamentoNombre);


module.exports = router;