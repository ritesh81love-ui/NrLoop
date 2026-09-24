const SHEET_ENDPOINT = 'https://script.google.com/macros/s/AKfycbwc58ufBObqWAjY0eS49U5ApPL8UpufS1kyTvsLRyKiTbKluylkpHXgWQ1hSUvg7MV7XA/exec';
const form = document.querySelector('[data-interest-form]');
if (form) {
  const status = form.querySelector('[data-status]');
  const button = form.querySelector('button[type="submit"]');
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    if (form.querySelector('[name="services"]') && !form.querySelector('[name="services"]:checked')) {
      status.textContent = 'Please select at least one service.';
      status.className = 'form-status error';
      form.querySelector('[name="services"]').focus();
      return;
    }
    const data = new FormData(form);
    const values = Object.fromEntries([...new Set([...data.keys()])].map(key => [key, data.getAll(key).join(', ')]));
    const consent = form.querySelector('[name="contactConsent"]');
    const business = values.role === 'business';
    const payload = {
      formType: business ? 'business' : 'customer',
      firstName: business ? '' : (values.name || '').split(' ')[0],
      contactName: business ? '' : values.name || '',
      businessName: business ? values.bizName || '' : '',
      email: business ? values.bizEmail || '' : values.email || '',
      suburb: business ? '' : values.suburb || '',
      services: business ? '' : values.services || '',
      bookingPreference: business ? '' : values.priorityRank || '',
      serviceArea: business ? values.bizSuburb || '' : '',
      mainService: business ? values.bizCategory || '' : '',
      groupPricing: business ? values.groupSizes || '' : '',
      idealJobs: business ? values.bizVolume || '' : '',
      notes: [values.concern, business ? values.categorySuggestion : values.serviceSuggestion,
        business ? values.businessReferral && `Suggested business: ${values.businessReferral}` : ''].filter(Boolean).join(' | '),
      consent: consent?.checked ? 'Email updates: yes' : 'Email updates: no',
      source: 'Pilot three-page site',
      pageUrl: location.href
    };
    button.disabled = true;
    button.textContent = 'Sending…';
    status.textContent = '';
    status.className = 'form-status';
    try {
      // Apps Script's ContentService redirects do not reliably expose CORS responses to GitHub Pages.
      // A no-cors POST can confirm transport, but cannot verify the row was written.
      await fetch(SHEET_ENDPOINT, {method:'POST', mode:'no-cors', headers:{'Content-Type':'text/plain;charset=utf-8'}, body:JSON.stringify(payload)});
      status.textContent = 'Thank you. Your response was sent. We cannot confirm the Sheet entry from this page.';
      status.classList.add('success');
      form.reset();
    } catch (error) {
      status.textContent = 'Your response could not be sent. Please check your connection and try again.';
      status.classList.add('error');
    } finally {
      button.disabled = false;
      button.textContent = 'Send my feedback';
    }
  });
}
