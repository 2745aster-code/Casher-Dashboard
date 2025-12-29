function updateDateTime() {
    const now = new Date();
    const options = { day: "2-digit", month: "short", year: "numeric" };
    const formatDate = now.toLocaleDateString("en-US", options);
    const formatTime = now.toLocaleTimeString("en-US", { hour12: false });

    document.getElementById("time-auto").textContent = formatTime;
    document.getElementById("date-auto").textContent = formatDate;
}
setInterval(updateDateTime, 1000);
updateDateTime();

document.querySelectorAll(".category-item").forEach(item => {
    item.addEventListener("click", function() {
        let selected = this.getAttribute("data-cat");

        document.querySelectorAll(".category-item").forEach(c => {
            c.classList.remove("active-category");
        });
        this.classList.add("active-category");

        document.querySelectorAll(".cell").forEach(product => {
            let productCat = product.getAttribute("data-cat");

            if(selected === "all" || productCat === selected) {
                product.style.display = "flex";
                setTimeout(() => {
                    product.classList.add("show");
                }, 10);
            } else {
                product.classList.remove("show");
                product.style.display = "none";
            }
        });
    });
});

window.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".cell").forEach(product => {
        product.style.display = "flex";
        setTimeout(() => product.classList.add("show"), 10);
    });

    let allBtn = document.querySelector('.category-item[data-cat="all"]');
    if (allBtn) allBtn.classList.add("active-category");
})

let bill = [];
function addToBill(name, price) {
    let existing = bill.find(item => item.name === name);
    if (existing) {
        existing.qty++;
    } else {
        bill.push({ name, price, qty: 1});
    }

    updateBillUI();
}

function updateBillUI() {
    let container = document.getElementById("bill-items");
    container.innerHTML = "";
    let total = 0;

    bill.forEach((item, index) => {
        let row = document.createElement("div");
        row.classList.add("bill-row");

        row.innerHTML = `
            <div class="bill-name">${item.name}</div>
            <div class="bill-qty">
                <button onclick="changeQty(${index}, -1)">-</button>
                <span>${item.qty}</span>
                <button onclick="changeQty(${index}, 1)">+</button>
            </div>
            <div class="bill-price">₹${item.price * item.qty}</div>
            <div class="bill-remove" onclick="removeItem(${index})">x</div>
        `;

        total += item.price * item.qty;
        container.appendChild(row);
    });
    document.getElementById("sub-total").innerText = `₹ ${total}`;
    let gst = total * 0.05;
    document.getElementById("gst-amount").innerText = "₹ " + gst.toFixed(2);
    let discountType = document.getElementById("discount-type").value;
    let discountAmount = 0;

    if(discountType === "custom") {
        discountAmount = parseFloat(document.getElementById("discount-custom").value) || 0;
    } else {
        let discountPercent = parseFloat(discountType);
        discountAmount = total * (discountPercent / 100);
    }

    let grandTotal = total + gst - discountAmount;
    if(grandTotal < 0) grandTotal = 0;

    document.getElementById("grand-total").innerText = "₹ " + grandTotal.toFixed(2);
}

function changeQty(i, delta) {
    bill[i].qty += delta;
    if (bill[i].qty <= 0) bill.splice(i, 1);
    updateBillUI();
}

function removeItem(i) {
    bill.splice(i, 1);
    updateBillUI();
}

document.getElementById("discount-type").addEventListener("change", function () {
    let customInput = document.getElementById("discount-custom");

    if(this.value === "custom") {
        customInput.style.display = "inline-block";
    } else {
        customInput.style.display = "none";
        customInput.value = "";
    }
    updateBillUI();
});

function cleanAmount(value) {
    return parseFloat(value.replace(/[₹,\s]/g, "")) || 0;
}
document.getElementById("discount-custom").addEventListener("input", updateBillUI);

