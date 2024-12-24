import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../../service/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  userForm!: FormGroup; // Declare userForm property
  errorMessage: string = '';

  constructor(
    public auth: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    /*if (localStorage.getItem('currentUser') != null) {
      this.router.navigate(['/profile']);
    }*/

    this.userForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  get username() {
    return this.userForm.get('username');
  }

  get password() {
    return this.userForm.get('password');
  }

  login(): void {
    if (this.userForm.valid) {
      this.auth.login(this.username?.value, this.password?.value).subscribe(
        (user: any) => {
          if (user && user.token) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.router.navigate(['/conta']);
          }
        },
        (err) => {
          this.errorMessage = 'The email or password is incorrect!'; // Atribuir a mensagem de erro
        }
      );
    }
  }
}  