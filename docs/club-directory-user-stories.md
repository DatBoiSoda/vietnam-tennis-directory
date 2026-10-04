# Vietnam Tennis Directory — User Stories & Data Plan

## 1. Product overview

Vietnam Tennis Directory is a public, mobile-friendly directory that helps players find active tennis clubs and communities across Vietnam. The first launch focuses on Vietnam, with clubs discoverable by location, playing level, and whether they are welcoming new members.

The website is powered by a moderated Google Sheet. A **Submit a Club** button sends organisers to a Google Form; submissions are reviewed before they appear publicly.

## 2. Primary users

| User | Need | Outcome |
| --- | --- | --- |
| Player looking for a club | Find a suitable group nearby | Can contact a relevant club quickly |
| Newcomer to a city | Understand the local tennis options | Finds clubs by city, district, level, and language |
| Club organiser | Publicise a club and recruit the right players | Submits an accurate listing for review |
| Directory administrator | Keep listings safe, useful, and current | Reviews, publishes, updates, or removes entries |

## 3. Core user journey — find a club

### User story

**As a tennis player in Vietnam, I want to search and filter clubs by where I am and what I need, so that I can find a club that is convenient and appropriate for my level.**

### Entry points

- The visitor lands on the Home page.
- The visitor opens the Clubs page from the navigation.
- The visitor follows a shared link to a specific club or a pre-filtered result.

### Home page

The Home page gives a simple introduction: “Find tennis clubs across Vietnam — by district, level, and recruiting status.” It includes:

- A prominent search field for club name, city/province, district, or venue.
- A call to action to browse clubs.
- Three live summary cards: total clubs, clubs recruiting, and provinces/cities covered.
- A visible **Submit a Club** button in the header and/or hero.

### Search and filters

On the Clubs page, the visitor can combine filters:

| Filter | Behaviour |
| --- | --- |
| Search | Matches club name, description, city/province, district, venue, and address |
| Province / city | Shows clubs in the selected province or centrally governed city |
| District | Narrows results to a selected district; options update for the chosen province/city |
| Recruiting status | Filters to Open, Seeking players, Waitlist, or Not currently recruiting |
| Playing level | Filters to clubs that welcome the selected level |
| Optional future filters | Playing days/times, language, club type, and cost |

Results update immediately and show the applied filters. The visitor can clear an individual filter or reset all filters.

### Club result card

Each result shows enough information for a quick decision:

- Club name and a short description
- City/province and district
- Venue name or address
- Recruiting status
- Welcomed levels
- Typical schedule
- Starting cost, if supplied
- A clear **View details** action

### Club details

**As a player, I want to see a club’s practical information and a safe way to contact it, so that I can decide whether to join or ask a question.**

The club details view displays the full public listing, Google Maps link, playing schedule, cost information, levels, recruitment status, languages, and approved public contact options. The visitor can return to the exact filtered list they came from.

### Empty, incomplete, and error states

- If no clubs match, explain that there are no results and offer **Clear filters**.
- If a listing has no cost or schedule, show “Contact club for details,” not a blank field.
- If the directory cannot load, show a plain retry message and retain filters where possible.
- Never show private submitter or moderator information to visitors.

## 4. Core user journey — submit a club

### User story

**As a club organiser, I want to submit my club through a simple form, so that players can discover it without my having to manage a separate website.**

### Flow

1. The organiser selects **Submit a Club**.
2. The website opens the linked Google Form in a new tab.
3. The organiser provides the club’s public information, their verification details, and publication consent.
4. Google Forms writes the response into its linked Google Sheet.
5. The website confirms that submissions are reviewed before publishing; it does not promise immediate publication.
6. An administrator reviews the entry, follows up if necessary, and publishes only approved listings.

### Acceptance criteria

- The button always points to the current Google Form URL.
- The form identifies required questions clearly.
- A successful form submission is stored in the private form-response sheet.
- Unreviewed, rejected, and private responses never appear on the public website.
- The public directory uses only the approved/published data tab.

## 5. Core user journey — administer listings

### User story

**As a directory administrator, I want to review and maintain submitted clubs in one place, so that the public directory stays accurate and trustworthy.**

### Moderation flow

1. Review a new Google Form response for completeness, duplicate listings, location accuracy, and contact method.
2. Verify the organiser when needed using their private email or phone.
3. Copy or approve the cleaned public fields in an **Approved clubs** Google Sheet tab.
4. Set `moderation_status` to `Approved` and `public_listing_status` to `Published`.
5. Publish or export only that approved tab for the website to read.
6. Recheck listings periodically; hide stale entries rather than deleting the audit record.

## 6. Information architecture and MVP pages

