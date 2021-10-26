import {Optional, Model, Sequelize, DataTypes, Association} from 'sequelize';
import { Post } from './post.model';
import {ItemImage} from './itemImage.model';

export interface PostItemAttributes {
    postItemId: number;
    text: string;
    upvoteCount: number;
    downvoteCount: number;
    postId: number;
    userId: number;
}

// tells sequelize that postItemId is not a required field
export interface PostItemCreationAttributes extends Optional<PostItem, 'postItemId'> { }


export class PostItem extends Model<PostItemAttributes, PostItemCreationAttributes> implements PostItemAttributes {

    public static associations: {
        images: Association<PostItem, ItemImage>
    };

    postItemId!: number;
    text!: string;
    upvoteCount!: number;
    downvoteCount!: number;
    postId!: number;
    userId!: number;


    public static initialize(sequelize: Sequelize) { // definition for database
        PostItem.init({
            postItemId: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            text: {
                type: DataTypes.STRING,
                allowNull: false
            },
            upvoteCount: {
                 type: DataTypes.INTEGER,
                 allowNull: false
            },
            downvoteCount: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            postId: {
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
    public static createAssociations() {
        PostItem.belongsTo(Post, {
            targetKey: 'postId',
            as: 'post',
            onDelete: 'cascade',
            foreignKey: 'postId'
        });
    }

}
