import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { HubService } from '../../../../shared/services/hubService';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HubResponseModel } from '../../../../shared/models/hubs-model';
import { Modal } from '../../../../shared/components/modal/modal';

@Component({
  selector: 'app-hub-details',
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    Modal,
    NgOptimizedImage,
  ],
  templateUrl: './hub-details.html',
  styleUrl: './hub-details.css',
})
export class HubDetails implements OnInit {
  private hubService = inject(HubService);
  private toastService = inject(HotToastService);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);

  isToggled = signal<boolean>(false);

  hub = signal<HubResponseModel>({ rating: '0' });
  reviews: any[] = [];
  isFavorite = signal<boolean>(false);
  selectedImage = signal<string>('');

  usr = JSON.parse(localStorage.getItem('uWfUsr') || '');
  role = signal<string>('');

  isEditing = signal(false);
  isModal = signal<boolean>(false);

  updateHubForm = this.fb.nonNullable.group({
    title: [this.hub().title],
    description: [this.hub().description],
  });

  reviewHubForm = this.fb.nonNullable.group({
    rating: ['', [Validators.required]],
    comment: ['', [Validators.required, Validators.maxLength(200)]],
  });

  // Helper getter to simplify template validation
  get f() {
    return this.reviewHubForm.controls;
  }
  get descriptionLength(): number {
    return this.reviewHubForm.get('comment')?.value?.length || 0;
  }

  ngOnInit(): void {
    this.getHub();
    this.role.set(this.usr?.role);
  }
  getHub() {
    const loadingToast = this.toastService.loading('Processing...');

    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.toastService.error('No hub ID found in route');
      return;
    }

    this.hubService.getSingleHub(id).subscribe({
      next: (res) => {
        loadingToast.close();
        this.hub.set(res.hub);
        this.isFavorite.set(res.is_favorite);
        this.reviews = res.reviews;
      },
      error: () => {
        loadingToast.close();
        this.toastService.error('Failed to fetch Hub details');
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
      this.reviewHubForm.patchValue(this.hub());
    }
  }

  saveChanges() {
    const loadingToast = this.toastService.loading('Processing...');

    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.toastService.error('No hub ID found in route');
      return;
    }

    if (this.updateHubForm.valid) {
      this.hubService.updateHub(this.updateHubForm.value, id).subscribe({
        next: (res) => {
          loadingToast.close();
          this.hub.set(res.hub);
        },
        error: () => {
          loadingToast.close();
          this.toastService.error('Failed to update Hub details');
        },
      });
      this.isToggled.set(false);
    }
  }

  submitReviewHub() {
    const loadingToast = this.toastService.loading('Processing...');

    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.toastService.error('No hub ID found in route');
      return;
    }

    if (this.reviewHubForm.valid) {
      this.hubService.reviewHub(this.reviewHubForm.value, id).subscribe({
        next: (res) => {
          loadingToast.close();
          this.reviews = [...this.reviews, res];
          this.isModal.set(false);
          this.reviewHubForm.reset;
        },
        error: () => {
          loadingToast.close();
          this.toastService.error('Failed to update Hub details');
          this.isModal.set(false);
        },
      });
    }
  }

  markFavoriteHub() {
    const loadingToast = this.toastService.loading('Processing...');

    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.toastService.error('No hub ID found in route');
      return;
    }
    this.hubService.favoriteHub(id).subscribe({
      next: (res) => {
        loadingToast.close();
        this.isFavorite.set(res.favorite);
      },
      error: () => {
        loadingToast.close();
        this.toastService.error('Failed to update Hub details');
      },
    });
  }

  toggleAddReviewModal() {
    this.isModal.set(!this.isModal());
  }
}
