import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import * as fromRoot from '@app/store';
import * as fromUser from '@app/store/user';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
    loading$!: Observable<boolean | null>;
    token: string | null = null;
    email: string | null = null;

    constructor(
        private store: Store<fromRoot.State>,
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        this.loading$ = this.store.pipe(select(fromUser.getLoading));
        this.token = this.route.snapshot.queryParamMap.get('token');
        this.email = this.route.snapshot.queryParamMap.get('email');
    }

    onSubmit(form: NgForm): void {
        if (form.invalid || !this.token) return;

        const { email, password, confirmPassword } = form.value;

        if (password !== confirmPassword) {
            form.controls['confirmPassword']?.setErrors({ mismatch: true });
            return;
        }

        this.store.dispatch(
          new fromUser.ResetPassword({
            email,
            token: this.token,
            password,
          })
        );
    }
}
