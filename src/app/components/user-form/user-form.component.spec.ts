import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { UserFormComponent } from './user-form.component';
import { UserService } from '../../services/user.service';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';

describe('UserFormComponent', () => {
  let component: UserFormComponent;
  let fixture: ComponentFixture<UserFormComponent>;
  let userService: UserService;
  let snackBar: MatSnackBar;
  let dialogRef: MatDialogRef<UserFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatSnackBarModule, MatIconModule, FormsModule],
      declarations: [UserFormComponent],
      providers: [
        { provide: MatDialogRef, useValue: { close: jasmine.createSpy('close') } },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        UserService
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserFormComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    snackBar = TestBed.inject(MatSnackBar);
    dialogRef = TestBed.inject(MatDialogRef);
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar newUser correctamente', () => {
    expect(component.newUser).toEqual({ name: '', username: '', email: '' });
  });

  it('debería cerrar el diálogo cuando se llama a onNoClick', () => {
    component.onNoClick();
    expect(dialogRef.close).toHaveBeenCalled();
  });

  it('debería llamar a userService.createUser cuando se llama a createUser', () => {
    spyOn(userService, 'createUser').and.callThrough();
    component.newUser = { name: 'Cristian', username: 'cgantiva', email: 'cgantiva@example.com' };

    component.createUser();

    expect(userService.createUser).toHaveBeenCalledWith({
      name: 'Cristian',
      username: 'cgantiva',
      email: 'cgantiva@example.com'
    });
  });

  it('debería mostrar un mensaje de éxito y cerrar el diálogo cuando se crea un usuario', () => {
    spyOn(userService, 'createUser').and.returnValue(of({}));
    spyOn(snackBar, 'open');

    component.newUser = { name: 'Cristian', username: 'cgantiva', email: 'cgantiva@example.com' };

    component.createUser();

    expect(dialogRef.close).toHaveBeenCalled();
    expect(snackBar.open).toHaveBeenCalledWith('Usuario creado con éxito', 'Cerrar', {
      duration: 3000,
    });
  });

  it('debería mostrar un mensaje de error si createUser falla', () => {
    spyOn(userService, 'createUser').and.returnValue(throwError('error'));
    spyOn(snackBar, 'open');

    component.newUser = { name: 'Cristian', username: 'cgantiva', email: 'cgantiva@example.com' };

    component.createUser();

    expect(snackBar.open).toHaveBeenCalledWith('No se pudo crear el usuario', 'Cerrar', {
      duration: 3000,
    });
  });
});
