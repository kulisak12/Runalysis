# Runalysis

This developer documentation covers all code used within the Runalysis app. The code takes care of necessary calculations as well as web page creation.

## Structure

**FileReading** accepts a file from the user and processes it based on the format.
- [FileLoader](https://kulisak12.github.io/Runalysis/devdoc/module-FileLoader.html) sets up a drag-and-drop area and calls the appropriate parser.
- [GpxParser](https://kulisak12.github.io/Runalysis/devdoc/module-GpxParser.html) parses the .gpx format.

**Modules** are the building blocks of the final page. Each module focused on a different part of activity analysis.
- [Generic](https://kulisak12.github.io/Runalysis/devdoc/module-Generic.html) allows toggling of module visibility.
- [Graphs](https://kulisak12.github.io/Runalysis/devdoc/module-Graphs.html) creates a module with graphs showing measured values.
- [Map](https://kulisak12.github.io/Runalysis/devdoc/module-Map.html) creates a module with activity map and summary.
- [Zones](https://kulisak12.github.io/Runalysis/devdoc/module-Zones.html) creates a module with instensity zones distribution.

**Processing** works with the activity data.
- [ActivityProcessing](https://kulisak12.github.io/Runalysis/devdoc/module-ActivityProcessing.html) calculates all necessary values within the activity.
- [DisplayShared](https://kulisak12.github.io/Runalysis/devdoc/module-DisplayShared.html) parses the shared link and displays the shared activity.
- [GenerateLink](https://kulisak12.github.io/Runalysis/devdoc/module-GenerateLink.html) redirects user to a page with the shared activity.

**Utility** provides conversion and lookup functions.
- [Formatting](https://kulisak12.github.io/Runalysis/devdoc/module-Formatting.html) formats values, converts between units and defines graph tickers.
- [Lookup](https://kulisak12.github.io/Runalysis/devdoc/module-Lookup.html) searches the run and calculates statistics.


## Installation

Upon downloading the [docs folder](https://github.com/kulisak12/Runalysis/tree/master/docs), you have everything you need. Open up `index.html` and you are ready to go.

## Libraries

The following libraries were used:
- [Dygraphs](http://dygraphs.com/)
- [DropzoneJS](https://www.dropzonejs.com/#)
- [noUiSlider](https://refreshless.com/nouislider/)
- [LZString](https://pieroxy.net/blog/pages/lz-string/index.html)
- [TinyColor](https://github.com/bgrins/TinyColor)
- [API Mapy.cz](https://api.mapy.cz/)
- [Font awesome](https://fontawesome.com)
- [JSDoc](https://jsdoc.app/)
- [better-docs](https://github.com/SoftwareBrothers/better-docs)

### Dygraphs

This library provides graphing functionality used in the graphs module. It gets a set of values created from the activity data and plots them according to custom settings. An extension for this library, *Synchronizer*, was used to keep the x-axis the same on all graphs.

### DropzoneJS

This library is used to create the drag-and-drop area for uploading files. It also takes care of most restrictions on what files can be uploaded.

### noUiSlider

This library adds a slider where multiple values can be selected. It is used when setting custom zones.

### API Mapy.cz

This API allows the insertion of maps into the website. It is supports displaying a gps recording on the map and highlighting of a certain point.

