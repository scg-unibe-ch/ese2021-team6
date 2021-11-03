import { Comment } from './comment.model';

export class Post {

  constructor(
    public postId: number,
    public title: string,
    public text: string,
    public imageId: number,
    public upvoteCount: number,
    public downvoteCount: number,
    public userId: number,
    public comments: Comment[]
  ) {}
}
