# Configuration

Application wide configuration for ExhaustiveUI.

## Csp-

The nonce value to use on dynamically generated style elements in core.

```typescript
provideExhaustive({
    csp: {
        nonce: '...'
    }
})
```

## Dynamic-

Inject the Exhaustive to your application to update the initial configuration at runtime.

```typescript
import { Component, OnInit } from '@angular/core';
import { Exhaustive } from '@exhaustive-ui/core/config';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

    constructor(private config: Exhaustive) {}

    ngOnInit() {
        this.config.ripple.set(true);
    }
}
```

## Filtermode-

