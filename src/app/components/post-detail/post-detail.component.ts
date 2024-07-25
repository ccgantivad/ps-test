import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../../services/post.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css']
})
export class PostDetailComponent implements OnInit {
  post: any;

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.postService.getPost(id).subscribe(data => {
      this.post = data;
    });
  }

  updatePost(): void {
    this.postService.updatePost(this.post.id, this.post).subscribe(() => {
      this.snackBar.open('Publicación actualizada con éxito', 'Cerrar', {
        duration: 3000,
      });
    });
  }
}
