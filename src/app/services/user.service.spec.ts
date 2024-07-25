import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should retrieve users from the API via GET', () => {
    const dummyUsers = [{ id: 1, name: 'John' }, { id: 2, name: 'Doe' }];

    service.getUsers().subscribe(users => {
      expect(users.length).toBe(2);
      expect(users).toEqual(dummyUsers);
    });

    const request = httpMock.expectOne(`${service.apiUrl}`);
    expect(request.request.method).toBe('GET');
    request.flush(dummyUsers);
  });

  afterEach(() => {
    httpMock.verify();
  });
});
