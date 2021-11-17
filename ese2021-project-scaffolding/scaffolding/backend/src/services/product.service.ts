import { UserAttributes, User } from '../models/user.model';
import { ProductAttributes, Product } from '../models/product.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class ProductService {


    public buy() {
    }

// gets the price of a specific Product
    public price(Id: number): Promise<number> {
        return Product.findByPk(Id)
            .then(product => {
                const price = product.price;
                return Promise.resolve(price);
            });
        }

// gets the UserId of a specific Product
    public userId(Id: number): Promise<number> {
        return Product.findByPk(Id)
            .then(product => {
                const userId = product.userId;
                return Promise.resolve(userId);
            });
    }
}
