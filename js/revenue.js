const revenue = [
  {
    id: 1,
    product: "Colina",
    volume: "0.75",
    type: "Red",
    quantity: 35,
    price: 170000,
    total: 5950000,
    image: "Paid a half",
    location: "Da Lat",
  },
  {
    id: 2,
    product: "Belleville",
    volume: "0.75",
    type: "White",
    quantity: 40,
    price: 180000,
    total: 6780000,
    image: "Paid a half",
    location: "Nha Trang",
  },
  {
    id: 3,
    product: "Sangria",
    volume: "0.75",
    type: "Red",
    quantity: 35,
    price: 170000,
    total: 5950000,
    image: "Paid a half",
    location: "Ho Chi Minh",
  },
];

const table = document.getElementById("revenue-table");
const locationFilter = document.getElementById("filter-location");
const searchInput = document.getElementById("revenue-search");
const totalElement = document.getElementById("revenue-total");
const overlay = document.getElementById("revenue-modal");
const openButton = document.getElementById("open-revenue-modal");
const cancelButton = document.getElementById("cancel-revenue");
const form = document.getElementById("revenue-form");
const modalTitle = document.getElementById("modal-title");
const productInput = document.getElementById("modal-revenue");
const volumeInput = document.getElementById("modal-address");
const quantityInput = document.getElementById("modal-quantity");
const typeInput = document.getElementById("modal-product");

let editingRevenueId = null;
let nextRevenueId = 4;

function getFilteredRevenue() {
  const selectedLocation = locationFilter.value;
  const searchTerm = searchInput.value.trim().toLowerCase();

  return revenue.filter((record) => {
    const matchesLocation =
      selectedLocation === "" || record.location === selectedLocation;
    const searchableValues = [
      record.product,
      record.volume,
      record.type,
      record.quantity,
      record.price,
      record.total,
      record.image,
      record.location,
    ];
    const matchesSearch = searchableValues.some((value) =>
      String(value).toLowerCase().includes(searchTerm),
    );

    return matchesLocation && matchesSearch;
  });
}

function createCell(value) {
  const cell = document.createElement("td");
  cell.textContent = value;
  return cell;
}

function createActionCell(record) {
  const cell = document.createElement("td");
  const actionButton = document.createElement("button");
  const menu = document.createElement("div");
  const editButton = document.createElement("button");
  const deleteButton = document.createElement("button");

  cell.className = "action";
  actionButton.type = "button";
  actionButton.className = "action-btn";
  actionButton.dataset.action = "toggle-menu";
  actionButton.setAttribute("aria-label", `Actions for ${record.product}`);
  actionButton.textContent = "⋮";

  menu.className = "dropdown-menu";
  editButton.type = "button";
  editButton.dataset.action = "edit";
  editButton.dataset.id = record.id;
  editButton.textContent = "Edit";
  deleteButton.type = "button";
  deleteButton.dataset.action = "delete";
  deleteButton.dataset.id = record.id;
  deleteButton.textContent = "Delete";

  menu.appendChild(editButton);
  menu.appendChild(deleteButton);
  cell.appendChild(actionButton);
  cell.appendChild(menu);
  return cell;
}

function renderTable(records) {
  table.textContent = "";

  if (records.length === 0) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 8;
    cell.textContent = "No revenue records found.";
    row.appendChild(cell);
    table.appendChild(row);
    return;
  }

  records.forEach((record) => {
    const row = document.createElement("tr");
    row.appendChild(createCell(record.product));
    row.appendChild(createCell(record.volume));
    row.appendChild(createCell(record.type));
    row.appendChild(createCell(record.quantity));
    row.appendChild(createCell(record.price));
    row.appendChild(createCell(record.total));
    row.appendChild(createCell(record.image));
    row.appendChild(createActionCell(record));
    table.appendChild(row);
  });
}

function updateTotal(records) {
  const total = records.reduce((sum, record) => sum + Number(record.total || 0), 0);
  totalElement.textContent = `${total.toLocaleString("en-US")} VND`;
}

function updateRevenueView() {
  const filteredRevenue = getFilteredRevenue();
  renderTable(filteredRevenue);
  updateTotal(filteredRevenue);
}

function openModal(record) {
  editingRevenueId = record ? record.id : null;
  modalTitle.textContent = record ? "Edit Revenue" : "Add Revenue";
  form.reset();

  if (record) {
    productInput.value = record.product;
    volumeInput.value = record.volume;
    quantityInput.value = record.quantity;
    typeInput.value = record.type;
  }

  overlay.classList.remove("hidden");
  overlay.removeAttribute("hidden");
  productInput.focus();
}

function closeModal() {
  overlay.classList.add("hidden");
  overlay.setAttribute("hidden", "");
  form.reset();
  editingRevenueId = null;
  modalTitle.textContent = "Add Revenue";
  openButton.focus();
}

function saveRevenue(event) {
  event.preventDefault();

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const quantity = Number(quantityInput.value || 0);

  if (editingRevenueId === null) {
    revenue.push({
      id: nextRevenueId,
      product: productInput.value.trim(),
      volume: volumeInput.value.trim(),
      type: typeInput.value.trim(),
      quantity,
      price: 0,
      total: 0,
      image: "",
      location: locationFilter.value,
    });
    nextRevenueId += 1;
  } else {
    const record = revenue.find((item) => item.id === editingRevenueId);

    if (record) {
      record.product = productInput.value.trim();
      record.volume = volumeInput.value.trim();
      record.type = typeInput.value.trim();
      record.quantity = quantity;
    }
  }

  updateRevenueView();
  closeModal();
}

function deleteRevenue(id) {
  const recordIndex = revenue.findIndex((record) => record.id === id);

  if (recordIndex !== -1) {
    revenue.splice(recordIndex, 1);
    updateRevenueView();
  }
}

locationFilter.addEventListener("change", updateRevenueView);
searchInput.addEventListener("input", updateRevenueView);
openButton.addEventListener("click", () => openModal());
cancelButton.addEventListener("click", closeModal);
form.addEventListener("submit", saveRevenue);

overlay.addEventListener("click", (event) => {
  if (event.target === overlay) {
    closeModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !overlay.classList.contains("hidden")) {
    closeModal();
  }
});

table.addEventListener("click", (event) => {
  const button = event.target.closest("button");

  if (!button) {
    return;
  }

  if (button.dataset.action === "toggle-menu") {
    button.nextElementSibling.classList.toggle("show");
  }

  if (button.dataset.action === "edit") {
    const record = revenue.find((item) => item.id === Number(button.dataset.id));

    if (record) {
      openModal(record);
    }
  }

  if (button.dataset.action === "delete") {
    deleteRevenue(Number(button.dataset.id));
  }
});

updateRevenueView();
