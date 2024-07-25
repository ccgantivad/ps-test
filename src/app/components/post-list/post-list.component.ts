import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../../services/post.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { PostFormComponent } from '../post-form/post-form.component';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {
  posts: any[] = [];
  userName: string = '';
  userEmail: string = '';
  isUserSelected: boolean = false;

  constructor(
    private postService: PostService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('userId');
    this.route.queryParams.subscribe(params => {
      this.userName = params['userName'] || '';
      this.userEmail = params['userEmail'] || '';
      this.isUserSelected = !!this.userName && !!this.userEmail;
    });

    if (userId) {
      this.postService.getPostsByUser(+userId).subscribe(data => {
        this.posts = data;
      });
    } else {
      this.postService.getPosts().subscribe(data => {
        this.posts = data;
      });
    }
  }

  deletePost(id: number): void {
    this.postService.deletePost(id).subscribe(() => {
      this.posts = this.posts.filter(post => post.id !== id);
      this.snackBar.open('Publicación eliminada con éxito', 'Cerrar', {
        duration: 3000,
      });
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(PostFormComponent, {
      width: '400px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const newPost = {
          ...result,
          userId: this.route.snapshot.paramMap.get('userId')
        };
        this.postService.createPost(newPost).subscribe(post => {
          this.posts.push(post);
          this.snackBar.open('Publicación creada con éxito', 'Cerrar', {
            duration: 3000,
          });
        });
      }
    });
  }
}
