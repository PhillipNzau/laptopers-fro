import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { HubCard } from '../../shared/components/hub-card/hub-card';
import { HubService } from '../../shared/services/hubService';
import {
  FormArray,
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { HubResponseModel } from '../../shared/models/hubs-model';
import { Modal } from '../../shared/components/modal/modal';
import { debounceTime, switchMap } from 'rxjs';

@Component({
  selector: 'app-hubs',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    HubCard,
    Modal,
    NgOptimizedImage,
  ],
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
  searchControl = new FormControl('');
  suggestions: any[] = [];
  selectedLocation: any = null;

  createHubForm = this.fb.nonNullable.group({
    title: ['', [Validators.required]],
    description: ['', [Validators.required]],
    location_name: ['', [Validators.required]],
    coordinates: this.fb.group({
      lat: [''],
      lng: [''],
    }),
    rating: ['', [Validators.required]],
    images: this.fb.nonNullable.array<File>([]),
  });

  ngOnInit(): void {
    this.getAllEvents();
    this.searchControl.valueChanges
      .pipe(
        debounceTime(200),
        switchMap((value) => this.hubService.searchLocations(value))
      )
      .subscribe((results) => {
        this.suggestions = results;
      });
  }
  get f() {
    return this.createHubForm.controls;
  }
  selectSuggestion(suggestion: any) {
    this.selectedLocation = suggestion;

    this.createHubForm.patchValue({
      location_name: this.selectedLocation.display_name,
      coordinates: {
        lat: this.selectedLocation.lat,
        lng: this.selectedLocation.lon,
      },
    });

    this.suggestions = [];
    this.searchControl.setValue(suggestion.display_name, { emitEvent: false });
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

    // if (this.createHubForm.invalid) return;

    const formValue = this.createHubForm.value;
    const formData = new FormData();

    const coordinates = formValue.coordinates ?? { lat: null, lng: null };

    // Append other fields
    formData.append('title', formValue.title ?? '');
    formData.append('location_name', formValue.location_name ?? '');
    formData.append('lat', formValue.coordinates?.lat ?? '');
    formData.append('lng', formValue.coordinates?.lng ?? '');
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
