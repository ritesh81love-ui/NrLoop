const SHEET_NAME = 'NrLoop Interest';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents || '{}');
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow([
        'Timestamp','Form Type','First Name','Contact Name','Business Name','Email','Mobile','Suburb','Postcode','Services','Timeframe','Booking Preference','ABN','Service Area','Radius','Main Service','Group Pricing','Ideal Jobs','Notes','Consent','Source','Page URL'
      ]);
      sheet.setFrozenRows(1);
    }
    const services = Array.isArray(data.services) ? data.services.join(', ') : (data.services || '');
    sheet.appendRow([
      new Date(), data.formType || '', data.firstName || '', data.contactName || '', data.businessName || '', data.email || '', data.mobile || '', data.suburb || '', data.postcode || '', services, data.timeframe || '', data.bookingPreference || '', data.abn || '', data.serviceArea || '', data.radius || '', data.mainService || '', data.groupPricing || '', data.idealJobs || '', data.notes || data.businessNotes || '', data.consent || '', data.source || '', data.pageUrl || ''
    ]);
    return ContentService.createTextOutput(JSON.stringify({ok:true})).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ok:false,error:String(err)})).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService.createTextOutput('NrLoop interest endpoint is running.');
}