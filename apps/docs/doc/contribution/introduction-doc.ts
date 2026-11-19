import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { Code } from '@/domain/code';
import { Component } from '@angular/core';

@Component({
    selector: 'introduction-doc',
    standalone: true,
    imports: [AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>ExhaustiveUI is a community-maintained Angular UI library, stewarded by e-xiste and dedicated to providing high-quality, versatile and accessible UI components that help developers build better applications faster.</p>
            <h3>Development Setup</h3>
            <p>To begin with, clone the ExhaustiveUI repository from GitHub:</p>
            <app-code [code]="code1" [hideToggleCode]="true" [hideStackBlitz]="true"></app-code>
            <p style="margin-top: 1rem;">Then run the documentation app in your local environment at <i>http://localhost:4200/</i>.</p>
            <app-code [code]="code2" [hideToggleCode]="true" [hideStackBlitz]="true"></app-code>
            <h3>Project Structure</h3>
            <p>ExhaustiveUI's project structure is organized as follows:</p>
            <app-code [code]="code3" [hideToggleCode]="true" [hideStackBlitz]="true"></app-code>
        </app-docsectiontext>
    `
})
export class IntroductionDoc {
    code1: Code = {
        typescript: `git clone https://github.com/e-xiste/exhaustive-ui.git
cd exhaustive-ui`
    };
    code2: Code = {
        typescript: `pnpm install
pnpm run dev`
    };
    code3: Code = {
        typescript: `- apps
  - docs                       // this documentation website
  - tailwind-playgrounds       // Tailwind integration sandboxes
- packages
  - core                       // components, directives and services
  - themes                     // built-in theme presets
  - styled                     // styled-mode theming engine
  - styles                     // base styles
  - tailwindcss                // Tailwind CSS plugin
  - locale                     // i18n locales
  - motion                     // animation utilities
  - utils                      // shared helpers`
    };
}
