// Data is read from the public-listings tab in the club-submission spreadsheet.
// This tab has sample, approved data and must be publicly readable to go live.
const GOOGLE_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/1a1Q6IptCoA1PE0WetuXAw3MiVuUwP6vNP9Aliil9xkQ/gviz/tq?tqx=out:csv&gid=6275336';

// Add the Google Form URL here when it is ready. It is intentionally separate
// from the public Sheet so private submitter details are never exposed.
const GOOGLE_FORM_URL = '';
const LOCAL_FALLBACK_CSV = 'clubs.csv';

const grid = document.querySelector('#club-grid');
const empty = document.querySelector('#empty-state');
const resultCount = document.querySelector('#result-count');
const dataStatus = document.querySelector('#data-status');
const searchInput = document.querySelector('#search-input');
const cityFilter = document.querySelector('#city-filter');
const districtFilter = document.querySelector('#district-filter');
const statusFilter = document.querySelector('#status-filter');
const levelFilter = document.querySelector('#level-filter');
const clearButton = document.querySelector('#clear-filters');
let clubs = [];

const split = value => String(value || '').split(/[|,]/).map(item => item.trim()).filter(Boolean);
const escapeHtml = value => String(value || '').replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]);
const cleanKey = key => String(key || '')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/đ/g, 'd')
  .trim()
  .toLowerCase()
  .replace(/[\s/_-]+/g, '_')
  .replace(/[^a-z0-9_]/g, '');

function parseCSV(text) {
  const rows = []; let row = []; let cell = ''; let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i]; const next = text[i + 1];
    if (char === '"' && quoted && next === '"') { cell += '"'; i += 1; }
    else if (char === '"') quoted = !quoted;
    else if (char === ',' && !quoted) { row.push(cell); cell = ''; }
    else if ((char === '\n' || char === '\r') && !quoted) {
      if (char === '\r' && next === '\n') i += 1;
      if (row.length || cell) { row.push(cell); rows.push(row); row = []; cell = ''; }
    } else cell += char;
  }
  if (row.length || cell) { row.push(cell); rows.push(row); }
  const [headers = [], ...data] = rows;
  return data.map(values => Object.fromEntries(headers.map((header, index) => [cleanKey(header), values[index] || ''])));
}

function valueOf(row, ...keys) { return keys.map(key => row[cleanKey(key)]).find(Boolean) || ''; }
function normaliseClub(row, index) {
  return {
    id: valueOf(row, 'id') || `club-${index}`,
    name: valueOf(row, 'name', 'club_name', 'club_or_community_name', 'tên câu lạc bộ hoặc cộng đồng'),
    city: valueOf(row, 'city', 'province_city', 'province', 'province_or_city', 'tỉnh thành phố'),
    district: valueOf(row, 'district', 'district_quan_huyen_city_within_province', 'quận huyện'),
    venue: valueOf(row, 'venue', 'primary_venue_name', 'address_venue_details', 'tên sân hoặc địa điểm chơi'),
    address: valueOf(row, 'address', 'street_address', 'address_venue_details'),
    mapsUrl: valueOf(row, 'maps_url', 'google_maps_link'),
    status: valueOf(row, 'status', 'recruiting_status', 'are_you_accepting_new_members', 'câu lạc bộ có đang nhận người chơi mới không') || 'Contact club',
    levels: valueOf(row, 'levels', 'welcomed_playing_levels', 'desired_member_level', 'phần 3 trình độ người chơi phù hợp'),
    times: valueOf(row, 'times', 'typical_time', 'khung giờ thường chơi'),
    contactLabel: valueOf(row, 'contact_label', 'preferred_contact_method', 'how_should_players_contact_the_club', 'phần 4 cách liên hệ ưu tiên') || 'Contact club',
    contactUrl: valueOf(row, 'contact_url', 'public_contact_link_or_handle', 'contact_link', 'link liên hệ tên tài khoản hoặc số điện thoại'),
    cost: valueOf(row, 'cost', 'membership_fee_cost', 'typical_cost_per_player', 'chi phí thông thường'),
    description: valueOf(row, 'description', 'short_description', 'mô tả ngắn'),
    listingStatus: valueOf(row, 'public_listing_status'),
    moderationStatus: valueOf(row, 'moderation_status')
  };
}

