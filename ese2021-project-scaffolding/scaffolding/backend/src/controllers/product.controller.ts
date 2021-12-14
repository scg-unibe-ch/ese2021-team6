import express from 'express';
import { Router, Request, Response } from 'express';
import { Product } from '../models/product.model';
import { ItemService } from '../services/item.service';
import { UserService } from '../services/user.service';
import { ProductService } from '../services/product.service';
import {MulterRequest} from '../models/multerRequest.model';

const itemService = new ItemService();
const productService = new ProductService();
const userService = new UserService();

const productController: Router = express.Router();

productController.post('/', (req: Request, res: Response) => {
    Product.create(req.body).then(created => {
        res.status(201).send(created);
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

productController.get('/', (req: Request, res: Response) => {
    Product.findAll()
        .then(list => res.status(200).send(list))
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

// add image to a post
productController.post('/:id/image', (req: MulterRequest, res: Response) => {
    itemService.addProductImage(req).then(created => res.send(created)).catch(err => res.status(500).send(err));
});

// get the filename of an image
productController.get('/:id/image', (req: Request, res: Response) => {
    itemService.getImageItem(Number(req.params.id)).then(products => res.send(products))
        .catch(err => res.status(500).send(err));
});

export const ProductController: Router = productController;
