const express = require("express");
const cors = require("cors");
const users = require("../controllers/users");
const clients = require("../controllers/clients");
const charges = require("../controllers/charges");
const summaryClients = require("../controllers/summaryClients");
const summaryCharges = require("../controllers/summaryCharges");
const loginVerify = require("../middlewares/loginVerify");
const schemaLogin = require("../validation/schemaLogin");
const schemaUserRegister = require("../validation/schemaUserRegister");
const schemaUserUpdate = require("../validation/schemaUserUpdate");
const schemaAddClient = require("../validation/schemaAddClient");
const schemaClientUpdate = require("../validation/schemaClientUpdate");
const schemaAddCharge = require("../validation/schemaAddCharge");
const reqBodyValidation = require("../middlewares/reqBodyValidation");

const router = express.Router();

router.use(cors());

//rotas de usuários

router.get("/users", users.userList);

router.post(
    "/users",
    reqBodyValidation(schemaUserRegister),
    users.userRegister
);

router.post("/login", reqBodyValidation(schemaLogin), users.userLogin);

router.use(loginVerify);

router.post(
    "/users/:id",
    reqBodyValidation(schemaUserUpdate),
    users.userUpdate
);
router.delete("/users/:id", users.userDelete);

//rotas de cliente
router.get("/userClients/:userId", clients.clientsList);
router.post(
    "/client",
    reqBodyValidation(schemaAddClient),
    clients.registerClient
);
router.put(
    "/client/:id",
    reqBodyValidation(schemaClientUpdate),
    clients.clientUpdate
);
router.get("/client/:id", clients.getClientInfoById);
router.get("/clientDefaulter/:userId", summaryClients.summaryDefaulter);
router.get("/clientGoodStanding/:userId", summaryClients.summaryGoodStanding);

//rotas de cobranças
router.post(
    "/charges/register/:id",
    reqBodyValidation(schemaAddCharge),
    charges.registerCharge
);
router.put("/charges/:id", charges.editCharges);
router.get("/charges/:id", charges.getChargesByClientId);
router.get("/charges", charges.listCharges);
router.get("/client-and-charges/:id", charges.getClientAndChargesById);
router.get("/charges/total/:userId", summaryCharges.sumCharges);
router.get("/charges/vencidas/:userId", summaryCharges.summaryOverdue);
router.get("/charges/pendentes/:userId", summaryCharges.summaryPending);
router.get("/charges/pagas/:userId", summaryCharges.summaryPaid);
router.delete("/charges/:id", charges.deleteCharge);

module.exports = router;
