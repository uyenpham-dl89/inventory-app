const customers = [
  {
    Do: "040426-01",
    Customer: "Ler Jardin",
    Product: "Colina",
    volume: "0.75",
    type: "Red",
    quantity: 35,
    price: 170000,
    total: 5950000,
    status: "Paid a half",
    payment: "Bank",
    location: "Hochiminh",
  },
  {
    Do: "040426-02",
    Customer: "Ler Jardin",
    Product: "Costera",
    volume: "0.75",
    type: "Red",
    quantity: 100,
    price: 170000,
    total: 17000000,
    status: "Paid a half",
    payment: "Bank",
    location: "Nha Trang",
  },
  {
    Do: "040426-04",
    Customer: "Ler Jardin",
    Product: "Sangria",
    volume: "0.75",
    type: "Red",
    quantity: 100,
    price: 170000,
    total: 17000000,
    status: "Paid a half",
    payment: "Cash",
    location: "Hanoi",
  },
  {
    Do: "040426-03",
    Customer: "ABC Wine",
    Product: "Colina",
    volume: "0.75",
    type: "Red",
    quantity: 20,
    price: 170000,
    total: 3400000,
    status: "Paid",
    payment: "Bank",
    location: "Hochiminh",
  },
  {
    Do: "040426-05",
    Customer: "XYZ Wine",
    Product: "Belleville",
    volume: "0.75",
    type: "Red",
    quantity: 20,
    price: 170000,
    total: 3400000,
    status: "Not yet",
    payment: "Bank",
    location: "Hoi An",
  },
];

/* =========================
   MAIN ELEMENTS
========================= */

const table = document.getElementById("customer-table");
const totalEl = document.getElementById("customer-total");

const statusFilter = document.getElementById("filter-status");
const paymentFilter = document.getElementById("filter-payment");
const locationFilter = document.getElementById("filter-location");
const searchInput = document.getElementById("customer-search");

/* =========================
   ADD MODAL
========================= */

const overlay = document.getElementById("customer-modal");
const openButton = document.getElementById("open-customer-modal");
const cancelButton = document.getElementById("cancel-customer");
const form = document.getElementById("customer-form");

/* =========================
   EDIT MODAL
========================= */

const editOverlay = document.getElementById("customer-edit-modal");
const editForm = document.getElementById("customer-edit-form");
const cancelEditButton = document.getElementById("cancel-edit-customer");

const editCustomerInput = document.getElementById("edit-customer");
const editProductInput = document.getElementById("edit-product");
const editVolumeInput = document.getElementById("edit-volume");
const editTypeInput = document.getElementById("edit-type");
const editQuantityInput = document.getElementById("edit-quantity");
const editPriceInput = document.getElementById("edit-price");
const editStatusInput = document.getElementById("edit-status");
const editPaymentInput = document.getElementById("edit-payment");
const editLocationInput = document.getElementById("edit-location");

/* =========================
   EDIT STATE
========================= */

let editingCustomerDo = null;

/* =========================
   FORMAT
========================= */

function formatCurrency(amount) {
  return amount.toLocaleString("en-US") + " VND";
}

function formatNumber(num) {
  return num.toLocaleString("en-US");
}

/* =========================
   TOTAL
========================= */

function updateTotal(data) {
  if (!totalEl) {
    return;
  }

  const sum = data.reduce((acc, customer) => acc + customer.total, 0);

  totalEl.textContent = formatCurrency(sum);
}

/* =========================
   RENDER TABLE
========================= */

