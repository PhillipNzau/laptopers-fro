import { Component, EventEmitter, Input, Output, Signal } from '@angular/core';
import { HubResponseModel } from '../../models/hubs-model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-hub-card',
  imports: [RouterModule],
  templateUrl: './hub-card.html',
  styleUrl: './hub-card.css',
})
export class HubCard {
  @Input({ required: true }) hubData!: HubResponseModel;
  @Output() back = new EventEmitter<boolean>();
}
