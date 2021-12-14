import { TestBed } from '@angular/core/testing';
import { Comment } from '../models/comment.model';
import { Post } from '../models/post.model';

import { PostCommentService } from './post-comment.service';

describe('UserService', () => {
  let service: PostCommentService;
  let post: Post

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PostCommentService);

    post = new Post(1, "title", "text", 1, "url", 1, 1, 1, [
      new Comment(1, "text", 1, 1, 1, 1)], "category", "now")
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('setting a product should work', () => {
    service.setPost(post)
    expect(service.getPost()).toEqual(post);
  });
});
