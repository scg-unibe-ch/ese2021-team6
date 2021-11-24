import express from 'express';
import { Router, Request, Response } from 'express';
import { Post } from '../models/post.model';
import { ItemService } from '../services/item.service';
import {MulterRequest} from '../models/multerRequest.model';

const itemService = new ItemService();

const postController: Router = express.Router();

postController.post('/', (req: Request, res: Response) => {
    const name = String(req.body.filename);
    console.log(name);
    Post.create(req.body).then(created => {
        res.status(201).send(created);
    })
        .catch(err => res.status(500).send(err));
});

postController.put('/:id', (req: Request, res: Response) => {
    Post.findByPk(req.params.id)
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

postController.delete('/:id', (req: Request, res: Response) => {
    Post.findByPk(req.params.id)
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

postController.get('/', (req: Request, res: Response) => {
    // this automatically fills each post with the according comments
    Post.findAll({ include: [Post.associations.comments] })
        .then(list => res.status(200).send(list))
        .catch(err => res.status(500).send(err));
});


// add image to a post
postController.post('/:id/image', (req: MulterRequest, res: Response) => {
    itemService.addImage(req).then(created => res.send(created)).catch(err => res.status(500).send(err));
});

// get the filename of an image
postController.get('/:id/image', (req: Request, res: Response) => {
    itemService.getImageItem(Number(req.params.id)).then(products => res.send(products))
        .catch(err => res.status(500).send(err));
});

export const PostController: Router = postController;
