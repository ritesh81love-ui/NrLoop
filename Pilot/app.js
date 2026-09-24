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
    // Preserve the field names used by the currently deployed interest Sheet.
    const payload = new URLSearchParams({
      role: values.role || '', name: values.name || '', email: values.email || '',
      suburb: values.suburb || '', services: values.services || '',
      serviceSuggestion: values.serviceSuggestion || '',
      bizName: values.bizName || '', bizEmail: values.bizEmail || '',
      bizCategory: values.bizCategory || '', bizSuburb: values.bizSuburb || '',
      bizVolume: values.bizVolume || '', categorySuggestion: values.categorySuggestion || '',
      rating: '', reasons: business ? `Suggested group sizes: ${values.groupSizes || 'not specified'}` : values.priorityRank || '',
      concern: [values.concern, business && values.businessReferral ? `Business referral: ${values.businessReferral}` : ''].filter(Boolean).join(' | '),
      priorityRank: values.priorityRank || '',
      notifyPrefs: consent?.checked ? 'Email' : 'No updates'
    });
    button.disabled = true;
    button.textContent = 'Sending…';
    status.textContent = '';
    status.className = 'form-status';
    try {
      // The deployed Apps Script accepts URL-encoded form fields. Its CORS response
      // is opaque on GitHub Pages, so transport success is not proof of a saved row.
      await fetch(SHEET_ENDPOINT, {method:'POST', mode:'no-cors', headers:{'Content-Type':'application/x-www-form-urlencoded'}, body:payload});
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
