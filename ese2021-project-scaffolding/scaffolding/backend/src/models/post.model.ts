import { Optional, Model, HasManyGetAssociationsMixin, HasManyAddAssociationMixin, DataTypes, Sequelize, Association } from 'sequelize';
import { PostItem } from './post-item.model';

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
        todoItems: Association<Post, PostItem>;
    };
    postId!: number;
    title!: string;
    text!: string;
    imageId!: number;
    upvoteCount!: number;
    downvoteCount!: number;
    userId!: number;

    public getTodoItems!: HasManyGetAssociationsMixin<PostItem>;
    public addItem!: HasManyAddAssociationMixin<PostItem, number>;

    public readonly postItems?: PostItem[];

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

            { tableName: 'posts12', sequelize }
        );
    }
    public static createAssociations() {
        Post.hasMany(PostItem, {
            as: 'postItems',
            foreignKey: 'postId'
        });
    }
}
