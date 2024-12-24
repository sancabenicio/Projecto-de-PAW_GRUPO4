import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../service/authentication.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent {
 
    constructor(private authenticationService: AuthenticationService, private router: Router) { }
    
    logout(): void {
      this.authenticationService.logout();
      this.router.navigate(['/login']);
    }
}
