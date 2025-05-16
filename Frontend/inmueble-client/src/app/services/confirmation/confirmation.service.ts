import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from './components/confirm-dialog.component';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ConfirmationService {
  constructor(private dialog: MatDialog) {}

  confirm(message: string): Observable<boolean> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message },
      width: '350px'
    });
    return dialogRef.afterClosed();
  }
}
