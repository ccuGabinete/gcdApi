var express = require('express');
var router = express.Router();
const acesso = require('../controllers/acessoController');
const scca = require('../controllers/sccaController');
const gcd = require('../controllers/depositoController');
const aa = require('../controllers/AAController');
const atd = require('../controllers/atendimentoController');
var mid = require('../asyncMiddleware');

router.post('/acesso/validar', mid.asyncMiddleware(acesso.validarSenha))
router.post('/acesso/atualizarSenha', mid.asyncMiddleware(acesso.atualizarSenha))
router.post('/acesso/salvar', mid.asyncMiddleware(acesso.salvar))
router.post('/notificado', scca.getScca);
router.get('/gcd/buscarLacre', mid.asyncMiddleware(gcd.buscarLacre))
router.post('/gcd/buscarPosicao', mid.asyncMiddleware(gcd.buscarPos))
router.post('/gcd/salvar', mid.asyncMiddleware(gcd.salvar))
router.post('/gcd/atualizaCartorio', mid.asyncMiddleware(gcd.atualizaCartorio))
router.post('/gcd/atualizaPlantao', mid.asyncMiddleware(gcd.atualizaPlantao))
router.post('/gcd/autos/buscarAuto', mid.asyncMiddleware(aa.buscarAuto))
router.post('/gcd/autos/salvar', mid.asyncMiddleware(aa.salvar))
router.post('/gcd/atendimento/salvar', mid.asyncMiddleware(atd.salvar))




module.exports = router

