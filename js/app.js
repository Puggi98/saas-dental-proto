/* ═══════════════════════════════════════════════════════
   SaaS Dental — Prototype JS
   Sin dependencias backend. Solo interacciones visuales.
   ═══════════════════════════════════════════════════════ */

const ROLES = {
  superadmin: { label: 'Superadmin SaaS', name: 'Gastón Rocha',         initials: 'GR' },
  admin:      { label: 'Admin Clínica',  name: 'Dra. María Fernández', initials: 'MF' },
  odontologo: { label: 'Odontólogo',     name: 'Dr. Andrés Gutiérrez', initials: 'AG' },
  recepcion:  { label: 'Recepción',      name: 'Sofía Medrano',        initials: 'SM' },
};

const NAV_BY_ROLE = {
  superadmin: [
    { section: 'Plataforma SaaS', items: [
      { id: 'superadmin-dashboard', label: 'Overview',   icon: 'globe',       href: 'superadmin-dashboard.html' },
      { id: 'superadmin-tenants',   label: 'Clínicas',   icon: 'building-2',  href: 'superadmin-tenants.html', badge: '47' },
      { id: 'superadmin-billing',   label: 'Facturación', icon: 'credit-card', href: 'superadmin-tenants.html' },
    ]},
    { section: 'Mi clínica (impersonando Sonrisas)', items: [
      { id: 'dashboard',   label: 'Dashboard',   icon: 'layout-dashboard', href: 'dashboard.html' },
      { id: 'agenda',      label: 'Agenda',      icon: 'calendar-days',    href: 'agenda.html' },
      { id: 'pacientes',   label: 'Pacientes',   icon: 'users',            href: 'pacientes.html' },
    ]},
  ],
  admin: [
    { section: 'Operación', items: [
      { id: 'dashboard',   label: 'Dashboard',   icon: 'layout-dashboard', href: 'dashboard.html' },
      { id: 'agenda',      label: 'Agenda',      icon: 'calendar-days',    href: 'agenda.html' },
      { id: 'pacientes',   label: 'Pacientes',   icon: 'users',            href: 'pacientes.html' },
      { id: 'cobros',      label: 'Cobros',      icon: 'wallet',           href: 'cobros.html' },
    ]},
    { section: 'Gestión', items: [
      { id: 'reportes',       label: 'Reportes',     icon: 'bar-chart-3',    href: 'reportes.html' },
      { id: 'tratamientos',   label: 'Tratamientos', icon: 'list-checks',    href: 'tratamientos.html' },
      { id: 'inventario',     label: 'Inventario',   icon: 'package',        href: 'inventario.html' },
      { id: 'documentos',     label: 'Documentos',   icon: 'folder-open',    href: 'documentos.html' },
    ]},
    { section: 'Administración', items: [
      { id: 'admin-usuarios', label: 'Usuarios',    icon: 'user-cog',       href: 'admin-usuarios.html' },
      { id: 'admin-clinica',  label: 'Clínica',     icon: 'building-2',     href: 'admin-clinica.html' },
    ]},
  ],
  odontologo: [
    { section: 'Clínico', items: [
      { id: 'dashboard',  label: 'Dashboard',  icon: 'layout-dashboard', href: 'dashboard.html' },
      { id: 'agenda',     label: 'Mi agenda',  icon: 'calendar-days',    href: 'agenda.html', badge: '7' },
      { id: 'pacientes',  label: 'Pacientes',  icon: 'users',            href: 'pacientes.html' },
      { id: 'documentos', label: 'Documentos', icon: 'folder-open',      href: 'documentos.html' },
    ]},
    { section: 'Referencias', items: [
      { id: 'tratamientos', label: 'Tratamientos', icon: 'list-checks',  href: 'tratamientos.html' },
      { id: 'inventario',   label: 'Inventario',   icon: 'package',      href: 'inventario.html' },
    ]},
  ],
  recepcion: [
    { section: 'Operación diaria', items: [
      { id: 'dashboard', label: 'Dashboard',  icon: 'layout-dashboard', href: 'dashboard.html' },
      { id: 'agenda',    label: 'Agenda',     icon: 'calendar-days',    href: 'agenda.html', badge: '12' },
      { id: 'pacientes', label: 'Pacientes',  icon: 'users',            href: 'pacientes.html' },
      { id: 'cobros',    label: 'Cobros',     icon: 'wallet',           href: 'cobros.html' },
    ]},
  ],
};

// Role persistence across pages
function getRole() {
  return localStorage.getItem('demo_role') || 'admin';
}
function setRole(role) {
  localStorage.setItem('demo_role', role);
}

/* ── Layout injection ── */
function buildSidebar(activePage) {
  const role = getRole();
  const user = ROLES[role];
  const sections = NAV_BY_ROLE[role];

  let html = `
    <div class="sidebar-brand">
      <div class="sidebar-brand-mark">S</div>
      <div>
        <div class="sidebar-brand-name">Sonrisas</div>
        <div class="sidebar-brand-sub">Clínica Dental</div>
      </div>
    </div>
  `;

  sections.forEach(section => {
    html += `<div class="sidebar-section-label">${section.section}</div>`;
    html += `<nav class="sidebar-nav">`;
    section.items.forEach(item => {
      const active = item.id === activePage ? 'active' : '';
      const badge = item.badge ? `<span class="badge">${item.badge}</span>` : '';
      html += `
        <a href="${item.href}" class="sidebar-link ${active}" data-page="${item.id}">
          <i data-lucide="${item.icon}"></i>
          <span>${item.label}</span>
          ${badge}
        </a>
      `;
    });
    html += `</nav>`;
  });

  html += `
    <div class="sidebar-footer">
      <div class="sidebar-user" onclick="showToast('Perfil del usuario', 'info')">
        <div class="avatar">${user.initials}</div>
        <div class="sidebar-user-info">
          <div class="sidebar-user-name">${user.name}</div>
          <div class="sidebar-user-role">${user.label}</div>
        </div>
        <i data-lucide="chevrons-up-down" style="width:14px;height:14px;opacity:0.5"></i>
      </div>
    </div>
  `;

  return html;
}

