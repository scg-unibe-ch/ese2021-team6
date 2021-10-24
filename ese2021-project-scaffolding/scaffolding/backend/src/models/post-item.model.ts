import {Optional, Model, Sequelize, DataTypes, Association} from 'sequelize';
import { Post } from './post.model';
import {ItemImage} from './itemImage.model';

export interface PostItemAttributes {
    postItemId: number;
    name: string;
    done: boolean;
    postId: number;
    itemImage: string;
}

// tells sequelize that postItemId is not a required field
export interface PostItemCreationAttributes extends Optional<PostItem, 'postItemId'> { }


export class PostItem extends Model<PostItemAttributes, PostItemCreationAttributes> implements PostItemAttributes {

    public static associations: {
        images: Association<PostItem, ItemImage>
    };

    postItemId!: number;
    name!: string;
    done!: boolean;
    postId!: number;
    itemImage!: string;


    public static initialize(sequelize: Sequelize) { // definition for database
        PostItem.init({
            postItemId: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            done: {
                type: DataTypes.BOOLEAN,
                allowNull: false
            },
            itemImage: {
                type: DataTypes.BOOLEAN,
                allowNull: true
            },
            postId: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
        },
        { sequelize, tableName: 'postItems' }
        );

    }
    public static createAssociations() {
        PostItem.belongsTo(Post, {
            targetKey: 'postId',
            as: 'post',
            onDelete: 'cascade',
            foreignKey: 'postId'
        });
        PostItem.hasMany(ItemImage, {
            as: 'images',
            foreignKey: 'postItemId'
        });
    }

}
