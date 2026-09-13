"""GA4 pull of sessions and booking clicks by AI referrer, by month (property 521172443).

Reuses the credential path of scripts/ga4-pull.py (truststore + service account). Prints a month
by source table for the AI answer engines and, for comparison, google and bing organic.

Usage:
  python scripts/ga4-ai-referrers.py                      # this year to date
  python scripts/ga4-ai-referrers.py --start 2026-01-01 --end 2026-09-13
"""
import argparse
import datetime as dt
import sys

sys.path.insert(0, __file__.rsplit("\\", 1)[0].rsplit("/", 1)[0])
try:
    import truststore
    truststore.inject_into_ssl()
except ImportError:
    pass

from importlib import import_module

ga4 = import_module("ga4-pull")

AI_SOURCES = ["chatgpt.com", "chat.openai.com", "perplexity.ai", "copilot.microsoft.com", "gemini.google.com",
              "claude.ai", "bing", "google", "duckduckgo.com", "ecosia.org"]


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--start", default=f"{dt.date.today().year}-01-01")
    parser.add_argument("--end", default=dt.date.today().isoformat())
    args = parser.parse_args()
    token = ga4.access_token()
    body = {
        "dateRanges": [{"startDate": args.start, "endDate": args.end}],
        "dimensions": [{"name": "yearMonth"}, {"name": "sessionSource"}],
        "metrics": [{"name": "sessions"}, {"name": "eventCount"}],
        "dimensionFilter": {"orGroup": {"expressions": [
            {"filter": {"fieldName": "sessionSource", "stringFilter": {"matchType": "CONTAINS", "value": s, "caseSensitive": False}}}
            for s in AI_SOURCES]}},
        "limit": 500,
    }
    data = ga4.run_report(token, body)
    rows = data.get("rows", [])
    table = {}
    for r in rows:
        ym, src = r["dimensionValues"][0]["value"], r["dimensionValues"][1]["value"]
        sessions = int(r["metricValues"][0]["value"])
        table.setdefault(src, {})[ym] = sessions
    months = sorted({ym for v in table.values() for ym in v})
    print("sessions by source and month (" + args.start + " to " + args.end + ")")
    print("source".ljust(26) + "".join(m.rjust(8) for m in months) + "   total")
    for src, v in sorted(table.items(), key=lambda kv: -sum(kv[1].values())):
        total = sum(v.values())
        print(src[:25].ljust(26) + "".join(str(v.get(m, 0)).rjust(8) for m in months) + str(total).rjust(8))
    # booking clicks by AI source
    body2 = {
        "dateRanges": [{"startDate": args.start, "endDate": args.end}],
        "dimensions": [{"name": "sessionSource"}],
        "metrics": [{"name": "eventCount"}],
        "dimensionFilter": {"andGroup": {"expressions": [
            {"filter": {"fieldName": "eventName", "stringFilter": {"value": "camp_booking_click"}}},
            {"orGroup": {"expressions": [
                {"filter": {"fieldName": "sessionSource", "stringFilter": {"matchType": "CONTAINS", "value": s, "caseSensitive": False}}}
                for s in AI_SOURCES]}}]}},
        "limit": 100,
    }
    data2 = ga4.run_report(token, body2)
    print("\nbooking clicks (camp_booking_click) by source, same period")
    for r in sorted(data2.get("rows", []), key=lambda r: -int(r["metricValues"][0]["value"])):
        print(r["dimensionValues"][0]["value"][:25].ljust(26) + r["metricValues"][0]["value"].rjust(8))


if __name__ == "__main__":
    main()
