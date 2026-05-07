/**
 * Full seed script — seeds ALL 42 projects into MongoDB.
 * Run: node scripts/seedFull.js
 *
 * Uses --replace mode: clears existing data and inserts fresh seed.
 * Requires MONGO_URI in .env
 */

const mongoose = require('mongoose');
require('dotenv').config();

const Project = require('../models/Project');

// ── Helper: empty monthly measures ──────────────────────────────────────────
const MONTHS = [
  'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december',
];
const MEASURE_TYPES = [
  'PAC', 'PTC', 'FAC', 'FTC', 'PTM', 'FTM', 'PAM', 'FAM', 'P_PROGRESS', 'F_PROGRESS',
];

function emptyMeasures() {
  const m = {};
  for (const k of MEASURE_TYPES) {
    m[k] = {};
    for (const mo of MONTHS) m[k][mo] = '';
  }
  return m;
}

function proj(overrides) {
  const allMonths = MONTHS.reduce((o, m) => ({ ...o, [m]: { pt: '', pp: '', ft: '', fp: '' } }), {});
  return {
    milestones: [], risks: [], documents: [], media: [],
    monthlyProgress: allMonths,
    measures: emptyMeasures(),
    reasonsForDelays: '', remarks: '', npd: '',
    revisedCost: '', startDate: '', endDate: '',
    kpi: '', output: '', outcome: '',
    physicalProgress: '', financialProgress: '',
    allocation2026: '', awardedSum: '', tec: '',
    ...overrides,
    measures: { ...emptyMeasures(), ...(overrides.measuresExtra || {}) },
  };
}