function usableClubs(rows) {
  return rows.map(normaliseClub).filter(club => {
    if (!club.name) return false;
    const approved = !club.moderationStatus || club.moderationStatus.toLowerCase() === 'approved';
    const published = !club.listingStatus || club.listingStatus.toLowerCase() === 'published';
    return approved && published;
  });
}
function unique(values) { return [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b)); }
function addOptions(select, values, placeholder) {
  const selected = select.value;
  select.innerHTML = `<option value="">${placeholder}</option>`;
  values.forEach(value => select.add(new Option(value, value)));
  select.value = values.includes(selected) ? selected : '';
}
function populateFilters() {
  addOptions(cityFilter, unique(clubs.map(club => club.city)), 'All provinces & cities');
  const districtRows = cityFilter.value ? clubs.filter(club => club.city === cityFilter.value) : clubs;
  addOptions(districtFilter, unique(districtRows.map(club => club.district)), 'All districts');
  addOptions(statusFilter, unique(clubs.map(club => club.status)), 'Any status');
}
function currentClubs() {
  const search = searchInput.value.trim().toLowerCase();
  return clubs.filter(club => {
    const searchable = [club.name, club.city, club.district, club.venue, club.address, club.description, club.levels].join(' ').toLowerCase();
    return (!search || searchable.includes(search)) &&
      (!cityFilter.value || club.city === cityFilter.value) &&
      (!districtFilter.value || club.district === districtFilter.value) &&
      (!statusFilter.value || club.status === statusFilter.value) &&
      (!levelFilter.value || split(club.levels).includes(levelFilter.value));
  });
}
function card(club) {
  const tags = [...split(club.levels), ...split(club.times).map(time => `${time} play`)].slice(0, 4);
  const location = [club.venue, [club.district, club.city].filter(Boolean).join(', ')].filter(Boolean).join(' · ');
  const mapAction = club.mapsUrl ? `<a href="${escapeHtml(club.mapsUrl)}" target="_blank" rel="noopener">View map <span>↗</span></a>` : '';
  const contactAction = club.contactUrl ? `<a class="contact" href="${escapeHtml(club.contactUrl)}" target="_blank" rel="noopener">${escapeHtml(club.contactLabel)} <span>↗</span></a>` : '';
  return `<article class="club-card"><div class="card-top"><span class="status ${escapeHtml(club.status.toLowerCase().replace(/\s+/g, '-'))}">${escapeHtml(club.status)}</span><span class="court-mark" aria-hidden="true"></span></div><h3>${escapeHtml(club.name)}</h3><p class="location">${escapeHtml(location || 'Vietnam')}</p><p class="description">${escapeHtml(club.description || 'Contact this club for the latest playing information.')}</p><div class="chips">${tags.map(tag => `<span>${escapeHtml(tag)}</span>`).join('')}</div>${club.cost ? `<p class="cost">${escapeHtml(club.cost)}</p>` : ''}<div class="card-actions">${mapAction}${contactAction}</div></article>`;
}
function updateStats() {
  const total = document.querySelector('#total-clubs');
  const recruiting = document.querySelector('#recruiting-clubs');
  const cities = document.querySelector('#covered-cities');
  if (total) total.textContent = clubs.length;
  if (recruiting) recruiting.textContent = clubs.filter(club => ['Open', 'Seeking players'].includes(club.status)).length;
  if (cities) cities.textContent = unique(clubs.map(club => club.city)).length;
}
function render() {
  const visible = currentClubs();
  resultCount.textContent = `${visible.length} ${visible.length === 1 ? 'club' : 'clubs'} ${visible.length === clubs.length ? 'in the directory' : 'match your search'}`;
  grid.innerHTML = visible.map(card).join('');
  empty.hidden = visible.length > 0;
  const active = searchInput.value || cityFilter.value || districtFilter.value || statusFilter.value || levelFilter.value;
  clearButton.hidden = !active;
}
function clearFilters() {
  searchInput.value = ''; cityFilter.value = ''; districtFilter.value = ''; statusFilter.value = ''; levelFilter.value = '';
  populateFilters(); render(); searchInput.focus();
}
function setFormLinks() {
  document.querySelector('#year').textContent = new Date().getFullYear();
  if (!GOOGLE_FORM_URL) return;
  ['form-link', 'submit-link'].forEach(id => {
    const link = document.querySelector(`#${id}`);
    link.href = GOOGLE_FORM_URL; link.removeAttribute('aria-disabled');
  });
  document.querySelector('#form-note').textContent = 'Every submission is reviewed before it goes live.';
}
async function loadListings() {
  try {
    const response = await fetch(GOOGLE_SHEET_CSV_URL);
    if (!response.ok) throw new Error('Sheet not available');
    clubs = usableClubs(parseCSV(await response.text()));
    if (!clubs.length) throw new Error('No approved listings');
    dataStatus.textContent = 'Live from the club directory';
  } catch (error) {
    const response = await fetch(LOCAL_FALLBACK_CSV);
    clubs = usableClubs(parseCSV(await response.text()));
    dataStatus.textContent = 'Directory preview';
  }
  populateFilters(); updateStats(); render();
}

searchInput.addEventListener('input', render);
cityFilter.addEventListener('change', () => { populateFilters(); render(); });
[districtFilter, statusFilter, levelFilter].forEach(filter => filter.addEventListener('change', render));
clearButton.addEventListener('click', clearFilters);
document.querySelector('#empty-clear').addEventListener('click', clearFilters);
setFormLinks(); loadListings();
