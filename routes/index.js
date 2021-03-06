var express = require('express');
var router = express.Router();
require('dotenv').config({path: './.env'});
const acesso = require('../controllers/acessoController');
const scca = require('../controllers/sccaController');
const gcd = require('../controllers/depositoController');
const aa = require('../controllers/AAController');
const atd = require('../controllers/atendimentoController');
const inst = require('../controllers/instituicaoController');
const email = require('../controllers/emailController');
const child = require('../controllers/criancasperdidascontroller');
const crachas = require('../controllers/crachasController');
var mid = require('../asyncMiddleware');
router.post('/acesso/validar', mid.asyncMiddleware(acesso.validarSenha))
router.post('/acesso/atualizarSenha', mid.asyncMiddleware(acesso.atualizarSenha))
router.post('/acesso/salvar', mid.asyncMiddleware(acesso.salvar))
router.post('/notificado', scca.getScca);
router.get('/gcd/buscarLacre', mid.asyncMiddleware(gcd.buscarLacre))
router.post('/gcd/getLacre', mid.asyncMiddleware(gcd.getLacre))
router.post('/gcd/buscarPosicao', mid.asyncMiddleware(gcd.buscarPos))
router.post('/gcd/salvar', mid.asyncMiddleware(gcd.salvar))
router.post('/gcd/atualizaCartorio', mid.asyncMiddleware(gcd.atualizaCartorio))
router.post('/gcd/atualizaPlantao', mid.asyncMiddleware(gcd.atualizaPlantao))
router.post('/gcd/atualizaLacre', mid.asyncMiddleware(gcd.atualizaLacre))
router.post('/gcd/autos/buscarAuto', mid.asyncMiddleware(aa.buscarAuto))
router.post('/gcd/autos/salvar', mid.asyncMiddleware(aa.salvar))
router.get('/gcd/autos/contar', mid.asyncMiddleware(aa.contar))
router.post('/gcd/atendimento/salvar', mid.asyncMiddleware(atd.salvar))
router.post('/gcd/atendimento/buscar', mid.asyncMiddleware(atd.buscar))
router.post('/gcd/instituicao/salvar', mid.asyncMiddleware(inst.salvar))
router.post('/gcd/instituicao/buscar', mid.asyncMiddleware(inst.buscar))
router.post('/gcd/instituicao/atualizar', mid.asyncMiddleware(inst.atualizar))
router.get('/gcd/criancas/:id', mid.asyncMiddleware(child.buscarId))
router.get('/gcd/email/enviar', mid.asyncMiddleware(email.enviar))
router.get('/crachas/listar', mid.asyncMiddleware(crachas.listar))
router.post('/crachas/atualizar', mid.asyncMiddleware(crachas.atualizar))

module.exports = router

