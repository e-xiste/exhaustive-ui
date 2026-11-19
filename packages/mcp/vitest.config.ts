import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'node',
        include: ['test/**/*.test.ts'],
        // The suite runs against the fixture snapshot only; a test that reaches the network is a bug.
        testTimeout: 10000
    }
});
