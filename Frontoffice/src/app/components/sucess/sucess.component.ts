import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sucess',
  templateUrl: './sucess.component.html',
  styleUrls: ['./sucess.component.css']
})
export class SucessComponent {

  constructor(private router: Router) {}

  redirectToLogin(): void {
    this.router.navigate(['/login'], { state: { redirect: '/profile' } });
  }
}
