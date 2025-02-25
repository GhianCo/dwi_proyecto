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

const fadeIn = trigger('fadeIn', [
    state(
        'void',
        style({
            opacity: 0,
        })
    ),

    state(
        '*',
        style({
            opacity: 1,
        })
    ),

    transition('void => false', []),

    transition('void => *', animate('{{timings}}'), {
        params: {
            timings: `${FuseAnimationDurations.entering} ${FuseAnimationCurves.deceleration}`,
        },
    }),
]);

const fadeInTop = trigger('fadeInTop', [
    state(
        'void',
        style({
            opacity: 0,
            transform: 'translate3d(0, -100%, 0)',
        })
    ),

    state(
        '*',
        style({
            opacity: 1,
            transform: 'translate3d(0, 0, 0)',
        })
    ),

    transition('void => false', []),

    transition('void => *', animate('{{timings}}'), {
        params: {
            timings: `${FuseAnimationDurations.entering} ${FuseAnimationCurves.deceleration}`,
        },
    }),
]);

const fadeInBottom = trigger('fadeInBottom', [
    state(
        'void',
        style({
            opacity: 0,
            transform: 'translate3d(0, 100%, 0)',
        })
    ),

    state(
        '*',
        style({
            opacity: 1,
            transform: 'translate3d(0, 0, 0)',
        })
    ),

    transition('void => false', []),

    transition('void => *', animate('{{timings}}'), {
        params: {
            timings: `${FuseAnimationDurations.entering} ${FuseAnimationCurves.deceleration}`,
        },
    }),
]);

// -----------------------------------------------------------------------------------------------------
// @ Fade in left
// -----------------------------------------------------------------------------------------------------
const fadeInLeft = trigger('fadeInLeft', [
    state(
        'void',
        style({
            opacity: 0,
            transform: 'translate3d(-100%, 0, 0)',
        })
    ),

    state(
        '*',
        style({
            opacity: 1,
            transform: 'translate3d(0, 0, 0)',
        })
    ),

    transition('void => false', []),

    transition('void => *', animate('{{timings}}'), {
        params: {
            timings: `${FuseAnimationDurations.entering} ${FuseAnimationCurves.deceleration}`,
        },
    }),
]);

// -----------------------------------------------------------------------------------------------------
// @ Fade in right
// -----------------------------------------------------------------------------------------------------
const fadeInRight = trigger('fadeInRight', [
    state(
        'void',
        style({
            opacity: 0,
            transform: 'translate3d(100%, 0, 0)',
        })
    ),

    state(
        '*',
        style({
            opacity: 1,
            transform: 'translate3d(0, 0, 0)',
        })
    ),

    // Prevent the transition if the state is false
    transition('void => false', []),

    // Transition
    transition('void => *', animate('{{timings}}'), {
        params: {
            timings: `${FuseAnimationDurations.entering} ${FuseAnimationCurves.deceleration}`,
        },
    }),
]);

// -----------------------------------------------------------------------------------------------------
// @ Fade out
// -----------------------------------------------------------------------------------------------------
const fadeOut = trigger('fadeOut', [
    state(
        '*',
        style({
            opacity: 1,
        })
    ),

    state(
        'void',
        style({
            opacity: 0,
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

// -----------------------------------------------------------------------------------------------------
// @ Fade out top
// -----------------------------------------------------------------------------------------------------
const fadeOutTop = trigger('fadeOutTop', [
    state(
        '*',
        style({
            opacity: 1,
            transform: 'translate3d(0, 0, 0)',
        })
    ),

    state(
        'void',
        style({
            opacity: 0,
            transform: 'translate3d(0, -100%, 0)',
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

// -----------------------------------------------------------------------------------------------------
// @ Fade out bottom
// -----------------------------------------------------------------------------------------------------
const fadeOutBottom = trigger('fadeOutBottom', [
    state(
        '*',
        style({
            opacity: 1,
            transform: 'translate3d(0, 0, 0)',
        })
    ),

    state(
        'void',
        style({
            opacity: 0,
            transform: 'translate3d(0, 100%, 0)',
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

// -----------------------------------------------------------------------------------------------------
// @ Fade out left
// -----------------------------------------------------------------------------------------------------
const fadeOutLeft = trigger('fadeOutLeft', [
    state(
        '*',
        style({
            opacity: 1,
            transform: 'translate3d(0, 0, 0)',
        })
    ),

    state(
        'void',
        style({
            opacity: 0,
            transform: 'translate3d(-100%, 0, 0)',
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

// -----------------------------------------------------------------------------------------------------
// @ Fade out right
// -----------------------------------------------------------------------------------------------------
const fadeOutRight = trigger('fadeOutRight', [
    state(
        '*',
        style({
            opacity: 1,
            transform: 'translate3d(0, 0, 0)',
        })
    ),

    state(
        'void',
        style({
            opacity: 0,
            transform: 'translate3d(100%, 0, 0)',
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

export {
    fadeIn,
    fadeInBottom,
    fadeInLeft,
    fadeInRight,
    fadeInTop,
    fadeOut,
    fadeOutBottom,
    fadeOutLeft,
    fadeOutRight,
    fadeOutTop,
};
