import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { HubCard } from '../../shared/components/hub-card/hub-card';
import { HubService } from '../../shared/services/hubService';
import {
  FormArray,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { HubResponseModel } from '../../shared/models/hubs-model';
import { Modal } from '../../shared/components/modal/modal';

@Component({
  selector: 'app-hubs',
  imports: [ReactiveFormsModule, CommonModule, HubCard, Modal],
  templateUrl: './hubs.html',
  styleUrl: './hubs.css',
})
export class Events implements OnInit {
  fb = inject(FormBuilder);
  hubService = inject(HubService);
  toastService = inject(HotToastService);

  usr = JSON.parse(localStorage.getItem('uWfUsr') || '');
  userDetails = signal<any>(this.usr);

  isLayout = signal<boolean>(true);
  hubs = signal<HubResponseModel[]>([]);

  createHubForm = this.fb.nonNullable.group({
    title: ['', [Validators.required]],
    description: ['', [Validators.required]],
    location_name: ['', [Validators.required]],
    geo_location: ['', [Validators.required]],
    rating: ['', [Validators.required]],
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

    this.hubService.getAllHub().subscribe({
      next: (res) => {
        loadingToast.close();
        this.hubs.set(res);
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
    return this.createHubForm.get('images') as FormArray<any>;
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
    console.log(this.createHubForm.value);
    console.log('====================================');

    // if (this.createHubForm.invalid) return;

    const formValue = this.createHubForm.value;
    const formData = new FormData();

    // Append other fields
    formData.append('title', formValue.title ?? '');
    formData.append('location_name', formValue.location_name ?? '');
    formData.append('geo_location', formValue.geo_location ?? '');
    formData.append('rating', formValue.rating ?? '');
    formData.append('description', formValue.description ?? '');

    // Append image files, safely
    (formValue.images ?? []).forEach((file: File) => {
      if (file) {
        formData.append('images', file);
      }
    });

    this.hubService.createHub(formData).subscribe({
      next: (res) => {
        this.getAllEvents();

        this.isModal.set(false);

        loadingToast.close();

        // Reset form and preview
        this.createHubForm.reset();
        this.imagePreviews = [];
        this.images.clear();
      },
      error: (err) => console.error('Error:', err),
    });
  }
}
