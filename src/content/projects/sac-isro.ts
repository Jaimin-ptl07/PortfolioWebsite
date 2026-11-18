import type { Project } from "../types";

export const sacIsro: Project = {
  slug: "sac-isro-flood-inundation",
  title: "Ganga flood inundation prediction",
  shortTitle: "SAC-ISRO flood research",
  subtitle:
    "Research at the Space Applications Centre (ISRO) on mapping river discharge to pixel-level flood extent, with two methods that go beyond a 10-category lookup baseline.",
  category: "Geospatial research / scientific computing",
  status: "Research",
  organisation: "Space Applications Centre (SAC), ISRO",
  role: "Research intern",
  timeline: "May 2024 – May 2025",
  featured: false,
  order: 6,
  glyph: "sac",
  focus: ["backend"],
  card: {
    problem: "The baseline predicted flood extent from one of only 10 discharge categories.",
    solution: "Discharge-bracketed map interpolation and per-pixel linear regression, with evaluation tooling against Sentinel-1 SAR flood masks.",
    impact: "Initial evaluation: mean F1 0.723 → 0.794 for per-pixel regression, with methodology caveats stated.",
  },
  techSummary: ["Python", "NumPy", "Rasterio", "scikit-learn", "GeoTIFF", "Sentinel-1 SAR"],

  overview: [
    "Predicting how far a river floods for a given discharge is a mapping problem: a single number at a gauge station has to become a probability for every 10 m pixel along a river section. The existing baseline did this with a lookup. Discharge was placed into one of 10 categories, and each category had its own flood-probability map.",
    "Over a year-long research internship at SAC-ISRO, I developed two alternatives for five sections of the Ganga, and built the Python tooling to categorise discharge, generate predictions and evaluate them against satellite-observed floods.",
    "The initial results favour the new methods, but the comparison has methodology gaps (different thresholds, event years not fully held out). They are presented here as initial research results, not as definitive improvements.",
  ],

  problem: {
    context: [
      "With 10 categories, every discharge inside a category gets the same predicted flood map, whether it sits at the bottom or the top of its range. Across a discharge range of roughly 580–92,900 m³/s, that is a coarse step.",
    ],
    who: "Researchers working on flood-inundation mapping for the Ganga.",
    why: "Finer discharge-to-extent mapping could give more faithful flood-extent estimates for a given gauge reading.",
    previous: "A 10-category discharge-based lookup: classify discharge, return that category's flood-probability map.",
    functional: [
      "Categorise historical discharge records from five gauge stations.",
      "Predict pixel-level flood probability for a target discharge or water level.",
      "Evaluate predictions against Sentinel-1 SAR flood masks.",
    ],
    constraints: [
      "Rasters of up to about 43 million pixels at about 10 m resolution.",
      "Eleven years of daily gauge records (May 2013 to May 2024).",
    ],
  },

  contribution: {
    designed: [
      "Discharge-bracketed map interpolation.",
      "Per-pixel linear regression of flood probability on water level (LinearFit).",
    ],
    implemented: [
      "Python discharge-categorisation tooling (about 1,670 categorised 12-day windows).",
      "Prediction and evaluation tooling over large GeoTIFF rasters.",
      "45 method–section–event evaluations against SAR flood masks.",
    ],
    dependencies: [
      "The Google Earth Engine script that produced Sentinel-1 SAR flood masks was not my work.",
      "The category baseline and its flood-probability maps pre-existed.",
    ],
  },

  architecture: {
    intro: [
      "The workflow runs from gauge records to an evaluated flood map. Gauge records are categorised into discharge windows, which index flood-probability maps. The two methods produce a predicted extent, and that prediction is scored against an observed SAR flood mask.",
      "This is a conceptual pipeline diagram. No satellite imagery or model output is reproduced on this page.",
    ],
    diagram: {
      id: "sac-pipeline",
      title: "Research workflow",
      caption: "Conceptual pipeline. Both methods share the categorisation and evaluation stages and differ only in how they predict.",
      width: 1000,
      height: 380,
      conceptual: true,
      groups: [{ label: "Prediction methods", x: 440, y: 30, w: 205, h: 260 }],
      nodes: [
        { id: "gauge", label: "Gauge records", sub: "5 stations, 2013–2024", x: 15, y: 140, w: 165, kind: "source", step: 1, detail: "Daily discharge and water-level records from five gauge stations, May 2013 to May 2024." },
        { id: "cat", label: "Discharge categories", sub: "≈1,670 windows", x: 225, y: 140, w: 170, kind: "process", step: 2, detail: "About 1,670 12-day discharge windows, categorised across a range of about 580–92,900 m³/s." },
        { id: "maps", label: "Probability maps", sub: "per category, ≈10 m", x: 225, y: 260, w: 170, kind: "store", detail: "Flood-probability rasters per discharge category, up to about 43 million pixels each." },
        { id: "interp", label: "Interpolation", sub: "bracketing maps", x: 460, y: 70, w: 165, kind: "process", step: 3, detail: "Blends the two category maps whose discharge ranges bracket the target discharge." },
        { id: "linear", label: "LinearFit", sub: "per-pixel regression", x: 460, y: 200, w: 165, kind: "model", step: 4, detail: "Fits a separate linear relationship between water level and flood probability at each pixel." },
        { id: "pred", label: "Predicted extent", sub: "GeoTIFF", x: 690, y: 140, w: 140, kind: "store", step: 5, detail: "A georeferenced predicted flood extent for a section and event." },
        { id: "sar", label: "Sentinel-1 SAR mask", sub: "observed flood", x: 690, y: 280, w: 140, kind: "source", detail: "Observed flood extent from Sentinel-1 SAR, used as the evaluation reference. The GEE processing script was not my work." },
        { id: "eval", label: "Evaluation", sub: "45 comparisons", x: 865, y: 140, w: 120, kind: "control", step: 6, detail: "Misclassification and F1 against the SAR mask: 45 method–section–event evaluations across 2016, 2018 and 2022 floods." },
      ],
      edges: [
        { from: "gauge", to: "cat" },
        { from: "cat", to: "maps", fromSide: "b", toSide: "t" },
        { from: "maps", to: "interp", fromSide: "r", toSide: "l" },
        { from: "cat", to: "linear", fromSide: "r", toSide: "l", label: "water level" },
        { from: "maps", to: "linear", fromSide: "r", toSide: "l" },
        { from: "interp", to: "pred" },
        { from: "linear", to: "pred" },
        { from: "pred", to: "eval" },
        { from: "sar", to: "eval", fromSide: "r", toSide: "b" },
      ],
    },
  },

  decisions: [
    {
      title: "Interpolate between bracketing maps",
      context: "The baseline returns one category's map for any discharge in that category.",
      choice: "For a target discharge, take the two category maps whose ranges bracket it and blend them.",
      rationale: ["Reuses the existing category maps, so no new training data is needed.", "Discharges near a category boundary are no longer forced into one side."],
      tradeoffs: ["Still limited by the quality and spacing of the category maps."],
    },
    {
      title: "Fit each pixel separately",
      context: "Different pixels respond differently to rising water: low-lying ones flood early, higher ones late.",
      choice: "Fit a separate linear relationship between water level and flood probability at every pixel.",
      rationale: ["Captures each location's own response.", "Linear fits are cheap enough to compute for rasters of tens of millions of pixels."],
      tradeoffs: ["A linear form cannot represent threshold-like behaviour at an individual pixel.", "Each pixel's fit depends on how much historical data covers it."],
    },
  ],

  challenges: [
    {
      title: "Large rasters",
      problem: "Flood-probability rasters reached about 43 million pixels at about 10 m resolution, across five sections.",
      solution: "Vectorised NumPy operations over Rasterio-loaded arrays, writing georeferenced GeoTIFF outputs.",
    },
    {
      title: "A fair comparison",
      problem: "The baseline and the new methods could not yet be compared on fully equal terms.",
      cause: "The baseline used a probability threshold greater than 0.1 while the new methods used at least 0.25, and event years were not fully held out from fitting.",
      solution: "Report the results as initial evaluation with both caveats attached, rather than as a clean head-to-head.",
      outcome: "A threshold-matched evaluation with held-out event years is the next step before drawing conclusions.",
    },
  ],

  implementation: [
    {
      title: "Discharge categorisation",
      body: ["Daily records from five gauge stations (May 2013 to May 2024) were grouped into about 1,670 12-day windows and categorised by discharge, spanning about 580–92,900 m³/s."],
    },
    {
      title: "Prediction and evaluation",
      body: ["Both methods produce georeferenced GeoTIFF predictions. Evaluation compares each prediction with a Sentinel-1 SAR flood mask for the same section and event and computes misclassification and F1. There are 45 method–section–event evaluations across the 2016, 2018 and 2022 floods."],
    },
  ],

  results: {
    intro: [
      "Initial research evaluation of LinearFit against the category baseline. Read the caveats first: the numbers are not threshold-matched, and event years were not fully held out.",
    ],
    headline: [
      { label: "Mean misclassification", before: 12.5, after: 8.2, unit: "%", better: "lower", decimals: 1, context: "LinearFit vs category baseline, mean across evaluations.", evidence: "research", note: "Not threshold-matched (baseline >0.1, new ≥0.25). Event years not fully held out." },
      { label: "Mean F1", before: 0.723, after: 0.794, unit: "", better: "higher", decimals: 3, context: "LinearFit vs category baseline.", evidence: "research", note: "Same caveats." },
      { label: "Evaluations", value: "45", unit: "method–section–event", context: "Across five sections and the 2016, 2018 and 2022 floods.", evidence: "scope" },
      { label: "Largest raster", value: "≈43M", unit: "pixels", context: "At about 10 m resolution.", evidence: "scope" },
    ],
    metrics: [
      { label: "River sections", value: "5", unit: "sections", context: "Ganga River.", evidence: "scope" },
      { label: "Gauge stations", value: "5", unit: "stations", context: "Daily records May 2013 – May 2024.", evidence: "scope" },
      { label: "Discharge windows", value: "≈1,670", unit: "12-day windows", context: "Categorised.", evidence: "scope" },
      { label: "Discharge range", value: "≈580–92,900", unit: "m³/s", context: "Across all windows.", evidence: "scope" },
    ],
    viz: ["sac-interpolation", "sac-evaluation"],
    caveats: [
      "The baseline used a probability threshold of >0.1; the new methods used ≥0.25. The comparison is not threshold-matched.",
      "Event years were not fully held out from fitting.",
      "No deployment or operational adoption is claimed.",
    ],
  },

  lessons: [
    {
      title: "A comparison is only as good as its protocol",
      body: "The headline numbers look like a clear win, but different thresholds and incomplete hold-out mean they can't be read as one. Stating the caveat next to the number matters more than the number.",
    },
    {
      title: "Simple models, at the right granularity",
      body: "A linear fit is about the simplest model there is. Fitting one per pixel made it expressive enough to be worth evaluating.",
    },
  ],

  stack: [
    { purpose: "Programming", items: [{ name: "Python", use: "Research tooling" }] },
    { purpose: "Geospatial", items: [
      { name: "Rasterio, GeoTIFF", use: "Raster I/O and georeferenced outputs" },
      { name: "Sentinel-1 SAR flood masks", use: "Evaluation reference" },
    ] },
    { purpose: "Data processing", items: [{ name: "NumPy", use: "Vectorised raster computation" }] },
    { purpose: "AI / ML", items: [{ name: "scikit-learn", use: "Regression and evaluation" }] },
  ],

  evidence: [],
  todo: [
    "Confirm the interpolation weighting (the interactive figure shows a linear blend and is labelled illustrative).",
    "Whether the interpolation method was evaluated with the same metrics, and its results.",
    "Any publication, report or presentation you are allowed to link.",
    "Confirm 'vectorised NumPy over Rasterio arrays' describes how you handled large rasters.",
  ],
};
