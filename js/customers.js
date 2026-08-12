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

const table = document.getElementById("customer-table");
const totalEl = document.getElementById("customer-total");
const statusFilter = document.getElementById("filter-status");
const paymentFilter = document.getElementById("filter-payment");
const locationFilter = document.getElementById("filter-location");
const searchInput = document.getElementById("customer-search");

function formatCurrency(amount) {
  return amount.toLocaleString("en-US") + " VND";
}

function formatNumber(num) {
  return num.toLocaleString("en-US");
}

function updateTotal(data) {
  if (!totalEl) return;
  const sum = data.reduce((acc, customer) => acc + customer.total, 0);
  totalEl.textContent = formatCurrency(sum);
}

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

    ["Edit", "Delete"].forEach((label) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = label;
      dropdownMenu.appendChild(button);
    });

    actionCell.append(actionButton, dropdownMenu);
    row.appendChild(actionCell);
    table.appendChild(row);
  });

  updateTotal(data);
}

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

statusFilter.addEventListener("change", filterCustomers);
paymentFilter.addEventListener("change", filterCustomers);
locationFilter.addEventListener("change", filterCustomers);

if (searchInput) {
  searchInput.addEventListener("input", filterCustomers);
}

filterCustomers();

table.addEventListener("click", (event) => {
  const actionButton = event.target.closest(".action-btn");

  if (!actionButton) return;

  const menu = actionButton.nextElementSibling;
  const shouldOpen = !menu.classList.contains("show");

  table.querySelectorAll(".dropdown-menu.show").forEach((openMenu) => {
    openMenu.classList.remove("show");
  });
  table.querySelectorAll(".action-btn[aria-expanded='true']").forEach(
    (openButton) => openButton.setAttribute("aria-expanded", "false"),
  );

  if (shouldOpen) {
    menu.classList.add("show");
    actionButton.setAttribute("aria-expanded", "true");
  }
});

const overlay = document.getElementById("customer-modal");
const openBtn = document.getElementById("open-customer-modal");
const cancelBtn = document.getElementById("cancel-customer");
const form = document.getElementById("customer-form");

if (overlay && openBtn && form) {
  function openModal() {
    overlay.classList.remove("hidden");
    overlay.removeAttribute("hidden");
    document.getElementById("modal-customer").focus();
  }

  function closeModal() {
    overlay.classList.add("hidden");
    overlay.setAttribute("hidden", "");
    form.reset();
    openBtn.focus();
  }

  openBtn.addEventListener("click", openModal);
  cancelBtn.addEventListener("click", closeModal);
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
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !overlay.classList.contains("hidden")) {
      closeModal();
    }
  });
}
