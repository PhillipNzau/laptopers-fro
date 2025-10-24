import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { EventService } from '../../../../shared/services/eventService';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { EventResponseModel } from '../../../../shared/models/events-model';

@Component({
  selector: 'app-event-details',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './event-details.html',
  styleUrl: './event-details.css',
})
export class EventDetails implements OnInit {
  private eventService = inject(EventService);
  private toastService = inject(HotToastService);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);

  isToggled = signal<boolean>(false);

  event = signal<EventResponseModel>({});
  selectedImage = signal<string>('');

  usr = JSON.parse(localStorage.getItem('uWfUsr') || '');
  role = signal<string>('');

  isEditing = signal(false);
  eventForm = this.fb.nonNullable.group({
    title: [this.event().title],
    location: [this.event().location],
    available: [this.event().available],
    description: [this.event().description],
  });

  ngOnInit(): void {
    this.getEvent();
    this.role.set(this.usr?.role);
  }
  getEvent() {
    const loadingToast = this.toastService.loading('Processing...');

    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.toastService.error('No Event ID found in route');
      return;
    }

    this.eventService.getSingleEvent(id).subscribe({
      next: (res) => {
        loadingToast.close();
        this.event.set(res);
      },
      error: () => {
        loadingToast.close();
        this.toastService.error('Failed to fetch event details');
      },
    });
  }

  selectImage(image: string) {
    this.selectedImage.set(image);
  }

  toggleChanged(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    this.isToggled.set(checkbox.checked);

    // Reset form with latest Event values when editing starts
    if (this.isToggled()) {
      this.eventForm.patchValue(this.event());
    }
  }

  saveChanges() {
    const loadingToast = this.toastService.loading('Processing...');

    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.toastService.error('No event ID found in route');
      return;
    }

    if (this.eventForm.valid) {
      this.eventService.updateEvent(this.eventForm.value, id).subscribe({
        next: (res) => {
          loadingToast.close();
          this.event.set(res);
        },
        error: () => {
          loadingToast.close();
          this.toastService.error('Failed to update Event details');
        },
      });
      this.isToggled.set(false);
    }
  }
}
