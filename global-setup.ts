import { chromium } from '@playwright/test';

// eslint-disable-next-line import/no-anonymous-default-export
export default async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/signup', { waitUntil: 'networkidle' });
  await browser.close();
};
