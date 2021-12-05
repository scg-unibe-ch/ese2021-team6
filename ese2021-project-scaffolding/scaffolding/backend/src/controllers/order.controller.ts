import express from 'express';
import {Router, Request, Response} from 'express';
import {Order} from '../models/order.model';
import {ItemService} from '../services/item.service';
import {MulterRequest} from '../models/multerRequest.model';

const orderController: Router = express.Router();
const itemService = new ItemService();

orderController.post('/', (req: Request, res: Response) => {
    Order.create(req.body)
        .then(inserted => res.send(inserted))
        .catch(err => res.status(500).send(err));
});

orderController.get('/', (req: Request, res: Response) => {
    Order.findAll()
        .then(list => res.status(200).send(list))
        .catch(err => res.status(500).send(err));
});

orderController.put('/:id', (req: Request, res: Response) => {
    Order.findByPk(req.params.id)
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

orderController.delete('/:id', (req: Request, res: Response) => {
    Order.findByPk(req.params.id)
        .then(found => {
            if (found != null) {
                found.destroy().then(() => res.status(200).send());
            } else {
                res.sendStatus(404);
            }
        })
        .catch(err => res.status(500).send(err));
});

export const OrderController: Router = orderController;
