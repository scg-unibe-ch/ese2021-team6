export class PostItem {

  constructor(
    public postItemId: number,
    public postId: number,
    public name: string,
    public image: string,
    public done: boolean
  ) {}
}
