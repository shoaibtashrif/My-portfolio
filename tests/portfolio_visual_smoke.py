import asyncio
import json
import os

from playwright.async_api import async_playwright


BASE_URL = os.environ.get("BASE_URL", "http://127.0.0.1:4174")


async def reveal_page(page):
    height = await page.evaluate("document.documentElement.scrollHeight")
    for y in range(0, height, 620):
        await page.evaluate("y => window.scrollTo(0, y)", y)
        await page.wait_for_timeout(100)
    await page.evaluate("window.scrollTo(0, 0)")
    await page.wait_for_timeout(250)


async def main():
    async with async_playwright() as playwright:
        browser = await playwright.chromium.launch(
            executable_path="/usr/bin/google-chrome",
            headless=True,
            args=[
                "--no-sandbox",
                "--host-resolver-rules=MAP shoaib.159-195-16-164.sslip.io 159.195.16.164",
            ],
        )
        desktop = await browser.new_page(viewport={"width": 1440, "height": 1000})
        errors = []
        desktop.on("pageerror", lambda error: errors.append(str(error)))

        captures = {}
        for path, name in [
            ("/about", "about"),
            ("/expertise", "expertise"),
            ("/projects", "projects"),
            ("/projects/hilum-healthcare-ai", "project-detail"),
        ]:
            await desktop.goto(f"{BASE_URL}{path}", wait_until="domcontentloaded", timeout=45000)
            await desktop.wait_for_timeout(1000)
            await reveal_page(desktop)
            await desktop.screenshot(path=f"/tmp/shoaib-{name}-refresh.png", full_page=True)
            captures[name] = {
                "overflow": await desktop.evaluate("document.documentElement.scrollWidth > innerWidth"),
                "images": await desktop.locator("main img").count(),
            }

        await desktop.goto(f"{BASE_URL}/about", wait_until="domcontentloaded", timeout=45000)
        await desktop.wait_for_timeout(1000)
        await desktop.wait_for_function(
            "document.querySelector('img[src*=\"shoaib-nature-perspective\"]')?.naturalWidth > 0",
            timeout=20000,
        )
        nature_loaded = await desktop.locator('img[src*="shoaib-nature-perspective"]').evaluate(
            "img => img.naturalWidth > 0"
        )
        assert nature_loaded
        assert captures["expertise"]["images"] >= 6
        assert all(not item["overflow"] for item in captures.values())

        mobile = await browser.new_page(viewport={"width": 390, "height": 844})
        mobile_errors = []
        mobile.on("pageerror", lambda error: mobile_errors.append(str(error)))
        await mobile.goto(f"{BASE_URL}/contact", wait_until="domcontentloaded", timeout=45000)
        await mobile.wait_for_timeout(1000)
        await mobile.get_by_role("button", name="Open navigation").click()
        menu_box = await mobile.locator(".ea-mobile-nav").bounding_box()
        assert menu_box and menu_box["x"] == 0 and menu_box["width"] == 390
        assert menu_box["y"] >= 70 and menu_box["y"] < 82
        assert await mobile.locator(".nav-book").is_visible()
        assert not await mobile.evaluate("document.documentElement.scrollWidth > innerWidth")
        await mobile.screenshot(path="/tmp/shoaib-mobile-navbar-refresh.png", full_page=True)

        await mobile.goto(f"{BASE_URL}/about", wait_until="domcontentloaded", timeout=45000)
        await mobile.wait_for_timeout(1000)
        await reveal_page(mobile)
        await mobile.screenshot(path="/tmp/shoaib-about-mobile-refresh.png", full_page=True)
        assert not await mobile.evaluate("document.documentElement.scrollWidth > innerWidth")

        print(json.dumps({
            "desktop": captures,
            "desktopErrors": errors,
            "mobileErrors": mobile_errors,
            "mobileMenu": menu_box,
            "natureLoaded": nature_loaded,
        }))
        await browser.close()


asyncio.run(main())
