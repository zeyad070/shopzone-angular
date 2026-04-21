import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordsMatch(passwordKey: string, confirmKey: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const group = control as FormGroup;
    const password = group.get(passwordKey)?.value as string | undefined;
    const confirm = group.get(confirmKey)?.value as string | undefined;
    if (!password || !confirm) {
      return null;
    }
    return password === confirm ? null : { passwordMismatch: true };
  };
}