document.getElementById("checkout-btn").addEventListener("click", function() {
    let subtotal = cleanAmount(document.getElementById("sub-total").innerText);
    let gst = cleanAmount(document.getElementById("gst-amount").innerText);
    let grand = cleanAmount(document.getElementById("grand-total").innerText);

    let discountType = document.getElementById("discount-type").value;
    let discount = 0;

    if(discountType === "custom") {
        discount = parseFloat(document.getElementById("discount-custom").value) || 0;
    } else {
        discount = subtotal * (parseFloat(discountType) / 100);
    }

    let customer = {
        name: document.getElementById("customer-name").value || "Walk-in Customer",
        phone: document.getElementById("customer-phone").value || "N/A"
    };

    let invoiceNumber = "FS-" + Date.now();
    let date = new Date().toLocaleString();

    let billData = {
        items: bill,
        subtotal, 
        gst,
        discount: discount.toFixed(2),
        grandTotal: grand.toFixed(2),
        customer,
        invoiceNumber,
        date
    };

    localStorage.setItem("billData", JSON.stringify(billData));
    window.open("receipt.html", "_blank");
});

document.getElementById("hold-btn").addEventListener("click", function () {
    localStorage.setItem("heldBill", JSON.stringify(bill));
    alert("Bill put on hold!");
    bill = [];
    updateBillUI();
});

document.getElementById("resume-btn").addEventListener("click", function () {
    let saved = JSON.parse(localStorage.getItem("heldBill"));
    if (!saved || saved.length === 0) return alert("No held bill found!");

    bill = saved;
    updateBillUI();
});

const searchBox = document.getElementById("search-box");

searchBox.addEventListener("input", function () {
    let query = this.value.toLowerCase().trim();

    document.querySelectorAll(".cell").forEach(product => {
        let nameElement = product.querySelector(".product-name");
        if (!nameElement) return;

        let name = nameElement.innerText.toLowerCase();
        if (query === "") {
            product.style.display = "flex";
            product.classList.add("show");
        } else if (name.includes(query)) {
            product.style.display = "flex";
            product.classList.add("show");
        } else {
            product.classList.remove("show");
            product.style.display = "none";
        }
    });
});

document.getElementById("customer-phone").addEventListener("input", function() {
    let num = this.value.replace(/\D/g, "").slice(0, 10);
    let formatted = num.replace(/(\d{5})(\d{1, 5})/, "$1 $2");
    this.value = formatted;

    if(num.length !== 10) {
        document.getElementById("phone-error").style.display = "block";
    } else {
        document.getElementById("phone-error").style.display = "none";
    }
});

function sendBillToServer() {
    const customerName = document.getElementById("customer-name").value;
    const customerPhone = document.getElementById("customer-phone").value;
    const subtotal = cleanAmount(document.getElementById("sub-total").innerText);
    const gst = cleanAmount(document.getElementById("gst-amount").innerText);
    const grandTotal = cleanAmount(document.getElementById("grand-total").innerText);

    let formattedItems = bill.map(item => ({
        product_name: item.name,
        quantity: item.qty,
        price: item.price,
        total: item.price * item.qty
    }));

    console.log("Sending Data:", {
        customer_name: customerName,
        customer_phone: customerPhone,
        subtotal: subtotal,
        gst: gst,
        grand_total: grandTotal,
        items: formattedItems
    });

    fetch("http://localhost/store/save_bill.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            customer_name: customerName,
            customer_phone: customerPhone,
            subtotal: subtotal,
            gst: gst,
            grand_total: grandTotal,
            items: formattedItems
        })
    })
    .then(res => res.text())
    .then(data => {
        console.log(data);
        alert("Bill saved successfully!");
    })
    .catch(err => console.error("Error", err));
}

const menuToggle = document.getElementById("menuToggle");
const menuList = document.getElementById("menuList");
const menuContainer = document.getElementById("menu");

menuToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    menuList.classList.toggle("show");
});

menuList.addEventListener("click", (e) => {
    e.stopPropagation();
});

document.addEventListener("click", () => {
    menuList.classList.remove("show");
});

document.getElementById("homeBtn").addEventListener("click", function() {
    window.location.href = "../HTML/cashier.html";
});

document.getElementById("profileBtn").addEventListener("click", function() {
    window.location.href = "http://localhost/store/profile.php";
});

document.getElementById("logoutBtn").addEventListener("click", function() {
    alert("Logging out...");
    window.location.href = "http://localhost/store/logout.php";
});

document.getElementById("profile-img").addEventListener("click", function() {
    window.location.href = "http://localhost/store/profile.php";
});