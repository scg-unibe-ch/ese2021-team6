import {Optional, Model, Sequelize, DataTypes, Association} from 'sequelize';
import {ItemImage} from './itemImage.model';
import { User } from './user.model';

export interface ProductAttributes {
    productId: number;
    title: string;
    category: string;
    price: number;
    imageId: number;
    userId: number;
}

// tells sequelize that commentId is not a required field
export interface ProductCreationAttributes extends Optional<Product, 'productId'> { }


export class Product extends Model<ProductAttributes, ProductAttributes> implements ProductAttributes {

    /*public static associations: {
        images: Association<Comment, ItemImage>
    };*/

    productId!: number;
    title!: string;
    category!: string;
    price!: number;
    imageId!: number;
    userId!: number;


    public static initialize(sequelize: Sequelize) { // definition for database
        Product.init({
            productId: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false
            },
            category: {
                type: DataTypes.STRING,
                allowNull: false
            },
            price: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            imageId: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
        },
        { sequelize, tableName: 'comments' }
        );
    }
}
