import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { UserAttributes, User } from '../models/user.model';

// this way you can just define a function and export it instead of a whole class
export function checkRegist(req: Request, res: Response, next: any) {

        let sameName = false;
        // const sameMail: false;
        // since the authorization header consists of "Bearer <token>" where <token> is a JWT token
        const desiredUserName = req.body.userName;
        const desiredEmail = req.body.email;
        console.log(desiredUserName);
        console.log(desiredEmail);
        // console.log(User.findOne({where: {userName: desiredUserName}}));

        User.findAndCountAll({where: {userName: desiredUserName}}).then(result => {
            console.log('beforIf');
            console.log(result.count);
            if (result.count > 1) {
                    sameName = true;
                console.log(sameName);
            }
        });

        // User.findOne(({where: {userName: desiredUserName}})).then({
        //        res.status(403).send({ message: 'Username already in use.' }));
        console.log(sameName);
        if (sameName) {
            console.log('yep');
            res.status(403).send({ message: 'Username already in use.' });
        }
     //   if (User.findOne({where: {email: desiredEmail}})) {
      //      res.status(403).send({ message: 'E-mail already in use.' });
      //  }
        // adds the field "tokenPayload" to the request enabling following functions to use data from the token

        next();
}
