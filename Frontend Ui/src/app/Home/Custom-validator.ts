import { AbstractControl, ValidatorFn } from '@angular/forms';

export function fileTypeValidator(allowedTypes: any[]): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    const file = control.value as File;
    if (file) {
      const extension = file.name.split('.').pop()?.toLowerCase();
      if (!allowedTypes.includes(extension)) {
        return { 'invalidFileType': true };
      }
    }
    return null;
  };
}

export function fileSizeValidator(maxSize: number): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    const file = control.value as File;
    if (file) {
      const fileSize = file.size / 1024 / 1024; // in MB
      if (fileSize > maxSize) {
        return { 'invalidFileSize': true };
      }
    }
    return null;
  };
}