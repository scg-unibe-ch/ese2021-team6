import {Optional, Model, Sequelize, DataTypes, Association} from 'sequelize';
import { Post } from './post.model';
import {ItemImage} from './itemImage.model';

export interface CommentAttributes {
    commentId: number;
    text: string;
    upvoteCount: number;
    downvoteCount: number;
    postId: number;
    userId: number;
}

// tells sequelize that commentId is not a required field
export interface CommentCreationAttributes extends Optional<Comment, 'commentId'> { }


export class Comment extends Model<CommentAttributes, CommentCreationAttributes> implements CommentAttributes {

    public static associations: {
        images: Association<Comment, ItemImage>
    };

    commentId!: number;
    text!: string;
    upvoteCount!: number;
    downvoteCount!: number;
    postId!: number;
    userId!: number;


    public static initialize(sequelize: Sequelize) { // definition for database
        Comment.init({
            commentId: {
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
        Comment.belongsTo(Post, {
            targetKey: 'postId',
            as: 'post',
            onDelete: 'cascade',
            foreignKey: 'postId'
        });
    }

}
