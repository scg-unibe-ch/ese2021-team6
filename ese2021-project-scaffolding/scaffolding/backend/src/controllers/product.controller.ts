import express from 'express';
import { Router, Request, Response } from 'express';
import { Product } from '../models/product.model';
import { UserService } from '../services/user.service';
import { ProductService } from '../services/product.service';
import {MulterRequest} from '../models/multerRequest.model';

const productService = new ProductService();
const userService = new UserService();

const productController: Router = express.Router();

// post a product in shop (admin only)
productController.post('/post', (req: Request, res: Response) => {
    console.log(req.body);
    Product.create(req.body).then(created => {
        res.status(201).send(created);
    })
        .catch(err => res.status(500).send(err));
});

productController.put('/:id', (req: Request, res: Response) => {
    Product.findByPk(req.params.id)
        .then(found => {
            if (found != null) {
                found.update(req.body).then(updated => {
                    res.status(200).send(updated);
                });
            } else {
                res.sendStatus(404);
            }

        })
        .catch(err => res.status(500).send(err));
});

// delete product (admin only)
productController.delete('/:id', (req: Request, res: Response) => {
    Product.findByPk(req.params.id)
        .then(found => {
            if (found != null) {
                found.destroy()
                    .then(item => res.status(200).send({ deleted: item }))
                    .catch(err => res.status(500).send(err));
            } else {
                res.sendStatus(404);
            }
        })
        .catch(err => res.status(500).send(err));
});

// get price of product
productController.get('/price', (req: Request, res: Response) => {
    const Id = Number(req.body.productId);
    Product.findByPk(Id)
        .then(product => {
            const price = product.price;
            res.status(200).send(price.toString());
        });
});

// get Id of user-> admin who posted the product
productController.get('/userId',
    (req: Request, res: Response) => {
        const Id = Number(req.body.productId);
        Product.findByPk(Id)
            .then(product => {
                const userId = product.userId;
                res.status(200).send(userId.toString());
            });
    });

productController.get('/:id', (req: Request, res: Response) => {
    Product.findByPk(req.params.id)
        .then(found => {
            if (found != null) {
                res.status(200).send(found);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(err => res.status(500).send(err));
});

export const PostController: Router = productController;
