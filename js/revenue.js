const revenue = [
  {
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
console.log(table);
function renderTable(data) {
  table.innerHTML = "";

  data.forEach((revenue) => {
    table.innerHTML += `
      <tr>

        <td>${revenue.product}</td>
        <td>${revenue.volume}</td>
        <td>${revenue.type}</td>
        <td>${revenue.quantity}</td>
        <td>${revenue.price}</td>
        <td>${revenue.total}</td>
        <td>${revenue.image}</td>
       
        

        <td class="action">

          <button class="action-btn">⋮</button>

          <div class="dropdown-menu">
            <button>Edit</button>
            <button>Delete</button>
          </div>

        </td>

      </tr>
    `;
  });
}

const locationFilter = document.getElementById("filter-location");

function filterRevenue() {
  const selectedlocation = locationFilter.value;

  const result = revenue.filter((revenue) => {
    return selectedlocation === "" || revenue.location === selectedlocation;
  });

  renderTable(result);
}

locationFilter.addEventListener("change", filterRevenue);

renderTable(revenue);

table.addEventListener("click", (e) => {
  if (e.target.classList.contains("action-btn")) {
    const menu = e.target.nextElementSibling;
    menu.classList.toggle("show");
  }
});
