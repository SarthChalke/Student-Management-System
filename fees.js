// Fees page logic

let allFees = [];

function loadFeeStats() {
  const fees = DB.getAll('fees');
  const collected = fees.reduce((s, f) => s + (f.paid || 0), 0);
  const pending   = fees.reduce((s, f) => s + (f.balance || 0), 0);
  const total     = fees.reduce((s, f) => s + (f.totalFee || 0), 0);
  const defaulters = fees.filter(f => f.status === 'Pending').length;
  document.getElementById('feeCollected').textContent  = '₹' + collected.toLocaleString('en-IN');
  document.getElementById('feePendingAmt').textContent = '₹' + pending.toLocaleString('en-IN');
  document.getElementById('feeTotal').textContent      = '₹' + total.toLocaleString('en-IN');
  document.getElementById('defaulters').textContent    = defaulters;
}

function renderFees(list) {
  const tbody = document.getElementById('feeTableBody');
  tbody.innerHTML = '';
  if (!list.length) { tbody.innerHTML = '<tr><td colspan="10" style="text-align:center;padding:30px;color:#6b7280;">No records found.</td></tr>'; return; }
  list.forEach(f => {
    const badgeClass = f.status === 'Paid' ? 'badge-success' : f.status === 'Partial' ? 'badge-warning' : 'badge-danger';
    tbody.innerHTML += `<tr>
      <td>${f.rollNo || '-'}</td>
      <td>${f.studentName}</td>
      <td>${(f.branch || '').split(' ')[0]}</td>
      <td>${f.year}</td>
      <td>₹${(f.totalFee || 0).toLocaleString('en-IN')}</td>
      <td style="color:#059669;">₹${(f.paid || 0).toLocaleString('en-IN')}</td>
      <td style="color:#dc2626;">₹${(f.balance || 0).toLocaleString('en-IN')}</td>
      <td><span class="badge ${badgeClass}">${f.status}</span></td>
      <td>${f.lastPayment || '-'}</td>
      <td><button class="btn-primary" style="font-size:12px;padding:5px 10px;" onclick="openFeeModal(${f.studentId})">💳 Pay</button></td>
    </tr>`;
  });
}

function filterFees() {
  const q      = document.getElementById('feeSearch').value.toLowerCase();
  const status = document.getElementById('feeStatusFilter').value;
  const list   = allFees.filter(f =>
    (!q || f.studentName.toLowerCase().includes(q) || (f.rollNo || '').toLowerCase().includes(q)) &&
    (!status || f.status === status)
  );
  renderFees(list);
}

function openFeeModal(studentId = null) {
  document.getElementById('feeModal').style.display = 'flex';
  document.getElementById('feeForm').reset();
  const sel = document.getElementById('feeStudent');
  sel.innerHTML = '<option value="">Select Student</option>';
  DB.getAll('students').forEach(s => {
    const opt = document.createElement('option');
    opt.value = s.id;
    opt.textContent = `${s.rollNo} - ${s.name}`;
    if (studentId && s.id === studentId) opt.selected = true;
    sel.appendChild(opt);
  });
  document.getElementById('feeDate').value = new Date().toISOString().split('T')[0];
  if (studentId) loadStudentFee();
}
function closeFeeModal() { document.getElementById('feeModal').style.display = 'none'; }

function loadStudentFee() {
  const sId = parseInt(document.getElementById('feeStudent').value);
  if (!sId) return;
  const feeRecord = DB.query('fees', f => f.studentId === sId)[0];
  if (feeRecord) {
    document.getElementById('feeTotalAmt').value   = feeRecord.totalFee;
    document.getElementById('feeAlreadyPaid').value = feeRecord.paid || 0;
  }
}

document.getElementById('feeForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const sId   = parseInt(document.getElementById('feeStudent').value);
  const payAmt = parseFloat(document.getElementById('feePayAmt').value);
  const student = DB.getById('students', sId);
  if (!student) return;
  const feeRecords = DB.query('fees', f => f.studentId === sId);
  if (feeRecords.length) {
    const fee = feeRecords[0];
    const newPaid    = (fee.paid || 0) + payAmt;
    const newBalance = (fee.totalFee || 0) - newPaid;
    const newStatus  = newBalance <= 0 ? 'Paid' : newPaid > 0 ? 'Partial' : 'Pending';
    DB.update('fees', fee.id, { paid: newPaid, balance: Math.max(newBalance, 0), status: newStatus, lastPayment: document.getElementById('feeDate').value, receipt: document.getElementById('feeReceipt').value || fee.receipt });
    DB.update('students', sId, { feeStatus: newStatus });
  } else {
    const totalFee = parseFloat(document.getElementById('feeTotalAmt').value) || 45000;
    const balance  = totalFee - payAmt;
    const status   = balance <= 0 ? 'Paid' : 'Partial';
    DB.insert('fees', { studentId: sId, rollNo: student.rollNo, studentName: student.name, branch: student.branch, year: student.year, totalFee, paid: payAmt, balance: Math.max(balance,0), status, lastPayment: document.getElementById('feeDate').value });
    DB.update('students', sId, { feeStatus: status });
  }
  closeFeeModal();
  loadFees();
});

function loadFees() {
  allFees = DB.getAll('fees');
  renderFees(allFees);
  loadFeeStats();
}

document.addEventListener('DOMContentLoaded', loadFees);
