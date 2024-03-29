const { Router } = require('express');
const { check } = require('express-validator');

//Controllers
const { postCarrito, getCarrito, deleteCarrito, putCarrito,deleteAllCarrito } = require('../controllers/cartServicios');

// Middlewares
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');



const router = Router();

//Manejo de rutas

// Obtener todas las categorias - publico
router.get('/mostrar', [
    validarJWT
] , getCarrito);

// Crear categoria - privada - cualquier persona con un token válido

router.post('/agregar', [
    validarJWT,
    check('itemId', 'No es un id de Mongo Válido').isMongoId()
], postCarrito );


// Actuaizar categoria - privada - cualquier persona con un token válido
router.put('/editar/:itemId', [
    validarJWT,
    check('itemId', 'No es un id de Mongo Válido').isMongoId(),
    validarCampos
] , putCarrito);



//Borrar una categoria - privado - Solo el admin puede eliminar una categoria (estado: false)
router.delete('/eliminar/:itemId', [
    validarJWT,
    check('itemId', 'No es un id de Mongo Válido').isMongoId(),
    validarCampos
] ,deleteCarrito);

//eliminar todo el carrito

router.delete('/eliminarCarr', [
    validarJWT,
 
], deleteAllCarrito );

module.exports = router;