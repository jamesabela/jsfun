# Database design worksheet

Design a two-table database for a workshop event. Each attendee chooses exactly one workshop.

WORKSHOP must store an ID, title, date, time, capacity and fee. ATTENDEE must store an ID, name and chosen workshop. Supply data types, keys and at least three checks. Add three workshops and four attendees. At least two attendees must choose the same workshop. Show joined attendee names and workshop titles. Explain why capacity is unsuitable as a primary key.

## Model answer

WORKSHOP fields: WorkshopID text primary key; Title text; EventDate date; StartTime time; Capacity integer; Fee currency. ATTENDEE fields: AttendeeID text primary key; AttendeeName text; WorkshopID text foreign key referencing WORKSHOP.WorkshopID. Require IDs and names, unique primary keys, positive capacity, non-negative fee and existing referenced workshops.

| WorkshopID | Title | EventDate | StartTime | Capacity | Fee |
|---|---|---|---|---|---|
| W01 | Coding | 2029-05-12 | 10:00 | 20 | 5.00 |
| W02 | Art | 2029-05-12 | 11:00 | 15 | 8.00 |
| W03 | Music | 2029-05-13 | 10:00 | 20 | 6.50 |

| AttendeeID | AttendeeName | WorkshopID |
|---|---|---|
| A01 | Aisha | W01 |
| A02 | Ben | W02 |
| A03 | Chen | W01 |
| A04 | Dina | W03 |

Joined results: Aisha/Coding, Ben/Art, Chen/Coding, Dina/Music. Capacity is not unique: W01 and W03 both allow 20 people. A workshop title or fee is updated in its own table once; attendees keep their links through the ID. This design assumes one choice per attendee.
