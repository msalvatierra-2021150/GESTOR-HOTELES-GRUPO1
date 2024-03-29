//Importaciones
const { Router } = require('express');
const { check } = require('express-validator');
const { getAdmin, getAllUsers, postAdmin, putAdmin, deleteAdmin } = require('../controllers/admin');
const { emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdminAppRole } = require('../middlewares/validar-roles');

const router = Router();

router.get('/mostrar',[
    validarJWT,
    esAdminAppRole
] ,getAdmin);

router.get('/mostrar-all',[
    validarJWT,
    esAdminAppRole
] ,getAllUsers);

router.post('/agregar', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe de ser más de 6 digitos').isLength( { min: 6 } ),
    check('correo', 'El correo no es valido').isEmail(),
    check('correo').custom( emailExiste ),
    validarCampos,
] ,postAdmin);

router.put('/editar', [
    validarJWT,
    esAdminAppRole,
    validarCampos
] ,putAdmin);


router.delete('/eliminar', [
    validarJWT,
    esAdminAppRole,
    validarCampos
] ,deleteAdmin);

// ROUTER
module.exports = router;