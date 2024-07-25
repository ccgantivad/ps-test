import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.css']
})
export class PostFormComponent {
  post: any = {};

  constructor(
    public dialogRef: MatDialogRef<PostFormComponent>,
    private postService: PostService
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  savePost(): void {
    this.postService.createPost(this.post).subscribe(result => {
      this.dialogRef.close(result);
    });
  }
}
