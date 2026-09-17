import { Borrower, Connection, ShockConfig, InterventionOption, LedgerItem } from '../types';

export const INITIAL_BORROWERS: Borrower[] = [
  {
    id: 'amina',
    name: 'Amina Wanjiku',
    sector: 'Maize & Legume Farming',
    location: 'Eldoret East Ward',
    loanAmount: 1400,
    monthlyRepayment: 115,
    currentBalance: 1120,
    cashBufferMonths: 1.2,
    baseStress: 56,
    x: 460,
    y: 165,
    radius: 34,
    vulnerabilityTrait: 'Rainfall volatility & harvest lumpiness',
    bioNote: 'Farms 4.5 acres of hybrid maize and climbing beans. Revenue arrives in two seasonal pulses. Holds high cooperative respect as group chair.',
    shieldReason: 'Primary production origin — vulnerable to meteorological stress rather than group transmission.',
    contributingFactors: [
      'Cash buffer reduced to 36 days following late seed purchase',
      'High seasonal concentration: 74% of revenue realized in post-harvest Q3',
      'Joint guarantee obligations to Beatrice Kemboi and Fatima Zahra'
    ],
    history: [
      { month: 'Oct 24', income: 380, expenses: 260, repayment: 115, reserve: 420 },
      { month: 'Nov 24', income: 340, expenses: 250, repayment: 115, reserve: 395 },
      { month: 'Dec 24', income: 680, expenses: 310, repayment: 115, reserve: 650 },
      { month: 'Jan 25', income: 520, expenses: 290, repayment: 115, reserve: 765 },
      { month: 'Feb 25', income: 240, expenses: 280, repayment: 115, reserve: 610 },
      { month: 'Mar 25', income: 210, expenses: 320, repayment: 115, reserve: 385 },
      { month: 'Apr 25', income: 190, expenses: 270, repayment: 115, reserve: 190 },
      { month: 'May 25', income: 230, expenses: 260, repayment: 115, reserve: 145 },
      { month: 'Jun 25', income: 310, expenses: 240, repayment: 115, reserve: 200 },
      { month: 'Jul 25', income: 580, expenses: 280, repayment: 115, reserve: 385 },
      { month: 'Aug 25', income: 640, expenses: 300, repayment: 115, reserve: 610 },
      { month: 'Sep 25', income: 420, expenses: 270, repayment: 115, reserve: 645 },
      { month: 'Oct 25', income: 360, expenses: 260, repayment: 115, reserve: 625 },
      { month: 'Nov 25', income: 330, expenses: 250, repayment: 115, reserve: 590 },
      { month: 'Dec 25', income: 620, expenses: 310, repayment: 115, reserve: 785 },
      { month: 'Jan 26', income: 490, expenses: 280, repayment: 115, reserve: 880 },
      { month: 'Feb 26', income: 260, expenses: 290, repayment: 115, reserve: 735 },
      { month: 'Mar 26', income: 220, expenses: 310, repayment: 115, reserve: 530 }
    ]
  },
  {
    id: 'beatrice',
    name: 'Beatrice Kemboi',
    sector: 'Textile & School Uniforms',
    location: 'Central Marketplace',
    loanAmount: 900,
    monthlyRepayment: 80,
    currentBalance: 640,
    cashBufferMonths: 2.1,
    baseStress: 36,
    x: 195,
    y: 355,
    radius: 28,
    vulnerabilityTrait: 'Tied to Amina through $450 joint guarantee',
    bioNote: 'Operates three foot-treadle sewing machines. Steady quarterly bulk orders for school terms; vulnerable if called to cover peer defaults.',
    shieldReason: 'Diversified school uniform contracts and unpledged household stitching income.',
    contributingFactors: [
      'Strong monthly cash consistency, but tight profit margins of 18%',
      'Exposed to $450 joint-guarantee call if Amina defaults',
      'Seasonal school enrollment demand cushion expiring in 6 weeks'
    ],
    history: [
      { month: 'Oct 24', income: 310, expenses: 210, repayment: 80, reserve: 340 },
      { month: 'Nov 24', income: 290, expenses: 200, repayment: 80, reserve: 350 },
      { month: 'Dec 24', income: 480, expenses: 260, repayment: 80, reserve: 490 },
      { month: 'Jan 25', income: 520, expenses: 280, repayment: 80, reserve: 650 },
      { month: 'Feb 25', income: 260, expenses: 190, repayment: 80, reserve: 640 },
      { month: 'Mar 25', income: 270, expenses: 195, repayment: 80, reserve: 635 },
      { month: 'Apr 25', income: 380, expenses: 230, repayment: 80, reserve: 705 },
      { month: 'May 25', income: 340, expenses: 210, repayment: 80, reserve: 755 },
      { month: 'Jun 25', income: 290, expenses: 200, repayment: 80, reserve: 765 },
      { month: 'Jul 25', income: 280, expenses: 195, repayment: 80, reserve: 770 },
      { month: 'Aug 25', income: 410, expenses: 240, repayment: 80, reserve: 860 },
      { month: 'Sep 25', income: 330, expenses: 210, repayment: 80, reserve: 900 },
      { month: 'Oct 25', income: 300, expenses: 205, repayment: 80, reserve: 915 },
      { month: 'Nov 25', income: 280, expenses: 195, repayment: 80, reserve: 920 },
      { month: 'Dec 25', income: 460, expenses: 250, repayment: 80, reserve: 1050 },
      { month: 'Jan 26', income: 510, expenses: 275, repayment: 80, reserve: 1205 },
      { month: 'Feb 26', income: 270, expenses: 190, repayment: 80, reserve: 1205 },
      { month: 'Mar 26', income: 285, expenses: 200, repayment: 80, reserve: 1210 }
    ]
  },
  {
    id: 'david',
    name: 'David Cheruiyot',
    sector: 'Grain Milling & Storage Depot',
    location: 'Highway Commercial Hub',
    loanAmount: 2200,
    monthlyRepayment: 175,
    currentBalance: 1680,
    cashBufferMonths: 1.8,
    baseStress: 44,
    x: 705,
    y: 165,
    radius: 40,
    vulnerabilityTrait: 'Direct volume conduit for regional maize crops',
    bioNote: 'Diesel-powered posho mill serving 60+ growers. Heavily capitalized with the group’s largest loan. Cash flow contracts if grain harvest dries up.',
    shieldReason: 'Capital-dense equipment asset with residual liquidation buffer.',
    contributingFactors: [
      'High fixed monthly loan service ($175) and fuel expense',
      'Relies on Amina and neighboring growers for 55% of raw grain input',
      'Provides commercial flour credit lines to Grace Akinyi’s provisions shop'
    ],
    history: [
      { month: 'Oct 24', income: 620, expenses: 410, repayment: 175, reserve: 580 },
      { month: 'Nov 24', income: 590, expenses: 390, repayment: 175, reserve: 605 },
      { month: 'Dec 24', income: 840, expenses: 510, repayment: 175, reserve: 760 },
      { month: 'Jan 25', income: 780, expenses: 480, repayment: 175, reserve: 885 },
      { month: 'Feb 25', income: 510, expenses: 380, repayment: 175, reserve: 840 },
      { month: 'Mar 25', income: 480, expenses: 370, repayment: 175, reserve: 775 },
      { month: 'Apr 25', income: 460, expenses: 360, repayment: 175, reserve: 700 },
      { month: 'May 25', income: 490, expenses: 370, repayment: 175, reserve: 645 },
      { month: 'Jun 25', income: 540, expenses: 390, repayment: 175, reserve: 620 },
      { month: 'Jul 25', income: 720, expenses: 460, repayment: 175, reserve: 705 },
      { month: 'Aug 25', income: 810, expenses: 490, repayment: 175, reserve: 850 },
      { month: 'Sep 25', income: 680, expenses: 430, repayment: 175, reserve: 925 },
      { month: 'Oct 25', income: 610, expenses: 410, repayment: 175, reserve: 950 },
      { month: 'Nov 25', income: 580, expenses: 390, repayment: 175, reserve: 970 },
      { month: 'Dec 25', income: 830, expenses: 500, repayment: 175, reserve: 1125 },
      { month: 'Jan 26', income: 760, expenses: 470, repayment: 175, reserve: 1240 },
      { month: 'Feb 26', income: 520, expenses: 380, repayment: 175, reserve: 1205 },
      { month: 'Mar 26', income: 490, expenses: 370, repayment: 175, reserve: 1155 }
    ]
  },
  {
    id: 'grace',
    name: 'Grace Akinyi',
    sector: 'Provisions Store & Dry Goods',
    location: 'Market North Gate',
    loanAmount: 1100,
    monthlyRepayment: 95,
    currentBalance: 780,
    cashBufferMonths: 3.4,
    baseStress: 26,
    x: 575,
    y: 470,
    radius: 30,
    vulnerabilityTrait: 'Wholesale inventory costs & David co-guarantee',
    bioNote: 'Retail storefront trading in sugar, tea, cooking fat, and milled flour. Rapid inventory turn keeps working capital fluid and resilient.',
    shieldReason: 'Daily cash collections from non-perishable staples and 3.4 months reserve cushion.',
    contributingFactors: [
      'Healthy 3.4-month cash reserve shield protects against temporary shocks',
      'Holds joint guarantee obligation with David Cheruiyot ($380)',
      'Stable daily cash turnover buffers local demand dips'
    ],
    history: [
      { month: 'Oct 24', income: 440, expenses: 310, repayment: 95, reserve: 520 },
      { month: 'Nov 24', income: 430, expenses: 300, repayment: 95, reserve: 555 },
      { month: 'Dec 24', income: 590, expenses: 390, repayment: 95, reserve: 660 },
      { month: 'Jan 25', income: 470, expenses: 320, repayment: 95, reserve: 715 },
      { month: 'Feb 25', income: 420, expenses: 300, repayment: 95, reserve: 740 },
      { month: 'Mar 25', income: 430, expenses: 305, repayment: 95, reserve: 770 },
      { month: 'Apr 25', income: 450, expenses: 310, repayment: 95, reserve: 815 },
      { month: 'May 25', income: 440, expenses: 305, repayment: 95, reserve: 855 },
      { month: 'Jun 25', income: 450, expenses: 310, repayment: 95, reserve: 900 },
      { month: 'Jul 25', income: 480, expenses: 330, repayment: 95, reserve: 955 },
      { month: 'Aug 25', income: 510, expenses: 340, repayment: 95, reserve: 1030 },
      { month: 'Sep 25', income: 460, expenses: 320, repayment: 95, reserve: 1075 },
      { month: 'Oct 25', income: 450, expenses: 310, repayment: 95, reserve: 1120 },
      { month: 'Nov 25', income: 440, expenses: 305, repayment: 95, reserve: 1160 },
      { month: 'Dec 25', income: 570, expenses: 380, repayment: 95, reserve: 1255 },
      { month: 'Jan 26', income: 480, expenses: 320, repayment: 95, reserve: 1320 },
      { month: 'Feb 26', income: 430, expenses: 300, repayment: 95, reserve: 1355 },
      { month: 'Mar 26', income: 440, expenses: 310, repayment: 95, reserve: 1390 }
    ]
  },
  {
    id: 'hassan',
    name: 'Hassan Abdi',
    sector: 'Dairy & Goat Husbandry',
    location: 'Ridge Grazing Common',
    loanAmount: 1500,
    monthlyRepayment: 125,
    currentBalance: 1210,
    cashBufferMonths: 1.6,
    baseStress: 48,
    x: 345,
    y: 470,
    radius: 35,
    vulnerabilityTrait: 'Feed input pricing and dry-season forage scarcity',
    bioNote: 'Maintains 6 dairy cows and 18 goats. Produces 45 litres of milk daily delivered to local tea vendors and households.',
    shieldReason: 'Perishability creates daily discipline; diversified livestock assets.',
    contributingFactors: [
      'Purchases maize crop residues and bran from Amina and David for herd feed',
      'Cross-guarantee liability tied to Beatrice Kemboi ($350)',
      'Dry-season feed price spikes compress daily operating surplus'
    ],
    history: [
      { month: 'Oct 24', income: 480, expenses: 320, repayment: 125, reserve: 380 },
      { month: 'Nov 24', income: 460, expenses: 310, repayment: 125, reserve: 405 },
      { month: 'Dec 24', income: 540, expenses: 350, repayment: 125, reserve: 470 },
      { month: 'Jan 25', income: 450, expenses: 320, repayment: 125, reserve: 475 },
      { month: 'Feb 25', income: 390, expenses: 340, repayment: 125, reserve: 400 },
      { month: 'Mar 25', income: 370, expenses: 360, repayment: 125, reserve: 285 },
      { month: 'Apr 25', income: 440, expenses: 320, repayment: 125, reserve: 280 },
      { month: 'May 25', income: 470, expenses: 310, repayment: 125, reserve: 315 },
      { month: 'Jun 25', income: 480, expenses: 315, repayment: 125, reserve: 355 },
      { month: 'Jul 25', income: 490, expenses: 320, repayment: 125, reserve: 400 },
      { month: 'Aug 25', income: 510, expenses: 330, repayment: 125, reserve: 455 },
      { month: 'Sep 25', income: 480, expenses: 320, repayment: 125, reserve: 490 },
      { month: 'Oct 25', income: 470, expenses: 315, repayment: 125, reserve: 520 },
      { month: 'Nov 25', income: 450, expenses: 310, repayment: 125, reserve: 535 },
      { month: 'Dec 25', income: 520, expenses: 345, repayment: 125, reserve: 585 },
      { month: 'Jan 26', income: 440, expenses: 320, repayment: 125, reserve: 580 },
      { month: 'Feb 26', income: 390, expenses: 350, repayment: 125, reserve: 495 },
      { month: 'Mar 26', income: 380, expenses: 360, repayment: 125, reserve: 395 }
    ]
  },
  {
    id: 'fatima',
    name: 'Fatima Zahra',
    sector: 'Ceramic Clayware & Cookstoves',
    location: 'Potters Kiln Quarter',
    loanAmount: 650,
    monthlyRepayment: 55,
    currentBalance: 390,
    cashBufferMonths: 3.8,
    baseStress: 22,
    x: 215,
    y: 165,
    radius: 25,
    vulnerabilityTrait: 'Low nominal loan balance; minimal input dependence',
    bioNote: 'Builds fuel-efficient clay stoves and water urns from local river clay. Sells to regional buyers and municipal women’s groups.',
    shieldReason: 'Negligible supply chain reliance; free local raw materials; modest $55 loan obligation.',
    contributingFactors: [
      'Low raw material expenditure — clay harvested from common riverbank',
      'Small monthly debt obligation ($55) easily covered by baseline sales',
      'Holds minor guarantee bond with Amina ($200) well within reserve capacity'
    ],
    history: [
      { month: 'Oct 24', income: 240, expenses: 110, repayment: 55, reserve: 380 },
      { month: 'Nov 24', income: 230, expenses: 105, repayment: 55, reserve: 450 },
      { month: 'Dec 24', income: 280, expenses: 120, repayment: 55, reserve: 555 },
      { month: 'Jan 25', income: 250, expenses: 110, repayment: 55, reserve: 640 },
      { month: 'Feb 25', income: 220, expenses: 100, repayment: 55, reserve: 705 },
      { month: 'Mar 25', income: 230, expenses: 105, repayment: 55, reserve: 775 },
      { month: 'Apr 25', income: 240, expenses: 110, repayment: 55, reserve: 850 },
      { month: 'May 25', income: 250, expenses: 110, repayment: 55, reserve: 935 },
      { month: 'Jun 25', income: 240, expenses: 105, repayment: 55, reserve: 1015 },
      { month: 'Jul 25', income: 260, expenses: 115, repayment: 55, reserve: 1105 },
      { month: 'Aug 25', income: 270, expenses: 120, repayment: 55, reserve: 1200 },
      { month: 'Sep 25', income: 250, expenses: 110, repayment: 55, reserve: 1285 },
      { month: 'Oct 25', income: 240, expenses: 105, repayment: 55, reserve: 1365 },
      { month: 'Nov 25', income: 235, expenses: 105, repayment: 55, reserve: 1440 },
      { month: 'Dec 25', income: 275, expenses: 120, repayment: 55, reserve: 1540 },
      { month: 'Jan 26', income: 245, expenses: 110, repayment: 55, reserve: 1620 },
      { month: 'Feb 26', income: 225, expenses: 100, repayment: 55, reserve: 1690 },
      { month: 'Mar 26', income: 235, expenses: 105, repayment: 55, reserve: 1765 }
    ]
  },
  {
    id: 'samuel',
    name: 'Samuel Kiprono',
    sector: 'Poultry & Egg Collective',
    location: 'South Valley Outpost',
    loanAmount: 800,
    monthlyRepayment: 70,
    currentBalance: 490,
    cashBufferMonths: 4.1,
    baseStress: 19,
    x: 725,
    y: 355,
    radius: 27,
    vulnerabilityTrait: 'High liquid daily cash flow; zero exposure to Amina',
    bioNote: 'Maintains 400 layers in ventilated coops. Delivers 25 trays of eggs daily to local grocers and school hostels.',
    shieldReason: 'Completely insulated from crop failures; direct retail daily liquidity; 4.1 months reserve.',
    contributingFactors: [
      'Unbroken daily revenue flow creates immediate debt repayment coverage',
      'No co-guarantee link or debt exposure to the grain farming cluster',
      '4.1 months liquidity buffer safely stationed in SACCO savings account'
    ],
    history: [
      { month: 'Oct 24', income: 360, expenses: 220, repayment: 70, reserve: 490 },
      { month: 'Nov 24', income: 350, expenses: 215, repayment: 70, reserve: 555 },
      { month: 'Dec 24', income: 420, expenses: 240, repayment: 70, reserve: 665 },
      { month: 'Jan 25', income: 370, expenses: 225, repayment: 70, reserve: 740 },
      { month: 'Feb 25', income: 360, expenses: 220, repayment: 70, reserve: 810 },
      { month: 'Mar 25', income: 365, expenses: 225, repayment: 70, reserve: 880 },
      { month: 'Apr 25', income: 375, expenses: 230, repayment: 70, reserve: 955 },
      { month: 'May 25', income: 380, expenses: 230, repayment: 70, reserve: 1035 },
      { month: 'Jun 25', income: 370, expenses: 225, repayment: 70, reserve: 1110 },
      { month: 'Jul 25', income: 385, expenses: 235, repayment: 70, reserve: 1190 },
      { month: 'Aug 25', income: 395, expenses: 240, repayment: 70, reserve: 1275 },
      { month: 'Sep 25', income: 375, expenses: 230, repayment: 70, reserve: 1350 },
      { month: 'Oct 25', income: 370, expenses: 225, repayment: 70, reserve: 1425 },
      { month: 'Nov 25', income: 365, expenses: 225, repayment: 70, reserve: 1495 },
      { month: 'Dec 25', income: 410, expenses: 240, repayment: 70, reserve: 1595 },
      { month: 'Jan 26', income: 380, expenses: 230, repayment: 70, reserve: 1675 },
      { month: 'Feb 26', income: 370, expenses: 225, repayment: 70, reserve: 1750 },
      { month: 'Mar 26', income: 375, expenses: 230, repayment: 70, reserve: 1825 }
    ]
  }
];

