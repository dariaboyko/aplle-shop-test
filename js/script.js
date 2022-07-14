const content = document.querySelector("#items");


let items = [];
let amounts = [];

async function getData() {
  const response = await fetch("https://shop-items-server.herokuapp.com/");
  const array = await response.json();
  items = array;
  items.forEach(() => amounts.push(0));
  for (let i = 0; i < items.length; i++) {
    items[i].imgUrl = "./img/" + items[i].imgUrl;
  }
  content.innerHTML = "";

  let data = "";

  items.forEach((element) => {
    data += createCardContent(element);
  });
  content.innerHTML = data;
}
getData();
const createCardContent = (object) => {
  const { name, imgUrl, price, orderInfo, id } = object;

  if (orderInfo.inStock !== 0) {
    const card = `<div class="card" name="${id}">
    <img class="productImg" src="${imgUrl}" alt="${name}" name="${id}">
    <h2 class="productTitle" name="${id}">${name}</h2>
    <span class="inStock" name="${id}"><img class= "inStockImg" src="./img/icons/check.svg"><span class="boldNumbers">${orderInfo.inStock}</span> left in stock</span>
    <span class="inStock" name="${id}">Price: <span class="boldNumbers">${price}</span> $</span>
    <button class="addToCart" name="${id}">Add to cart</button>
    <div class="productInfo stats">
    <img class="likeReview" src='./img/icons/like.svg'>
    <div class="cardBottom">
    <p><span class="boldNumbers">${orderInfo.reviews}% </span> Positive reviews</p>
    <p>Above average</p>
    </div>
    </div>
    </div>`;

    return card;
  } else {
    const card = `<div class="card">
    <img class="productImg" src="${imgUrl}" alt="${name}" name="${id}">
    <h2 class="productTitle" name="${id}">${name}</h2>
    <span class="inStock" name="${id}"><img class= "inStockImg closeStockImg" src="./img/icons/close.svg">${orderInfo.inStock} left in stock</span>
    <span class="inStock" name="${id}">Price: <span class="boldNumbers">${price} </span>$</span>
    <button class="addToCart disabledButton">Add to cart</button>
    <div class="productInfo stats">
    <img class="likeReview" src='./img/icons/like.svg'>
    <div class="cardBottom">
    <p><span class="boldNumbers">${orderInfo.reviews}%</span> Positive reviews</p>
    <p>Above average</p>
    </div>
    </div>
    </div>`;
    return card;
  }
};
let arrows = document.querySelectorAll(".arrow");
const filterContent = document.querySelectorAll(".filterWrapper");
const sideFiltersButton = document.getElementById("sideFiltersButton");
const sideFiters = document.getElementById("sideFiters");
const filterModal = document.getElementById("filterModal");
const sortButton = document.getElementById("sortButton");
const sortModal = document.getElementById("sortModal");
const closeFilterModal = document.querySelectorAll(".close");

let filteredArray = [];
filterContent.forEach((element) => {
  filteredArray.push(element.classList[0]);
});
sideFiltersButton.addEventListener("click", () => {
  if (sideFiters.classList.contains("displayNone")) {
    sideFiters.classList.remove("displayNone");
    sideFiltersButton.classList.add("filterButtonChecked");
    content.classList.add("itemsWrapperFiltered");
    filterModal.classList.remove("displayNone");
    sortModal.classList.add("displayNone");
    sortButton.classList.remove("checkedSortButton");
  } else {
    sideFiters.classList.add("displayNone");
    content.classList.remove("itemsWrapperFiltered");
    sideFiltersButton.classList.remove("filterButtonChecked");
    filterModal.classList.add("displayNone");
    sortModal.classList.add("displayNone");
    sortButton.classList.remove("checkedSortButton");
  }
});
sortButton.addEventListener("click", () => {
  sortModal.classList.remove("displayNone");
  filterModal.classList.add("displayNone");
  sortButton.classList.add("checkedSortButton");
});

closeFilterModal.forEach((e) =>
  e.addEventListener("click", () => {
    filterModal.classList.add("displayNone");
    sortModal.classList.add("displayNone");
    sortButton.classList.remove("checkedSortButton");
  })
);

arrows.forEach((el) => {
  el.addEventListener("click", () => {
    if (el.classList.contains("down")) {
      el.classList.add("up");
      el.classList.remove("down");
      filterContent[filteredArray.indexOf(el.classList[0])].classList.add(
        "displayNone"
      );
    } else {
      el.classList.remove("up");
      el.classList.add("down");
      filterContent[filteredArray.indexOf(el.classList[0])].classList.remove(
        "displayNone"
      );
    }
  });
});
const generateContent = (array) => {
  content.innerHTML = "";

  let data = "";

  array.forEach((element) => {
    data += createCardContent(element);
  });

  if (!data) data = "No data";

  content.innerHTML = data;
};

