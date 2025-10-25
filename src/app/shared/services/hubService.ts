import { Inject, Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

import { API_CONFIG, ApiConfig } from '../../api.config';
import {
  HubApiResponseModel,
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

  searchLocations(query: any) {
    if (!query) return [];

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      query
    )}&addressdetails=1&limit=5`;

    return this.http.get<any[]>(url);
  }

  // get all hubs
  getAllHub() {
    const url = `${this.apiConfig.baseUrl}${this.apiConfig.endpoints.hubUrl}`;
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
    const url = `${this.apiConfig.baseUrl}${this.apiConfig.endpoints.hubUrl}/${eventId}`;
    return this.http.get<HubApiResponseModel>(url).pipe(
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
    const url = `${this.apiConfig.baseUrl}${this.apiConfig.endpoints.hubUrl}`;
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
    const url = `${this.apiConfig.baseUrl}${this.apiConfig.endpoints.hubUrl}/${eventId}`;
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
    const url = `${this.apiConfig.baseUrl}${this.apiConfig.endpoints.hubUrl}/${eventId}/reviews`;
    return this.http.post<any>(url, hubData).pipe(
      map((res) => {
        // if (res.status === 200) {
        //   return res;
        // }

        return res;
      })
    );
  }
}
