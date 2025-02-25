import {
    animate,
    state,
    style,
    transition,
    trigger,
} from '@angular/animations';
import {
    FuseAnimationCurves,
    FuseAnimationDurations,
} from '@fuse/animations/defaults';

const zoomIn = trigger('zoomIn', [
    state(
        'void',
        style({
            opacity: 0,
            transform: 'scale(0.5)',
        })
    ),

    state(
        '*',
        style({
            opacity: 1,
            transform: 'scale(1)',
        })
    ),

    transition('void => false', []),

    transition('void => *', animate('{{timings}}'), {
        params: {
            timings: `${FuseAnimationDurations.entering} ${FuseAnimationCurves.deceleration}`,
        },
    }),
]);

const zoomOut = trigger('zoomOut', [
    state(
        '*',
        style({
            opacity: 1,
            transform: 'scale(1)',
        })
    ),

    state(
        'void',
        style({
            opacity: 0,
            transform: 'scale(0.5)',
        })
    ),

    // Prevent the transition if the state is false
    transition('false => void', []),

    // Transition
    transition('* => void', animate('{{timings}}'), {
        params: {
            timings: `${FuseAnimationDurations.exiting} ${FuseAnimationCurves.acceleration}`,
        },
    }),
]);

export { zoomIn, zoomOut };
