import { Optional, Model, Sequelize, DataTypes, Association } from 'sequelize';
import { User } from './user.model';
import { Post } from './post.model';

export interface VotedPostsAttributes {
    voteId: number;
    userId: number;
    postId: number;
    voted: number;
}

export interface VotedPostsCreationAttributes extends Optional<VotedPostsAttributes, 'voteId'> { }

export class VotedPost extends Model<VotedPostsAttributes, VotedPostsCreationAttributes> implements VotedPostsAttributes {
    voteId!: number;
    userId!: number;
    postId!: number;
    voted!: number;

    public static initialize(sequelize: Sequelize) {
        VotedPost.init({
            voteId: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            postId: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            voted: {
                type: DataTypes.INTEGER,
                defaultValue: false
            }
        },
            {
                sequelize,
                tableName: 'votedPosts'
            }
        );
    }
    public static createAssociations() {
        VotedPost.belongsTo(Post, {
            targetKey: 'postId',
            as: 'post',
            onDelete: 'cascade',
            foreignKey: 'postId'
        });
    }
}