function buildTopbar(breadcrumb, heading, withSearch = true) {
  const role = getRole();
  const user = ROLES[role];
  return `
    <div class="topbar-title">
      <div class="topbar-breadcrumb">${breadcrumb}</div>
      <div class="topbar-heading">${heading}</div>
    </div>
    <div class="topbar-actions">
      ${withSearch ? `
      <div class="topbar-search">
        <i data-lucide="search"></i>
        <input type="text" placeholder="Buscar pacientes, citas, cobros..." onkeydown="if(event.key==='Enter'){showToast('Búsqueda simulada','info');this.blur();}">
      </div>` : ''}
      <button class="role-switcher" onclick="openRoleSwitcher()">
        <span class="role-dot"></span>
        <span>${user.label}</span>
        <i data-lucide="chevrons-up-down"></i>
      </button>
      <button class="icon-btn" onclick="showToast('3 nuevas notificaciones','info')" aria-label="Notificaciones">
        <i data-lucide="bell"></i>
        <span class="dot"></span>
      </button>
      <button class="icon-btn" onclick="openSettingsMenu(event)" aria-label="Configuración">
        <i data-lucide="settings"></i>
      </button>
    </div>
  `;
}

/* ── initLayout: called from each page ── */
function initLayout({ page, breadcrumb, heading, withSearch = true }) {
  const sidebar = document.getElementById('sidebar');
  const topbar = document.getElementById('topbar');
  if (sidebar) sidebar.innerHTML = buildSidebar(page);
  if (topbar) topbar.innerHTML = buildTopbar(breadcrumb, heading, withSearch);
  ensureToastContainer();
  ensureRoleModal();
  if (window.lucide) lucide.createIcons();
}

/* ── Toasts ── */
function ensureToastContainer() {
  if (!document.querySelector('.toast-container')) {
    const c = document.createElement('div');
    c.className = 'toast-container';
    document.body.appendChild(c);
  }
}
function showToast(msg, type = 'success') {
  ensureToastContainer();
  const icons = { success: 'check-circle-2', error: 'x-circle', info: 'info' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<i data-lucide="${icons[type]}"></i><span>${msg}</span>`;
  document.querySelector('.toast-container').appendChild(toast);
  if (window.lucide) lucide.createIcons();
  setTimeout(() => {
    toast.style.animation = 'slideIn 0.2s ease-in reverse';
    setTimeout(() => toast.remove(), 200);
  }, 3200);
}

/* ── Role switcher modal ── */
function ensureRoleModal() {
  if (document.getElementById('role-modal')) return;
  const backdrop = document.createElement('div');
  backdrop.id = 'role-modal';
  backdrop.className = 'modal-backdrop';
  backdrop.innerHTML = `
    <div class="modal" onclick="event.stopPropagation()">
      <div class="modal-head">
        <div>
          <div class="modal-title">Cambiar de rol</div>
          <div class="modal-sub">Este prototipo simula múltiples roles del SaaS Dental</div>
        </div>
        <button class="modal-close" onclick="closeRoleSwitcher()"><i data-lucide="x"></i></button>
      </div>
      <div class="modal-body" id="role-options"></div>
      <div class="modal-actions">
        <button class="btn btn-ghost" onclick="closeRoleSwitcher()">Cerrar</button>
      </div>
    </div>
  `;
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) closeRoleSwitcher();
  });
  document.body.appendChild(backdrop);
}
function openRoleSwitcher() {
  ensureRoleModal();
  const current = getRole();
  const opts = document.getElementById('role-options');
  opts.innerHTML = Object.entries(ROLES).map(([key, r]) => `
    <div class="agenda-item" style="cursor:pointer;margin-bottom:8px;${key===current?'border-color:var(--accent);':''}" onclick="pickRole('${key}')">
      <div class="avatar" style="width:42px;height:42px;font-size:14px">${r.initials}</div>
      <div>
        <div class="agenda-patient-name">${r.name}</div>
        <div class="agenda-patient-meta">${r.label}</div>
      </div>
      <div>${key===current?'<span class="badge badge-dark">Actual</span>':'<i data-lucide="chevron-right" style="width:16px;height:16px;color:var(--text-tertiary)"></i>'}</div>
    </div>
  `).join('');
  if (window.lucide) lucide.createIcons();
  document.getElementById('role-modal').classList.add('open');
}
function closeRoleSwitcher() {
  document.getElementById('role-modal').classList.remove('open');
}
function pickRole(role) {
  setRole(role);
  closeRoleSwitcher();
  // If switching away from superadmin while on a superadmin page, go to dashboard
  const onSuperadminPage = location.pathname.includes('superadmin-');
  const switchingToNonSuper = role !== 'superadmin';
  // If switching TO superadmin from a normal page, go to superadmin dashboard
  const switchingToSuper = role === 'superadmin' && !onSuperadminPage;

  if (onSuperadminPage && switchingToNonSuper) {
    location.href = 'dashboard.html';
  } else if (switchingToSuper) {
    location.href = 'superadmin-dashboard.html';
  } else {
    location.reload();
  }
}

/* ── Tabs helper ── */
function activateTab(tabsId, index) {
  const tabs = document.querySelectorAll(`#${tabsId} .tab`);
  const panels = document.querySelectorAll(`#${tabsId} ~ .tab-panels .tab-panel`);
  tabs.forEach((t, i) => t.classList.toggle('active', i === index));
  panels.forEach((p, i) => p.classList.toggle('active', i === index));
}

/* ── Prevent form submit ── */
document.addEventListener('submit', (e) => {
  if (e.target.classList.contains('demo-form')) {
    e.preventDefault();
    showToast('Cambios guardados', 'success');
  }
});

/* ── Odontograma state cycling ── */
const ODONTO_STATES = ['sano', 'caries', 'restaurado', 'endodoncia', 'corona', 'ausente'];
let currentTool = 'caries';

function setOdontoTool(state) {
  currentTool = state;
  document.querySelectorAll('.odonto-tool').forEach(el => {
    el.classList.toggle('active', el.dataset.state === state);
  });
  showToast(`Herramienta activa: ${state}`, 'info');
}

function handleToothClick(el) {
  const current = el.dataset.state || 'sano';
  if (currentTool === 'sano' || current === currentTool) {
    el.dataset.state = 'sano';
    showToast(`Diente ${el.dataset.num} — sano`, 'success');
  } else {
    el.dataset.state = currentTool;
    showToast(`Diente ${el.dataset.num} — ${currentTool}`, 'success');
  }
}

/* ═══════════════════════════════════════════════════════
   MODALES FUNCIONALES
   ═══════════════════════════════════════════════════════ */

function ensureGenericModal() {
  if (document.getElementById('generic-modal')) return;
  const backdrop = document.createElement('div');
  backdrop.id = 'generic-modal';
  backdrop.className = 'modal-backdrop';
  backdrop.innerHTML = `
    <div class="modal" onclick="event.stopPropagation()">
      <div class="modal-head">
        <div>
          <div class="modal-title" id="gen-title">Modal</div>
          <div class="modal-sub" id="gen-sub"></div>
        </div>
        <button class="modal-close" onclick="closeGenericModal()" aria-label="Cerrar">
          <i data-lucide="x"></i>
        </button>
      </div>
      <div class="modal-body" id="gen-body"></div>
      <div class="modal-actions" id="gen-actions"></div>
    </div>
  `;
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) closeGenericModal();
  });
  document.body.appendChild(backdrop);
}

