import { Comment, CommentAttributes, CommentCreationAttributes } from './comment.model';
import { Optional, Model, Sequelize, DataTypes } from 'sequelize';

export interface UserAttributes {
    userId: number;
    userName: string;
    password: string;
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    zipCode: number;
    city: string;
    birthday: number;
    phoneNumber: number;
    admin: boolean;
}

export interface UserCreationAttributes extends Optional<UserAttributes, 'userId'> { }

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    userId!: number;
    userName!: string;
    password!: string;
    firstName!: string;
    lastName!: string;
    email!: string;
    address!: string;
    zipCode!: number;
    city!: string;
    birthday!: number;
    phoneNumber!: number;
    admin!: boolean;

    public static initialize(sequelize: Sequelize) {
        User.init({
            userId: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            userName: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false
            },
            firstName: {
                type: DataTypes.STRING,
                allowNull: false
            },
            lastName: {
                type: DataTypes.STRING,
                allowNull: false
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            },
            address: {
                type: DataTypes.STRING,
                allowNull: false
            },
            zipCode: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            city: {
                type: DataTypes.STRING,
                allowNull: false
            },
            birthday: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            phoneNumber: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            admin: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            }
        },
            {
                sequelize,
                tableName: 'users'
            }
        );
    }
}
