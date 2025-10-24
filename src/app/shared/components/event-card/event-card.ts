import { Component, EventEmitter, Input, Output, Signal } from '@angular/core';
import { EventResponseModel } from '../../models/events-model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-event-card',
  imports: [RouterModule],
  templateUrl: './event-card.html',
  styleUrl: './event-card.css',
})
export class EventCard {
  @Input({ required: true }) eventData!: EventResponseModel;
  @Output() back = new EventEmitter<boolean>();
}