function renderTable(data) {
  table.innerHTML = "";

  data.forEach((customer) => {
    const row = document.createElement("tr");

    const values = [
      customer.Do,
      customer.Customer,
      customer.Product,
      customer.volume,
      customer.type,
      customer.quantity,
      formatNumber(customer.price),
      formatNumber(customer.total),
    ];

    values.forEach((value) => {
      const cell = document.createElement("td");
      cell.textContent = value;
      row.appendChild(cell);
    });

    /* ACTION CELL */

    const actionCell = document.createElement("td");
    actionCell.className = "action";

    const actionButton = document.createElement("button");

    actionButton.type = "button";
    actionButton.className = "action-btn";
    actionButton.textContent = "⋮";

    actionButton.setAttribute("aria-label", `Actions for ${customer.Do}`);

    actionButton.setAttribute("aria-expanded", "false");

    const dropdownMenu = document.createElement("div");

    dropdownMenu.className = "dropdown-menu";

    /* EDIT */

    const editButton = document.createElement("button");

    editButton.type = "button";
    editButton.textContent = "Edit";

    editButton.dataset.action = "edit";
    editButton.dataset.do = customer.Do;

    /* DELETE */

    const deleteButton = document.createElement("button");

    deleteButton.type = "button";
    deleteButton.textContent = "Delete";

    deleteButton.dataset.action = "delete";
    deleteButton.dataset.do = customer.Do;

    dropdownMenu.appendChild(editButton);
    dropdownMenu.appendChild(deleteButton);

    actionCell.append(actionButton, dropdownMenu);

    row.appendChild(actionCell);

    table.appendChild(row);
  });

  updateTotal(data);
}

/* =========================
   FILTER
========================= */

function filterCustomers() {
  const selectedStatus = statusFilter.value;
  const selectedPayment = paymentFilter.value;
  const selectedLocation = locationFilter.value;

  const query = searchInput ? searchInput.value.trim().toLowerCase() : "";

  const result = customers.filter((customer) => {
    const matchesFilters =
      (selectedStatus === "" || customer.status === selectedStatus) &&
      (selectedPayment === "" || customer.payment === selectedPayment) &&
      (selectedLocation === "" || customer.location === selectedLocation);

    const matchesSearch =
      query === "" ||
      customer.Customer.toLowerCase().includes(query) ||
      customer.Product.toLowerCase().includes(query) ||
      customer.Do.toLowerCase().includes(query);

    return matchesFilters && matchesSearch;
  });

  renderTable(result);
}

/* =========================
   GENERATE DO
========================= */

function generateDo() {
  const now = new Date();

  const dd = String(now.getDate()).padStart(2, "0");
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const yy = String(now.getFullYear()).slice(-2);

  const prefix = `${dd}${mm}${yy}`;

  const sameDayCount = customers.filter((customer) =>
    customer.Do.startsWith(prefix),
  ).length;

  const seq = String(sameDayCount + 1).padStart(2, "0");

  return `${prefix}-${seq}`;
}

/* =========================
   ADD CUSTOMER
========================= */

function saveCustomer(form) {
  if (!form.checkValidity()) {
    form.reportValidity();
    return false;
  }

  const formData = new FormData(form);

  const quantity = Number(formData.get("quantity")) || 1;

  const price = 170000;

  customers.push({
    Do: generateDo(),

    Customer: formData.get("customer").trim(),

    Product: (formData.get("product") || "").trim() || "—",

    volume: "0.75",

    type: "Red",

    quantity,

    price,

    total: quantity * price,

    status: "Not yet",

    payment: "Cash",

    location: "Hochiminh",
  });

  filterCustomers();

  return true;
}

/* =========================
   OPEN EDIT MODAL
========================= */

function openEditModal(customer) {
  editingCustomerDo = customer.Do;

  editCustomerInput.value = customer.Customer;

  editProductInput.value = customer.Product;

  editVolumeInput.value = customer.volume;

  editTypeInput.value = customer.type;

  editQuantityInput.value = customer.quantity;

  editPriceInput.value = customer.price;

  editStatusInput.value = customer.status;

  editPaymentInput.value = customer.payment;

  editLocationInput.value = customer.location;

  editOverlay.classList.remove("hidden");
  editOverlay.removeAttribute("hidden");

  editCustomerInput.focus();
}

/* =========================
   SAVE EDIT
========================= */

function saveEditedCustomer(event) {
  event.preventDefault();

  /*
    Check required fields
  */

  if (!editForm.checkValidity()) {
    editForm.reportValidity();
    return;
  }

  /*
    Find the customer being edited
  */

  const customer = customers.find((item) => item.Do === editingCustomerDo);

  if (!customer) {
    return;
  }

  /*
    Update customer data
  */

  customer.Customer = editCustomerInput.value.trim();

  customer.Product = editProductInput.value.trim();

  customer.volume = editVolumeInput.value.trim();

  customer.type = editTypeInput.value.trim();

  customer.quantity = Number(editQuantityInput.value) || 0;

  customer.price = Number(editPriceInput.value) || 0;

  customer.status = editStatusInput.value;

  customer.payment = editPaymentInput.value;

  customer.location = editLocationInput.value;

  /*
    Recalculate total
  */

  customer.total = customer.quantity * customer.price;

  /*
    Refresh table
  */

  filterCustomers();

  /*
    Close modal
  */

  closeEditModal();
}

