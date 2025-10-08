#!/usr/bin/env python3
"""
generate_study_schedule.py

Creates:
 - study_schedule.ics            # events for next 40 days (Mon-Sat only)
 - study_schedule_cancel.ics     # CANCEL file that cancels same events (import to delete)

Timezone: Africa/Accra (default). Adjust TZ_NAME if needed.
UID scheme: study-YYYYMMDD-<morning|evening>-setmyday@example.org
This deterministic UID lets you update/cancel events by reusing the same UID.
"""

from datetime import datetime, date, time, timedelta
from zoneinfo import ZoneInfo
import uuid

# === USER SETTINGS (edit as needed) ===
TZ_NAME = "Africa/Accra"   # user's timezone
DAYS_AHEAD = 40            # create schedule from today, for this many days forward (inclusive)
MORNING_START = time(5, 0)
MORNING_END   = time(7, 0)
EVENING_START = time(19, 0)
EVENING_END   = time(22, 0)
REMINDER_MINUTES = 15      # minutes before event for VALARM
OUTPUT_ICS = "study_schedule.ics"
OUTPUT_CANCEL_ICS = "study_schedule_cancel.ics"
ORGANIZER_EMAIL = "setmyday@example.org"  # appears in ICS metadata; change if you like
CALENDAR_NAME = "SetMyDay — Study Timetable"
# === End settings ===

tz = ZoneInfo(TZ_NAME)

def dt_to_ics(dt: datetime) -> str:
    """Return ICS datetime string in local TZ with Z-less format and TZID param handled in VEVENT."""
    # We'll use local times and include TZID in DTSTART/DTEND lines, so no trailing Z.
    return dt.strftime("%Y%m%dT%H%M%S")

def make_event(uid: str, summary: str, dtstart: datetime, dtend: datetime, description: str, sequence: int = 0):
    """Return VEVENT string for a single event (with two display VALARMs)."""
    dtstart_s = dt_to_ics(dtstart)
    dtend_s = dt_to_ics(dtend)
    # Use DESCRIPTION and X-ALT-DESC for compatibility
    vevent = []
    vevent.append("BEGIN:VEVENT")
    vevent.append(f"UID:{uid}")
    vevent.append(f"SEQUENCE:{sequence}")
    vevent.append("STATUS:CONFIRMED")
    vevent.append(f"DTSTAMP:{dt_to_ics(datetime.now(tz))}")
    vevent.append(f"DTSTART;TZID={TZ_NAME}:{dtstart_s}")
    vevent.append(f"DTEND;TZID={TZ_NAME}:{dtend_s}")
    vevent.append(f"SUMMARY:{summary}")
    # Make description include the UID and calendar name to help identify/manage events.
    vevent.append("TRANSP:OPAQUE")
    vevent.append(f"DESCRIPTION:{description}")
    vevent.append(f"X-ALT-DESC;FMTTYPE=text/html:<b>{summary}</b><br/>{description}")
    vevent.append(f"ORGANIZER:MAILTO:{ORGANIZER_EMAIL}")
    # Two simple reminders: 30 and 5 minutes (you can edit below if you want only one)
    # Using a single reminder as requested; uses REMINDER_MINUTES setting
    vevent.append("BEGIN:VALARM")
    vevent.append("ACTION:DISPLAY")
    vevent.append(f"DESCRIPTION:Reminder - {summary}")
    vevent.append(f"TRIGGER:-PT{REMINDER_MINUTES}M")
    vevent.append("END:VALARM")
    vevent.append("END:VEVENT")
    return "\n".join(vevent)

def make_cancel_event(uid: str, summary: str):
    """Return VEVENT string marked as CANCELLED (minimal fields)."""
    vevent = []
    vevent.append("BEGIN:VEVENT")
    vevent.append(f"UID:{uid}")
    vevent.append("SEQUENCE:1")
    vevent.append("STATUS:CANCELLED")
    vevent.append(f"DTSTAMP:{dt_to_ics(datetime.now(tz))}")
    vevent.append(f"SUMMARY:{summary}")
    vevent.append("END:VEVENT")
    return "\n".join(vevent)