// ── All 42 Projects ──────────────────────────────────────────────────────────
const PROJECTS = [

  // ── Siyak Nagara ──
  proj({
    id: 1772168120000, department: 'Dept: Urban Dev & Special Proj', district: 'Kilinochchi',
    budgetLine: 'Siyak Nagara', projectNumber: 1,
    projectName: 'Market complex development at Kilinochchi stage ii',
    startDate: '2025-10-15', endDate: '2026-06-30', tec: '120', allocation2026: '45.00',
    awardedSum: '98500000', physicalProgress: '12%', financialProgress: '10.50',
    kpi: '100% Completion of Projects',
    output: 'Complete market complex and make it usable for traders',
    outcome: '. Market stalls . Parking area . Sanitary facilities',
    responsibleOfficer: 'Mr. Pradeep Silva, Director 0771234567',
  }),
  proj({
    id: 1772168128040, department: 'Dept: Urban Dev & Special Proj', district: 'Mullaitivu',
    budgetLine: 'Siyak Nagara', projectNumber: 2,
    projectName: 'Bus stand development at Mullaitivu - stage iii',
    startDate: '2025-11-18', endDate: '2026-08-14', tec: '70', allocation2026: '39.04',
    awardedSum: '48271027', physicalProgress: '8%', financialProgress: '9.23',
    kpi: '100% Completion of Projects',
    output: 'Complete the bus stand and make it usable for public, efficient transportation system and enhance the commercial spaces by developing the bus stand',
    outcome: '. Supper structure finishing works   . Electrical works               ...',
    responsibleOfficer: 'Ms. Sonali Attanayaka,\n Deputy Director\n 071-4425671',
  }),
  proj({
    id: 1772168137007, department: 'Dept: Urban Dev & Special Proj', district: 'Ampara',
    budgetLine: 'Siyak Nagara', projectNumber: 3,
    projectName: 'Weekly pola development at Ampara stage ii',
    startDate: '2025-12-24', endDate: '2027-03-30', tec: '295.7', allocation2026: '50.96',
    physicalProgress: '1%', financialProgress: '53.44',
    output: 'Completion of pola', outcome: 'Upgrading public and infrastructure facilities of the town',
  }),
  proj({
    id: 1772168142936, department: 'Dept: Urban Dev & Special Proj', district: 'Anuradhapura',
    budgetLine: 'Siyak Nagara', projectNumber: 4,
    projectName: 'Sanitary facilities & landscape improvement at habarana, anuradhapura-stage ...',
    startDate: '2025-10-30', endDate: '2026-03-29', tec: '27', allocation2026: '13.74',
    awardedSum: '20437027.71', physicalProgress: '20%', financialProgress: '6.69',
    kpi: '100% Completion of Projects',
    output: 'To improve Sanitary facilities, public gathering spaces and refreshment areas',
    outcome: '. Toilet block ( Ladies / Gents & Disable) . Coffee shops (...)',
    responsibleOfficer: 'Ms.Erandi Senevirathne Additional Director (Architect)0772350159',
  }),
  proj({
    id: 1772168150000, department: 'Dept: Urban Dev & Special Proj', district: 'Puttalam',
    budgetLine: 'Siyak Nagara', projectNumber: 5,
    projectName: 'Town centre development at Puttalam - phase i',
    startDate: '2025-09-01', endDate: '2026-05-30', tec: '85', allocation2026: '35.00',
    awardedSum: '72000000', physicalProgress: '15%', financialProgress: '12.00',
    kpi: '100% Completion of Projects',
    output: 'Complete town centre infrastructure',
    outcome: '. Paved walkways . Street lighting . Public spaces',
    responsibleOfficer: 'Mr. Kumara Perera, Additional Director 0762345678',
  }),
  proj({
    id: 1772168158000, department: 'Dept: Urban Dev & Special Proj', district: 'Trincomalee',
    budgetLine: 'Siyak Nagara', projectNumber: 6,
    projectName: 'Fishing harbour facility improvements at Trincomalee',
    startDate: '2025-10-01', endDate: '2026-07-30', tec: '56', allocation2026: '28.00',
    awardedSum: '45000000', physicalProgress: '22%', financialProgress: '18.50',
    kpi: '100% Completion of Projects',
    output: 'Improved harbour facilities for fishermen',
    outcome: '. Ice plant . Storage facilities . Jetty repairs',
    responsibleOfficer: 'Ms. Nirmala Fernando, Deputy Director 0777654321',
  }),

  // ── Tourism Promotion and City Branding ──
  proj({
    id: 1772200100001, department: 'Dept: Urban Dev & Special Proj', district: 'Colombo',
    budgetLine: 'Tourism Promotion and City Branding', projectNumber: 7,
    projectName: 'City branding and wayfinding system - Colombo City',
    startDate: '2025-08-01', endDate: '2026-04-30', tec: '45', allocation2026: '22.50',
    awardedSum: '38000000', physicalProgress: '45%', financialProgress: '40.00',
    kpi: 'City brand visibility increased by 30%',
    output: 'Installation of wayfinding signage across Colombo',
    outcome: '. 120 signage boards . 5 information kiosks . Brand campaign',
    responsibleOfficer: 'Mr. Janaka De Silva, Director 0711234567',
  }),
  proj({
    id: 1772200100002, department: 'Dept: Urban Dev & Special Proj', district: 'Galle',
    budgetLine: 'Tourism Promotion and City Branding', projectNumber: 8,
    projectName: 'Heritage walk trail development - Galle Fort',
    startDate: '2025-09-15', endDate: '2026-06-15', tec: '32', allocation2026: '18.00',
    awardedSum: '27500000', physicalProgress: '30%', financialProgress: '25.00',
    kpi: 'Heritage trail operational',
    output: 'Marked heritage trail with interpretation boards',
    outcome: '. Trail markers . Information boards . Night lighting',
    responsibleOfficer: 'Ms. Chamari Rathnayake, Deputy Director 0762987654',
  }),
  proj({
    id: 1772200100003, department: 'Dept: Urban Dev & Special Proj', district: 'Kandy',
    budgetLine: 'Tourism Promotion and City Branding', projectNumber: 9,
    projectName: 'Kandy city tourism gateway development',
    startDate: '2025-10-01', endDate: '2026-08-31', tec: '65', allocation2026: '30.00',
    awardedSum: '54000000', physicalProgress: '18%', financialProgress: '15.00',
    kpi: '100% completion of gateway facilities',
    output: 'Tourist welcome centre and facilities',
    outcome: '. Welcome centre . Information points . Parking',
    responsibleOfficer: 'Mr. Asela Bandara, Additional Director 0774567890',
  }),

  // ── Essential Maintenance of Government Housing Schemes ──
  proj({
    id: 1772300100001, department: 'Dept: Housing', district: 'Colombo',
    budgetLine: 'Essential Maintenance of Government Housing Schemes', projectNumber: 10,
    projectName: 'Maintenance of Sethsiripaya housing complex - phase i',
    startDate: '2025-07-01', endDate: '2026-03-31', tec: '42', allocation2026: '25.00',
    awardedSum: '35600000', physicalProgress: '55%', financialProgress: '50.00',
    kpi: 'All units maintained',
    output: 'Renovation of 200 housing units',
    outcome: '. Roof repairs . Plumbing . Electrical work',
    responsibleOfficer: 'Mr. Ruwan Jayaweera, Director 0712345678',
  }),
  proj({
    id: 1772300100002, department: 'Dept: Housing', district: 'Gampaha',
    budgetLine: 'Essential Maintenance of Government Housing Schemes', projectNumber: 11,
    projectName: 'Wathuragama housing scheme rehabilitation',
    startDate: '2025-08-15', endDate: '2026-04-15', tec: '28', allocation2026: '18.00',
    awardedSum: '24000000', physicalProgress: '40%', financialProgress: '35.00',
    kpi: '100% units rehabilitated',
    output: 'Rehabilitation of 150 housing units',
    outcome: '. Structural repairs . Water supply . Drainage',
    responsibleOfficer: 'Ms. Dilrukshi Perera, Deputy Director 0763456789',
  }),
  proj({
    id: 1772300100003, department: 'Dept: Housing', district: 'Kalutara',
    budgetLine: 'Essential Maintenance of Government Housing Schemes', projectNumber: 12,
    projectName: 'Aluthgama housing complex maintenance works',
    startDate: '2025-09-01', endDate: '2026-05-31', tec: '19', allocation2026: '12.00',
    awardedSum: '16500000', physicalProgress: '28%', financialProgress: '22.00',
    kpi: '100% maintenance complete',
    output: 'Maintenance of 80 housing units',
    outcome: '. Painting . Roofing . Electrical upgrades',
    responsibleOfficer: 'Mr. Suresh Wijesinghe, Additional Director 0774987654',
  }),

  // ── Techcity ──
  proj({
    id: 1772400100001, department: 'Dept: Urban Dev & Special Proj', district: 'Colombo',
    budgetLine: 'Techcity', projectNumber: 13,
    projectName: 'Techcity infrastructure phase i - IT park Malabe',
    startDate: '2025-06-01', endDate: '2026-12-31', tec: '500', allocation2026: '150.00',
    awardedSum: '450000000', physicalProgress: '25%', financialProgress: '20.00',
    kpi: 'Phase I infrastructure complete',
    output: 'IT park infrastructure - roads, utilities, broadband',
    outcome: '. 10km internal roads . Power substations . Fiber optic network',
    responsibleOfficer: 'Mr. Chandana Mapa, Director General 0777777777',
  }),
  proj({
    id: 1772400100002, department: 'Dept: Urban Dev & Special Proj', district: 'Colombo',
    budgetLine: 'Techcity', projectNumber: 14,
    projectName: 'Techcity digital hub building construction',
    startDate: '2025-09-01', endDate: '2027-06-30', tec: '300', allocation2026: '80.00',
    awardedSum: '265000000', physicalProgress: '10%', financialProgress: '8.00',
    kpi: 'Building structure complete',
    output: 'Multi-storey digital innovation hub',
    outcome: '. Foundation . Structure . MEP rough-in',
    responsibleOfficer: 'Ms. Thilini Silva, Deputy Director 0711111111',
  }),

  // ── Community ──
  proj({
    id: 1772500100001, department: 'Dept: Urban Dev & Special Proj', district: 'Batticaloa',
    budgetLine: 'Community', projectNumber: 15,
    projectName: 'Community centre development at Batticaloa - phase ii',
    startDate: '2025-08-01', endDate: '2026-06-30', tec: '38', allocation2026: '20.00',
    awardedSum: '32000000', physicalProgress: '35%', financialProgress: '30.00',
    kpi: 'Community centre operational',
    output: 'Multi-purpose community building',
    outcome: '. Hall (capacity 300) . Meeting rooms . Sports ground',
    responsibleOfficer: 'Mr. Rasith Silva, Deputy Director 0762222222',
  }),
  proj({
    id: 1772500100002, department: 'Dept: Urban Dev & Special Proj', district: 'Vavuniya',
    budgetLine: 'Community', projectNumber: 16,
    projectName: 'Public park and recreation area - Vavuniya',
    startDate: '2025-10-01', endDate: '2026-07-31', tec: '22', allocation2026: '14.00',
    awardedSum: '18500000', physicalProgress: '20%', financialProgress: '16.00',
    kpi: 'Park open to public',
    output: 'Landscaped recreation area with facilities',
    outcome: '. Playground . Walking track . Seating areas',
    responsibleOfficer: 'Ms. Priya Nair, Additional Director 0763333333',
  }),
  proj({
    id: 1772500100003, department: 'Dept: Urban Dev & Special Proj', district: 'Jaffna',
    budgetLine: 'Community', projectNumber: 17,
    projectName: 'Youth centre development at Jaffna',
    startDate: '2025-11-01', endDate: '2026-08-31', tec: '30', allocation2026: '15.00',
    awardedSum: '25000000', physicalProgress: '12%', financialProgress: '9.00',
    kpi: 'Youth centre operational',
    output: 'Youth training and recreation facility',
    outcome: '. Computer lab . Sports hall . Library',
    responsibleOfficer: 'Mr. Sivakumar Raja, Deputy Director 0774444444',
  }),

  // ── Housing ──
  proj({
    id: 1772600100001, department: 'Dept: Housing', district: 'Nuwara Eliya',
    budgetLine: 'Housing', projectNumber: 18,
    projectName: 'Low-income housing project - Nuwara Eliya 100 units',
    startDate: '2025-07-15', endDate: '2027-01-15', tec: '180', allocation2026: '60.00',
    awardedSum: '155000000', physicalProgress: '18%', financialProgress: '15.00',
    kpi: '100 housing units complete',
    output: '100 two-bedroom housing units',
    outcome: '. Foundations . Superstructure . Utilities connections',
    responsibleOfficer: 'Mr. Nimal Kariyawasam, Director 0765555555',
  }),
  proj({
    id: 1772600100002, department: 'Dept: Housing', district: 'Ratnapura',
    budgetLine: 'Housing', projectNumber: 19,
    projectName: 'Disaster relief housing - Ratnapura 50 units',
    startDate: '2025-09-01', endDate: '2026-09-30', tec: '75', allocation2026: '40.00',
    awardedSum: '64000000', physicalProgress: '30%', financialProgress: '27.00',
    kpi: '50 units allocated to disaster victims',
    output: '50 single-storey housing units',
    outcome: '. Site clearing . Construction . Handover',
    responsibleOfficer: 'Ms. Anoma Seneviratne, Deputy Director 0776666666',
  }),
  proj({
    id: 1772600100003, department: 'Dept: Housing', district: 'Kegalle',
    budgetLine: 'Housing', projectNumber: 20,
    projectName: 'Estate worker housing rehabilitation - Kegalle',
    startDate: '2025-08-01', endDate: '2026-06-30', tec: '52', allocation2026: '28.00',
    awardedSum: '44500000', physicalProgress: '42%', financialProgress: '38.00',
    kpi: '120 units rehabilitated',
    output: 'Rehabilitation of estate worker quarters',
    outcome: '. Structural repairs . Sanitation . Water supply',
    responsibleOfficer: 'Mr. Sanjeewa Bandara, Additional Director 0767777777',
  }),

  // ── Utilities ──
  proj({
    id: 1772700100001, department: 'Dept: Urban Dev & Special Proj', district: 'Badulla',
    budgetLine: 'Utilities', projectNumber: 21,
    projectName: 'Street lighting improvement - Badulla town',
    startDate: '2025-06-15', endDate: '2026-02-28', tec: '18', allocation2026: '12.00',
    awardedSum: '15800000', physicalProgress: '70%', financialProgress: '65.00',
    kpi: '500 LED street lights installed',
    output: 'LED street lighting across Badulla town',
    outcome: '. 500 LED lights . Reduced electricity cost . Improved safety',
    responsibleOfficer: 'Ms. Chathu Gunawardena, Deputy Director 0768888888',
  }),
  proj({
    id: 1772700100002, department: 'Dept: Urban Dev & Special Proj', district: 'Monaragala',
    budgetLine: 'Utilities', projectNumber: 22,
    projectName: 'Water supply system upgrade - Monaragala',
    startDate: '2025-07-01', endDate: '2026-04-30', tec: '35', allocation2026: '22.00',
    awardedSum: '30000000', physicalProgress: '48%', financialProgress: '42.00',
    kpi: '5000 households with improved water supply',
    output: 'Upgraded water distribution network',
    outcome: '. New water mains . Pressure regulators . Consumer meters',
    responsibleOfficer: 'Mr. Gamini Herath, Additional Director 0769999999',
  }),
  proj({
    id: 1772700100003, department: 'Dept: Urban Dev & Special Proj', district: 'Hambantota',
    budgetLine: 'Utilities', projectNumber: 23,
    projectName: 'Solid waste management - Hambantota district',
    startDate: '2025-08-15', endDate: '2026-05-31', tec: '28', allocation2026: '16.00',
    awardedSum: '24000000', physicalProgress: '35%', financialProgress: '28.00',
    kpi: 'Waste collection coverage 90%',
    output: 'Waste collection infrastructure',
    outcome: '. Collection vehicles . Transfer stations . Awareness campaign',
    responsibleOfficer: 'Ms. Sanda Wijeratne, Deputy Director 0770000001',
  }),

  // ── Transport ──
  proj({
    id: 1772800100001, department: 'Dept: Urban Dev & Special Proj', district: 'Matara',
    budgetLine: 'Transport', projectNumber: 24,
    projectName: 'Bus terminal redevelopment - Matara',
    startDate: '2025-07-01', endDate: '2026-06-30', tec: '95', allocation2026: '48.00',
    awardedSum: '82000000', physicalProgress: '22%', financialProgress: '18.00',
    kpi: 'Modern bus terminal operational',
    output: 'Modernised bus terminal with 30 bays',
    outcome: '. Passenger shelters . Commercial spaces . Sanitary facilities',
    responsibleOfficer: 'Mr. Kasun Jayasena, Director 0770000002',
  }),
  proj({
    id: 1772800100002, department: 'Dept: Urban Dev & Special Proj', district: 'Kurunegala',
    budgetLine: 'Transport', projectNumber: 25,
    projectName: 'Urban road network improvement - Kurunegala',
    startDate: '2025-09-01', endDate: '2026-07-31', tec: '110', allocation2026: '55.00',
    awardedSum: '95000000', physicalProgress: '15%', financialProgress: '12.00',
    kpi: '25km roads resurfaced',
    output: 'Road resurfacing and drainage improvement',
    outcome: '. Carriageway resurfacing . Kerbs . Storm drains',
    responsibleOfficer: 'Ms. Nimali Ranatunga, Deputy Director 0770000003',
  }),
  proj({
    id: 1772800100003, department: 'Dept: Urban Dev & Special Proj', district: 'Polonnaruwa',
    budgetLine: 'Transport', projectNumber: 26,
    projectName: 'Cycle and pedestrian path - Polonnaruwa heritage zone',
    startDate: '2025-10-01', endDate: '2026-06-30', tec: '24', allocation2026: '14.00',
    awardedSum: '20500000', physicalProgress: '32%', financialProgress: '28.00',
    kpi: '8km cycle path complete',
    output: 'Dedicated cycle and pedestrian infrastructure',
    outcome: '. Cycle path . Pedestrian walkway . Rest shelters',
    responsibleOfficer: 'Mr. Shiran Bandara, Additional Director 0770000004',
  }),

  // ── Infrastructure ──
  proj({
    id: 1772900100001, department: 'Dept: Urban Dev & Special Proj', district: 'Colombo',
    budgetLine: 'Infrastructure', projectNumber: 27,
    projectName: 'Storm water drainage improvement - Kolonnawa',
    startDate: '2025-06-01', endDate: '2026-05-31', tec: '140', allocation2026: '70.00',
    awardedSum: '122000000', physicalProgress: '38%', financialProgress: '33.00',
    kpi: 'Flood risk reduced in 500 ha area',
    output: 'Upgraded storm water drainage network',
    outcome: '. Box culverts . Retention ponds . Pump stations',
    responsibleOfficer: 'Mr. Ajith Mendis, Director 0770000005',
  }),
  proj({
    id: 1772900100002, department: 'Dept: Urban Dev & Special Proj', district: 'Gampaha',
    budgetLine: 'Infrastructure', projectNumber: 28,
    projectName: 'Public space development - Negombo city centre',
    startDate: '2025-08-01', endDate: '2026-06-30', tec: '60', allocation2026: '32.00',
    awardedSum: '52000000', physicalProgress: '28%', financialProgress: '24.00',
    kpi: 'Public square operational',
    output: 'Landscaped urban public space',
    outcome: '. Paved plaza . Fountain . Seating . Shade structures',
    responsibleOfficer: 'Ms. Iresha Perera, Deputy Director 0770000006',
  }),
  proj({
    id: 1772900100003, department: 'Dept: Urban Dev & Special Proj', district: 'Kalutara',
    budgetLine: 'Infrastructure', projectNumber: 29,
    projectName: 'Coastal protection and walkway - Beruwala',
    startDate: '2025-09-15', endDate: '2026-08-31', tec: '78', allocation2026: '40.00',
    awardedSum: '67500000', physicalProgress: '20%', financialProgress: '16.00',
    kpi: 'Coastal protection operational',
    output: 'Seawall and beach walkway',
    outcome: '. 1.2km seawall . Beach walkway . Recreational facilities',
    responsibleOfficer: 'Mr. Buddhika Senanayake, Additional Director 0770000007',
  }),
  proj({
    id: 1772900100004, department: 'Dept: Urban Dev & Special Proj', district: 'Galle',
    budgetLine: 'Infrastructure', projectNumber: 30,
    projectName: 'Galle city waterfront redevelopment',
    startDate: '2025-07-01', endDate: '2026-10-31', tec: '200', allocation2026: '90.00',
    awardedSum: '175000000', physicalProgress: '15%', financialProgress: '12.00',
    kpi: 'Waterfront precinct upgraded',
    output: 'Modern waterfront with public amenities',
    outcome: '. Marina . Restaurants . Open air theatre . Promenade',
    responsibleOfficer: 'Ms. Nilmini Jayakody, Director 0770000008',
  }),
  proj({
    id: 1772900100005, department: 'Dept: Urban Dev & Special Proj', district: 'Matara',
    budgetLine: 'Infrastructure', projectNumber: 31,
    projectName: 'Urban renewal project - Matara old town',
    startDate: '2025-10-01', endDate: '2026-09-30', tec: '85', allocation2026: '42.00',
    awardedSum: '74000000', physicalProgress: '10%', financialProgress: '8.00',
    kpi: 'Old town revitalised',
    output: 'Revitalised historic town precinct',
    outcome: '. Heritage buildings restored . Streetscape . Lighting',
    responsibleOfficer: 'Mr. Thilina Rajapaksha, Deputy Director 0770000009',
  }),
  proj({
    id: 1772900100006, department: 'Dept: Urban Dev & Special Proj', district: 'Hambantota',
    budgetLine: 'Infrastructure', projectNumber: 32,
    projectName: 'Industrial zone infrastructure - Mirijjawila',
    startDate: '2025-08-01', endDate: '2027-03-31', tec: '350', allocation2026: '120.00',
    awardedSum: '310000000', physicalProgress: '8%', financialProgress: '6.00',
    kpi: 'Phase I infrastructure complete',
    output: 'Industrial zone roads and utilities',
    outcome: '. 15km roads . Power . Water . Wastewater',
    responsibleOfficer: 'Ms. Samanthi Kumari, Director 0770000010',
  }),
  proj({
    id: 1772900100007, department: 'Dept: Urban Dev & Special Proj', district: 'Mannar',
    budgetLine: 'Infrastructure', projectNumber: 33,
    projectName: 'Town infrastructure rehabilitation - Mannar',
    startDate: '2025-09-01', endDate: '2026-08-31', tec: '55', allocation2026: '30.00',
    awardedSum: '48000000', physicalProgress: '25%', financialProgress: '20.00',
    kpi: 'Town infrastructure restored',
    output: 'Rehabilitated town infrastructure',
    outcome: '. Roads . Water supply . Electricity . Drains',
    responsibleOfficer: 'Mr. Rizwan Mohamed, Additional Director 0770000011',
  }),

  // ── Clean Sri Lanka ──
  proj({
    id: 1772532100001, department: 'Dept: Urban Dev & Special Proj', district: 'Colombo',
    budgetLine: 'Clean Sri Lanka', projectNumber: 34,
    projectName: 'Public toilet facility upgrading - Colombo Municipal Area',
    startDate: '2025-07-01', endDate: '2026-03-31', tec: '20', allocation2026: '14.00',
    awardedSum: '17500000', physicalProgress: '60%', financialProgress: '55.00',
    kpi: '25 toilets upgraded',
    output: 'Upgraded public toilet facilities',
    outcome: '. Modern fixtures . Disabled access . Hygiene dispensers',
    responsibleOfficer: 'Ms. Hasini Abeywickrama, Deputy Director 0770000012',
  }),
  proj({
    id: 1772532100002, department: 'Dept: Urban Dev & Special Proj', district: 'Kandy',
    budgetLine: 'Clean Sri Lanka', projectNumber: 35,
    projectName: 'Lake side beautification and sanitation - Kandy Lake',
    startDate: '2025-08-15', endDate: '2026-04-15', tec: '16', allocation2026: '10.00',
    awardedSum: '14000000', physicalProgress: '45%', financialProgress: '40.00',
    kpi: 'Lake walkway and facilities complete',
    output: 'Beautification and sanitation of Kandy Lake area',
    outcome: '. Paved walkway . Seating . Toilet facilities . Lighting',
    responsibleOfficer: 'Mr. Nuwan Dissanayake, Additional Director 0770000013',
  }),
  proj({
    id: 1772532100003, department: 'Dept: Urban Dev & Special Proj', district: 'Galle',
    budgetLine: 'Clean Sri Lanka', projectNumber: 36,
    projectName: 'Beach clean-up and facility centre - Unawatuna',
    startDate: '2025-09-01', endDate: '2026-05-31', tec: '12', allocation2026: '8.00',
    awardedSum: '10500000', physicalProgress: '38%', financialProgress: '32.00',
    kpi: 'Facility centre operational',
    output: 'Beach facility centre with eco-friendly design',
    outcome: '. Changing rooms . Showers . Information centre',
    responsibleOfficer: 'Ms. Dini Siriwardena, Deputy Director 0770000014',
  }),
  proj({
    id: 1772532100004, department: 'Dept: Urban Dev & Special Proj', district: 'Trincomalee',
    budgetLine: 'Clean Sri Lanka', projectNumber: 37,
    projectName: 'Tourist beach amenities - Nilaveli',
    startDate: '2025-10-01', endDate: '2026-06-30', tec: '14', allocation2026: '9.00',
    awardedSum: '12000000', physicalProgress: '28%', financialProgress: '22.00',
    kpi: 'Beach amenities operational',
    output: 'Beach amenities including toilets and showers',
    outcome: '. Toilet block . Showers . Parking . Shade shelters',
    responsibleOfficer: 'Mr. Isuru Silva, Additional Director 0770000015',
  }),
  proj({
    id: 1772532100005, department: 'Dept: Urban Dev & Special Proj', district: 'Hambantota',
    budgetLine: 'Clean Sri Lanka', projectNumber: 38,
    projectName: 'Tourist rest area development - Bundala road',
    startDate: '2025-09-15', endDate: '2026-04-30', tec: '9', allocation2026: '6.50',
    awardedSum: '7800000', physicalProgress: '50%', financialProgress: '45.00',
    kpi: 'Rest area operational',
    output: 'Tourist rest area with basic facilities',
    outcome: '. Toilet . Parking . Seating . Drinking water',
    responsibleOfficer: 'Ms. Chathuri Nanayakkara, Deputy Director 0770000016',
  }),

  // ── Clean Sri Lanka (from compass seed - projects 39-42) ──
  proj({
    id: 1772532181322, department: 'Dept: Urban Dev & Special Proj', district: 'Polonnaruwa',
    budgetLine: 'Clean Sri Lanka', projectNumber: 39,
    projectName: 'Renovation of Facility Centre at Lankapura',
    startDate: '2025-09-18', endDate: '2026-01-15', tec: '24.50', allocation2026: '10.69',
    awardedSum: '17442375', physicalProgress: '37%', financialProgress: '39%',
    kpi: '100% Completion of Projects',
    output: 'Completion of sanitary facility building for Local & Foreign. tourists…',
    outcome: '. Improvement of Toilet block               ( Ladies/ Gents & Disable)…',
    responsibleOfficer: 'Ms.Erandi Senevirathne Additional Director (Architect)0772350159',
  }),
  proj({
    id: 1772532190315, department: 'Dept: Urban Dev & Special Proj', district: 'Kurunegala',
    budgetLine: 'Clean Sri Lanka', projectNumber: 40,
    projectName: 'Construction and renovation of facility center at Badagamuwa Forest Pa…',
    startDate: '2025-09-18', endDate: '2026-01-15', tec: '24.71', allocation2026: '10.51',
    awardedSum: '16889512.95', physicalProgress: '58%', financialProgress: '38%',
    kpi: '100% Completion of Projects',
    output: 'Completion of sanitary facility building & Camping facility building f…',
    outcome: '. Toilet block  ( Ladies/ Gents & Disable)                      . RCC …',
    responsibleOfficer: 'Mrs.Rasika Sahabandu.    ctg.D.Director   0760492293',
  }),
  proj({
    id: 1772532197371, department: 'Dept: Urban Dev & Special Proj', district: 'Matale',
    budgetLine: 'Clean Sri Lanka', projectNumber: 41,
    projectName: 'Development of Tourist Sanitary facilities at Hotel Junction Sigiriya',
    tec: '31.9Mn',
    output: 'Completion of sanitary facility building for Local & Foreign. tourists…',
    outcome: ' Improvement of Sanitary Facilities Toilet block               ( Ladie…',
    responsibleOfficer: 'Ms.Thathsarani Karavita, Additional Director (Architect)00760954417',
  }),
  proj({
    id: 1772532201866, department: 'Dept: Urban Dev & Special Proj', district: 'Polonnaruwa',
    budgetLine: 'Clean Sri Lanka', projectNumber: 42,
    projectName: 'Bus halt & Sanitary facility development project, Girithale Junction',
    tec: '28.47', allocation2026: '18.00',
    output: 'Complete the bus halt & make it usabale for public efficent transport …',
    outcome: '. Bus halt            . Toilet block ( Ladies/ Gents & Disable)  ',
    responsibleOfficer: 'Ms.Erandi Senevirathne Additional Director (Architect)0772350159',
  }),
];

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const uri = process.env.MONGO_URI;
  const dbName = process.env.MONGO_DB_NAME || 'project_dashboard';

  if (!uri) {
    console.error('❌ MONGO_URI is not set in .env');
    process.exit(1);
  }

  console.log(`🔌 Connecting to MongoDB...`);
  await mongoose.connect(uri, { dbName });
  console.log(`✅ Connected to database: ${dbName}`);

  const mode = (process.argv[2] || '--upsert').toLowerCase();

  if (mode === '--replace') {
    await Project.deleteMany({});
    await Project.insertMany(PROJECTS);
    console.log(`✅ Seeded ${PROJECTS.length} projects (replace mode).`);
  } else {
    let count = 0;
    for (const p of PROJECTS) {
      await Project.updateOne({ id: p.id }, { $set: p }, { upsert: true });
      count++;
    }
    console.log(`✅ Upserted ${count} projects.`);
  }

  await mongoose.disconnect();
  console.log('🏁 Done!');
}

main().catch(err => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});
