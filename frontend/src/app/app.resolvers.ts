import { inject } from '@angular/core';
import { NavigationService } from 'app/core/navigation/navigation.service';
import { forkJoin } from 'rxjs';

export const initialDataResolver = () => {
    const navigationService = inject(NavigationService);

    return forkJoin([
        navigationService.get(),
    ]);
};
