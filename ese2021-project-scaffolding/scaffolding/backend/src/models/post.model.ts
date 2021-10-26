import { Optional, Model, HasManyGetAssociationsMixin, HasManyAddAssociationMixin, DataTypes, Sequelize, Association } from 'sequelize';
import { PostItem } from './post-item.model';

export interface PostAttributes {
    postId: number;
    name: string;
}

export interface PostCreationAttributes extends Optional<PostAttributes, 'postId'> { }

export class Post extends Model<PostAttributes, PostCreationAttributes> implements PostAttributes {

    public static associations: {
        todoItems: Association<Post, PostItem>;
    };
    postId!: number;
    name!: string;

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
                name: {
                    type: DataTypes.STRING,
                    allowNull: false
                }
            },
            { tableName: 'posts', sequelize }
        );
    }
    public static createAssociations() {
        Post.hasMany(PostItem, {
            as: 'postItems',
            foreignKey: 'postId'
        });
    }
}