function openGenericModal({ title, subtitle = '', body, submitLabel = 'Guardar', onSubmit, size = 'md' }) {
  ensureGenericModal();
  document.getElementById('gen-title').textContent = title;
  document.getElementById('gen-sub').textContent = subtitle;
  const bodyEl = document.getElementById('gen-body');
  bodyEl.innerHTML = `<form id="gen-form">${body}</form>`;
  const form = bodyEl.querySelector('#gen-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit();
    closeGenericModal();
  });
  document.getElementById('gen-actions').innerHTML = `
    <button type="button" class="btn btn-ghost" onclick="closeGenericModal()">Cancelar</button>
    <button type="button" class="btn btn-primary" onclick="document.getElementById('gen-form').requestSubmit()">${submitLabel}</button>
  `;
  const modalEl = document.querySelector('#generic-modal .modal');
  modalEl.style.maxWidth = size === 'lg' ? '640px' : '520px';
  if (window.lucide) lucide.createIcons();
  document.getElementById('generic-modal').classList.add('open');
}

function closeGenericModal() {
  const m = document.getElementById('generic-modal');
  if (m) m.classList.remove('open');
}

/* ── Modal: Nueva cita ── */
function openNewCitaModal(preselect = '') {
  openGenericModal({
    title: 'Nueva cita',
    subtitle: 'Programa una cita en la agenda',
    size: 'lg',
    submitLabel: 'Crear cita',
    body: `
      <div class="form-group">
        <label class="form-label">Paciente</label>
        <select class="form-select" required>
          <option value="">Selecciona un paciente...</option>
          <option ${preselect==='jp'?'selected':''}>Juan Pérez Morales</option>
          <option>Ana García Rojas</option>
          <option>Carlos Mendoza Villca</option>
          <option>Laura Choque Aguilar</option>
          <option>Pedro Flores Ramírez</option>
          <option>Carmen Vargas Suárez</option>
          <option>Roberto Ibáñez Torres</option>
          <option>Valeria Rivera Quispe</option>
        </select>
        <div class="form-hint">¿No encuentras al paciente? <a href="#" onclick="event.preventDefault();closeGenericModal();openNewPacienteModal();" style="color:var(--text);font-weight:600">Crear nuevo</a></div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Profesional</label>
          <select class="form-select" required>
            <option>Dra. María Fernández</option>
            <option>Dr. Andrés Gutiérrez</option>
            <option>Dr. Sebastián Rojas</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Tratamiento</label>
          <select class="form-select">
            <option>Consulta general · Bs 100 · 30min</option>
            <option>Limpieza dental · Bs 250 · 45min</option>
            <option>Resina · Bs 350 · 40min</option>
            <option>Endodoncia · Bs 1.200 · 90min</option>
            <option>Corona porcelana · Bs 2.500 · 120min</option>
            <option>Blanqueamiento · Bs 800 · 60min</option>
            <option>Ortodoncia — control · Bs 450 · 30min</option>
          </select>
        </div>
      </div>
      <div class="form-row-3">
        <div class="form-group">
          <label class="form-label">Fecha</label>
          <input class="form-input" type="date" value="2026-04-15" required>
        </div>
        <div class="form-group">
          <label class="form-label">Hora</label>
          <input class="form-input" type="time" value="10:00" required>
        </div>
        <div class="form-group">
          <label class="form-label">Duración</label>
          <select class="form-select">
            <option>30 min</option>
            <option selected>45 min</option>
            <option>60 min</option>
            <option>90 min</option>
            <option>120 min</option>
          </select>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Notas (opcional)</label>
        <textarea class="form-textarea" placeholder="Observaciones para el profesional..."></textarea>
      </div>
    `,
    onSubmit: () => showToast('Cita creada · Paciente notificado', 'success'),
  });
}

/* ── Modal: Nuevo paciente ── */
function openNewPacienteModal() {
  openGenericModal({
    title: 'Nuevo paciente',
    subtitle: 'Registra un paciente en tu clínica',
    size: 'lg',
    submitLabel: 'Registrar paciente',
    body: `
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Nombre</label>
          <input class="form-input" placeholder="Ej: Juan" required>
        </div>
        <div class="form-group">
          <label class="form-label">Apellidos</label>
          <input class="form-input" placeholder="Ej: Pérez Morales" required>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Cédula de Identidad</label>
          <input class="form-input" placeholder="Ej: 6123456 SC" required>
        </div>
        <div class="form-group">
          <label class="form-label">Fecha de nacimiento</label>
          <input class="form-input" type="date" required>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Teléfono</label>
          <input class="form-input" placeholder="+591 712-34567" required>
        </div>
        <div class="form-group">
          <label class="form-label">Email</label>
          <input class="form-input" type="email" placeholder="paciente@ejemplo.com">
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Dirección</label>
        <input class="form-input" placeholder="Dirección completa">
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Género</label>
          <select class="form-select">
            <option>Masculino</option>
            <option>Femenino</option>
            <option>Otro</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Ocupación</label>
          <input class="form-input" placeholder="Opcional">
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Antecedentes médicos</label>
        <textarea class="form-textarea" placeholder="Alergias, condiciones, medicación..."></textarea>
      </div>
    `,
    onSubmit: () => showToast('Paciente registrado · Ficha creada', 'success'),
  });
}

