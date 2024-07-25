import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { PostListComponent } from './post-list.component';
import { PostService } from '../../services/post.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('PostListComponent', () => {
  let component: PostListComponent;
  let fixture: ComponentFixture<PostListComponent>;
  let postService: PostService;
  let snackBar: MatSnackBar;
  let dialog: MatDialog;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PostListComponent],
      imports: [
        HttpClientTestingModule,
        MatSnackBarModule,
        MatDialogModule,
        BrowserAnimationsModule
      ],
      providers: [
        PostService,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: () => '1' } },
            queryParams: of({ userName: 'Bret', userEmail: 'Sincere@april.biz' })
          }
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostListComponent);
    component = fixture.componentInstance;
    postService = TestBed.inject(PostService);
    snackBar = TestBed.inject(MatSnackBar);
    dialog = TestBed.inject(MatDialog);
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar el nombre y correo del usuario desde los query params', () => {
    component.ngOnInit();
    expect(component.userName).toBe('Bret');
    expect(component.userEmail).toBe('Sincere@april.biz');
    expect(component.isUserSelected).toBeTrue();
  });

  it('debería cargar los posts del usuario al inicializar', () => {
    spyOn(postService, 'getPostsByUser').and.returnValue(of([{ id: 1, title: 'Pruebas post', body: 'Esto es una prueba' }]));
    component.ngOnInit();
    expect(postService.getPostsByUser).toHaveBeenCalledWith(1);
    expect(component.posts.length).toBe(1);
    expect(component.posts[0].title).toBe('Pruebas post');
  });

  it('debería eliminar un post y mostrar un mensaje de éxito', () => {
    component.posts = [{ id: 1, title: 'Pruebas post', body: 'Esto es una prueba' }];
    spyOn(postService, 'deletePost').and.returnValue(of({}));
    spyOn(snackBar, 'open');

    component.deletePost(1);

    expect(postService.deletePost).toHaveBeenCalledWith(1);
    expect(component.posts.length).toBe(0);
    expect(snackBar.open).toHaveBeenCalledWith('Publicación eliminada con éxito', 'Cerrar', {
      duration: 3000,
    });
  });

  it('debería abrir el diálogo y crear un nuevo post', () => {
    spyOn(dialog, 'open').and.returnValue({
      afterClosed: () => of({ title: 'Prueba post', body: 'Esto es una prueba' })
    } as any);
    spyOn(postService, 'createPost').and.returnValue(of({ id: 2, title: 'Prueba post', body: 'Esto es una prueba', userId: 1 }));
    spyOn(snackBar, 'open');

    component.openDialog();

    expect(dialog.open).toHaveBeenCalled();
    expect(postService.createPost).toHaveBeenCalledWith({
      title: 'Prueba post',
      body: 'Esto es una prueba',
      userId: '1'
    });
    expect(component.posts.length).toBe(1);
    expect(component.posts[0].title).toBe('Prueba post');
    expect(snackBar.open).toHaveBeenCalledWith('Publicación creada con éxito', 'Cerrar', {
      duration: 3000,
    });
  });
});
