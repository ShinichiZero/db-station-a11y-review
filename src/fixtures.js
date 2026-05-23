export const frankfurtHbfFixture = {
  stationName: 'Frankfurt (Main) Hbf',
  sourceLabel: 'Demo fixture (modeled from publicly visible station page content categories)',
  stationUrl: 'https://www.bahnhof.de/frankfurt-main-hbf',
  travelerTasks: [
    { task: 'Enter station', status: 'Pass', notes: 'Main entrances are documented and appear step-free in listing text.' },
    { task: 'Find platform', status: 'Partial', notes: 'Platform information exists, but wayfinding detail clarity varies by channel.' },
    { task: 'Check elevator/lift availability', status: 'Needs manual verification', notes: 'Elevator status appears referenced, but live availability needs confirmation.' },
    { task: 'Request assistance', status: 'Pass', notes: 'Mobility service and support pathways are listed.' },
    { task: 'Find toilets', status: 'Partial', notes: 'Facility information exists but accessibility details are incomplete.' },
    { task: 'Find exits', status: 'Partial', notes: 'Maps support this, but route clarity for low-vision users needs manual check.' },
    { task: 'Use maps', status: 'Needs manual verification', notes: 'Station map asset exists; readability in assistive technology needs manual testing.' },
    { task: 'Use timetables', status: 'Partial', notes: 'PDF timetable reliance may increase friction for some users.' },
    { task: 'Contact station support', status: 'Pass', notes: 'Contact path is discoverable through service information blocks.' }
  ],
  technicalChecks: [
    { check: 'Landmarks', status: 'Partial', notes: 'Needs manual review against semantic regions in rendered page.' },
    { check: 'Heading structure', status: 'Partial', notes: 'Requires heading level verification in source HTML.' },
    { check: 'Keyboard order', status: 'Needs manual verification', notes: 'Tab sequence must be manually validated.' },
    { check: 'Visible focus', status: 'Needs manual verification', notes: 'Focus visibility depends on current stylesheet/runtime state.' },
    { check: 'Link names', status: 'Partial', notes: 'Descriptive links likely present but must be checked end-to-end.' },
    { check: 'Form labels', status: 'Not applicable', notes: 'Station page may have limited form controls.' },
    { check: 'Language attribute', status: 'Needs manual verification', notes: 'Confirm lang attribute in final delivered HTML.' },
    { check: 'PDF reliance', status: 'Partial', notes: 'PDF timetables create potential accessibility dependence.' },
    { check: 'Alternative formats', status: 'Needs manual verification', notes: 'Alternative non-PDF equivalent must be confirmed.' },
    { check: 'Contact clarity', status: 'Pass', notes: 'Contact pathways are represented in station service area.' },
    { check: 'Mobile usability', status: 'Needs manual verification', notes: 'Requires viewport and zoom checks on mobile devices.' }
  ],
  assistance: {
    discoverability: 'Partial',
    notes: 'Mobility service appears present, but booking details and response expectations require manual verification.'
  },
  pdfFriction: 'PDF-first timetable distribution may slow down task completion for screen-reader and low-vision travelers.',
  manualScreenReaderNotes: [
    'VoiceOver (manual): Needs manual verification.',
    'NVDA (manual): Needs manual verification.'
  ],
  redesignRecommendations: [
    'Provide direct HTML alternatives for every PDF timetable and station notice.',
    'Highlight elevator outages and accessible route changes in plain language at top of page.',
    'Add explicit “Request travel assistance” action near station summary with contact expectations.'
  ],
  evidence: [
    { id: 'E1', source: 'Station facilities section', finding: 'Toilets and services are listed', confidence: 'Medium' },
    { id: 'E2', source: 'Mobility service section', finding: 'Assistance pathway exists', confidence: 'Medium' },
    { id: 'E3', source: 'Timetable section', finding: 'PDF timetable links are present', confidence: 'High' }
  ],
  needsVerification: [
    { topic: 'Live elevator status', why: 'Operational state can change frequently' },
    { topic: 'Screen-reader flow quality', why: 'Requires VoiceOver/NVDA human testing' },
    { topic: 'Mobile zoom and reflow', why: 'Requires device-level WCAG 1.4.10 checks' }
  ]
};
