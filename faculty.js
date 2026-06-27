// Faculty page logic

let allFaculty = [];

function renderFaculty(list) {
  const tbody = document.getElementById('facultyTableBody');
  tbody.innerHTML = '';
  if (!list.length) { tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;padding:30px;color:#6b7280;">No faculty found.</td></tr>'; return; }
  list.forEach(f => {
    tbody.innerHTML += `<tr>
      <td>${f.empId}</td>
      <td><strong>${f.name}</strong></td>
      <td>${f.dept}</td>
      <td>${f.designation}</td>
      <td>${f.contact || '-'}</td>
      <td>${f.email || '-'}</td>
      <td>${f.qualification || '-'}</td>
      <td>
        <button class="btn-edit" onclick="editFaculty(${f.id})">✏️</button>
        <button class="btn-danger" onclick="deleteFaculty(${f.id})">🗑️</button>
      </td>
    </tr>`;
  });
}

function filterFaculty() {
  const q = document.getElementById('facultySearch').value.toLowerCase();
  renderFaculty(allFaculty.filter(f => !q || f.name.toLowerCase().includes(q) || f.dept.toLowerCase().includes(q) || f.empId.toLowerCase().includes(q)));
}

function openFacultyModal(id = null) {
  document.getElementById('facultyModal').style.display = 'flex';
  document.getElementById('facultyForm').reset();
  document.getElementById('facultyId').value = '';
  document.getElementById('facultyModalTitle').textContent = id ? 'Edit Faculty' : 'Add Faculty';
  if (id) {
    const f = DB.getById('faculty', id);
    if (f) {
      document.getElementById('facultyId').value = f.id;
      document.getElementById('fName').value     = f.name;
      document.getElementById('fEmpId').value    = f.empId;
      document.getElementById('fDept').value     = f.dept;
      document.getElementById('fDesig').value    = f.designation;
      document.getElementById('fQual').value     = f.qualification || '';
      document.getElementById('fExp').value      = f.experience || '';
      document.getElementById('fContact').value  = f.contact || '';
      document.getElementById('fEmail').value    = f.email || '';
      document.getElementById('fAddress').value  = f.address || '';
    }
  }
}
function closeFacultyModal() { document.getElementById('facultyModal').style.display = 'none'; }
function editFaculty(id) { openFacultyModal(id); }
function deleteFaculty(id) {
  if (!confirm('Delete this faculty member?')) return;
  DB.delete('faculty', id);
  loadFaculty();
}

document.getElementById('facultyForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const id = parseInt(document.getElementById('facultyId').value) || null;
  const data = {
    name:          document.getElementById('fName').value,
    empId:         document.getElementById('fEmpId').value,
    dept:          document.getElementById('fDept').value,
    designation:   document.getElementById('fDesig').value,
    qualification: document.getElementById('fQual').value,
    experience:    parseInt(document.getElementById('fExp').value) || 0,
    contact:       document.getElementById('fContact').value,
    email:         document.getElementById('fEmail').value,
    address:       document.getElementById('fAddress').value,
  };
  id ? DB.update('faculty', id, data) : DB.insert('faculty', data);
  closeFacultyModal();
  loadFaculty();
});

function loadFaculty() {
  allFaculty = DB.getAll('faculty');
  renderFaculty(allFaculty);
}

document.addEventListener('DOMContentLoaded', loadFaculty);
