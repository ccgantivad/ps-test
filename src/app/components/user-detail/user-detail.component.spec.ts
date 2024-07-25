import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { UserDetailComponent } from './user-detail.component';
import { UserService } from '../../services/user.service';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

describe('UserDetailComponent', () => {
  let component: UserDetailComponent;
  let fixture: ComponentFixture<UserDetailComponent>;
  let userService: UserService;
  let snackBar: MatSnackBar;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserDetailComponent],
      imports: [
        HttpClientTestingModule,
        MatSnackBarModule,
        BrowserAnimationsModule,
        FormsModule
      ],
      providers: [
        UserService,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: () => '2' } }
          }
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDetailComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    snackBar = TestBed.inject(MatSnackBar);
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar los detalles del usuario al inicializar', () => {
    const mockUser = {
      id: 2,
      name: 'Ervin Howell',
      username: 'Antonette',
      email: 'Shanna@melissa.tv',
      phone: '010-692-6593 x09125',
      website: 'anastasia.net',
      address: {
        street: 'Victor Plains',
        suite: 'Suite 879',
        city: 'Wisokyburgh',
        zipcode: '90566-7771',
        geo: {
          lat: '-43.9509',
          lng: '-34.4618'
        }
      },
      company: {
        name: 'Deckow-Crist',
        catchPhrase: 'Proactive didactic contingency',
        bs: 'synergize scalable supply-chains'
      }
    };
    spyOn(userService, 'getUser').and.returnValue(of(mockUser));

    component.ngOnInit();

    expect(userService.getUser).toHaveBeenCalledWith(2);
    expect(component.user).toEqual(mockUser);
  });

  it('debería mostrar un mensaje de éxito al actualizar el usuario', () => {
    spyOn(userService, 'updateUser').and.returnValue(of({}));
    spyOn(snackBar, 'open');

    component.user = {
      id: 2,
      name: 'Ervin Howell',
      username: 'Antonette',
      email: 'Shanna@melissa.tv',
      phone: '010-692-6593 x09125',
      website: 'anastasia.net',
      address: {
        street: 'Victor Plains',
        suite: 'Suite 879',
        city: 'Wisokyburgh',
        zipcode: '90566-7771',
        geo: {
          lat: '-43.9509',
          lng: '-34.4618'
        }
      },
      company: {
        name: 'Deckow-Crist',
        catchPhrase: 'Proactive didactic contingency',
        bs: 'synergize scalable supply-chains'
      }
    };

    component.updateUser();

    expect(userService.updateUser).toHaveBeenCalledWith(2, component.user);
    expect(snackBar.open).toHaveBeenCalledWith('Usuario actualizado con éxito', 'Cerrar', {
      duration: 3000,
    });
  });


});
