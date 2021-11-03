import { Optional, Model, HasManyGetAssociationsMixin, HasManyAddAssociationMixin, DataTypes, Sequelize, Association } from 'sequelize';
import { Comment } from './comment.model';

export interface PostAttributes {
    postId: number;
    title: string;
    text: string;
    imageId: number;
    upvoteCount: number;
    downvoteCount: number;
    userId: number;
}

export interface PostCreationAttributes extends Optional<PostAttributes, 'postId'> { }

export class Post extends Model<PostAttributes, PostCreationAttributes> implements PostAttributes {

    public static associations: {
        comments: Association<Post, Comment>;
    };
    postId!: number;
    title!: string;
    text!: string;
    imageId!: number;
    upvoteCount!: number;
    downvoteCount!: number;
    userId!: number;

    public getComments!: HasManyGetAssociationsMixin<Comment>;
    public addComment!: HasManyAddAssociationMixin<Comment, number>;

    public readonly comments?: Comment[];

    public static initialize(sequelize: Sequelize) {
        Post.init(
            {
                postId: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey: true
                },
                title: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                text: {
                    type: DataTypes.STRING,
                    allowNull: true
                },
                imageId: {
                    type: DataTypes.INTEGER,
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
                userId: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    unique: true
                },
            },

            { tableName: 'posts', sequelize }
        );
    }
    public static createAssociations() {
        Post.hasMany(Comment, {
            as: 'comments',
            foreignKey: 'postId'
        });
    }
}
