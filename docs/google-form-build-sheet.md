# Tennis Vietnam — Google Form setup

Create a Google Form titled **List your tennis club or community**. Link its Responses tab to a new spreadsheet named **Tennis Vietnam — club submissions**.

## Form questions

Make the questions marked **Required** mandatory.

1. **Club or community name** — short answer — Required
2. **Club type** — multiple choice: Tennis club; Social group; Academy; University group; Company group; Other — Required
3. **Short description** — paragraph — Required
4. **City / province** — dropdown — Required
5. **District / quận / huyện / city within province** — short answer — Required
6. **Ward / phường / xã** — short answer — Optional
7. **Primary venue name** — short answer — Required
8. **Street address** — short answer — Required
9. **Google Maps link** — short answer with URL validation — Required
10. **Are you accepting new members?** — multiple choice: Open; Seeking players; Waitlist; Not currently — Required
11. **What are you seeking?** — checkboxes: Regular members; Players to fill sessions; Opponents; Event participants; Coaches
12. **Welcomed playing levels** — checkboxes: Beginner; Lower intermediate; Intermediate; Advanced; Competitive — Required
13. **Typical playing days** — checkboxes: Mon; Tue; Wed; Thu; Fri; Sat; Sun — Required
14. **Typical time** — checkboxes: Morning; Daytime; Evening — Required
15. **Languages used** — checkboxes: Vietnamese; English; Both; Other — Required
16. **Typical cost per player** — short answer — Optional
17. **How should players contact the club?** — multiple choice: Zalo; Facebook; Instagram; Email; Website; Phone — Required
18. **Public contact link or handle** — short answer — Required
19. **Submitted by** — short answer — Required
20. **Your role** — multiple choice: Host; Leader; Coach; Organizer; Member — Required
21. **Private email for verification** — short answer with email validation — Required
22. **I confirm I may publish the information above** — required checkbox
23. **I confirm this listing is accurate** — required checkbox

## Spreadsheet tabs

Keep the automatic **Form Responses 1** tab untouched. Create a separate **Approved clubs** tab by importing `approved-clubs-template.csv` from this folder. Only rows with `moderation_status = Approved` and `public_listing_status = Published` should be copied into the site’s public data.

Moderation routine:

1. Check the location, club contact link, and obvious duplicates.
2. Contact the submitter if needed.
3. Copy approved information into **Approved clubs** and set the public status to Published.
4. Recheck every 3–6 months; hide stale listings instead of deleting their audit record.

## Website connection

This starter loads `dist/clubs.csv`. Once you have an approved Google Sheet, publish only the **Approved clubs** tab as a CSV, download/export that CSV, and replace `dist/clubs.csv` before publishing the website. This deliberate one-way publish step prevents private submitter details and unmoderated responses from becoming public.
