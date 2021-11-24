
import express, { Router, Request, Response } from 'express';
import { VotedPost } from '../models/votedPosts.model';

const votedPostsController: Router = express.Router();

votedPostsController.post('/', (req: Request, res: Response) => {
    VotedPost.create(req.body).then(created => {
        res.status(201).send(created);
    })
        .catch(err => res.status(500).send(err));
});

votedPostsController.get('/', (req: Request, res: Response) => {
    VotedPost.findAll()
        .then(found => res.status(200).send(found))
        .catch(err => res.status(500).send(err));
});

votedPostsController.put('/:id', (req: Request, res: Response) => {
    VotedPost.findByPk(req.params.id)
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

votedPostsController.delete('/:id', (req: Request, res: Response) => {
    VotedPost.findByPk(req.params.id)
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


export const VotedPostController: Router = votedPostsController;
