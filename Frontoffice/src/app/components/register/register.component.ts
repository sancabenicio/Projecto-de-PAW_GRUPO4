import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../../service/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  userForm: FormGroup; // Declare userForm property
  showPassword: boolean = false;

  constructor(
    public auth: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.userForm = this.auth.buildUserForm();
  }

  ngOnInit(): void {}

  register(): void {
    if (this.userForm.valid) {
      const { name, email, password } = this.userForm.value;
      this.auth.register(name, email, password).subscribe(
        (user: any) => {
          if (user && user.token) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            console.log(user);
            this.router.navigate(['/success']);
          }
        },
        (err) => {
          if (err.error && err.error.message === 'Email already exists') {
            this.userForm.controls['email'].setErrors({ 'emailExists': true });
          } else {
            alert('Registration failed. Please try again.');
          }
        }
      );
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}  