/* =========================
   CLOSE EDIT MODAL
========================= */

function closeEditModal() {
  editOverlay.classList.add("hidden");

  editOverlay.setAttribute("hidden", "");

  editForm.reset();

  editingCustomerDo = null;
}

/* =========================
   DELETE CUSTOMER
========================= */

function deleteCustomer(doNumber) {
  const customerIndex = customers.findIndex(
    (customer) => customer.Do === doNumber,
  );

  if (customerIndex === -1) {
    return;
  }

  const confirmed = confirm("Are you sure you want to delete this customer?");

  if (!confirmed) {
    return;
  }

  customers.splice(customerIndex, 1);

  filterCustomers();
}

/* =========================
   FILTER EVENTS
========================= */

statusFilter.addEventListener("change", filterCustomers);

paymentFilter.addEventListener("change", filterCustomers);

locationFilter.addEventListener("change", filterCustomers);

if (searchInput) {
  searchInput.addEventListener("input", filterCustomers);
}

/* =========================
   TABLE EVENTS
========================= */

table.addEventListener("click", (event) => {
  const button = event.target.closest("button");

  if (!button) {
    return;
  }

  /*
      THREE DOT MENU
    */

  if (button.classList.contains("action-btn")) {
    const menu = button.nextElementSibling;

    const shouldOpen = !menu.classList.contains("show");

    table.querySelectorAll(".dropdown-menu.show").forEach((openMenu) => {
      openMenu.classList.remove("show");
    });

    table
      .querySelectorAll(".action-btn[aria-expanded='true']")
      .forEach((openButton) => {
        openButton.setAttribute("aria-expanded", "false");
      });

    if (shouldOpen) {
      menu.classList.add("show");

      button.setAttribute("aria-expanded", "true");
    }

    return;
  }

  /*
      EDIT
    */

  if (button.dataset.action === "edit") {
    const customer = customers.find((item) => item.Do === button.dataset.do);

    if (customer) {
      openEditModal(customer);
    }

    return;
  }

  /*
      DELETE
    */

  if (button.dataset.action === "delete") {
    deleteCustomer(button.dataset.do);

    return;
  }
});

/* =========================
   ADD MODAL EVENTS
========================= */

if (overlay && openButton && form) {
  function openModal() {
    overlay.classList.remove("hidden");

    overlay.removeAttribute("hidden");

    document.getElementById("modal-customer").focus();
  }

  function closeModal() {
    overlay.classList.add("hidden");

    overlay.setAttribute("hidden", "");

    form.reset();

    openButton.focus();
  }

  openButton.addEventListener("click", openModal);

  cancelButton.addEventListener("click", closeModal);

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (saveCustomer(form)) {
      closeModal();
    }
  });

  overlay.addEventListener("click", function (event) {
    if (event.target === overlay) {
      closeModal();
    }
  });
}

/* =========================
   EDIT MODAL EVENTS
========================= */

if (editOverlay && editForm && cancelEditButton) {
  cancelEditButton.addEventListener("click", closeEditModal);

  editForm.addEventListener("submit", saveEditedCustomer);

  editOverlay.addEventListener("click", function (event) {
    if (event.target === editOverlay) {
      closeEditModal();
    }
  });
}

/* =========================
   ESCAPE KEY
========================= */

document.addEventListener("keydown", function (event) {
  if (event.key !== "Escape") {
    return;
  }

  if (overlay && !overlay.classList.contains("hidden")) {
    overlay.classList.add("hidden");
    overlay.setAttribute("hidden", "");

    form.reset();
  }

  if (editOverlay && !editOverlay.classList.contains("hidden")) {
    closeEditModal();
  }
});

/* =========================
   INITIAL RENDER
========================= */

filterCustomers();
