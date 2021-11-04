export class Comment {

  constructor(
    public commentId: number,
    public text: string,
    public upvoteCount: number,
    public downvoteCount: number,
    public postId: number,
    public userId: number,
  ) {}
}
