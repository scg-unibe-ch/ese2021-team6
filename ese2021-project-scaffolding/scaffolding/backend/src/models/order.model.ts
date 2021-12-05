import {Optional, Model, Sequelize, DataTypes, Association} from 'sequelize';
import {ItemImage} from './itemImage.model';
import { User } from './user.model';
import { Product } from './product.model';

export interface OrderAttributes {
    orderId: number;
    username: string;
    deliveryAdress: string;
    city: string;
    zipcode: number;
    paymentMethod: string;
    orderStatus: string;
    productId: number;
}

// tells sequelize that commentId is not a required field
export interface OrderCreationAttributes extends Optional<OrderAttributes, 'orderId'> { }


export class Order extends Model<OrderAttributes, OrderCreationAttributes> implements OrderAttributes {

    orderId!: number;
    username!: string;
    deliveryAdress!: string;
    city!: string;
    zipcode!: number;
    paymentMethod!: string;
    orderStatus!: string;
    productId!: number;


    public static initialize(sequelize: Sequelize) { // definition for database
        Order.init({
                orderId: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
                username: {
                type: DataTypes.STRING,
                allowNull: false
            },
                deliveryAdress: {
                type: DataTypes.STRING,
                allowNull: true
            },
                city: {
                type: DataTypes.STRING,
                allowNull: true
            },
                zipcode: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
                paymentMethod: {
                type: DataTypes.STRING,
                allowNull: true
            },
                orderStatus: {
                type: DataTypes.ENUM('pending', 'shipped', 'cancelled'),
                allowNull: true
            },
                productId: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
        },
        { sequelize, tableName: 'orders' }
        );
    }
}
