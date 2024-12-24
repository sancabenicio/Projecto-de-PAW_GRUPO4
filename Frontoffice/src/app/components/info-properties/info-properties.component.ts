import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Property } from '../../model/property.model';
import { PropertyService } from 'src/app/service/property.service';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-info-properties',
  templateUrl: './info-properties.component.html',
  styleUrls: ['./info-properties.component.css']
})
export class InfoPropertiesComponent implements OnInit {
  property: Property | undefined;

  constructor(
    private route: ActivatedRoute,
    private yourService: PropertyService,
    private authenticationService: AuthenticationService, private router:Router
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      console.log('Property ID:', id);
      if (id) {
        this.getProperty(id);
      }
    });
  }

  getProperty(id: string) {
    console.log('Making API request with ID:', id);
  
    this.yourService.getProperty(id)
      .subscribe(
        (response: any) => {
          this.property = response.dbproperties;
          this.fetchPropertyImage(this.property);
        },
        (error) => {
          console.log('API Error:', error);
        }
      );
  }

  fetchPropertyImage(property: Property | undefined): void {
    if (property && property._id) {
      this.yourService.getPropertyImage(property._id).subscribe(
        (imageBlob: Blob) => {
          this.createImageFromBlob(imageBlob, property);
        },
        (error: any) => {
          console.error('Error fetching property image:', error);
          this.setDefaultImage(property);
        }
      );
    } else {
      console.warn('Invalid property object or missing _id');
    }
  }
  
  createImageFromBlob(imageBlob: Blob, property: Property): void {
    const reader = new FileReader();
    reader.onloadend = () => {
      property.imageSrc = reader.result as string;
      console.log('Image URL:', property.imageSrc); 
    };
    reader.readAsDataURL(imageBlob);
  }

  setDefaultImage(property: Property): void {
    property.imageSrc = '/assets/img/castle2.png';
  }

  logout(): void {
    this.authenticationService.logout();
    this.router.navigate(['/homepage']);
  }
} 