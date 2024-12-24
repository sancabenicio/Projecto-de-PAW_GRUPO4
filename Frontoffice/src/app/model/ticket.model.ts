export class Ticket{
    _id?: string;
    event?: {
        name?: string;
        location?: {
            city?: string;
        }
      };
    user?: any;
    quantity?: number;
    date?: string;
    price?: number;
    status?: string;
}