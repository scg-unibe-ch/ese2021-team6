import express, { Application , Request, Response } from 'express';
import morgan from 'morgan';
import { CommentController } from './controllers/comment.controller';
import { PostController } from './controllers/post.controller';
import { UserController } from './controllers/user.controller';
import { SecuredController } from './controllers/secured.controller';
import { Sequelize } from 'sequelize';
import { Post } from './models/post.model';
import { Product } from './models/product.model';
import { Comment } from './models/comment.model';
import { User } from './models/user.model';
import {ItemImage} from './models/itemImage.model';
import { VotedPost } from './models/votedPosts.model';
import { Order } from './models/order.model';


import cors from 'cors';
import {AdminController} from './controllers/admin.controller';
import { VotedPostController } from './controllers/votedPosts.controller';
import { ProductController } from './controllers/product.controller';
import { OrderController } from './controllers/order.controller';

export class Server {
    private server: Application;
    private sequelize: Sequelize;
    private port = process.env.PORT || 3000;

    constructor() {
        this.server = this.configureServer();
        this.sequelize = this.configureSequelize();

        Comment.initialize(this.sequelize); // creates the tables if they dont exist
        Post.initialize(this.sequelize);
        Product.initialize(this.sequelize);
        User.initialize(this.sequelize);
        VotedPost.initialize(this.sequelize);
        ItemImage.initialize(this.sequelize);
        Order.initialize(this.sequelize);
        Comment.createAssociations();
        Post.createAssociations();
        // ItemImage.createAssociations();

        this.sequelize.sync().then(() => {                           // create connection to the database
            this.server.listen(this.port, () => {                                   // start server on specified port
                console.log(`server listening at http://localhost:${this.port}`);   // indicate that the server has started
            });
        });
    }

    private configureServer(): Application {
        // options for cors middleware
        const options: cors.CorsOptions = {
            allowedHeaders: [
                'Origin',
                'X-Requested-With',
                'Content-Type',
                'Accept',
                'X-Access-Token',
            ],
            credentials: true,
            methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
            origin: `http://localhost:${this.port}`,
            preflightContinue: false,
        };

        return express()
            .use(cors())
            .use(express.json())                    // parses an incoming json to an object
            .use(morgan('tiny'))                    // logs incoming requests
            .use('/comment', CommentController)   // any request on this path is forwarded to the TodoItemController
            .use('/post', PostController)
            .use('/user', UserController)
            .use('/secured', SecuredController)
            .use('/admin', AdminController)
            .use('/votedPosts', VotedPostController)
            .use('/product', ProductController)
            .use('/order', OrderController)
            .options('*', cors(options))
            .use(express.static('./src/public'))
            .use('/uploads', express.static('./src/public/uploads')) // IS REALLY NEEDED FORWARD TO FRONTEND
            // this is the message you get if you open http://localhost:3000/ when the server is running
            .get('/', (req, res) => res.send('<h1>Welcome to the ESE-2021 Backend Scaffolding <span style="font-size:50px">&#127881;</span></h1>'));
    }

    private configureSequelize(): Sequelize {
        return new Sequelize({
            dialect: 'sqlite',
            storage: 'db.sqlite',
            logging: false // can be set to true for debugging
        });
    }
}

const server = new Server(); // starts the server
