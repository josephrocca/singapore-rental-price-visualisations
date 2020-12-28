# Singapore Rental Price Visualisations
Singapore rental price visualisations based on public data pulled from Property Guru.

## Demo

* https://josephrocca.github.io/singapore-rental-price-visualisations/#price_(full_apartments)
* https://josephrocca.github.io/singapore-rental-price-visualisations/#price_per_square_foot_(full_apartments)
* https://josephrocca.github.io/singapore-rental-price-visualisations/#price_(rooms_only)
* https://josephrocca.github.io/singapore-rental-price-visualisations/#building's_year_of_construction

## Data Collection

If you'd like to collect your own data, open up propertyguru.com.sg, and paste the contents of `collectData.js` into your browser's console, and run it. You should see something like this (but much slower):

![property guru data collection process](https://github.com/josephrocca/singapore-rental-price-visualisations/blob/main/property_data_collection_viz.gif?raw=true)

It is collecting the data for each of those square regions. Once it has finished, it'll `console.log` the JSON which you can then use to replace the contents of the `propertyData.json` file.

If you're reading this some time after early 2021, it's likely that you'll need to update the selectors in `collectData.js` to match any UI changes that Property Guru have made.
