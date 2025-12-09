const { defineConfig } = require('vitest/config');

module.exports = defineConfig({
    test: {
        globals: true,
        environment: 'node',
        testTimeout: 10000,
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html']
        }
    }
});
