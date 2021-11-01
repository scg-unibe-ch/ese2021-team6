export class Comment {

  constructor(
    public commentId: number,
    public postId: number,
    public text: string,
    public userId: boolean,
    public upvoteCount: number,
    public downvoteCount: number,
  ) {}
}