/* ── Modal: Registrar cobro ── */
function openNewCobroModal(preselectPaciente = '') {
  openGenericModal({
    title: 'Registrar cobro',
    subtitle: 'Registra un pago y genera comprobante imprimible',
    size: 'lg',
    submitLabel: 'Registrar pago',
    body: `
      <div class="form-group">
        <label class="form-label">Paciente</label>
        <select class="form-select" required>
          <option value="">Selecciona un paciente...</option>
          <option ${preselectPaciente==='jp'?'selected':''}>Juan Pérez Morales</option>
          <option>Ana García Rojas</option>
          <option>Carlos Mendoza Villca</option>
          <option>Laura Choque Aguilar</option>
          <option>Pedro Flores Ramírez</option>
          <option>Carmen Vargas Suárez</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Tratamiento / Concepto</label>
        <select class="form-select">
          <option>Limpieza dental — Bs 250</option>
          <option>Consulta general — Bs 100</option>
          <option>Resina — Bs 350</option>
          <option>Endodoncia unirradicular — Bs 1.200</option>
          <option>Corona porcelana — Bs 2.500</option>
          <option>Blanqueamiento — Bs 800</option>
          <option>Ortodoncia control — Bs 450</option>
          <option>Extracción simple — Bs 200</option>
        </select>
      </div>
      <div class="form-row-3">
        <div class="form-group">
          <label class="form-label">Método de pago</label>
          <select class="form-select">
            <option>Efectivo</option>
            <option>QR</option>
            <option>Transferencia</option>
            <option>Tarjeta</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Monto (Bs)</label>
          <input class="form-input" type="number" value="250" required>
        </div>
        <div class="form-group">
          <label class="form-label">Fecha</label>
          <input class="form-input" type="date" value="2026-04-14" required>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Notas (opcional)</label>
        <textarea class="form-textarea" placeholder="Observaciones del cobro..."></textarea>
      </div>
      <label style="display:flex;align-items:center;gap:8px;font-size:12.5px;color:var(--text-secondary);margin-top:6px">
        <input type="checkbox" checked> Imprimir comprobante al guardar
      </label>
    `,
    onSubmit: () => showToast('Pago registrado · Comprobante generado', 'success'),
  });
}

/* ── Modal: Nuevo tratamiento (catálogo) ── */
function openNewTratamientoModal() {
  openGenericModal({
    title: 'Nuevo tratamiento',
    subtitle: 'Agrega un tratamiento al catálogo',
    size: 'lg',
    submitLabel: 'Crear tratamiento',
    body: `
      <div class="form-group">
        <label class="form-label">Nombre del tratamiento</label>
        <input class="form-input" placeholder="Ej: Limpieza profunda" required>
      </div>
      <div class="form-group">
        <label class="form-label">Descripción breve</label>
        <input class="form-input" placeholder="Ej: Tartrectomía supra y subgingival">
      </div>
      <div class="form-row-3">
        <div class="form-group">
          <label class="form-label">Categoría</label>
          <select class="form-select">
            <option>General</option>
            <option>Endodoncia</option>
            <option>Ortodoncia</option>
            <option>Prótesis</option>
            <option>Estética</option>
            <option>Cirugía</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Duración (min)</label>
          <input class="form-input" type="number" value="45" required>
        </div>
        <div class="form-group">
          <label class="form-label">Precio (Bs)</label>
          <input class="form-input" type="number" value="350" required>
        </div>
      </div>
      <label style="display:flex;align-items:center;gap:8px;font-size:12.5px;color:var(--text-secondary)">
        <input type="checkbox" checked> Tratamiento activo y disponible para agendar
      </label>
    `,
    onSubmit: () => showToast('Tratamiento agregado al catálogo', 'success'),
  });
}

/* ── Modal: Invitar usuario ── */
function openInvitarUsuarioModal() {
  openGenericModal({
    title: 'Invitar usuario',
    subtitle: 'Envía una invitación por email',
    submitLabel: 'Enviar invitación',
    body: `
      <div class="form-group">
        <label class="form-label">Email</label>
        <input class="form-input" type="email" placeholder="usuario@sonrisas.bo" required>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Nombre</label>
          <input class="form-input" placeholder="Ej: Daniela" required>
        </div>
        <div class="form-group">
          <label class="form-label">Apellidos</label>
          <input class="form-input" placeholder="Ej: Ríos" required>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Rol</label>
          <select class="form-select">
            <option>Odontólogo</option>
            <option>Recepción</option>
            <option>Admin Clínica</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Especialidad</label>
          <input class="form-input" placeholder="Opcional">
        </div>
      </div>
    `,
    onSubmit: () => showToast('Invitación enviada por email', 'success'),
  });
}

/* ── Modal: Nueva consulta clínica ── */
function openNewConsultaModal() {
  openGenericModal({
    title: 'Nueva consulta clínica',
    subtitle: 'Registra una consulta en la historia del paciente',
    size: 'lg',
    submitLabel: 'Guardar consulta',
    body: `
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Fecha</label>
          <input class="form-input" type="date" value="2026-04-14" required>
        </div>
        <div class="form-group">
          <label class="form-label">Profesional</label>
          <select class="form-select">
            <option>Dr. Andrés Gutiérrez</option>
            <option>Dra. María Fernández</option>
            <option>Dr. Sebastián Rojas</option>
          </select>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Motivo de consulta</label>
        <input class="form-input" placeholder="Ej: Dolor en molar superior derecho">
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Diente(s) tratado(s)</label>
          <input class="form-input" placeholder="Ej: 16, 17">
        </div>
        <div class="form-group">
          <label class="form-label">Tratamiento realizado</label>
          <select class="form-select">
            <option>Consulta general</option>
            <option>Limpieza dental</option>
            <option>Resina</option>
            <option>Endodoncia</option>
            <option>Corona porcelana</option>
            <option>Extracción</option>
          </select>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Diagnóstico / Notas clínicas</label>
        <textarea class="form-textarea" placeholder="Diagnóstico, observaciones, indicaciones post-tratamiento..."></textarea>
      </div>
      <label style="display:flex;align-items:center;gap:8px;font-size:12.5px;color:var(--text-secondary)">
        <input type="checkbox" checked> Marcar cita como "Atendida"
      </label>
    `,
    onSubmit: () => showToast('Consulta guardada en historia clínica', 'success'),
  });
}

/* ── Modal: Agregar al plan de tratamiento ── */
function openAgregarPlanModal() {
  openGenericModal({
    title: 'Agregar al plan de tratamiento',
    subtitle: 'Juan Pérez Morales',
    submitLabel: 'Agregar',
    body: `
      <div class="form-group">
        <label class="form-label">Tratamiento</label>
        <select class="form-select">
          <option>Resina — Bs 350</option>
          <option>Limpieza dental — Bs 250</option>
          <option>Endodoncia — Bs 1.200</option>
          <option>Corona porcelana — Bs 2.500</option>
        </select>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Diente</label>
          <input class="form-input" placeholder="Ej: 17" required>
        </div>
        <div class="form-group">
          <label class="form-label">Prioridad</label>
          <select class="form-select">
            <option>Alta</option>
            <option selected>Media</option>
            <option>Baja</option>
          </select>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Notas</label>
        <textarea class="form-textarea"></textarea>
      </div>
    `,
    onSubmit: () => showToast('Agregado al plan de tratamiento', 'success'),
  });
}

/* ── Filter chips: toggle active within group ── */
document.addEventListener('click', (e) => {
  const chip = e.target.closest('.filter-chip');
  if (chip && chip.parentElement) {
    chip.parentElement.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
  }
});

