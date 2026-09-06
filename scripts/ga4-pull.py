#!/usr/bin/env python
"""GA4 booking-click pull over the REST endpoint (property 521172443).

Why this exists: the `ga4` MCP server dials an IPv6 address that this machine cannot reach.
The REST endpoint falls back to IPv4, so the same service account works here.

The service-account path is read from the ga4 MCP entry in ~/.claude.json; nothing secret is
printed or written. Certificates: truststore injects the Windows root store (corporate AV).

Usage:
  python scripts/ga4-pull.py                       # top camps by booking clicks, this year
  python scripts/ga4-pull.py --camp "Les Elfes"    # one camp by month
  python scripts/ga4-pull.py --start 2026-06-01 --end 2026-08-31
"""
from __future__ import annotations

import argparse
import datetime as dt
import io
import json
import os
import sys

PROPERTY = "521172443"
URL = f"https://analyticsdata.googleapis.com/v1beta/properties/{PROPERTY}:runReport"
SCOPE = "https://www.googleapis.com/auth/analytics.readonly"


def credentials_path() -> str:
    config = json.load(io.open(os.path.expanduser("~/.claude.json"), encoding="utf-8"))
    return config["mcpServers"]["ga4"]["env"]["GOOGLE_APPLICATION_CREDENTIALS"]


def access_token() -> str:
    from google.auth.transport.requests import Request
    from google.oauth2 import service_account

    creds = service_account.Credentials.from_service_account_file(credentials_path(), scopes=[SCOPE])
    creds.refresh(Request())
    return creds.token


def run_report(token: str, body: dict) -> dict:
    import requests

    response = requests.post(URL, headers={"Authorization": f"Bearer {token}"}, json=body, timeout=60)
    if response.status_code != 200:
        sys.exit(f"GA4 HTTP {response.status_code}: {response.text[:300]}")
    return response.json()


def booking_filter(camp: str | None) -> dict:
    event = {"filter": {"fieldName": "eventName", "stringFilter": {"value": "camp_booking_click"}}}
    if not camp:
        return event
    by_camp = {"filter": {"fieldName": "customEvent:camp_name",
                          "stringFilter": {"matchType": "CONTAINS", "value": camp}}}
    return {"andGroup": {"expressions": [event, by_camp]}}


def main() -> None:
    parser = argparse.ArgumentParser(description="GA4 booking clicks over REST")
    parser.add_argument("--start", default=f"{dt.date.today().year}-01-01")
    parser.add_argument("--end", default=dt.date.today().isoformat())
    parser.add_argument("--camp", help="substring of the camp name; switches to a by-month view")
    parser.add_argument("--limit", type=int, default=15)
    args = parser.parse_args()

    try:
        import truststore

        truststore.inject_into_ssl()
    except ImportError:
        pass

    token = access_token()
    date_range = [{"startDate": args.start, "endDate": args.end}]
    dimension = "yearMonth" if args.camp else "customEvent:camp_name"
    order = ({"dimension": {"dimensionName": "yearMonth"}} if args.camp
             else {"metric": {"metricName": "eventCount"}, "desc": True})
    report = run_report(token, {
        "dateRanges": date_range,
        "dimensions": [{"name": dimension}],
        "metrics": [{"name": "eventCount"}],
        "dimensionFilter": booking_filter(args.camp),
        "orderBys": [order],
        "limit": args.limit,
    })

    label = f"booking clicks for '{args.camp}' by month" if args.camp else "booking clicks by camp"
    print(f"{label}, {args.start} to {args.end} (per-camp names recorded from March 2026):")
    for row in report.get("rows", []):
        print(f"  {row['dimensionValues'][0]['value']:<40} {row['metricValues'][0]['value']:>6}")
    if not args.camp:
        print(f"  rows: {report.get('rowCount', 0)}")


if __name__ == "__main__":
    main()
