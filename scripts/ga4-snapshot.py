"""GA4 snapshot over REST (truststore for the Windows certificate store). Writes a markdown report."""
import datetime as dt, io, json, os, sys
import truststore; truststore.inject_into_ssl()
import requests
from google.oauth2 import service_account
from google.auth.transport.requests import Request

PROP = "521172443"
URL = f"https://analyticsdata.googleapis.com/v1beta/properties/{PROP}:runReport"
OUT = "D:/OneDrive/Documents/GitHub/camp-explorer-europe-2026/docs/reports/GA4_PULL_2026-09-06.md"
cfg = json.load(io.open(os.path.expanduser("~/.claude.json"), encoding="utf-8"))
creds = service_account.Credentials.from_service_account_file(cfg["mcpServers"]["ga4"]["env"]["GOOGLE_APPLICATION_CREDENTIALS"], scopes=["https://www.googleapis.com/auth/analytics.readonly"])
creds.refresh(Request()); H = {"Authorization": f"Bearer {creds.token}"}
TODAY = dt.date.today().isoformat()

def report(dims, mets, start="2026-01-01", end=TODAY, dim_filter=None, order=None, limit=25):
    body = {"dateRanges": [{"startDate": start, "endDate": end}], "dimensions": [{"name": d} for d in dims],
            "metrics": [{"name": m} for m in mets], "limit": limit}
    if dim_filter: body["dimensionFilter"] = dim_filter
    if order: body["orderBys"] = order
    r = requests.post(URL, headers=H, json=body, timeout=60)
    if r.status_code != 200: return [("HTTP " + str(r.status_code), r.text[:120])]
    return [tuple(v["value"] for v in row.get("dimensionValues", [])) + tuple(v["value"] for v in row["metricValues"]) for row in r.json().get("rows", [])]

def table(title, header, rows):
    lines = [f"### {title}", "", "| " + " | ".join(header) + " |", "|" + "---|" * len(header)]
    lines += ["| " + " | ".join(str(c) for c in row) + " |" for row in rows]
    return "\n".join(lines) + "\n"

ev = lambda name: {"filter": {"fieldName": "eventName", "stringFilter": {"value": name}}}
by_metric = lambda m: [{"metric": {"metricName": m}, "desc": True}]
by_dim = lambda d: [{"dimension": {"dimensionName": d}}]

sections = []
sections.append(table("Users, sessions, views by month (2026)", ["month", "active users", "sessions", "page views", "engaged sessions"],
    report(["yearMonth"], ["activeUsers", "sessions", "screenPageViews", "engagedSessions"], order=by_dim("yearMonth"))))
sections.append(table("Last 30 days versus the 30 before", ["window", "active users", "sessions", "booking clicks"], [
    ("last 30 days",) + (report([], ["activeUsers", "sessions"], start="30daysAgo", end="today") or [("", "")])[0]
        + (report([], ["eventCount"], start="30daysAgo", end="today", dim_filter=ev("camp_booking_click")) or [("0",)])[0],
    ("previous 30 days",) + (report([], ["activeUsers", "sessions"], start="60daysAgo", end="31daysAgo") or [("", "")])[0]
        + (report([], ["eventCount"], start="60daysAgo", end="31daysAgo", dim_filter=ev("camp_booking_click")) or [("0",)])[0]]))
sections.append(table("Traffic sources 2026 (session source / medium)", ["source / medium", "sessions", "active users"],
    report(["sessionSourceMedium"], ["sessions", "activeUsers"], order=by_metric("sessions"), limit=20)))
sections.append(table("Countries 2026", ["country", "active users", "sessions"],
    report(["country"], ["activeUsers", "sessions"], order=by_metric("activeUsers"), limit=15)))
sections.append(table("Devices 2026", ["device", "active users", "sessions"],
    report(["deviceCategory"], ["activeUsers", "sessions"], order=by_metric("activeUsers"))))
sections.append(table("Operating systems 2026", ["OS", "active users"],
    report(["operatingSystem"], ["activeUsers"], order=by_metric("activeUsers"), limit=8)))
sections.append(table("Events 2026", ["event", "count", "users"],
    report(["eventName"], ["eventCount", "totalUsers"], order=by_metric("eventCount"), limit=20)))
sections.append(table("Booking clicks by camp 2026 (per-camp names recorded from March)", ["camp", "booking clicks"],
    report(["customEvent:camp_name"], ["eventCount"], dim_filter=ev("camp_booking_click"), order=by_metric("eventCount"), limit=70)))
sections.append(table("Booking clicks by month 2026", ["month", "booking clicks", "users clicking"],
    report(["yearMonth"], ["eventCount", "totalUsers"], dim_filter=ev("camp_booking_click"), order=by_dim("yearMonth"))))
sections.append(table("Booking clicks by category 2026", ["category", "booking clicks"],
    report(["customEvent:camp_category"], ["eventCount"], dim_filter=ev("camp_booking_click"), order=by_metric("eventCount"))))
sections.append(table("Booking clicks by camp country 2026", ["camp country", "booking clicks"],
    report(["customEvent:camp_country"], ["eventCount"], dim_filter=ev("camp_booking_click"), order=by_metric("eventCount"), limit=30)))
sections.append(table("Booking clicks by visitor device 2026", ["device", "booking clicks"],
    report(["deviceCategory"], ["eventCount"], dim_filter=ev("camp_booking_click"), order=by_metric("eventCount"))))
sections.append(table("Video clicks by camp 2026", ["camp", "video clicks"],
    report(["customEvent:camp_name"], ["eventCount"], dim_filter=ev("video_click"), order=by_metric("eventCount"))))
sections.append(table("Consent granted by month (analytics_consent_granted)", ["month", "events"],
    report(["yearMonth"], ["eventCount"], dim_filter=ev("analytics_consent_granted"), order=by_dim("yearMonth"))))

doc = f"""# GA4 pull, 6 September 2026 (property {PROP}, REST endpoint, service account)

*Pulled by ESC Claude with `scratchpad/ga4_snapshot.py` over the REST endpoint because the ga4 connector fails on this machine (Norton TLS interception, see the bridge note). Date range 1 January 2026 to {TODAY} unless stated. GA4 only counts visitors who accepted analytics cookies, so every figure is a floor. Per-camp event parameters are recorded as custom dimensions from March 2026; earlier booking clicks appear as "(not set)".*

""" + "\n".join(sections)
io.open(OUT, "w", encoding="utf-8", newline="\n").write(doc)
print("written", OUT, "| sections:", len(sections), "| chars:", len(doc))
