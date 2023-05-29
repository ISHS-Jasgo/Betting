import express from 'express';
const logoutRouter = express.Router();

logoutRouter.get('/', (req, res, next) => {
    req.session.destroy(() => console.log("Session destroyed"));
    res.status(200).send({success: true});
});

module.exports = logoutRouter;