/* ═══════════════════════════════════════════════════════
   MENÚ DE CONFIGURACIÓN (dropdown superior derecha)
   ═══════════════════════════════════════════════════════ */

const SETTINGS_MENU_ITEMS = [
  { id: 'perfil',       label: 'Perfil',                 icon: 'user',           color: '#8B5CF6', action: 'openPerfilModal' },
  { id: 'billing',      label: 'Billing',                icon: 'credit-card',    color: '#3B82F6', action: 'openBillingModal' },
  { divider: true },
  { id: 'whatsapp',     label: 'Vincular WhatsApp',      icon: 'message-circle', color: '#25D366', action: 'openVincularWhatsAppModal' },
  { id: 'gcal',         label: 'Vincular Google Calendar', icon: 'calendar',     color: '#4285F4', action: 'openVincularGoogleCalendarModal' },
  { id: 'telegram',     label: 'Vincular Telegram',      icon: 'send',           color: '#0EA5E9', action: 'openVincularTelegramModal' },
  { divider: true },
  { id: 'seguridad',    label: 'Seguridad',              icon: 'shield',         color: '#6B7280', action: 'openSeguridadModal' },
  { id: 'preferencias', label: 'Preferencias',           icon: 'sliders-horizontal', color: '#6B7280', action: 'openPreferenciasModal' },
  { id: 'equipo',       label: 'Equipo',                 icon: 'users',          color: '#6366F1', action: 'goToEquipo' },
  { divider: true },
  { id: 'refiere',      label: 'Refiere y Gana',         icon: 'gift',           color: '#EC4899', action: 'openRefiereModal' },
  { divider: true },
  { id: 'logout',       label: 'Cerrar sesión',          icon: 'log-out',        color: '#EF4444', action: 'doLogout', danger: true },
];

function ensureSettingsMenu() {
  if (document.getElementById('settings-menu')) return;
  const menu = document.createElement('div');
  menu.id = 'settings-menu';
  menu.className = 'settings-menu';
  menu.innerHTML = SETTINGS_MENU_ITEMS.map(item => {
    if (item.divider) return `<div class="settings-menu-divider"></div>`;
    return `
      <div class="settings-menu-item ${item.danger ? 'danger' : ''}" onclick="closeSettingsMenu();${item.action}();">
        <i data-lucide="${item.icon}" style="color:${item.color}"></i>
        <span>${item.label}</span>
      </div>
    `;
  }).join('');
  menu.addEventListener('click', (e) => e.stopPropagation());
  document.body.appendChild(menu);
}

function openSettingsMenu(ev) {
  ensureSettingsMenu();
  const menu = document.getElementById('settings-menu');
  const btn = ev.currentTarget;
  const rect = btn.getBoundingClientRect();
  menu.style.top = (rect.bottom + 8) + 'px';
  menu.style.right = (window.innerWidth - rect.right) + 'px';
  menu.classList.add('open');
  if (window.lucide) lucide.createIcons();
  ev.stopPropagation();
}

function closeSettingsMenu() {
  const m = document.getElementById('settings-menu');
  if (m) m.classList.remove('open');
}

// Close on outside click
document.addEventListener('click', () => closeSettingsMenu());

/* ═══════════════════════════════════════════════════════
   MODALES DEL MENÚ DE CONFIGURACIÓN
   ═══════════════════════════════════════════════════════ */

/* ── Perfil ── */
function getProfile() {
  try { return JSON.parse(localStorage.getItem('demo_profile') || '{}'); } catch { return {}; }
}
function saveProfile(data) {
  localStorage.setItem('demo_profile', JSON.stringify(data));
}

function openPerfilModal() {
  const role = getRole();
  const user = ROLES[role];
  const profile = getProfile();
  const nombre = profile.nombre || user.name.split(' ')[0];
  const apellido = profile.apellido || user.name.split(' ').slice(1).join(' ');
  const email = profile.email || user.name.toLowerCase().replace(/[^a-z]+/g,'.').replace(/^\.|\.$/g,'') + '@sonrisas.bo';
  const telefono = profile.telefono || '+591 712-34567';
  const idioma = profile.idioma || 'Español';
  const photoUrl = profile.photoUrl || '';

  const avatarHtml = photoUrl
    ? `<img id="perfil-avatar-img" src="${photoUrl}" style="width:72px;height:72px;border-radius:50%;object-fit:cover;border:2px solid var(--border-strong)">`
    : `<div id="perfil-avatar-img" class="avatar" style="width:72px;height:72px;font-size:22px">${user.initials}</div>`;

  openGenericModal({
    title: 'Mi perfil',
    subtitle: 'Actualiza tus datos personales',
    size: 'lg',
    submitLabel: 'Guardar cambios',
    body: `
      <div style="display:flex;align-items:center;gap:16px;margin-bottom:18px;padding:16px;background:var(--bg-alt);border-radius:var(--r-md)">
        <div id="perfil-avatar-wrap" style="position:relative;cursor:pointer" onclick="document.getElementById('perfil-photo-input').click()">
          ${avatarHtml}
          <div style="position:absolute;bottom:-2px;right:-2px;width:26px;height:26px;border-radius:50%;background:var(--accent);color:#FFF;display:flex;align-items:center;justify-content:center;border:2px solid var(--bg-alt)">
            <i data-lucide="camera" style="width:12px;height:12px;stroke-width:2.5"></i>
          </div>
        </div>
        <div style="flex:1">
          <div style="font-weight:700;font-size:15px" id="perfil-display-name">${nombre} ${apellido}</div>
          <div style="font-size:12px;color:var(--text-secondary)">${user.label}</div>
          <div style="font-size:11px;color:var(--text-tertiary);margin-top:3px">Haz clic en la foto para cambiarla</div>
        </div>
        <input type="file" id="perfil-photo-input" accept="image/*" style="display:none" onchange="handlePerfilPhoto(this)">
        <button type="button" class="btn btn-secondary btn-sm" onclick="document.getElementById('perfil-photo-input').click()"><i data-lucide="upload"></i> Cambiar foto</button>
      </div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Nombre</label><input class="form-input" id="perfil-nombre" value="${nombre}" oninput="updatePerfilPreview()"></div>
        <div class="form-group"><label class="form-label">Apellido</label><input class="form-input" id="perfil-apellido" value="${apellido}" oninput="updatePerfilPreview()"></div>
      </div>
      <div class="form-group"><label class="form-label">Email</label><input class="form-input" type="email" id="perfil-email" value="${email}"></div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Teléfono</label><input class="form-input" id="perfil-telefono" value="${telefono}"></div>
        <div class="form-group">
          <label class="form-label">Idioma</label>
          <select class="form-select" id="perfil-idioma">
            <option ${idioma==='Español'?'selected':''}>Español</option>
            <option ${idioma==='English'?'selected':''}>English</option>
            <option ${idioma==='Português'?'selected':''}>Português</option>
          </select>
        </div>
      </div>
      ${photoUrl ? `<div style="margin-top:8px"><button type="button" class="btn btn-ghost btn-sm" style="color:var(--error)" onclick="removePerfilPhoto()"><i data-lucide="trash-2"></i> Eliminar foto</button></div>` : ''}
    `,
    onSubmit: () => {
      const data = {
        nombre: document.getElementById('perfil-nombre').value,
        apellido: document.getElementById('perfil-apellido').value,
        email: document.getElementById('perfil-email').value,
        telefono: document.getElementById('perfil-telefono').value,
        idioma: document.getElementById('perfil-idioma').value,
        photoUrl: getProfile().photoUrl || '',
      };
      saveProfile(data);
      applyProfileToUI(data);
      showToast('Perfil actualizado', 'success');
    },
  });
}

