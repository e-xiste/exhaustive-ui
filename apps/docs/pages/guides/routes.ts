import { Routes } from '@angular/router';
import { AccessibilityDemoComponent } from './accessibility/accessibilitydemo';
import { PrimeFlexDemoComponent } from './primeflex/primeflexdemo';
import { RTLDemoComponent } from './rtl/rtldemo';
import { AnimationsDemoComponent } from './animations/animationsdemo';
import { NamingDemoComponent } from './naming/namingdemo';

export default [
    { path: '', redirectTo: 'accessibility', pathMatch: 'full' },
    { path: 'accessibility', component: AccessibilityDemoComponent },
    { path: 'animations', component: AnimationsDemoComponent },
    { path: 'naming', component: NamingDemoComponent },
    { path: 'primeflex', component: PrimeFlexDemoComponent },
    { path: 'rtl', component: RTLDemoComponent }
] satisfies Routes;
