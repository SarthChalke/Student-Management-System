// Students page logic

let allStudents = [];

function renderTable(list) {
  const tbody = document.getElementById('studentTableBody');
  tbody.innerHTML = '';

  if (!list.length) {
    tbody.innerHTML =
      '<tr><td colspan="9" style="text-align:center;padding:30px;color:#6b7280;">No students found.</td></tr>';
    return;
  }

  list.forEach(s => {
    const badgeClass =
      s.feeStatus === 'Paid'
        ? 'badge-success'
        : s.feeStatus === 'Partial'
        ? 'badge-warning'
        : 'badge-danger';

    tbody.innerHTML += `
      <tr>
        <td>${s.rollNo || '-'}</td>
        <td>${s.enrollmentNo || '-'}</td>
        <td>${s.name || '-'}</td>
        <td>${s.branch || '-'}</td>
        <td>${s.year === 1 ? '1st' : s.year === 2 ? '2nd' : s.year === 3 ? '3rd' : '-' } Year</td>
        <td>${s.contact || '-'}</td>
        <td>${s.email || '-'}</td>
        <td><span class="badge ${badgeClass}">${s.feeStatus || 'Pending'}</span></td>
        <td>
          <button class="btn-edit" onclick="editStudent(${s.id})">✏️ Edit</button>
          <button class="btn-danger" onclick="deleteStudent(${s.id})">🗑️ Del</button>
        </td>
      </tr>
    `;
  });
}

function filterStudents() {
  const q = document.getElementById('searchInput').value.toLowerCase();
  const branch = document.getElementById('filterBranch').value;
  const year = document.getElementById('filterYear').value;

  const list = allStudents.filter(s =>
    (
      !q ||
      (s.name || '').toLowerCase().includes(q) ||
      (s.rollNo || '').toLowerCase().includes(q) ||
      (s.enrollmentNo || '').toLowerCase().includes(q) ||
      (s.email || '').toLowerCase().includes(q)
    ) &&
    (!branch || s.branch === branch) &&
    (!year || String(s.year) === year)
  );

  renderTable(list);
}

function openModal(id = null) {
  document.getElementById('studentModal').style.display = 'flex';
  document.getElementById('studentForm').reset();

  document.getElementById('studentId').value = '';

  document.getElementById('modalTitle').textContent =
    id ? 'Edit Student' : 'Add New Student';

  if (id) {
    const s = DB.getById('students', id);

    if (!s) return;

    document.getElementById('studentId').value = s.id;
    document.getElementById('sName').value = s.name || '';
    document.getElementById('sRoll').value = s.rollNo || '';
    document.getElementById('sEnrollment').value = s.enrollmentNo || '';
    document.getElementById('sBranch').value = s.branch || '';
    document.getElementById('sYear').value = s.year || '';
    document.getElementById('sDob').value = s.dob || '';
    document.getElementById('sGender').value = s.gender || 'Male';
    document.getElementById('sContact').value = s.contact || '';
    document.getElementById('sEmail').value = s.email || '';
    document.getElementById('sAddress').value = s.address || '';
    document.getElementById('sParent').value = s.parentName || '';
    document.getElementById('sParentContact').value = s.parentContact || '';
    document.getElementById('sFeeStatus').value = s.feeStatus || 'Pending';
    document.getElementById('sAdmDate').value = s.admDate || '';
  }
}

function closeModal() {
  document.getElementById('studentModal').style.display = 'none';
}

function editStudent(id) {
  openModal(id);
}

function deleteStudent(id) {
  if (!confirm('Delete this student? This action cannot be undone.'))
    return;

  DB.delete('students', id);
  loadStudents();
}

document
  .getElementById('studentForm')
  .addEventListener('submit', function (e) {
    e.preventDefault();

    const id =
      parseInt(document.getElementById('studentId').value) || null;

    const data = {
      name: document.getElementById('sName').value,
      rollNo: document.getElementById('sRoll').value,
      enrollmentNo: document.getElementById('sEnrollment').value,
      branch: document.getElementById('sBranch').value,
      year: parseInt(document.getElementById('sYear').value),

      dob: document.getElementById('sDob').value,
      gender: document.getElementById('sGender').value,

      contact: document.getElementById('sContact').value,
      email: document.getElementById('sEmail').value,
      address: document.getElementById('sAddress').value,

      parentName: document.getElementById('sParent').value,
      parentContact: document.getElementById('sParentContact').value,

      feeStatus: document.getElementById('sFeeStatus').value,
      admDate: document.getElementById('sAdmDate').value
    };

    if (id) {
      DB.update('students', id, data);
    } else {
      DB.insert('students', data);
    }

    closeModal();
    loadStudents();
  });

function loadStudents() {
  allStudents = DB.getAll('students');
  renderTable(allStudents);
}

document.addEventListener('DOMContentLoaded', loadStudents);