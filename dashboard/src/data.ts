/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SlideData } from './types';

export const slidesData: SlideData[] = [
  {
    id: 7,
    kicker: "THE INSTRUMENT",
    title: "ONE GRID, TWO READINGS",
    subtitle: "a score for how peri-urban, an ecology for what kind",
    layout: "one-grid-two-readings",
    bodyText: [
      "Each cell contains two values. The first is its Peri-Urban Score—a composite of five morphological and spatial dimensions. The second is its Ecology—the active material-thermal behavior of the cell. Under the hood, these values come from 8,625 field observations across Lecce."
    ],
    notes: "Here we open Act II of our empirical analysis. We need to move from broad definitions to precise, quantifiable measures. We have 8,625 individual grid cells, each functioning as a one-hectare micro-observatory. This interactive interface shows how we balance five critical spatial metrics to construct our Peri-Urban composite score—from high-mass stone wall densities to vegetation coverage. By adjusting these weights or clicking on the ecological presets, we can observe where different parts of the Lecce territory sit on the Buffer-Capacity Ladder, and see how our four key ecologies group within the broader data cloud."
  },
  {
    id: 10,
    kicker: "THE FINDING",
    title: "STONE AND FIRE TRADE PLACES",
    subtitle: "the sign of the gap reverses, every year",
    layout: "stone-fire-trade",
    bodyText: [
      "In spring, the textbook holds: open ground is cool, the fraying fringe is hot. In summer it inverts — the open karst becomes the hottest surface in the grid, the built fringe the coolest. The reversal holds in all four years of the record (2015, 2018, 2021, 2025)."
    ],
    metric: {
      value: "+1.6 °C",
      label: "Summer Land Surface Temperature Gap",
      caption: "Stone LST (46.79 °C) minus Fire LST (45.24 °C)"
    },
    notes: "Our core climatological climax: the seasonal inversion where Stone and Fire trade places. In Spring, the thermal gap is negative (-2.0 °C), meaning the Stone is cooler. But under Summer's extreme solar radiation, Stone's bare, dry karst surfaces behave as severe thermal batteries, rising to 46.79 °C while Fire remains at 45.24 °C—a positive gap of +1.6 °C. This microclimatic inversion is highly stable and robust, replicating consistently across all four years in our satellite record (2015, 2018, 2021, 2025)."
  },
  {
    id: 15,
    kicker: "THE TRANSECT, MEASURED",
    title: "FOUR KILOMETRES, TEN YEARS",
    subtitle: "",
    layout: "four-kilometres",
    bodyText: [
      "Eighty-two points, fifty metres apart, from the historic core (0m) to the open countryside (4,050m)."
    ],
    notes: "We now transition to Slide 15: Four Kilometres, Ten Years. Here, we present a high-resolution comparative analysis of 82 points spaced exactly 50 meters apart along our design transect, measured in 2015 and 2025 across multiple seasons and metrics. Over this ten-year interval, we can track microclimatic and ecological trends in great detail. Most notably, we see that the core-to-rural temperature gap in summer has actually narrowed, shrinking from 6.9 degrees in 2015 to 4.7 degrees in 2025. This dynamic chart allows the presenter to toggle between spring, summer, and winter seasons and explore four key indicators—Land Surface Temperature, vegetative cover via NDVI, moisture levels through NDMI, and soil mineral expression with BSI. Hovering over the lines reveals the specific CORINE land cover and high-precision Urban Atlas descriptions for each point, allowing for an incredibly deep localized reading of Lecce's transition zones."
  },
  {
    id: 16,
    kicker: "TERRITORY SCALE",
    title: "GRID-WIDE THERMAL TRAJECTORY",
    subtitle: "",
    layout: "grid-wide-dashboard",
    bodyText: [
      "Analysis of 8,625 one-hectare grid cells spanning the entire Lecce territory."
    ],
    notes: "Slide 16: Grid-Wide Thermal Trajectory. Evaluates all 8,625 cells across 2015, 2018, 2021, and 2025."
  }
];
