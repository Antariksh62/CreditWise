import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const SCREENSHOT_DIR = path.resolve('artifacts', 'visual_polish');
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function runVerification() {
  console.log('--- Starting Homepage Visual Polish Verification ---');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900 });

    console.log('Navigating to http://localhost:3000 ...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });

    // 1. Verify Hero CTA buttons bounding box
    const heroButtons = await page.evaluate(() => {
      const primary = document.querySelector('section a[href="/onboarding"]');
      const secondary = document.querySelector('section a[href="/cards"]');
      
      const pRect = primary ? primary.getBoundingClientRect() : null;
      const sRect = secondary ? secondary.getBoundingClientRect() : null;

      return {
        primary: pRect ? { width: pRect.width, height: pRect.height, text: primary.innerText.trim() } : null,
        secondary: sRect ? { width: sRect.width, height: sRect.height, text: secondary.innerText.trim() } : null,
      };
    });
    console.log('Hero Buttons Desktop Dimensions:', heroButtons);

    // 2. Verify Canvas location and mask styling
    const canvasDetails = await page.evaluate(() => {
      const canvas = document.querySelector('section canvas');
      if (!canvas) return null;
      const rect = canvas.getBoundingClientRect();
      const parent = canvas.parentElement;
      const pRect = parent.getBoundingClientRect();
      const style = window.getComputedStyle(canvas);
      return {
        canvasWidth: rect.width,
        canvasHeight: rect.height,
        canvasTop: rect.top,
        parentTag: parent.tagName,
        parentTop: pRect.top,
        parentHeight: pRect.height,
        maskImage: style.maskImage || style.webkitMaskImage,
      };
    });
    console.log('Canvas Details:', canvasDetails);

    // 3. Verify Navbar Search button (no <kbd> element)
    const navbarSearch = await page.evaluate(() => {
      const btn = document.querySelector('button[aria-label="Search all credit cards"]');
      if (!btn) return { found: false };
      const kbd = btn.querySelector('kbd');
      const text = btn.innerText;
      return {
        found: true,
        hasKbd: !!kbd,
        kbdText: kbd ? kbd.innerText : null,
        buttonText: text,
      };
    });
    console.log('Navbar Search Button Details:', navbarSearch);

    // 4. Verify LearnPreview heading styling and font
    const learnHeading = await page.evaluate(() => {
      const h2Elements = Array.from(document.querySelectorAll('h2'));
      const target = h2Elements.find(h => h.textContent.includes('Guides and Credit Card Insights'));
      if (!target) return null;
      const style = window.getComputedStyle(target);
      return {
        text: target.textContent.trim(),
        fontFamily: style.fontFamily,
        fontSize: style.fontSize,
        fontWeight: style.fontWeight,
        lineHeight: style.lineHeight,
      };
    });
    console.log('Learn Heading Details:', learnHeading);

    // Capture desktop hero screenshot
    const heroSection = await page.$('section');
    if (heroSection) {
      await heroSection.screenshot({ path: path.join(SCREENSHOT_DIR, 'hero_desktop.png') });
      console.log('Saved hero_desktop.png');
    }

    // Capture navbar screenshot
    const nav = await page.$('header') || await page.$('nav');
    if (nav) {
      await nav.screenshot({ path: path.join(SCREENSHOT_DIR, 'navbar_desktop.png') });
      console.log('Saved navbar_desktop.png');
    }

    // Capture learn section screenshot
    await page.evaluate(() => {
      const heading = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.includes('Guides and Credit Card Insights'));
      if (heading) {
        heading.scrollIntoView();
      }
    });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'learn_preview_desktop.png') });
    console.log('Saved learn_preview_desktop.png');

    // Test Mobile viewport
    console.log('Testing mobile viewport (390x844)...');
    await page.setViewport({ width: 390, height: 844 });
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 600));

    const mobileButtons = await page.evaluate(() => {
      const primary = document.querySelector('section a[href="/onboarding"]');
      const secondary = document.querySelector('section a[href="/cards"]');
      const pRect = primary ? primary.getBoundingClientRect() : null;
      const sRect = secondary ? secondary.getBoundingClientRect() : null;
      return {
        primary: pRect ? { width: pRect.width, height: pRect.height, text: primary.innerText.trim() } : null,
        secondary: sRect ? { width: sRect.width, height: sRect.height, text: secondary.innerText.trim() } : null,
      };
    });
    console.log('Hero Buttons Mobile Dimensions:', mobileButtons);

    const mobileHero = await page.$('section');
    if (mobileHero) {
      await mobileHero.screenshot({ path: path.join(SCREENSHOT_DIR, 'hero_mobile.png') });
      console.log('Saved hero_mobile.png');
    }

    console.log('--- Verification Complete ---');
  } catch (err) {
    console.error('Verification error:', err);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
}

runVerification();