def generate_schedule():
    start_dt = datetime.now(tz)
    start_date = start_dt.date()
    end_date = start_date + timedelta(days=DAYS_AHEAD - 1)  # inclusive range of DAYS_AHEAD days
    # We'll build events only for weekdays Mon-Sat (0..5), skip Sundays (6)
    # First 7 scheduled study-days (Mon-Sat only) are labeled as "Generative AI course"
    scheduled_days_counter = 0
    lines = []
    # Calendar header
    lines.append("BEGIN:VCALENDAR")
    lines.append("PRODID:-//SetMyDay//Study Schedule//EN")
    lines.append("VERSION:2.0")
    lines.append("CALSCALE:GREGORIAN")
    lines.append(f"X-WR-CALNAME:{CALENDAR_NAME}")
    lines.append("METHOD:PUBLISH")
    # iterate dates
    d = start_date
    while d <= end_date:
        weekday = d.weekday()  # Mon=0 ... Sun=6
        if weekday == 6:
            # skip Sunday entirely
            d = d + timedelta(days=1)
            continue
        # This date is a scheduled study-day
        scheduled_days_counter += 1
        # Decide summary for first 7 scheduled days
        if scheduled_days_counter <= 7:
            label = "Generative AI course"
        else:
            label = "Study Session"
        # Create morning event
        morning_start_dt = datetime.combine(d, MORNING_START, tzinfo=tz)
        morning_end_dt   = datetime.combine(d, MORNING_END, tzinfo=tz)
        uid_morning = f"study-{d.strftime('%Y%m%d')}-morning-setmyday@example.org"
        summary_m = f"{label} — Morning Session"
        description = f"{summary_m}\\nUID:{uid_morning}\\nCalendar:{CALENDAR_NAME}"
        lines.append(make_event(uid_morning, summary_m, morning_start_dt, morning_end_dt, description))
        # Create evening event
        evening_start_dt = datetime.combine(d, EVENING_START, tzinfo=tz)
        evening_end_dt   = datetime.combine(d, EVENING_END, tzinfo=tz)
        uid_evening = f"study-{d.strftime('%Y%m%d')}-evening-setmyday@example.org"
        summary_e = f"{label} — Evening Session"
        description = f"{summary_e}\\nUID:{uid_evening}\\nCalendar:{CALENDAR_NAME}"
        lines.append(make_event(uid_evening, summary_e, evening_start_dt, evening_end_dt, description))
        # next day
        d = d + timedelta(days=1)
    lines.append("END:VCALENDAR")
    ics_text = "\n".join(lines)
    with open(OUTPUT_ICS, "w", encoding="utf-8") as f:
        f.write(ics_text)
    print(f"Wrote {OUTPUT_ICS} with {scheduled_days_counter*2} events (morning+evening each scheduled study-day).")
    return OUTPUT_ICS

def generate_cancel_file():
    """Generate an ICS file containing CANCELLED VEVENTs for the same date range and UIDs.
       Import this file to cancel the events previously created (UIDs match).
    """
    start_dt = datetime.now(tz)
    start_date = start_dt.date()
    end_date = start_date + timedelta(days=DAYS_AHEAD - 1)
    scheduled_days_counter = 0
    lines = []
    lines.append("BEGIN:VCALENDAR")
    lines.append("PRODID:-//SetMyDay//Study Schedule Cancel//EN")
    lines.append("VERSION:2.0")
    lines.append("CALSCALE:GREGORIAN")
    lines.append(f"X-WR-CALNAME:{CALENDAR_NAME} (CANCELLATIONS)")
    lines.append("METHOD:CANCEL")
    d = start_date
    while d <= end_date:
        if d.weekday() == 6:
            d = d + timedelta(days=1)
            continue
        scheduled_days_counter += 1
        uid_morning = f"study-{d.strftime('%Y%m%d')}-morning-setmyday@example.org"
        uid_evening = f"study-{d.strftime('%Y%m%d')}-evening-setmyday@example.org"
        summary_m = "Study Session — Morning"
        summary_e = "Study Session — Evening"
        lines.append(make_cancel_event(uid_morning, summary_m))
        lines.append(make_cancel_event(uid_evening, summary_e))
        d = d + timedelta(days=1)
    lines.append("END:VCALENDAR")
    ics_text = "\n".join(lines)
    with open(OUTPUT_CANCEL_ICS, "w", encoding="utf-8") as f:
        f.write(ics_text)
    print(f"Wrote {OUTPUT_CANCEL_ICS} with {scheduled_days_counter*2} CANCEL events.")
    return OUTPUT_CANCEL_ICS

if __name__ == "__main__":
    print("Generating study schedule ICS...")
    generate_schedule()
    print("Also generating CANCEL ICS (to clear events if needed)...")
    generate_cancel_file()
    print("Done. Import the .ics file(s) into Google Calendar or other calendar apps.")
    print("Tips:")
    print(" - To update an event, create a new .ics using the same UID but with changed times/summary and import (Google Calendar will often create a new event unless it recognizes same UID; many calendar backends honor UID).")
    print(" - To remove events, import the cancel file (study_schedule_cancel.ics).")