export const INITIAL_CONNECTIONS: Connection[] = [
  {
    id: 'conn_amina_beatrice',
    source: 'amina',
    target: 'beatrice',
    type: 'mutual_guarantee',
    strength: 0.82,
    label: 'Joint Guarantee ($450 bond)',
    details: 'Beatrice Kemboi signed as first-line guarantor for Amina’s agricultural facility; mutual liability triggers upon 30 days arrears.',
    curveOffset: { x: -35, y: 30 }
  },
  {
    id: 'conn_amina_david',
    source: 'amina',
    target: 'david',
    type: 'supply_link',
    strength: 0.78,
    label: 'Maize Milling Supply Contract',
    details: 'David Cheruiyot processes 55% of Amina’s seasonal grain crop. Shortfalls directly idle mill operational capacity.',
    curveOffset: { x: 20, y: -40 }
  },
  {
    id: 'conn_amina_hassan',
    source: 'amina',
    target: 'hassan',
    type: 'supply_link',
    strength: 0.65,
    label: 'Livestock Fodder & Stalks Trade',
    details: 'Hassan relies on Amina for post-harvest stalks and silage. A crop loss forces costly transport imports from outside the district.',
    curveOffset: { x: -20, y: 35 }
  },
  {
    id: 'conn_david_grace',
    source: 'david',
    target: 'grace',
    type: 'supply_link',
    strength: 0.72,
    label: 'Commercial Flour Consignment',
    details: 'David provides wholesale fortified flour on 14-day rolling credit terms to Grace’s central market storefront.',
    curveOffset: { x: 30, y: 15 }
  },
  {
    id: 'conn_david_grace_guar',
    source: 'david',
    target: 'grace',
    type: 'mutual_guarantee',
    strength: 0.60,
    label: 'Shared Working Capital Pledge ($380)',
    details: 'Secondary co-guarantee bond securing commercial credit lines between wholesale depot and retail market unit.',
    curveOffset: { x: 45, y: -25 }
  },
  {
    id: 'conn_beatrice_hassan',
    source: 'beatrice',
    target: 'hassan',
    type: 'mutual_guarantee',
    strength: 0.52,
    label: 'Artisan Mutual Pledge ($350)',
    details: 'Cross-pledge formed in the founding lending cycle between tailoring guild and pasture ridge cooperative members.',
    curveOffset: { x: -10, y: 40 }
  },
  {
    id: 'conn_fatima_amina',
    source: 'fatima',
    target: 'amina',
    type: 'mutual_guarantee',
    strength: 0.38,
    label: 'Ceramic Guild Anchor ($200)',
    details: 'Community solidarity bond pledging backup liquidity support for planting cycles.',
    curveOffset: { x: -45, y: -20 }
  },
  {
    id: 'conn_grace_samuel',
    source: 'grace',
    target: 'samuel',
    type: 'supply_link',
    strength: 0.44,
    label: 'Daily Egg Distribution Line',
    details: 'Grace stocks 12 egg crates daily on cash-on-delivery terms from Samuel’s poultry layer sheds.',
    curveOffset: { x: 35, y: 25 }
  }
];

