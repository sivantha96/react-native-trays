# E2E Testing (Optional)

For end-to-end (E2E) smoke tests, we recommend [Detox](https://github.com/wix/Detox) or [Playwright](https://playwright.dev/).

## Setup Example (Detox)

1. Install Detox:
   ```sh
   yarn add -D detox
   yarn detox init -r jest
   ```
2. Configure `detox.config.js` for your project (see Detox docs).
3. Add a basic test in `e2e/`:
   ```js
   // e2e/firstTest.e2e.js
   describe('App', () => {
     it('should launch', async () => {
       await device.launchApp();
       await expect(element(by.text('Open Tray'))).toBeVisible();
     });
   });
   ```
4. Run:
   ```sh
   yarn detox build
   yarn detox test
   ```

See official [Detox docs](https://wix.github.io/Detox/docs/introduction/getting-started/) for details.

---

You may also use [Playwright](https://playwright.dev/) for web-based E2E testing if you export your example app to web.
