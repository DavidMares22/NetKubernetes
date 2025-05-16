import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import { ConfirmationService } from './confirmation.service';
import { ConfirmDialogComponent } from './components/confirm-dialog.component';

@NgModule({
  declarations: [ConfirmDialogComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ],
  exports: [ConfirmDialogComponent]
})
export class ConfirmationModule {
  static forRoot(): ModuleWithProviders<ConfirmationModule> {
    return {
      ngModule: ConfirmationModule,
      providers: [ConfirmationService]
    };
  }
}
