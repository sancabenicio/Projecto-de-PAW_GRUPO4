import { Component, NgModule, OnInit } from '@angular/core';
import { Property } from '../../model/property.model';
import { PropertyService } from '../../service/property.service';
import { AuthenticationService } from '../../service/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-list-properties',
  templateUrl: './list-properties.component.html',
  styleUrls: ['./list-properties.component.css']
})
export class ListPropertiesComponent implements OnInit {
  properties: Property[] = [];

  constructor(private propertyService: PropertyService, private authenticationService: AuthenticationService, private router: Router) { }

  ngOnInit(): void {
    this.getProperties();
  }

  getProperties(): void {
    this.propertyService.getProperties().subscribe(
      (data: Property[]) => {
        this.properties = data;
        this.fetchPropertyImages();
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  fetchPropertyImages(): void {
    this.properties.forEach((property: Property) => {
      if (property._id) {
        this.propertyService.getPropertyImage(property._id).subscribe(
          (imageBlob: Blob) => {
            this.createImageFromBlob(imageBlob, property);
          },
          (error: any) => {
            console.error('Error fetching property image:', error);
            this.setDefaultImage(property);
          }
        );
      }
    });
  }

  createImageFromBlob(imageBlob: Blob, property: Property): void {
    const reader = new FileReader();
    reader.onloadend = () => {
      property.imageSrc = reader.result as string;
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

