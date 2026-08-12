from pathlib import Path

from playwright.sync_api import sync_playwright


URL = "http://127.0.0.1:4321/preview/aplikace/regulace-zateze/"


def run_flow(page, screenshot_path: str) -> dict:
    errors = []
    page.on("pageerror", lambda error: errors.append(str(error)))
    page.route(
        "**/*",
        lambda route: route.continue_()
        if route.request.url.startswith("http://127.0.0.1:4321/")
        else route.abort(),
    )
    page.goto(URL, wait_until="networkidle")
    page.locator("#kompas").scroll_into_view_if_needed()
    page.get_by_role("button", name="Připravit krátkou techniku").click()
    assert page.locator("#need-error").is_visible()
    assert page.evaluate("document.activeElement?.getAttribute('name')") == "need"
    page.locator("label.need-card", has_text="Tělo je v napětí").click()
    page.get_by_role("button", name="Připravit krátkou techniku").click()
    assert page.locator("#protocol-title").inner_text() == "Zpomalte výdech"
    assert page.evaluate("document.activeElement?.id") == "step-heading"
    page.locator("#timer-toggle").click()
    page.wait_for_timeout(1100)
    assert page.locator("#timer").inner_text() != "1:30"
    page.locator("#timer-reset").click()
    assert page.locator("#timer").inner_text() == "1:30"
    page.get_by_role("button", name="Pokračovat k plánu").click()
    assert page.evaluate("document.activeElement?.id") == "step-heading"
    page.locator("label.action-card", has_text="Dokončím jednu konkrétní věc").click()
    page.locator("#action-detail").fill("Odpovím na jeden důležitý e-mail")
    page.locator("#load-after").fill("3")
    page.get_by_role("button", name="Vytvořit můj plán").click()
    assert page.evaluate("document.activeElement?.id") == "step-heading"
    assert page.locator("#result-action").inner_text() == "Dokončím jednu konkrétní věc"
    assert page.locator("#result-detail").inner_text() == "Odpovím na jeden důležitý e-mail"
    overflow = page.evaluate("document.documentElement.scrollWidth > document.documentElement.clientWidth")
    storage = page.evaluate("({local: localStorage.length, session: sessionStorage.length})")
    cookies = page.context.cookies()
    page.screenshot(path=screenshot_path, full_page=True)
    page.locator("#start-over").click()
    assert page.locator("#step-one").is_visible()
    assert page.locator("#load-before").input_value() == "5"
    assert page.locator("#load-after").input_value() == "5"
    assert page.locator('input[name="need"]:checked').count() == 0
    assert page.locator('input[name="action"]:checked').count() == 0
    assert page.locator("#action-detail").input_value() == ""
    assert page.evaluate("document.activeElement?.id") == "step-heading"
    return {"page_errors": errors, "horizontal_overflow": overflow, "storage": storage, "cookies": len(cookies)}


with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True, args=["--no-sandbox"])
    desktop = browser.new_page(viewport={"width": 1440, "height": 1000})
    desktop_result = run_flow(desktop, "/tmp/regulace-zateze-desktop.png")
    mobile = browser.new_page(viewport={"width": 375, "height": 812}, is_mobile=True)
    mobile_result = run_flow(mobile, "/tmp/regulace-zateze-mobile.png")
    boundary_results = {}
    for width, height in ((320, 700), (768, 900)):
        page = browser.new_page(viewport={"width": width, "height": height})
        page.goto(URL, wait_until="networkidle")
        boundary_results[width] = page.evaluate(
            "document.documentElement.scrollWidth > document.documentElement.clientWidth"
        )
        page.close()
    browser.close()

assert not desktop_result["page_errors"], desktop_result
assert not mobile_result["page_errors"], mobile_result
assert not desktop_result["horizontal_overflow"], desktop_result
assert not mobile_result["horizontal_overflow"], mobile_result
assert desktop_result["storage"] == {"local": 0, "session": 0}, desktop_result
assert mobile_result["storage"] == {"local": 0, "session": 0}, mobile_result
assert desktop_result["cookies"] == 0, desktop_result
assert mobile_result["cookies"] == 0, mobile_result
assert not any(boundary_results.values()), boundary_results
print({"desktop": desktop_result, "mobile": mobile_result, "boundary_overflow": boundary_results})
print(Path("/tmp/regulace-zateze-desktop.png").stat().st_size)
print(Path("/tmp/regulace-zateze-mobile.png").stat().st_size)
