import asyncio
import json
import os

from playwright.async_api import async_playwright


URL = "https://shoaib.159-195-16-164.sslip.io/"
FAKE_AUDIO = os.environ.get("FAKE_AUDIO_FILE", "/tmp/voice-silence.wav")
EXPECTED_DRAINS = int(os.environ.get("EXPECTED_DRAINS", "1"))


async def main():
    async with async_playwright() as playwright:
        browser = await playwright.chromium.launch(
            executable_path="/usr/bin/google-chrome",
            headless=True,
            args=[
                "--no-sandbox",
                "--use-fake-device-for-media-stream",
                f"--use-file-for-fake-audio-capture={FAKE_AUDIO}",
                "--use-fake-ui-for-media-stream",
                "--autoplay-policy=no-user-gesture-required",
                "--host-resolver-rules=MAP shoaib.159-195-16-164.sslip.io 159.195.16.164",
            ],
        )
        context = await browser.new_context(
            permissions=["microphone"], viewport={"width": 1200, "height": 850}
        )
        page = await context.new_page()
        errors = []
        page.on("pageerror", lambda error: errors.append(str(error)))
        await page.add_init_script(
            """
            window.voiceMetrics = [];
            const Worklet = window.AudioWorkletNode;
            window.AudioWorkletNode = class extends Worklet {
              constructor(...args) {
                super(...args);
                if (args[1] === 'portfolio-pcm-playback') {
                  this.port.addEventListener('message', event => window.voiceMetrics.push(event.data));
                  this.port.start();
                }
              }
            };
            """
        )
        await page.goto(URL, wait_until="domcontentloaded", timeout=30000)
        await page.locator(".nav-projects-trigger").hover()
        menu = page.locator(".nav-projects-menu")
        await menu.wait_for(state="visible")
        menu_box = await menu.bounding_box()
        await page.screenshot(path="/tmp/shoaib-projects-dropdown.png")
        assert menu_box and menu_box["x"] >= 0
        assert menu_box["x"] + menu_box["width"] <= 1200
        assert menu_box["height"] < 420
        await page.mouse.move(1100, 800)
        await page.wait_for_timeout(250)

        await page.get_by_role("button", name="Open AI Assistant").click()
        await page.get_by_role("tab", name="Call", exact=True).click()
        await page.get_by_role("button", name="Start call", exact=True).click()
        await page.wait_for_function(
            f"window.voiceMetrics.filter(item => item.type === 'drained').length >= {EXPECTED_DRAINS}",
            timeout=90000,
        )
        await page.wait_for_timeout(300)
        drained = await page.evaluate(
            "window.voiceMetrics.filter(item => item.type === 'drained')"
        )
        await page.set_viewport_size({"width": 390, "height": 844})
        await page.wait_for_timeout(200)
        panel_box = await page.locator(".pa-panel").bounding_box()
        assert panel_box
        assert abs(panel_box["x"]) < 1 and abs(panel_box["y"]) < 1
        assert abs(panel_box["width"] - 390) < 1
        assert abs(panel_box["height"] - 844) < 1
        await page.screenshot(path="/tmp/shoaib-assistant-mobile.png")
        print(
            json.dumps(
                {
                    "pageErrors": errors,
                    "dropdown": menu_box,
                    "drained": drained,
                    "mobilePanel": panel_box,
                    "overflow": await page.evaluate(
                        "document.documentElement.scrollWidth > innerWidth"
                    ),
                }
            )
        )
        await browser.close()


asyncio.run(main())