export const SHOCK_OPTIONS: ShockConfig[] = [
  {
    id: 'crop_failure',
    name: 'Severe Drought & Late Rains (Crop Failure)',
    description: 'Depresses agricultural harvest yields by 65%, eliminates seasonal surplus cash, and halts crop residues needed by livestock.',
    icon: 'sprout',
    defaultSeverity: 72
  },
  {
    id: 'medical_expense',
    name: 'Acute Household Medical Emergency',
    description: 'Demands an immediate lump-sum cash drainage of $380 for hospitalization, depleting liquid operational buffers.',
    icon: 'heart-pulse',
    defaultSeverity: 58
  },
  {
    id: 'income_drop',
    name: 'Wholesale Market Stagnation & Price Crash',
    description: 'Local market consumer spending drops 40% over three consecutive months, eroding inventory gross margins.',
    icon: 'trending-down',
    defaultSeverity: 50
  },
  {
    id: 'market_slowdown',
    name: 'Transport Fuel Surge & Input Cost Spike',
    description: 'Fuel and transport tariffs surge 50%, compressing operational margins for milling equipment and distance deliveries.',
    icon: 'truck',
    defaultSeverity: 45
  }
];

export const INTERVENTION_OPTIONS: InterventionOption[] = [
  {
    id: 'none',
    name: 'Monitor Only (Standard Follow-up)',
    shortDesc: 'Maintain existing repayment schedules without financial buffer injection.',
    actionNote: 'No balance sheet intervention applied. Stress diffuses freely across all guarantee and commercial ties.',
    groupReliefDescription: 'Group absorbs full contagion through mutual guarantees and supply delays.'
  },
  {
    id: 'grace_period',
    name: '90-Day Principal Repayment Moratorium',
    shortDesc: 'Pauses principal amortization for 3 months, requiring interest-only token service ($15/mo).',
    actionNote: 'Preserves operating liquidity in the borrower’s bank account, preventing immediate cash exhaustion during harvest recovery.',
    groupReliefDescription: 'Cuts contagion risk by 68%. Co-guarantors Beatrice and Hassan remain completely uncalled.'
  },
  {
    id: 'liquidity_support',
    name: 'Targeted Working Capital Micro-Grant ($220)',
    shortDesc: 'Injects non-repayable emergency working capital from the cooperative emergency reserve.',
    actionNote: 'Restores operating cash cushion above minimum threshold, allowing continuation of input purchases and supply obligations.',
    groupReliefDescription: 'Eliminates cross-default threat to grain milling depot; overall group risk drops to nominal.'
  },
  {
    id: 'restructuring',
    name: 'Term Restructuring (Extend 12 to 24 Months)',
    shortDesc: 'Recalculates amortization schedule, lowering monthly debt service from $115 to $58.',
    actionNote: 'Permanently reduces monthly cash burn to fit depressed post-shock revenue levels without technical default.',
    groupReliefDescription: 'Provides sustainable recovery pathway; converts acute liquidity distress into manageable long-term tenure.'
  }
];

