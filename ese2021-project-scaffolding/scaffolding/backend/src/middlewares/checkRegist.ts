import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { UserAttributes, User } from '../models/user.model';

// this way you can just define a function and export it instead of a whole class
export function checkRegist(req: Request, res: Response, next: any) {

      /*  let sameName = false;
        let sameMail = false;

        const desiredUserName = req.body.userName;
        const desiredEmail = req.body.email;


        User.findAndCountAll({where: {userName: desiredUserName}}).then(result => {
            if (result.count > 1) {
                    sameName = true;
            }
        });

        User.findAndCountAll({where: {email: desiredEmail}}).then(result => {
            if (result.count > 1) {
                sameMail = true;
            }
        });

        setTimeout(() => {if (sameName) {
            res.status(403).send({ message: 'Username already in use.' }); }}, 2000);

        setTimeout(() => {if (sameMail) {
            res.status(403).send({ message: 'Email already in use.' }); }}, 2000);
*/
        setTimeout( () => {
            next();
        }, 5000);

}
