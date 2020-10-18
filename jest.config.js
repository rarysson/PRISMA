module.exports = {
    preset: "@vue/cli-plugin-unit-jest",
    setupFiles: ["./tests/setup/setup.js"],
    collectCoverage: true,
    collectCoverageFrom: [
        "<rootDir>/src/**/*.{js,vue}",
        "!<rootDir>/src/{main.js,App.vue}",
        "!<rootDir>/src/plugins/**",
        "!<rootDir>/src/router/**"
    ],
    coverageReporters: ["lcov", "text-summary"]
};