const filterData = (data, filter) => {
  const filteredData1 = data.filter((item) => {
    let result = false;

    if (filter) {
      if (item.name.toLowerCase().includes(filter.toLowerCase())) {
        result = true;
      }
    }
    return result;
  });
  if (filter.length === 0) {
    return items;
  } else if (filteredData1 !== 0) {
    return filteredData1;
  }
};
const filterDataByPrice = (data) => {
  let minPrice = Number(document.getElementById("startingPrice").value);
  let maxPrice = Number(document.getElementById("endingPrice").value);
  let filteredData = [];
  if (minPrice.toString().length === 3 && minPrice < 179) {
    document.getElementById("startingPrice").value = 179;
  }
  if (maxPrice > 2799) {
    document.getElementById("endingPrice").value = 2799;
  }
  if (minPrice !== 0 && maxPrice !== 0) {
    filteredData = data.filter((e) => maxPrice > e.price && e.price > minPrice);
  } else if (minPrice !== 0) {
    filteredData = data.filter((e) => e.price > minPrice);
  } else if (maxPrice !== 0) {
    filteredData = data.filter((e) => maxPrice > e.price);
  } else {
    filteredData = data;
  }
  return filteredData;
};

const colors = document.getElementsByName("color");
const filterDataByColors = (data) => {
  let checked = [];
  colors.forEach((e) => {
    if (e.checked) {
      checked.push(e);
    }
  });
  if (checked.length >= 1) {
    let checkedColors = [];
    checked.forEach((e) => checkedColors.push(e.value));

    let filteredData = [];
    data.forEach((item) => {
      checkedColors.forEach((e) => {
        if (item.color.join().includes(e)) {
          filteredData.push(item);
        }
      });
    });
    return filteredData;
  } else {
    return data;
  }
};
const memory = document.getElementsByName("memory");
const filterDataByMemory = (data) => {
  let checked = [];
  memory.forEach((e) => {
    if (e.checked) {
      checked.push(e);
    }
  });
  if (checked.length >= 1) {
    let checkedMemory = [];
    checked.forEach((e) => checkedMemory.push(e.value));

    let filteredData = [];
    checkedMemory.forEach((e) => {
      data.forEach((item) => {
        if (item.storage == e) {
          filteredData.push(item);
        }
      });
    });
    return filteredData;
  } else {
    return data;
  }
};
const os = document.getElementsByName("OS");
const filterDataByOS = (data) => {
  let checked = [];
  os.forEach((e) => {
    if (e.checked) {
      checked.push(e);
    }
  });
  if (checked.length >= 1) {
    let checkedOS = [];
    checked.forEach((e) => checkedOS.push(e.value));

    let filteredData = [];
    checkedOS.forEach((e) => {
      data.forEach((item) => {
        if (item.os == e) {
          filteredData.push(item);
        }
      });
    });
    return filteredData;
  } else {
    return data;
  }
};
const compareNumbers = (a, b) => {
  return a - b;
};

const display = document.getElementsByName("display");
const filterDataByDisplay = (data) => {
  let checked = [];
  display.forEach((e) => {
    if (e.checked) {
      checked.push(e);
    }
  });
  if (checked.length >= 1) {
    let arrayOfInches = [];
    let filteredData = [];
    checked.forEach((e) => {
      arrayOfInches.push(e.min);
      arrayOfInches.push(e.max);
    });
    arrayOfInches = arrayOfInches.sort(compareNumbers);
    data.forEach((item) => {
      if (
        arrayOfInches[0] <= item.display &&
        arrayOfInches[arrayOfInches.length - 1] >= item.display
      ) {
        filteredData.push(item);
      }
    });
    return filteredData;
  } else {
    return data;
  }
};

let pageContent = items;
const searchBar = document.getElementById("searchBar");
let inputs = searchBar.getElementsByTagName("input");
for (let input of inputs) {
  const eventType = input.type === "checkbox" ? "change" : "input";

  input.addEventListener(eventType, (e) => {
    e.preventDefault();
    let filteredData = items;
    if (input.id === "searchedDevice") {
      const data = input.value;
      console.log(input.value);
      filteredData = filterData(items, data);
    }
    filteredData = filterDataByColors(filteredData);
    filteredData = filterDataByPrice(filteredData);
    filteredData = filterDataByMemory(filteredData);
    filteredData = filterDataByOS(filteredData);
    filteredData = filterDataByDisplay(filteredData);
    pageContent = filteredData;
    generateContent(pageContent);
  });
}

