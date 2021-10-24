import { PostItem } from './post-item.model';

export class Post {

  constructor(
    public postId: number,
    public name: string,
    public postItems: PostItem[]
  ) {}
}
