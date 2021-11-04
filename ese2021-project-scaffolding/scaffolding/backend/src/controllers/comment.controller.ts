import express from 'express';
import {Router, Request, Response} from 'express';
import {Comment} from '../models/comment.model';
import {ItemService} from '../services/item.service';
import {MulterRequest} from '../models/multerRequest.model';



const commentController: Router = express.Router();
const itemService = new ItemService();


commentController.post('/', (req: Request, res: Response) => {
    console.log(req.body);
    Comment.create(req.body)
        .then(inserted => res.send(inserted))
        .catch(err => res.status(500).send(err));
});

// add image to a todoItem
commentController.post('/:id/image', (req: MulterRequest, res: Response) => {
    itemService.addImage(req).then(created => res.send(created)).catch(err => res.status(500).send(err));
});

// get the filename of an image
commentController.get('/:id/image', (req: Request, res: Response) => {
    itemService.getImageItem(Number(req.params.id)).then(products => res.send(products))
        .catch(err => res.status(500).send(err));
});


commentController.put('/:id', (req: Request, res: Response) => {
    Comment.findByPk(req.params.id)
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

commentController.delete('/:id', (req: Request, res: Response) => {
    Comment.findByPk(req.params.id)
        .then(found => {
            if (found != null) {
                found.destroy().then(() => res.status(200).send());
            } else {
                res.sendStatus(404);
            }
        })
        .catch(err => res.status(500).send(err));
});

export const CommentController: Router = commentController;