| Page | Purpose | Primary actions |
| --- | --- | --- |
| Home | Explain the directory and begin discovery | Search, browse clubs, submit a club |
| Clubs | Searchable/filterable directory | Filter, clear filters, open a club |
| Club details | Help a player make contact | Open map, contact club, return to results |
| Submit a Club | Handoff to Google Form | Open form |
| About / FAQ (optional MVP) | Explain coverage, moderation, and updates | Submit a club, browse clubs |

## 7. Data needed for each club

An asterisk (`*`) means the information should be required for a public listing unless noted otherwise.

### Identity and description

| Field | Required | Notes |
| --- | --- | --- |
| Club name | Yes | The name players know the club by |
| Club type | Yes | Tennis club, social group, academy, university, company, other |
| Short description | Yes | What the group is like; 1–3 short sentences |
| Club photo / logo | No | Optional; only with permission to publish |

### Location

| Field | Required | Notes |
| --- | --- | --- |
| Province / city | Yes | Controlled list of Vietnam provinces and centrally governed cities |
| District | Yes | Include quận / huyện / city within province as appropriate |
| Ward / phường / xã | No | Helpful for large districts |
| Primary venue name | Yes | Court, club, school, etc. |
| Address / venue details | Yes | Street address or a clear meeting-point description |
| Google Maps link | Strongly recommended | Use URL validation; enables map action and location checking |
| Latitude / longitude | No | Admin-generated future field for map search |

### Playing and membership

| Field | Required | Notes |
| --- | --- | --- |
| Recruiting status | Yes | Open; Seeking players; Waitlist; Not currently recruiting |
| What the club is seeking | No | Members, players to fill sessions, opponents, event participants, coaches |
| Welcomed playing levels | Yes | Beginner, lower intermediate, intermediate, advanced, competitive; allow multiple |
| Typical playing days | Yes | Select all that apply |
| Typical time | Yes | Morning, daytime, evening; optional free-text detail such as “Tue/Thu 19:00” |
| Languages used | Yes | Vietnamese, English, both, other |
| Membership fee / typical cost (₫) | No | Clarify period: per session, monthly, court split, or free |
| Court surface / indoor-outdoor | No | Useful later for more specific discovery |

### Public contact

| Field | Required | Notes |
| --- | --- | --- |
| Preferred contact method | Yes | Zalo, Facebook, Instagram, email, website, phone |
| Public contact link or handle | Yes | A link, handle, or public contact number; validate URLs where relevant |
| Contact name | No | Publish only with the person’s consent |
| Contact phone | No | Publish only if the person explicitly agrees; use Vietnam country code format when possible |
| Contact email | No | Publish only if the person explicitly agrees |

### Verification, consent, and operations — private only

| Field | Required | Notes |
| --- | --- | --- |
| Submitted by | Yes | Not public by default |
| Submitter role | Yes | Host, leader, coach, organiser, member |
| Private email for verification | Yes | Email validation; never displayed on the website |
| Private phone for verification | No | Never displayed without explicit consent |
| Permission to publish | Yes | Required checkbox |
| Confirmation that information is accurate | Yes | Required checkbox |
| Submission date | Automatic | Google Forms timestamp |
| Last verified date | Admin-managed | Lets the directory identify stale listings |
| Moderation status | Admin-managed | Pending, needs clarification, approved, rejected, archived |
| Public listing status | Admin-managed | Draft, published, hidden |
| Internal notes | Admin-managed | Never public |

## 8. Recommended Google Sheet structure

Use two separate tabs to avoid exposing private details.

| Tab | Purpose | Website access |
| --- | --- | --- |
| `Form Responses 1` | Automatic raw Google Form submissions, including private verification fields | Never public |
| `Approved clubs` | Cleaned public listing fields plus admin status fields | Only this tab feeds the website |

Suggested website-publishing rule: include a row only when `moderation_status = Approved` **and** `public_listing_status = Published`.

## 9. Launch scope and future ideas

### Vietnam MVP

- Vietnam-only location model (province/city → district → address/venue)
- Search by name and location
- Filters for province/city, district, recruiting status, and level
- Moderated Google Form submissions and a Google Sheet source of truth
- Public contact links, rather than requiring user accounts or in-site messaging

### Later

- Interactive map and “near me” search
- Saved clubs and alerts when a club begins recruiting
- Club claiming and organiser editing
- Community reviews or activity verification, with moderation safeguards
- Multi-language interface (Vietnamese and English)
- Expansion to other countries without changing the core listing model

## 10. Open decisions before build

1. What is the final public Google Form URL for **Submit a Club**?
2. Will the directory read a published CSV from the `Approved clubs` tab, or use a secure Google Sheets/API integration?
3. Which public contact methods are acceptable—especially phone numbers and personal emails?
4. Should “membership fee” mean a monthly fee, a per-session cost, or both as separate fields?
5. What counts as an active club, and how often should organisers reconfirm their listing?
6. Should club detail pages have shareable URLs from the first release?