function handlePerfilPhoto(input) {
  const file = input.files[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) { showToast('La imagen no debe superar 5 MB', 'error'); return; }
  const reader = new FileReader();
  reader.onload = (e) => {
    const url = e.target.result;
    // Update preview in modal
    const wrap = document.getElementById('perfil-avatar-wrap');
    if (wrap) {
      const existing = document.getElementById('perfil-avatar-img');
      if (existing) existing.remove();
      const img = document.createElement('img');
      img.id = 'perfil-avatar-img';
      img.src = url;
      img.style.cssText = 'width:72px;height:72px;border-radius:50%;object-fit:cover;border:2px solid var(--border-strong)';
      wrap.insertBefore(img, wrap.firstChild);
    }
    // Save to profile
    const profile = getProfile();
    profile.photoUrl = url;
    saveProfile(profile);
    applyProfileToUI(profile);
    showToast('Foto de perfil actualizada', 'success');
  };
  reader.readAsDataURL(file);
}

function removePerfilPhoto() {
  const profile = getProfile();
  profile.photoUrl = '';
  saveProfile(profile);
  applyProfileToUI(profile);
  closeGenericModal();
  setTimeout(() => openPerfilModal(), 200);
  showToast('Foto eliminada', 'info');
}

function updatePerfilPreview() {
  const nombre = document.getElementById('perfil-nombre')?.value || '';
  const apellido = document.getElementById('perfil-apellido')?.value || '';
  const display = document.getElementById('perfil-display-name');
  if (display) display.textContent = `${nombre} ${apellido}`.trim();
}

function applyProfileToUI(profile) {
  // Update sidebar avatar
  const sidebarAvatars = document.querySelectorAll('.sidebar-user .avatar');
  sidebarAvatars.forEach(av => {
    if (profile.photoUrl) {
      av.outerHTML = `<img src="${profile.photoUrl}" class="avatar" style="width:34px;height:34px;border-radius:50%;object-fit:cover;border:1px solid var(--border-strong)">`;
    }
  });
  // Update sidebar name
  const sidebarName = document.querySelector('.sidebar-user-name');
  if (sidebarName && profile.nombre) {
    sidebarName.textContent = `${profile.nombre} ${profile.apellido || ''}`.trim();
  }
}

/* ── Billing ── */
function openBillingModal() {
  openGenericModal({
    title: 'Billing & suscripción',
    subtitle: 'Gestiona tu plan y método de pago',
    size: 'lg',
    submitLabel: 'Actualizar plan',
    body: `
      <div style="padding:18px;background:linear-gradient(135deg,#18181B,#2A2A2A);border-radius:var(--r-lg);color:#FFF;margin-bottom:18px">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
          <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.04em;opacity:0.6;font-weight:600">Plan actual</div>
          <span style="background:#D0FF71;color:#201F1F;padding:3px 9px;border-radius:999px;font-size:10px;font-weight:700">ACTIVO</span>
        </div>
        <div style="font-size:20px;font-weight:800;margin-bottom:4px">Pro · Multi-profesional</div>
        <div style="font-size:12px;opacity:0.7;margin-bottom:12px">Hasta 10 usuarios · 3.000 pacientes · Reportes avanzados</div>
        <div style="display:flex;align-items:baseline;gap:6px">
          <span style="font-size:28px;font-weight:800">Bs 420</span>
          <span style="font-size:13px;opacity:0.7">/mes</span>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Método de pago</label>
        <div style="display:flex;align-items:center;gap:12px;padding:12px;border:1px solid var(--border-strong);border-radius:var(--r-md)">
          <div style="width:36px;height:24px;background:linear-gradient(135deg,#1A1F71,#4B5FE3);border-radius:4px"></div>
          <div style="flex:1">
            <div style="font-weight:600;font-size:13px">Visa ••• 4821</div>
            <div style="font-size:11px;color:var(--text-tertiary)">Expira 08/28</div>
          </div>
          <button type="button" class="btn btn-ghost btn-sm">Cambiar</button>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Próxima facturación</label>
        <div style="font-size:13px;color:var(--text-secondary)">8 de mayo de 2026 · Bs 420,00</div>
      </div>
      <div style="margin-top:10px;padding:12px;background:var(--bg-alt);border-radius:var(--r-md);font-size:12px;color:var(--text-secondary)">
        <strong style="color:var(--text)">Historial de pagos disponible</strong> · Descarga facturas desde los últimos 12 meses.
      </div>
    `,
    onSubmit: () => showToast('Plan gestionado correctamente', 'success'),
  });
}

