import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent {
  newUser: any = { name: '', username: '', email: '' };

  constructor(
    public dialogRef: MatDialogRef<UserFormComponent>,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  createUser(): void {
    this.userService.createUser(this.newUser).subscribe(user => {
      this.dialogRef.close(user);
      this.snackBar.open('Usuario creado con éxito', 'Cerrar', {
        duration: 3000,
      });
    });
  }
}
