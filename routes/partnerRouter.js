const express = require('express');
const Partner = require('../models/partner');
const partnerRouter = express.Router();
const authenticate = ('../authenticate')
partnerRouter.route('/:partnerId/comments')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
    partner.findById(req.params.partnerId)
    .then(partner => {
        if (partner) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(partner.comments);
        } else {
            err = new Error(`partner ${req.params.partnerId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    partner.findById(req.params.partnerId)
    .then(partner => {
        if (partner) {
            partner.comments.push(req.body);
            partner.save()
            .then(partner => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(partner);
            })
            .catch(err => next(err));
        } else {
            err = new Error(`partner ${req.params.partnerId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end(`PUT operation not supported on /partners/${req.params.partnerId}/comments`);
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    partner.findById(req.params.partnerId)
    .then(partner => {
        if (partner) {
            for (let i = (partner.comments.length-1); i >= 0; i--) {
                partner.comments.id(partner.comments[i]._id).remove();
            }
            partner.save()
            .then(partner => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(partner);
            })
            .catch(err => next(err));
        } else {
            err = new Error(`partner ${req.params.partnerId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
});

partnerRouter.route('/:partnerId/comments/:commentId')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
    partner.findById(req.params.partnerId)
    .then(partner => {
        if (partner && partner.comments.id(req.params.commentId)) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(partner.comments.id(req.params.commentId));
        } else if (!partner) {
            err = new Error(`partner ${req.params.partnerId} not found`);
            err.status = 404;
            return next(err);
        } else {
            err = new Error(`Comment ${req.params.commentId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /partners/${req.params.partnerId}/comments/${req.params.commentId}`);
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    partner.findById(req.params.partnerId)
    .then(partner => {
        if (partner && partner.comments.id(req.params.commentId)) {
            if (req.body.rating) {
                partner.comments.id(req.params.commentId).rating = req.body.rating;
            }
            if (req.body.text) {
                partner.comments.id(req.params.commentId).text = req.body.text;
            }
            partner.save()
            .then(partner => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(partner);
            })
            .catch(err => next(err));
        } else if (!partner) {
            err = new Error(`partner ${req.params.partnerId} not found`);
            err.status = 404;
            return next(err);
        } else {
            err = new Error(`Comment ${req.params.commentId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    partner.findById(req.params.partnerId)
    .then(partner => {
        if (partner && partner.comments.id(req.params.commentId)) {
            partner.comments.id(req.params.commentId).remove();
            partner.save()
            .then(partner => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(partner);
            })
            .catch(err => next(err));
        } else if (!partner) {
            err = new Error(`partner ${req.params.partnerId} not found`);
            err.status = 404;
            return next(err);
        } else {
            err = new Error(`Comment ${req.params.commentId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
});

module.exports = partnerRouter;