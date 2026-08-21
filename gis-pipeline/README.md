# RUTZ GIS Pipeline

This folder documents the ArcGIS Pro geoprocessing pipeline behind the RUTZ Index — the
Model Builder architecture, the arcpy expressions used to derive thermal and spectral
indices, and the classification logic that produces the peri-urban gradient and
dominant-ecology typology.

**Status:** placeholder — to be populated with:

- Model Builder diagram exports (`M_Master` and sub-models)
- `.atbx` toolbox file(s)
- arcpy scripts (LST/spectral index expressions, field-rename script, Zonal Statistics
  batch logic)
- A short write-up of the two-fishnet architecture (`FISHNET_Master_Profile` /
  `FISHNET_Thermal_TimeSeries`) and the Landsat sensor manifest

Full source geodatabases, the raw 8,625-cell fishnets, and the 12 Landsat scenes are not
hosted here — they're large binary/raster data best kept in Google Drive. This folder is
the readable, reviewable logic layer: what the pipeline does and why, not the multi-GB
data it operates on.
