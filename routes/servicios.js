//Importaciones
const { Router } = require('express');
const { check } = require('express-validator');
const { getServicios, postSerivicos, putServicios, deleteServicio } = require('../controllers/servicios');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdminAppRole } = require('../middlewares/validar-roles');
const { validarCampos } = require('../middlewares/validar-campos');
const { existeServicio } = require('../helpers/db-validators');

const router = Router();

router.get('/mostrar',[
    validarJWT,
    //esAdminAppRole,
    validarCampos,
] ,getServicios);

router.post('/agregar', [
    /*
    check('nombreServicio', 'El nombre es obligatorio').not().isEmpty(),
    check('precio', 'El precio es obligatorio').not().isEmpty(),
    check('nombreServicio').custom( existeServicio ),*/
    validarCampos,
] ,postSerivicos);

router.put('/editar/:id', [
    /*
    check('nombreServicio', 'El nombre es obligatorio').not().isEmpty(),
    check('precio', 'El precio es obligatorio').not().isEmpty(),
    check('nombreServicio').custom( existeServicio ),
    */
    validarCampos,
] ,putServicios);


router.delete('/eliminar/:id', [
    validarJWT,
    //esAdminAppRole,
    validarCampos
] ,deleteServicio);

// ROUTER
module.exports = router;