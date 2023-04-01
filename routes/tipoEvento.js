//Importaciones
const { Router } = require('express');
const { check } = require('express-validator');
const { getTipoEventos, postTipoEvento, putTipoEvento, deleteTipoEvento } = require('../controllers/tipoEvento');
const { esRoleValido } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { tieneRole } = require('../middlewares/validar-roles');

const router = Router();

router.get('/mostrar', getTipoEventos);

router.post('/agregar', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos,
] ,postTipoEvento);

router.put('/editar/:id', [
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    validarCampos
] ,putTipoEvento);


router.delete('/eliminar/:id', [
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    validarCampos
] ,deleteTipoEvento);


module.exports = router;


// ROUTES
