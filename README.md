# Singapore Rental Price Visualisations
This is a simple data collector and visualiser for Singapore rental price data. The `propertyData.json` file in this repo contains data collected on Dec 29th 2020. I'm new to Singapore and am going to rent a place soon, so I was playing around with public rental data as part of my decision process. Figured that I might as well throw the data into a Leaflet map and make it public.

You can click markers to go to their listings, but if you're visiting this page after (perhaps) Jan 2021 you'll probably want to run `collectData.js` again (see below for instructions) to get fresh listings.

## Demo

* https://josephrocca.github.io/singapore-rental-price-visualisations/#price_(full_apartments)
* https://josephrocca.github.io/singapore-rental-price-visualisations/#price_per_square_foot_(full_apartments)
* https://josephrocca.github.io/singapore-rental-price-visualisations/#price_(rooms_only)
* https://josephrocca.github.io/singapore-rental-price-visualisations/#building's_year_of_construction

<p align="center">
  <img src="https://github.com/josephrocca/singapore-rental-price-visualisations/blob/main/ui_usage.gif?raw=true" alt="visualisation user interface"/>
</p>

## Data Collection

If you'd like to collect your own data:

1. open up propertyguru.com.sg in your browser
2. open browser console (usually F12)
3. paste the contents of `collectData.js` into the console
4. press enter to run the code

You should see something like this (but much slower):

<p align="center">
  <img src="https://github.com/josephrocca/singapore-rental-price-visualisations/blob/main/property_data_collection_viz.gif?raw=true" alt="property guru data collection process"/>
</p>

It is collecting the data for each of those square regions. Once it has finished, it'll log the JSON. You can then copy it and paste it into `propertyData.json`, replacing the existing data.

If you're reading this some time after early 2021, it's likely that you'll need to update the selectors in `collectData.js` to match any UI changes that Property Guru have made.
