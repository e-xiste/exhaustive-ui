import { EnvironmentProviders, inject, InjectionToken, makeEnvironmentProviders, provideAppInitializer } from '@angular/core';
import { Exhaustive } from './exhaustive';
import type { ExhaustiveConfigType } from './exhaustive.types';

export const EXHAUSTIVE_CONFIG = new InjectionToken<ExhaustiveConfigType>('EXHAUSTIVE_CONFIG');

export function provideExhaustive(...features: ExhaustiveConfigType[]): EnvironmentProviders {
    const providers = features?.map((feature) => ({
        provide: EXHAUSTIVE_CONFIG,
        useValue: feature,
        multi: false
    }));

    const initializer = provideAppInitializer(() => {
        const config = inject(Exhaustive);
        features?.forEach((feature) => config.setConfig(feature));
        return;
    });

    return makeEnvironmentProviders([...providers, initializer]);
}