/* ── Vincular WhatsApp ── */
function openVincularWhatsAppModal() {
  openGenericModal({
    title: 'Vincular WhatsApp Business',
    subtitle: 'Conecta tu número para enviar recordatorios automáticos',
    size: 'lg',
    submitLabel: 'Vincular',
    body: `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:22px;align-items:center">
        <div style="text-align:center;padding:18px;background:var(--bg-alt);border-radius:var(--r-lg)">
          <div style="display:inline-block;padding:12px;background:#FFF;border-radius:var(--r-md);border:1px solid var(--border-strong)">
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https://wa.me/sonrisas-demo&margin=0" alt="QR WhatsApp" width="180" height="180" style="display:block">
          </div>
          <div style="font-size:11.5px;color:var(--text-tertiary);margin-top:10px;font-weight:600">Expira en 04:58</div>
        </div>
        <div>
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">
            <div style="width:36px;height:36px;border-radius:10px;background:#25D366;display:flex;align-items:center;justify-content:center">
              <i data-lucide="message-circle" style="color:white;width:18px;height:18px"></i>
            </div>
            <div>
              <div style="font-weight:700;font-size:13.5px">WhatsApp Business</div>
              <div style="font-size:11px;color:var(--text-tertiary)">Meta oficial</div>
            </div>
          </div>
          <ol style="padding-left:18px;font-size:12.5px;line-height:1.7;color:var(--text-secondary)">
            <li>Abrí WhatsApp en tu teléfono</li>
            <li>Andá a <strong>Ajustes → Dispositivos vinculados</strong></li>
            <li>Tocá <strong>Vincular un dispositivo</strong></li>
            <li>Escaneá el código QR de la izquierda</li>
          </ol>
          <div style="margin-top:14px;padding:10px;background:var(--info-light);border-radius:var(--r-md);font-size:11.5px;color:#1D4ED8">
            <strong>Con WhatsApp conectado podrás:</strong><br>
            • Enviar recordatorios 24h antes<br>
            • Confirmar citas automáticamente<br>
            • Compartir comprobantes de pago
          </div>
        </div>
      </div>
    `,
    onSubmit: () => showToast('WhatsApp vinculado correctamente', 'success'),
  });
}

/* ── Vincular Google Calendar ── */
function openVincularGoogleCalendarModal() {
  openGenericModal({
    title: 'Vincular Google Calendar',
    subtitle: 'Sincroniza tu agenda con tu cuenta de Google',
    submitLabel: 'Conectar con Google',
    body: `
      <div style="text-align:center;padding:22px 10px">
        <div style="display:inline-flex;align-items:center;justify-content:center;width:72px;height:72px;background:#FFF;border:1px solid var(--border-strong);border-radius:18px;margin-bottom:16px;box-shadow:var(--shadow-sm)">
          <svg width="40" height="40" viewBox="0 0 48 48">
            <rect x="8" y="10" width="32" height="30" rx="4" fill="#FFF" stroke="#4285F4" stroke-width="2"/>
            <rect x="8" y="10" width="32" height="8" rx="4" fill="#4285F4"/>
            <text x="24" y="33" text-anchor="middle" font-family="Arial" font-size="14" font-weight="700" fill="#4285F4">14</text>
            <line x1="16" y1="6" x2="16" y2="14" stroke="#4285F4" stroke-width="2" stroke-linecap="round"/>
            <line x1="32" y1="6" x2="32" y2="14" stroke="#4285F4" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
        <div style="font-size:16px;font-weight:700;margin-bottom:6px">Conecta tu Google Calendar</div>
        <div style="font-size:12.5px;color:var(--text-secondary);max-width:380px;margin:0 auto 18px">
          Al vincular tu cuenta, las citas creadas en Sonrisas se sincronizarán automáticamente con tu Google Calendar.
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Cuenta de Google</label>
        <select class="form-select">
          <option>maria.fernandez@gmail.com</option>
          <option>Conectar otra cuenta...</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Calendario a sincronizar</label>
        <select class="form-select">
          <option>Calendario principal</option>
          <option>Clínica Sonrisas (compartido)</option>
          <option>Agenda personal</option>
        </select>
      </div>
      <div style="display:flex;flex-direction:column;gap:8px;margin-top:10px">
        <label style="display:flex;align-items:center;gap:10px;font-size:12.5px;color:var(--text-secondary)"><input type="checkbox" checked> Sincronización bidireccional (Google ↔ Sonrisas)</label>
        <label style="display:flex;align-items:center;gap:10px;font-size:12.5px;color:var(--text-secondary)"><input type="checkbox" checked> Incluir notas del paciente en evento</label>
        <label style="display:flex;align-items:center;gap:10px;font-size:12.5px;color:var(--text-secondary)"><input type="checkbox"> Invitar al paciente por email</label>
      </div>
    `,
    onSubmit: () => showToast('Google Calendar conectado', 'success'),
  });
}

/* ── Vincular Telegram ── */
function openVincularTelegramModal() {
  openGenericModal({
    title: 'Vincular Telegram',
    subtitle: 'Recibí notificaciones y confirmá citas por Telegram',
    submitLabel: 'Abrir bot en Telegram',
    body: `
      <div style="text-align:center;padding:18px 10px">
        <div style="display:inline-flex;align-items:center;justify-content:center;width:72px;height:72px;background:linear-gradient(135deg,#0EA5E9,#38BDF8);border-radius:18px;margin-bottom:14px">
          <i data-lucide="send" style="color:white;width:32px;height:32px"></i>
        </div>
        <div style="font-size:16px;font-weight:700;margin-bottom:6px">Conecta con @SonrisasBot</div>
        <div style="font-size:12.5px;color:var(--text-secondary);max-width:380px;margin:0 auto 18px">
          Usa el bot oficial de Sonrisas para recibir alertas, confirmar citas y administrar tu agenda desde Telegram.
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Tu usuario de Telegram</label>
        <input class="form-input" placeholder="@tu_usuario" required>
      </div>
      <div class="form-group">
        <label class="form-label">Código de verificación</label>
        <input class="form-input" placeholder="Te lo enviará el bot">
        <div class="form-hint">Al abrir el bot enviará un código de 6 dígitos a tu email.</div>
      </div>
    `,
    onSubmit: () => showToast('Telegram vinculado', 'success'),
  });
}

/* ── Seguridad ── */
function openSeguridadModal() {
  openGenericModal({
    title: 'Seguridad',
    subtitle: 'Protege tu cuenta y los datos de tus pacientes',
    submitLabel: 'Guardar cambios',
    body: `
      <div class="form-group">
        <label class="form-label">Cambiar contraseña</label>
        <input class="form-input" type="password" placeholder="Contraseña actual">
      </div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Nueva contraseña</label><input class="form-input" type="password"></div>
        <div class="form-group"><label class="form-label">Confirmar</label><input class="form-input" type="password"></div>
      </div>
      <div style="margin-top:10px;padding:14px;border:1px solid var(--border-strong);border-radius:var(--r-md)">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px">
          <div>
            <div style="font-weight:600;font-size:13px">Autenticación en dos pasos (2FA)</div>
            <div style="font-size:11.5px;color:var(--text-tertiary)">Agrega una capa extra de seguridad con app de autenticación</div>
          </div>
          <label style="display:inline-flex;align-items:center;gap:8px;cursor:pointer">
            <input type="checkbox" checked style="width:36px;height:20px">
          </label>
        </div>
      </div>
      <div style="margin-top:10px;padding:14px;border:1px solid var(--border-strong);border-radius:var(--r-md)">
        <div style="font-weight:600;font-size:13px;margin-bottom:8px">Sesiones activas</div>
        <div style="display:flex;align-items:center;gap:10px;font-size:12px;color:var(--text-secondary)">
          <i data-lucide="laptop" style="width:16px;height:16px"></i>
          <span style="flex:1">MacBook Pro · Santa Cruz, BO · <strong style="color:var(--success)">Ahora</strong></span>
        </div>
      </div>
    `,
    onSubmit: () => showToast('Configuración de seguridad actualizada', 'success'),
  });
}

