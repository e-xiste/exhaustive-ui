import { AppConfigService } from '@/service/appconfigservice';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AnimateOnScrollModule } from '@exhaustive-ui/core/animateonscroll';

@Component({
    selector: 'features-section',
    standalone: true,
    imports: [CommonModule, AnimateOnScrollModule],
    template: `
        <section class="landing-features py-20">
            <div class="section-header">Features</div>
            <p class="section-detail">Everything the v21 codebase offered, rebuilt on modern Angular and maintained in the open.</p>
            <div class="mt-16 px-8 lg:px-20">
                <div class="features-container">
                    <div class="grid grid-cols-12 gap-4">
                        <div class="col-span-12 md:col-span-6 xl:col-span-4 flex justify-center">
                            <div class="box p-6 w-full animate-duration-500" pAnimateOnScroll enterClass="animate-fadein">
                                <img src="/demo/landing/features/icon-angular.svg" alt="Angular icon" class="block mb-4" />
                                <div class="font-semibold mb-4 text-lg">Angular 22</div>
                                <p class="m-0 text-surface-500 dark:text-surface-400 font-medium">Built for Angular 22. ExhaustiveUI majors follow Angular&#39;s, and <i>ng update</i> migrates your code from one to the next.</p>
                            </div>
                        </div>
                        <div class="col-span-12 md:col-span-6 xl:col-span-4 flex justify-center">
                            <div class="box p-6 w-full animate-duration-500" pAnimateOnScroll enterClass="animate-fadein">
                                <img src="/demo/landing/features/icon-signal.svg" alt="signals icon" class="block mb-4" />
                                <div class="font-semibold mb-4 text-lg">Full Signals</div>
                                <p class="m-0 text-surface-500 dark:text-surface-400 font-medium">
                                    Every input, two-way property, output and query is a signal: <i>input()</i>, <i>model()</i>, <i>output()</i>, <i>computed()</i>. Ready for Signal Forms.
                                </p>
                            </div>
                        </div>
                        <div class="col-span-12 md:col-span-6 xl:col-span-4 flex justify-center">
                            <div class="box p-6 w-full animate-duration-500" pAnimateOnScroll enterClass="animate-fadein">
                                <img src="/demo/landing/features/icon-modern.svg" alt="modern Angular icon" class="block mb-4" />
                                <div class="font-semibold mb-4 text-lg">Modern Angular</div>
                                <p class="m-0 text-surface-500 dark:text-surface-400 font-medium">Standalone components, OnPush change detection and the built-in <i>&#64;if</i> / <i>&#64;for</i> control flow, tested without zone.js.</p>
                            </div>
                        </div>
                        <div class="col-span-12 md:col-span-6 xl:col-span-4 flex justify-center">
                            <div class="box p-6 w-full animate-duration-500" pAnimateOnScroll enterClass="animate-fadein">
                                <img src="/demo/landing/features/icon-tailwind.svg" alt="Tailwind CSS icon" class="block mb-4" />
                                <div class="font-semibold mb-4 text-lg">Tailwind CSS 4</div>
                                <p class="m-0 text-surface-500 dark:text-surface-400 font-medium">First-class Tailwind CSS v4 support: theme colors and animation utilities from a single <i>&#64;import</i>, with a PrimeFlex migration.</p>
                            </div>
                        </div>
                        <div class="col-span-12 md:col-span-6 xl:col-span-4 flex justify-center">
                            <div class="box p-6 w-full animate-duration-500" pAnimateOnScroll enterClass="animate-fadein">
                                <img src="/demo/landing/features/icon-components.svg" class="block mb-4" alt="components icon" />
                                <div class="font-semibold mb-4 text-lg">80+ UI Components</div>
                                <p class="m-0 text-surface-500 dark:text-surface-400 font-medium">The ultimate set of UI Components to assist you with 80+ impressive Angular Components.</p>
                            </div>
                        </div>
                        <div class="col-span-12 md:col-span-6 xl:col-span-4 flex justify-center">
                            <div class="box p-6 w-full animate-duration-500" pAnimateOnScroll enterClass="animate-fadein">
                                <img src="/demo/landing/features/icon-theme.svg" alt="components icon" class="block mb-4" />
                                <div class="font-semibold mb-4 text-lg">Styled or Unstyled</div>
                                <p class="m-0 text-surface-500 dark:text-surface-400 font-medium">Choose from a variety of pre-built themes or implement your design systems with the CSS library of your choice like TailwindCSS.</p>
                            </div>
                        </div>
                        <div class="col-span-12 md:col-span-6 xl:col-span-4 flex justify-center">
                            <div class="box p-6 w-full animate-duration-500" pAnimateOnScroll enterClass="animate-fadein">
                                <img src="/demo/landing/features/icon-accessibility.svg" alt="components icon" class="block mb-4" />
                                <div class="font-semibold mb-4 text-lg">Accessibility</div>
                                <p class="m-0 text-surface-500 dark:text-surface-400 font-medium">Targets AA level compliance with the Web Content Accessibility Guidelines (WCAG 2.1).</p>
                            </div>
                        </div>
                        <div class="col-span-12 md:col-span-6 xl:col-span-4 flex justify-center">
                            <div class="box p-6 w-full animate-duration-500" pAnimateOnScroll enterClass="animate-fadein">
                                <img src="/demo/landing/features/icon-mobile.svg" alt="components icon" class="block mb-4" />
                                <div class="font-semibold mb-4 text-lg">Mobile</div>
                                <p class="m-0 text-surface-500 dark:text-surface-400 font-medium">First class support for responsive design led by touch optimized elements.</p>
                            </div>
                        </div>
                        <div class="col-span-12 md:col-span-6 xl:col-span-4 flex justify-center">
                            <div class="box p-6 w-full animate-duration-500" pAnimateOnScroll enterClass="animate-fadein">
                                <img src="/demo/landing/features/icon-ts.svg" alt="components icon" class="block mb-4" />
                                <div class="font-semibold mb-4 text-lg">Typescript</div>
                                <p class="m-0 text-surface-500 dark:text-surface-400 font-medium">Top-notch support for Typescript with types and tooling assistance.</p>
                            </div>
                        </div>
                        <div class="col-span-12 md:col-span-6 xl:col-span-4 xl:col-start-5 flex justify-center">
                            <div class="box p-6 w-full animate-duration-500" pAnimateOnScroll enterClass="animate-fadein">
                                <img src="/demo/landing/features/icon-community.svg" alt="components icon" class="block mb-4" />
                                <div class="font-semibold mb-4 text-lg">Community</div>
                                <p class="m-0 text-surface-500 dark:text-surface-400 font-medium">Connect with the open source community, collaborate and have a voice in the roadmap. Contributions written with AI coding agents are welcome.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `
})
export class FeaturesSectionComponent {
    constructor(private configService: AppConfigService) {}

    get isDarkMode() {
        return this.configService.appState().darkTheme;
    }
}