const defaultButton = document.getElementById("defaultButton");
const ascendingButton = document.getElementById("ascendingButton");
const descendingButton = document.getElementById("descendingButton");
ascendingButton.addEventListener("click", (e) => {
  e.preventDefault();
  defaultButton.classList.remove("orderButtonChecked");
  ascendingButton.classList.add("orderButtonChecked");
  descendingButton.classList.remove("orderButtonChecked");
  generateContent(pageContent.sort((a, b) => (a.price > b.price ? 1 : -1)));
});
descendingButton.addEventListener("click", (e) => {
  e.preventDefault();
  defaultButton.classList.remove("orderButtonChecked");
  ascendingButton.classList.remove("orderButtonChecked");
  descendingButton.classList.add("orderButtonChecked");
  generateContent(pageContent.sort((a, b) => (a.price < b.price ? 1 : -1)));
});
defaultButton.addEventListener("click", (e) => {
  e.preventDefault();
  defaultButton.classList.add("orderButtonChecked");
  ascendingButton.classList.remove("orderButtonChecked");
  descendingButton.classList.remove("orderButtonChecked");
  generateContent(pageContent.sort((a, b) => (a.id > b.id ? 1 : -1)));
});


let cartItems = [];
let totalPrice = 0;
const itemInfoWindow = document.getElementById("itemInfoWindow");
const itemInfoWindowWrapper = document.getElementById("itemInfoWindowWrapper");
const cartItemsElement = document.getElementById("cartItems");
const totalAmountElement = document.getElementById("totalAmount");
const totalPriceElement = document.getElementById("totalPrice");
document.querySelector(".itemsWrapper").onclick = function (e) {
  e.preventDefault();
  if (
    e.target.matches(".card") ||
    e.target.matches(".productImg") ||
    e.target.matches(".productTitle") ||
    e.target.matches(".inStock") ||
    e.target.matches(".itemInfoWindow")
  ) {
    const NAME = e.target.name;
    const item = items.filter((e) => {
    return e.id == NAME;
    })[0];
    itemInfoWindow.classList.remove("displayNone");
    itemInfoWindowWrapper.classList.remove("displayNone");
    const { name, imgUrl, size, orderInfo, os, price, chip, color,id } = item;
    if (orderInfo.inStock !== 0) {
      itemInfoWindow.innerHTML = `
    <img class="productInfoImg" src="${imgUrl}" alt="${name}"></img>
    <div class="productWindowStats">
        <h2 class="productTitle">${name}</h2>
        <div class="productInfo stats">
            <img class="likeReview" src='./img/icons/like.svg'>
            <div class="cardBottom">
                <p><span class="boldNumbers">${orderInfo.reviews}% </span> Positive reviews</p>
                <p>Above average</p>
            </div>
        </div>
        <div class="parameters">
            <p>Color: <span>${color}</span></p>
            <p>Operating system: <span>${os}</span></p>
            <p>Chip: <span>${chip.name}</span></p>
            <p>Height: <span>${size.height} cm</span></p>
            <p>Width: <span>${size.width} cm</span></p>
            <p>Depth: <span>${size.depth} cm</span></p>
            <p>Weight: <span>${size.weight} g</span></p>
        </div>
    </div>
    <div class="orderInfoWindow">
            <h2 class="price" >$ ${price}</h2>
            <p class="stock">Stock: <span class="boldNumbers">${orderInfo.inStock}</span> pcs</p>
            <button class="addToCart"  name="${id}">Add to cart</button>
    </div>
    `;
    } else {
      itemInfoWindow.innerHTML = `
    <img class="productInfoImg" src="${imgUrl}" alt="${name}"></img>
    <div class="productWindowStats">
        <h2 class="productTitle">${name}</h2>
        <div class="productInfo stats">
            <img class="likeReview" src='./img/icons/like.svg'>
            <div class="cardBottom">
                <p><span class="boldNumbers">${orderInfo.reviews}% </span> Positive reviews</p>
                <p>Above average</p>
            </div>
        </div>
        <div class="parameters">
            <p>Color: <span>${color}</span></p>
            <p>Operating system: <span>${os}</span></p>
            <p>Chip: <span>${chip.name}</span></p>
            <p>Height: <span>${size.height} cm</span></p>
            <p>Width: <span>${size.width} cm</span></p>
            <p>Depth: <span>${size.depth} cm</span></p>
            <p>Weight: <span>${size.weight} g</span></p>
        </div>
    </div>
    <div class="orderInfoWindow">
            <h2 class="price" >$ ${price}</h2>
            <p class="stock">Stock: <span class="boldNumbers">${orderInfo.inStock}</span> pcs</p>
            <button class="addToCart disabledButton">Add to cart</button>
    </div>
    `;
    }
  }
  if (e.target.matches(".addToCart")) {
      const item = items.filter((el) => el.id == e.target.name)[0];
      const { name, imgUrl, price, chip, color, id } =item;
      totalPrice += price;
      if (cartItems.filter((el)=> el.id===id).length!==0){
          amounts[id - 1]++;
        cartItemsElement.querySelector("#amount" + id).innerHTML = `${
          amounts[id - 1]
        }`;
      }
        else{
            cartItems.push(item);
            amounts[id - 1]=1;
            cartItemsElement.innerHTML += `<div class="cartItem"> 
                <img class="cartImg" src="${imgUrl}" alt="${name}">
                <div class="cartItemInfo">
                    <p>${name}</p>
                    <p class="cartItemPrice">$${price}</p>
                </div>
                <button class="amountButton lessAmount" name = "${id}"> < </button>
                <p class="cartItemAmount" id="amount${id}">${
              amounts[id - 1]
            }</p>
                <button class="amountButton moreAmount" name = "${id}"> > </button>
                <button class="deleteCartItem" name = "${id}">X</button>
            <div>`;}
}
const totalAmount = amounts.reduce((acc, num) => acc + num, 0);
totalAmountElement.innerHTML = `${totalAmount} ptc.`;
totalPriceElement.innerHTML = `${totalPrice}$.`;
};
document.querySelector(".itemInfoWindowWrapper").onclick = function (e) {
  e.preventDefault();
  itemInfoWindow.classList.add("displayNone");
  itemInfoWindowWrapper.classList.add("displayNone");
};
document.querySelector(".itemInfoWindow").onclick = function (e) {
  e.preventDefault();
  if (e.target.matches(".addToCart")) {
        const item = items.filter((el) => el.id == e.target.name)[0];
        const { name, imgUrl, price, id } = item;
        totalPrice += price;
        if (cartItems.filter((el) => el.id == id).length !== 0) {
        amounts[id - 1]++;
        cartItemsElement.querySelector("#amount" + id).innerHTML = `${amounts[id - 1]}`;
    }
     else {
      cartItems.push(item);
      amounts[id - 1] = 1;
      cartItemsElement.innerHTML += `<div class="cartItem"> 
                <img class="cartImg" src="${imgUrl}" alt="${name}">
                <div class="cartItemInfo">
                    <p>${name}</p>
                    <p class="cartItemPrice">$${price}</p>
                </div>
                <button class="amountButton lessAmount" name = "${id}"> < </button>
                <p class="cartItemAmount" id="amount${id}">${
        amounts[id - 1]
      }</p>
                <button class="amountButton moreAmount" name = "${id}"> > </button>
                <button class="deleteCartItem" name = "${id}">X</button>
            <div>`;
    }}
  const totalAmount = amounts.reduce((acc, num) => acc + num, 0);
  totalAmountElement.innerHTML = `${totalAmount} ptc.`;
  totalPriceElement.innerHTML = `${totalPrice}$.`;
};

