import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { switchMap } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { passwordsMatch } from '../../shared/validators/password-match.validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  standalone: false,
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  readonly form = this.fb.nonNullable.group(
    {
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
    },
    { validators: passwordsMatch('password', 'confirmPassword') },
  );

  submitting = false;

  constructor(
    private readonly auth: AuthService,
    private readonly router: Router,
    private readonly toastr: ToastrService,
  ) {}

  submit(): void {
    if (this.form.invalid || this.submitting) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting = true;
    const { name, email, password } = this.form.getRawValue();
    this.auth
      .emailExists(email)
      .pipe(
        switchMap((exists) => {
          if (exists) {
            throw new Error('Email is already registered');
          }
          return this.auth.register({
            name,
            email: email.toLowerCase(),
            password,
          });
        }),
      )
      .subscribe({
        next: () => {
          this.toastr.success('Account created successfully');
          void this.router.navigateByUrl('/login');
        },
        error: (err: unknown) => {
          const message = err instanceof Error ? err.message : 'Registration failed';
          this.toastr.error(message);
          this.submitting = false;
        },
        complete: () => {
          this.submitting = false;
        },
      });
  }

  mismatch(): boolean {
    return (
      this.form.touched &&
      !!this.form.errors &&
      'passwordMismatch' in this.form.errors &&
      !!this.form.errors['passwordMismatch']
    );
  }
}
