console.log("JavaScript loaded");

const loginForm = document.getElementById("loginForm");
const container = document.querySelector(".container");
const loginSection = document.querySelector(".login");

function mainPage(user) {

// const savedData = JSON.parse(localStorage.getItem("data")) || [];

// if (savedData.length > 0) {
//     display(savedData);
// }

loginSection.style.display = "none";
container.style.display = "block";


container.innerHTML = `

<div class="nav">
<ul>
<li>Home</li>
<li>Store</li>
<li>Abouts</li>
<li>Contact</li>
<li>
<select class="settings">
<option>Settings</option>
<option>Manage Profile</option>
<option>Logout</option>
</select>

</li>
</ul>
</div>
<br>
<div class="searchBar">
<label for="search">Search:</label>
<input type="text" name="search" id="search">
</div>
<br>
<h1>Products:</h1>
<div class="contentContainer">

<div class="contentOptions">
<ul>
<li id="inStore">InStore</li>
<li id="shoppingCart">Shopping Cart</li>
<li>Undefined</li>
<li>Undefined</li>
<li>Undefined</li>
</ul>
</div>
<div class="contentDisplay">
<div class="productList"></div>
</div>

</div>
`;

const shoppingCart = document.getElementById("shoppingCart");
const inStore = document.getElementById("inStore");
const productList = document.querySelector(".productList");
const search = document.getElementById("search");


search.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        
        const searchInput = search.value.trim().toLowerCase();

        const savedData = JSON.parse(localStorage.getItem("data")) || [];

        const filteredProducts = savedData.filter(product => {
            return product.ProductName.toLowerCase().includes(searchInput);
        });

        display(filteredProducts)
    }
})

inStore.addEventListener("click", async () => {
    const response = await fetch(`/products`, {
        method: "GET"
    })

    const data = await response.json();

    localStorage.setItem("data", JSON.stringify(data));

    productList.innerHTML = "";

    display(data)

   
})

function display(data) {
    productList.innerHTML = "";

    data.forEach(product => {
        
        productList.innerHTML += `
        
        <div class="productCard">
                
                <div>${product.ProductName}</div>
                <div>${product.CategoryID}</div>
                <div>${product.BasePrice}</div>

                <button class="addToCart" data-id="${product.ProductID}">Add to Cart</button>
                
                </div>
        
        
        `

    });

    const addToCart = document.querySelectorAll(".addToCart");

    addToCart.forEach(button => {

    const ProductID = button.dataset.id;

    button.addEventListener("click", () => {
        const selectProduct = data.find(product => {
            return product.ProductID == ProductID;
        })
        console.log(selectProduct)

        const cart = JSON.parse(localStorage.getItem("cart")) || [];

        cart.push(selectProduct);

        localStorage.setItem("cart", JSON.stringify(cart));

        console.log(cart)
    })
})



}

const savedData = JSON.parse(localStorage.getItem("data")) || [];

if (savedData.length > 0) {
    display(savedData);
}

shoppingCart.addEventListener("click", () => {
    

    const contentDisplay = document.querySelector(".productList");

    contentDisplay.innerHTML = ""

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    console.log(cart)

    cart.forEach(product => {
        contentDisplay.innerHTML += `
        
         <div class="productCard">
                
                <div>${product.ProductName}</div>
                <div>${product.CategoryID}</div>
                <div>${product.BasePrice}</div>     
                </div>
        `
    })

})

const dropDown = document.querySelector(".settings");

dropDown.addEventListener("change", () => {
    
    if (dropDown.value === "Logout") {
        localStorage.removeItem("user");
        location.reload();
    }
})



}

const savedUser = localStorage.getItem("user");

if (savedUser) {
    const user = JSON.parse(savedUser)
    mainPage(user)
} else {
    console.log("No user found")
    loginSection.style.display = "block";
    container.style.display = "none";
}

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    console.log("Submit event triggered");


    const Email = document.getElementById("email").value;
    const Password = document.getElementById("password").value;

    if (!Email.trim() || !Password) {
        console.log("No details have been captured.")
        return;
    }

    const response = await fetch("http://localhost:3000/users/login" , {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            Email: Email,
            Password: Password
        })
    })

    const data = await response.json();

    if (response.ok) {
        console.log("Login successful")

        localStorage.setItem("user", JSON.stringify(data))

        console.log("Login response:", data);

        mainPage(data)
        
    } 
})