const cart = document.getElementById("cart");
const cartWrapper = document.getElementById("cartWrapper");
cart.addEventListener("click", (e) => {
  e.preventDefault();
  if (cartWrapper.classList.contains("displayNone")){
      cartWrapper.classList.remove("displayNone")}
  else cartWrapper.classList.add("displayNone");
});

document.querySelector(".cartWrapper").onclick = function (e) {
  e.preventDefault();
   if (e.target.matches(".deleteCartItem")) {
       console.log(cartItems);
    cartItems = cartItems.filter((el) => el.id != e.target.name);
    amounts[e.target.name-1]=0;
    cartItemsElement.innerHTML='';
    cartItems.forEach(
      ({ name, imgUrl,price, id }) => {
        cartItemsElement.innerHTML += `<div class="cartItem"> 
                <img class="cartImg" src="${imgUrl}" alt="${name}">
                <div class="cartItemInfo">
                    <p>${name}</p>
                    <p class="cartItemPrice">$${price}</p>
                </div>
                <button class="amountButton lessAmount" name = "${id}"> < </button>
                <p class="cartItemAmount" id="amount${id}">${
        amounts[id - 1]
      }</p>
                <button class="amountButton moreAmount" name = "${id}"> > </button>
                <button class="deleteCartItem" name = "${id}">X</button>
            <div>`;
      }
    );
   }
   if (e.target.matches(".lessAmount")) {
       if(amounts[e.target.name-1]!==0){
        amounts[e.target.name-1]--;
        document.querySelector(`#amount${e.target.name}`).innerHTML = `${
        amounts[e.target.name - 1]
       }`;
    }
   }
   if (e.target.matches(".moreAmount")) {
     amounts[e.target.name - 1]++;
     document.querySelector(`#amount${e.target.name}`).innerHTML = `${
       amounts[e.target.name - 1]
     }`;
   }
   totalPrice = 0;
   for (let i = 1; i < amounts.length; i++) {
       totalPrice += amounts[i-1]*items.filter((item)=>item.id===i)[0].price;
   }
   const totalAmount = amounts.reduce((acc, num) => acc + num, 0);
   totalAmountElement.innerHTML = `${totalAmount} ptc.`;
   totalPriceElement.innerHTML = `${totalPrice}$.`;
}
