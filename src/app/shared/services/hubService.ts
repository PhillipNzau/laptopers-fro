import { Inject, Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

import { API_CONFIG, ApiConfig } from '../../api.config';
import {
  HubResponseModel,
  ReviewHubModel,
  UpdateHubModel,
} from '../models/hubs-model';

@Injectable({
  providedIn: 'root',
})
export class HubService {
  private apiConfig = inject(API_CONFIG);

  router = inject(Router);
  http = inject(HttpClient);

  // get all hubs
  getAllHub() {
    const url = `${this.apiConfig.baseUrl}${this.apiConfig.endpoints.eventUrl}`;
    return this.http.get<HubResponseModel[]>(url).pipe(
      map((res) => {
        // if (res.status === 200) {
        //   return res;
        // }
        return res.reverse();
      })
    );
  }

  // get single hub
  getSingleHub(eventId: string) {
    const url = `${this.apiConfig.baseUrl}${this.apiConfig.endpoints.eventUrl}/${eventId}`;
    return this.http.get<HubResponseModel>(url).pipe(
      map((res) => {
        // if (res.status === 200) {
        //   return res;
        // }
        return res;
      })
    );
  }

  // create  hub
  createHub(hubData: any) {
    const url = `${this.apiConfig.baseUrl}${this.apiConfig.endpoints.eventUrl}`;
    return this.http.post<any>(url, hubData).pipe(
      map((res) => {
        // if (res.status === 200) {
        //   return res;
        // }
        return res;
      })
    );
  }

  // update  hub
  updateHub(hubData: UpdateHubModel, eventId: string) {
    const url = `${this.apiConfig.baseUrl}${this.apiConfig.endpoints.eventUrl}/${eventId}`;
    return this.http.patch<any>(url, hubData).pipe(
      map((res) => {
        // if (res.status === 200) {
        //   return res;
        // }
        return res?.event;
      })
    );
  }

  reviewHub(hubData: ReviewHubModel, eventId: string) {
    const url = `${this.apiConfig.baseUrl}${this.apiConfig.endpoints.eventUrl}/${eventId}`;
    return this.http.patch<any>(url, hubData).pipe(
      map((res) => {
        // if (res.status === 200) {
        //   return res;
        // }
        return res?.event;
      })
    );
  }
}
