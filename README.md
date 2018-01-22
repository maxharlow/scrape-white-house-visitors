Scrape White House visitors
===========================

Politico has been publishing [a crowdsourced set of White House visitor logs](https://www.politico.com/interactives/databases/trump-white-house-visitor-logs-and-records) for the Trump administration. This includes in-person meetings with the president at Mar-a-Lago and other venues, appearances at events and documented phone calls with foreign leaders and other politicians. Some events, such as the White House Easter egg roll, inauguration and others are not included because interactions with the president were superficial. Does not include Trump's meetings with White House aides, meetings held by Vice President Mike Pence, or other administration officials. Trump family members are also not included. The logs are limited by access to full guest lists as well as incomplete knowledge. The race of individuals is determined according to definitions used by the US Census Bureau, except in the case of Hispanics, who are treated as a separate racial group for the purposes of this database.

This scrapes all the available logs into a CSV file.

Requires [Node](https://nodejs.org/).

Install the dependencies with `npm install`, then run `node white-house-visitors`. Produces a file named `white-house-visitors.csv`.
