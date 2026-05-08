const xlsx = require('xlsx');

const MONTHS = [
  'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december',
];

const MEASURE_KEYS = ['PTC', 'PAC', 'FTC', 'FAC'];

function normalizeKey(value) {
  return String(value ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '');
}

function cleanCell(value) {
  if (value === undefined || value === null) return '';
  if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  const text = String(value).trim();
  if (!text || text === '-') return '';
  return text;
}

function stableIdFromText(text) {
  let hash = 0;
  const input = String(text || '');
  for (let index = 0; index < input.length; index += 1) {
    hash = ((hash << 5) - hash + input.charCodeAt(index)) | 0;
  }
  return Math.abs(hash) || Date.now();
}

function buildEmptyMeasures() {
  return MEASURE_KEYS.reduce((measureAcc, measureKey) => {
    measureAcc[measureKey] = MONTHS.reduce((monthAcc, month) => {
      monthAcc[month] = '';
      return monthAcc;
    }, {});
    return measureAcc;
  }, {});
}

function findHeaderRowIndex(rows) {
  return rows.findIndex((row) => {
    const normalized = row.map(normalizeKey);
    return normalized.includes('nameoftheproject') && normalized.includes('measure');
  });
}

function findColumnIndex(headers, candidates) {
  return headers.findIndex((header) => {
    const normalized = normalizeKey(header);
    return candidates.some((candidate) => normalized.includes(candidate));
  });
}

function parseWorkbook(buffer, fallbackSheetName = '') {
  const workbook = xlsx.read(buffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0] || fallbackSheetName || 'Imported Budget Line';
  const worksheet = workbook.Sheets[sheetName];
  const rows = xlsx.utils.sheet_to_json(worksheet, { header: 1, defval: '' });

  const headerRowIndex = findHeaderRowIndex(rows);
  if (headerRowIndex === -1) {
    throw new Error('Unable to find the table header row in the workbook.');
  }

  const headers = rows[headerRowIndex];
  const indices = {
    projectNumber: 0,
    projectName: findColumnIndex(headers, ['nameoftheproject']),
    duration: findColumnIndex(headers, ['dateofcommencement', 'duration']),
    tec: findColumnIndex(headers, ['tec']),
    awardedSum: findColumnIndex(headers, ['awardedsum']),
    revisedCost: findColumnIndex(headers, ['revisedcost']),
    physicalProgress: findColumnIndex(headers, ['physicalprogress']),
    financialProgress: findColumnIndex(headers, ['financialprogress']),
    allocation2026: findColumnIndex(headers, ['allocationfortheyear2026', 'allocation2026']),
    measure: findColumnIndex(headers, ['measure']),
    kpi: findColumnIndex(headers, ['kpi']),
    output: findColumnIndex(headers, ['output']),
    outcome: findColumnIndex(headers, ['outcome']),
    responsibleOfficer: findColumnIndex(headers, ['responsibleofficer']),
    remarks: findColumnIndex(headers, ['remarks', 'presentstatus']),
  };

  const monthIndices = MONTHS.map((month) => findColumnIndex(headers, [month]));
  const importedRows = [];
  const budgetLine = String(sheetName).replace(/^budget\s*line\s*:?\s*/i, '').trim() || sheetName;

  let currentGroup = [];

  const flushGroup = () => {
    if (!currentGroup.length) return;
    const firstRow = currentGroup[0];
    const projectNumberValue = cleanCell(firstRow[indices.projectNumber]);
    const projectName = cleanCell(firstRow[indices.projectName]);

    if (!projectName) {
      currentGroup = [];
      return;
    }

    const duration = cleanCell(firstRow[indices.duration]);
    const measures = buildEmptyMeasures();
    const monthlyProgress = MONTHS.reduce((acc, month) => {
      acc[month] = { pt: '', pp: '', ft: '', fp: '' };
      return acc;
    }, {});

    const measureRowByKey = new Map();
    for (const row of currentGroup) {
      const measureValue = cleanCell(row[indices.measure]).toUpperCase();
      if (MEASURE_KEYS.includes(measureValue)) {
        measureRowByKey.set(measureValue, row);
      }
    }

    MEASURE_KEYS.forEach((measureKey) => {
      const row = measureRowByKey.get(measureKey);
      if (!row) return;
      MONTHS.forEach((month, monthIndex) => {
        const cellValue = cleanCell(row[monthIndices[monthIndex]]);
        if (!cellValue) return;

        measures[measureKey][month] = cellValue;
        if (measureKey === 'PTC') monthlyProgress[month].pt = cellValue;
        if (measureKey === 'PAC') monthlyProgress[month].pp = cellValue;
        if (measureKey === 'FTC') monthlyProgress[month].ft = cellValue;
        if (measureKey === 'FAC') monthlyProgress[month].fp = cellValue;
      });
    });

    const stableSeed = `${budgetLine}|${projectNumberValue || projectName}`;
    const projectNumber = Number(projectNumberValue);

    importedRows.push({
      id: stableIdFromText(stableSeed),
      department: '',
      district: '',
      budgetLine,
      projectNumber: Number.isFinite(projectNumber) ? projectNumber : importedRows.length + 1,
      projectName,
      startDate: '',
      endDate: '',
      duration,
      npd: '',
      tec: cleanCell(firstRow[indices.tec]),
      awardedSum: cleanCell(firstRow[indices.awardedSum]),
      revisedCost: cleanCell(firstRow[indices.revisedCost]),
      physicalProgress: cleanCell(firstRow[indices.physicalProgress]),
      financialProgress: cleanCell(firstRow[indices.financialProgress]),
      allocation2026: cleanCell(firstRow[indices.allocation2026]),
      kpi: cleanCell(firstRow[indices.kpi]),
      output: cleanCell(firstRow[indices.output]),
      outcome: cleanCell(firstRow[indices.outcome]),
      responsibleOfficer: cleanCell(firstRow[indices.responsibleOfficer]),
      reasonsForDelays: '',
      remarks: cleanCell(firstRow[indices.remarks]) || duration,
      milestones: [],
      risks: [],
      documents: [],
      monthlyProgress,
      measures: {
        ...measures,
        output: cleanCell(firstRow[indices.output]),
        outcome: cleanCell(firstRow[indices.outcome]),
      },
    });

    currentGroup = [];
  };

  for (let rowIndex = headerRowIndex + 1; rowIndex < rows.length; rowIndex += 1) {
    const row = rows[rowIndex];
    const firstCell = cleanCell(row[0]);

    if (!firstCell) {
      if (currentGroup.length) currentGroup.push(row);
      continue;
    }

    if (/^total$/i.test(firstCell) || /^grand\s*total$/i.test(firstCell)) {
      flushGroup();
      break;
    }

    const parsedNumber = Number(firstCell);
    if (Number.isFinite(parsedNumber)) {
      flushGroup();
      currentGroup = [row];
      continue;
    }

    if (currentGroup.length) {
      currentGroup.push(row);
    }
  }

  flushGroup();

  return {
    sheetName,
    budgetLine,
    importedRows,
  };
}

module.exports = {
  parseWorkbook,
};