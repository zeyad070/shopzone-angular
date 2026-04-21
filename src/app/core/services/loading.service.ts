import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private readonly pending = new BehaviorSubject<number>(0);
  readonly pending$ = this.pending.asObservable();

  begin(): void {
    this.pending.next(this.pending.value + 1);
  }

  end(): void {
    this.pending.next(Math.max(0, this.pending.value - 1));
  }
}
