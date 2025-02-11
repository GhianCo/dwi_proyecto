import {Component, inject, ViewEncapsulation} from '@angular/core';
import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormGroup,
} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {RouterLink} from '@angular/router';
import {fuseAnimations} from '@fuse/animations';
import {FuseAlertComponent,} from '@fuse/components/alert';
import {AppStore} from "@shared/data-access/app.store";
import {JsonPipe, NgIf} from "@angular/common";
import {CustomButtonComponent} from "@shared/ui/custom-button/custom.button.component";

@Component({
    selector: 'auth-sign-in',
    templateUrl: './sign-in.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
    standalone: true,
    imports: [
        RouterLink,
        FuseAlertComponent,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatCheckboxModule,
        MatProgressSpinnerModule,
        NgIf,
        CustomButtonComponent,
        JsonPipe
    ],
})
export class AuthSignInComponent {
    showAlert: boolean = false;

    appStore = inject(AppStore);
    vm = this.appStore.vm();

    /**
     * Constructor
     */
    constructor() {
    }

    /**
     * Sign in
     */
    signIn(): void {
        // Return if the form is invalid
        if (this.vm.signInForm.invalid) {
            return;
        }

        // Disable the form
        this.vm.signInForm.disable();

        // Sign in
        this.appStore.signIn(this.vm.signInForm.value)  ;
    }
}
