export interface Event {
    _id?: string;
    name?: string;
    description?: string;
    date?: Date;
    capacity?: number;
    ticketPrice?: number;
    location?: {
        _id?: string;
        name?: string;
        formatted?: string;
        city?: string;
        country?: string;
      };
    isFree?: boolean;
    photos?: {
      data?: string;
      contentType?: string;
    };
    ticketsSold?: number;
    imageSrc?: string;
  }