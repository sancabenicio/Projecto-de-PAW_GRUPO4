import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Event } from '../../model/event.model';
import { EventService } from 'src/app/service/event.service';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { ClientServiceService } from 'src/app/service/client-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-info-events',
  templateUrl: './info-events.component.html',
  styleUrls: ['./info-events.component.css']
})
export class InfoEventsComponent implements OnInit {
  event: Event | undefined;
  ticketQuantity: number = 1;
  userEmail: string = '';
  sessionId: string = '';
  sessionDetails: any = {};

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private authenticationService: AuthenticationService,
    private clientService: ClientServiceService,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      console.log('Event ID:', id);
      if (id) {
        this.getEvent(id);
      }
    });
  }

  getEvent(id: string) {
    console.log('Making API request with ID:', id);

    this.eventService.getEvent(id)
      .subscribe(
        (response: any) => {
          this.event = response.dbevents;
          this.fetchEventImage(this.event);
        },
        (error) => {
          console.log('API Error:', error);
        }
      );
  }

  fetchEventImage(event: Event | undefined): void {
    if (event && event._id) {
      this.eventService.getEventImage(event._id).subscribe(
        (imageBlob: Blob) => {
          this.createImageFromBlob(imageBlob, event);
        },
        (error: any) => {
          console.error('Error fetching event image:', error);
          this.setDefaultImage(event);
        }
      );
    } else {
      console.warn('Invalid event object or missing _id');
    }
  }

  createImageFromBlob(imageBlob: Blob, event: Event): void {
    const reader = new FileReader();
    reader.onloadend = () => {
      event.imageSrc = reader.result as string;
      console.log('Image URL:', event.imageSrc);
    };
    reader.readAsDataURL(imageBlob);
  }

  setDefaultImage(event: Event): void {
    event.imageSrc = '/assets/img/castle2.png';
  }

  buyTickets(): void {
    this.clientService.getProfile().subscribe(
      (response) => {
        const userEmail = response.email;
  
        if (this.event && this.event._id) {
          this.eventService.buyTicket(this.event._id, userEmail, this.ticketQuantity)
            .subscribe(
              (response: any) => {
                console.log('Ticket bought:', response);
                if (response.url) {
                  window.location.href = response.url;
                } else {
                  this.router.navigate(['/profile']);
                }
              },
              (error) => {
                console.log('API Error:', error);
                  this.router.navigate(['/profile']);
                }
            );
        } else {
          console.warn('Invalid event object or missing _id');
        }
      },
      (error) => {
        console.log('Error retrieving user profile:', error);
      }
    );
  }
  
  logout(): void {
    this.authenticationService.logout();
    this.router.navigate(['/homepage']);
  }
}
