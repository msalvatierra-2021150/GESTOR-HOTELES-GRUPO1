//Importaciones
const { Router } = require('express');
const { check } = require('express-validator');
const { getEvento, postEvento, putEvento, deleteEvento } = require('../controllers/evento');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdminAppRole } = require('../middlewares/validar-roles');
const { validarCampos } = require('../middlewares/validar-campos');
const { existeEvento } = require('../helpers/db-validators');

const router = Router();

router.get('/',[
] ,getEvento);

router.post('/agregar', [
    check('nombreEvento', 'El nombre es obligatorio').not().isEmpty(),
    check('cantidadUsuarios', 'La cantidad es obligatorio').isNumeric(),
    check('nombreEvento').custom( existeEvento ),
    validarCampos,
] ,postEvento);

router.put('/editar/:id', [
    check('nombreEvento', 'El nombre es obligatorio').not().isEmpty(),
    check('cantidadUsuarios', 'La cantidad es obligatorio').isNumeric(),
    check('nombreEvento').custom( existeEvento ),
    validarCampos,
   
] ,putEvento);


router.delete('/eliminar/:id', [
    
] ,deleteEvento);

// ROUTER
module.exports = router;