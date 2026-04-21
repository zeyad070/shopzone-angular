import { Component, inject } from '@angular/core';
import { map } from 'rxjs';
import { LoadingService } from '../../../core/services/loading.service';

@Component({
  selector: 'app-loading-overlay',
  templateUrl: './loading-overlay.component.html',
  styleUrl: './loading-overlay.component.css',
  standalone: false,
})
export class LoadingOverlayComponent {
  private readonly loading = inject(LoadingService);
  readonly visible$ = this.loading.pending$.pipe(map((n) => n > 0));
}
