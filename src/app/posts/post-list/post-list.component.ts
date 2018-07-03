import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  // posts = [
  //   { title: 'First Post', content: 'This is the first post's content' },
  //   { title: 'Second Post', content: 'This is the second post's content' },
  //   { title: 'Third Post', content: 'This is the third post's content' }
  // ];
  posts: Post[] = [];
  isLoading = false;
  userIsAuthanticated = false;
  public currentUserStudent = true;

  private postsSub: Subscription;
  private authStatusSub: Subscription;

  constructor(public postsService: PostsService, private authService: AuthService) {}

  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts();
    this.postsSub = this.postsService.getPostUpdateListener()
      .subscribe((posts: Post[]) => {
        this.isLoading = false;
        this.posts = posts;
      });

    if (this.authService.userType === 'admin') {
      this.currentUserStudent = false;
    }
    this.userIsAuthanticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
    .getAuthStatusListener()
    .subscribe(isAuthanticated => {
      this.userIsAuthanticated = isAuthanticated;
    });
  }

  onDelete(postId: string) {
    this.postsService.deletePost(postId);
  }

  onJoin(postId: string) {
    this.postsService.joinToPost(postId);
  }
  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