/* ── Preferencias ── */
function openPreferenciasModal() {
  openGenericModal({
    title: 'Preferencias',
    subtitle: 'Personaliza tu experiencia en Sonrisas',
    submitLabel: 'Guardar preferencias',
    body: `
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Tema</label>
          <select class="form-select"><option>Automático (sistema)</option><option>Claro</option><option>Oscuro</option></select>
        </div>
        <div class="form-group">
          <label class="form-label">Idioma</label>
          <select class="form-select"><option>Español</option><option>English</option><option>Português</option></select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Zona horaria</label>
          <select class="form-select"><option>America/La_Paz (GMT-4)</option></select>
        </div>
        <div class="form-group">
          <label class="form-label">Formato de fecha</label>
          <select class="form-select"><option>DD/MM/AAAA</option><option>MM/DD/AAAA</option></select>
        </div>
      </div>
      <div style="margin-top:8px;padding:14px;border:1px solid var(--border-strong);border-radius:var(--r-md)">
        <div style="font-weight:600;font-size:13px;margin-bottom:10px">Notificaciones</div>
        <div style="display:flex;flex-direction:column;gap:8px">
          <label style="display:flex;align-items:center;gap:10px;font-size:12.5px"><input type="checkbox" checked> Alerta al recibir nueva cita</label>
          <label style="display:flex;align-items:center;gap:10px;font-size:12.5px"><input type="checkbox" checked> Recordatorio de citas del día</label>
          <label style="display:flex;align-items:center;gap:10px;font-size:12.5px"><input type="checkbox"> Resumen semanal por email</label>
          <label style="display:flex;align-items:center;gap:10px;font-size:12.5px"><input type="checkbox" checked> Alertas de cobros pendientes</label>
        </div>
      </div>
    `,
    onSubmit: () => showToast('Preferencias guardadas', 'success'),
  });
}

/* ── Equipo (navega a admin-usuarios) ── */
function goToEquipo() {
  if (location.pathname.endsWith('admin-usuarios.html')) {
    showToast('Ya estás en Usuarios', 'info');
  } else {
    location.href = 'admin-usuarios.html';
  }
}

/* ── Refiere y Gana ── */
function openRefiereModal() {
  openGenericModal({
    title: 'Refiere y Gana',
    subtitle: 'Comparte Sonrisas con otra clínica y ambos ganan',
    submitLabel: 'Copiar link',
    body: `
      <div style="text-align:center;padding:18px 10px 10px">
        <div style="display:inline-flex;align-items:center;justify-content:center;width:72px;height:72px;background:linear-gradient(135deg,#EC4899,#F472B6);border-radius:18px;margin-bottom:14px">
          <i data-lucide="gift" style="color:white;width:32px;height:32px"></i>
        </div>
        <div style="font-size:22px;font-weight:800;letter-spacing:-0.02em;margin-bottom:4px">1 mes gratis</div>
        <div style="font-size:13px;color:var(--text-secondary);max-width:380px;margin:0 auto 18px">
          Por cada clínica que se registre con tu link, ambos reciben <strong>1 mes gratis</strong> del plan Pro.
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Tu link de referido</label>
        <div style="display:flex;gap:8px">
          <input class="form-input" value="sonrisas.bo/r/maria-f-4k28" readonly style="flex:1">
          <button type="button" class="btn btn-secondary" onclick="showToast('Link copiado','success')"><i data-lucide="copy"></i></button>
        </div>
      </div>
      <div class="kpi-row" style="margin-top:14px">
        <div class="kpi"><div class="kpi-label">Referidos</div><div class="kpi-value">3</div></div>
        <div class="kpi"><div class="kpi-label">Activos</div><div class="kpi-value">2</div></div>
        <div class="kpi"><div class="kpi-label">Meses ganados</div><div class="kpi-value" style="color:var(--success)">2</div></div>
      </div>
    `,
    onSubmit: () => showToast('Link copiado al portapapeles', 'success'),
  });
}

/* ── Logout ── */
function doLogout() {
  showToast('Cerrando sesión...', 'info');
  setTimeout(() => { location.href = '../index.html'; }, 600);
}

/* ── ESC cierra modales ── */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeGenericModal();
    closeRoleSwitcher();
  }
});

/* ── Render odontograma FDI ── */
function renderOdontograma(mountId) {
  const mount = document.getElementById(mountId);
  if (!mount) return;
  // FDI notation
  const upperRight = [18,17,16,15,14,13,12,11];
  const upperLeft  = [21,22,23,24,25,26,27,28];
  const lowerLeft  = [38,37,36,35,34,33,32,31];
  const lowerRight = [48,47,46,45,44,43,42,41];

  // Initial states (some pre-marked for realism)
  const initial = {
    16: 'caries', 26: 'restaurado', 36: 'corona', 46: 'endodoncia',
    18: 'ausente', 28: 'ausente', 38: 'ausente', 48: 'ausente',
    24: 'restaurado', 37: 'caries',
  };

  function tooth(num, lower=false) {
    const state = initial[num] || 'sano';
    return `
      <div class="odonto-tooth ${lower?'lower':''}" data-num="${num}" data-state="${state}" onclick="handleToothClick(this)">
        <span class="odonto-tooth-num">${num}</span>
        <div class="odonto-tooth-svg"></div>
      </div>
    `;
  }
  function tooth2(num, lower=false) {
    const state = initial[num] || 'sano';
    return `
      <div class="odonto-tooth ${lower?'lower':''}" data-num="${num}" data-state="${state}" onclick="handleToothClick(this)">
        <div class="odonto-tooth-svg"></div>
        <span class="odonto-tooth-num">${num}</span>
      </div>
    `;
  }

  mount.innerHTML = `
    <div class="odonto-row">
      ${upperRight.map(n => tooth(n)).join('')}
      <div style="width:10px"></div>
      ${upperLeft.map(n => tooth(n)).join('')}
    </div>
    <div class="odonto-divider"></div>
    <div class="odonto-row">
      ${lowerRight.reverse().map(n => tooth2(n, true)).join('')}
      <div style="width:10px"></div>
      ${lowerLeft.reverse().map(n => tooth2(n, true)).join('')}
    </div>
  `;
}
