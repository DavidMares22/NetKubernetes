import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromRoot from '@app/store';
import * as fromUser from '@app/store/user';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  loading$!: Observable<boolean | null>;

  constructor(private store: Store<fromRoot.State>) {}

  ngOnInit(): void {
    this.loading$ = this.store.pipe(select(fromUser.getLoading));
  }

  onSubmit(form: NgForm): void {
    if (form.invalid) return;

    const email = form.value.email;
    const clientUri = window.location.origin;

    this.store.dispatch(new fromUser.ForgotPassword({ email, clientUri }));
  }
}
