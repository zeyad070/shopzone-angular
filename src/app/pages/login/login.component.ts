import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone: false,
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  submitting = false;

  constructor(
    private readonly auth: AuthService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly toastr: ToastrService,
  ) {}

  submit(): void {
    if (this.form.invalid || this.submitting) {
      this.form.markAllAsTouched();
      return;
    }
    const { email, password } = this.form.getRawValue();
    this.submitting = true;
    this.auth.login(email, password).subscribe({
      next: () => {
        this.toastr.success('Welcome back!');
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/products';
        void this.router.navigateByUrl(returnUrl);
      },
      error: (err: unknown) => {
        const message =
          err instanceof Error ? err.message : 'We could not sign you in. Please try again.';
        this.toastr.error(message, 'Login failed');
        this.submitting = false;
      },
      complete: () => {
        this.submitting = false;
      },
    });
  }
}