export const INITIAL_LEDGER_ITEMS: LedgerItem[] = [
  {
    id: 'ledg-01',
    date: '14 Sep 2026',
    borrowerName: 'Amina Wanjiku',
    actionType: 'Seasonal Field Audit',
    evidenceText: 'Soil moisture deficits confirmed in Eldoret East parcel. Maize planting delayed by 21 days; reserve cushion stands at 1.2 months.',
    outcomeNote: 'Pre-emptive flag placed on Beatrice Kemboi guarantee bond.'
  },
  {
    id: 'ledg-02',
    date: '28 Aug 2026',
    borrowerName: 'David Cheruiyot',
    actionType: 'Equipment Inspection',
    evidenceText: 'Posho diesel mill serviced; fuel expenditure tracking higher due to regional supply tariffs. Cash reserve stable at 1.8 months.',
    outcomeNote: 'Supply connection to Grace Akinyi verified current.'
  },
  {
    id: 'ledg-03',
    date: '11 Aug 2026',
    borrowerName: 'Fatima Zahra',
    actionType: 'Resilience Certification',
    evidenceText: 'Ceramic stove bulk contract closed with County Environment Directorate. Zero debt delinquency across 18 consecutive months.',
    outcomeNote: 'Maintained in Healthy Borrower Shield.'
  },
  {
    id: 'ledg-04',
    date: '02 Jul 2026',
    borrowerName: 'Samuel Kiprono',
    actionType: 'Daily Turnover Verification',
    evidenceText: 'Layer flock productivity logged at 89% lay rate. Daily retail cash deposits averaging $14/day with direct SACCO credit.',
    outcomeNote: 'Affirmed as highest insulation borrower in cooperative.'
  }
];
