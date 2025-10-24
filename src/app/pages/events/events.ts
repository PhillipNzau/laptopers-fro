import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { EventCard } from '../../shared/components/event-card/event-card';
import { EventService } from '../../shared/services/eventService';
import {
  FormArray,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { EventResponseModel } from '../../shared/models/events-model';
import { Modal } from '../../shared/components/modal/modal';

@Component({
  selector: 'app-events',
  imports: [ReactiveFormsModule, CommonModule, EventCard, Modal],
  templateUrl: './events.html',
  styleUrl: './events.css',
})
export class Events implements OnInit {
  fb = inject(FormBuilder);
  eventService = inject(EventService);
  toastService = inject(HotToastService);

  usr = JSON.parse(localStorage.getItem('uWfUsr') || '');
  userDetails = signal<any>(this.usr);

  isLayout = signal<boolean>(true);
  events = signal<EventResponseModel[]>([]);

  createEventForm = this.fb.nonNullable.group({
    title: ['', [Validators.required]],
    description: ['', [Validators.required]],
    location: ['', [Validators.required]],
    target_amount: ['', [Validators.required]],
    deadline: ['', [Validators.required]],
    status: ['', [Validators.required]],
    images: this.fb.nonNullable.array<File>([], [Validators.required]),
  });

  ngOnInit(): void {
    this.getAllEvents();
  }
  toggleLayout() {
    this.isLayout.set(!this.isLayout());
  }

  getAllEvents() {
    const loadingToast = this.toastService.loading('Processing...');

    this.eventService.getAllEvent().subscribe({
      next: (res) => {
        loadingToast.close();
        this.events.set(res);
      },
      error: (err) => {
        loadingToast.close();

        this.toastService.error(
          `Something went wrong feting events! ${err.error.error}!!`,
          {
            duration: 2000,
          }
        );
      },
    });
  }

  isModal = signal<boolean>(false);
  toggleAddModal() {
    this.isModal.set(!this.isModal());
  }

  // Getter for easy access in template
  get images(): FormArray<any> {
    return this.createEventForm.get('images') as FormArray<any>;
  }
  // Function to handle file input and convert to base64
  imagePreviews: string[] = [];

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    Array.from(input.files).forEach((file) => {
      // Add the File to the FormArray
      this.images.push(this.fb.control(file));

      // Create a preview URL for the file
      const previewUrl = URL.createObjectURL(file);
      this.imagePreviews.push(previewUrl);
    });

    input.value = '';
  }

  removeImage(index: number): void {
    this.images.removeAt(index);
    this.imagePreviews.splice(index, 1);
  }

  submitCreateForm() {
    const loadingToast = this.toastService.loading('Processing...');
    console.log('====================================');
    console.log(this.createEventForm.value);
    console.log('====================================');

    // if (this.createEventForm.invalid) return;

    const formValue = this.createEventForm.value;
    const formData = new FormData();

    // Append other fields
    formData.append('title', formValue.title ?? '');
    formData.append('location', formValue.location ?? '');
    formData.append('target_amount', formValue.target_amount ?? '');
    formData.append('deadline', formValue.deadline ?? '');
    formData.append('status', formValue.status ?? '');
    formData.append('description', formValue.description ?? '');

    // Append image files, safely
    (formValue.images ?? []).forEach((file: File) => {
      if (file) {
        formData.append('images', file);
      }
    });

    this.eventService.createEvent(formData).subscribe({
      next: (res) => {
        this.getAllEvents();

        this.isModal.set(false);

        loadingToast.close();

        // Reset form and preview
        this.createEventForm.reset();
        this.imagePreviews = [];
        this.images.clear();
      },
      error: (err) => console.error('Error:', err),
    });
  }
}
