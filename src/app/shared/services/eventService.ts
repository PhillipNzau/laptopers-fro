import { Inject, Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

import { API_CONFIG, ApiConfig } from '../../api.config';
import { EventResponseModel, UpdateEventModel } from '../models/events-model';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private apiConfig = inject(API_CONFIG);

  router = inject(Router);
  http = inject(HttpClient);

  // get all events
  getAllEvent() {
    const url = `${this.apiConfig.baseUrl}${this.apiConfig.endpoints.eventUrl}`;
    return this.http.get<EventResponseModel[]>(url).pipe(
      map((res) => {
        // if (res.status === 200) {
        //   return res;
        // }
        return res.reverse();
      })
    );
  }

  // get single event
  getSingleEvent(eventId: string) {
    const url = `${this.apiConfig.baseUrl}${this.apiConfig.endpoints.eventUrl}/${eventId}`;
    return this.http.get<EventResponseModel>(url).pipe(
      map((res) => {
        // if (res.status === 200) {
        //   return res;
        // }
        return res;
      })
    );
  }

  // create  event
  createEvent(eventData: any) {
    const url = `${this.apiConfig.baseUrl}${this.apiConfig.endpoints.eventUrl}`;
    return this.http.post<EventResponseModel>(url, eventData).pipe(
      map((res) => {
        // if (res.status === 200) {
        //   return res;
        // }
        return res;
      })
    );
  }

  // update  event
  updateEvent(eventData: UpdateEventModel, eventId: string) {
    const url = `${this.apiConfig.baseUrl}${this.apiConfig.endpoints.eventUrl}/${eventId}`;
    return this.http.patch<any>(url, eventData).pipe(
      map((res) => {
        // if (res.status === 200) {
        //   return res;
        // }
        return res?.event;
      })
    );
  }
}
