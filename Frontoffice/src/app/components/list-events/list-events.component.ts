import { Component, OnInit } from '@angular/core';
import { Event } from '../../model/event.model';
import { EventService } from '../../service/event.service';
import { AuthenticationService } from '../../service/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-list-events',
  templateUrl: './list-events.component.html',
  styleUrls: ['./list-events.component.css']
})
export class ListEventsComponent implements OnInit {
  events: Event[] = [];

  constructor(private eventService: EventService, private authenticationService: AuthenticationService, private router:Router) { }

  ngOnInit(): void {
    this.getEvents();
  }

  getEvents(): void {
    this.eventService.getEvents().subscribe(
      (data: Event[]) => {
        this.events = data;
        this.fetchEventImages();
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  fetchEventImages(): void {
    this.events.forEach((event: Event) => {
      if (event._id) {
        this.eventService.getEventImage(event._id).subscribe(
          (imageBlob: Blob) => {
            console.log('Image received for event:', event);
            this.createImageFromBlob(imageBlob, event);
          },
          (error: any) => {
            console.error('Error fetching event image:', error);
            this.setDefaultImage(event);
          }
        );
      }
    });
  }

  createImageFromBlob(imageBlob: Blob, event: Event): void {
    const reader = new FileReader();
    reader.onloadend = () => {
      event.imageSrc = reader.result as string;
    };
    reader.readAsDataURL(imageBlob);
  }

  setDefaultImage(event: Event): void {
    event.imageSrc = '/assets/img/castle2.png';
  }

  logout(): void {
    this.authenticationService.logout();
    this.router.navigate(['/homepage']);
  }
}
