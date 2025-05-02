const alphaPos = new AlphaPos()

const addDrinkButton = document.querySelector('[data-alpha-pos="add-drink"]')
const orderLists = document.querySelector('[data-order-lists]')

addDrinkButton.addEventListener('click', function () {
  const drinkName = alphaPos.getCheckedValue('drink')
  const ice = alphaPos.getCheckedValue('ice')
  const sugar = alphaPos.getCheckedValue('sugar')

  if (!drinkName) {
    alert('Please choose at least one item.')
    return
  }

  const drink = new Drink(drinkName, sugar, ice)
  alphaPos.addDrink(drink)
})

orderLists.addEventListener('click', function (event) {
  const isDeleteButton = event.target.matches('[data-alpha-pos="delete-drink"]')
  const isCheckoutButton = event.target.matches('[data-alpha-pos="checkout"]')

  if (isDeleteButton) {
    alphaPos.deleteDrink(event.target.parentElement.parentElement.parentElement)

    if (orderLists.querySelectorAll('.card').length === 0) {  
      // 如果清單都沒飲料，刪除checkout按鈕    
      const checkoutWrapper = orderLists.querySelector('[data-alpha-pos="checkout"]')?.parentElement
      if (checkoutWrapper) checkoutWrapper.remove()
    }
  }  

  if (isCheckoutButton) {
    // 1. calculate total amount
    alert(`Total amount of drinks：$${alphaPos.checkout()}`)
    // 2. reset the order list
    alphaPos.clearOrder(orderLists)
    event.target.parentElement.remove() // 清除結帳按鈕
  }
})

// Constructor function for Alpha Pos System
function AlphaPos () { }

AlphaPos.prototype.getCheckedValue = function (inputName) {
  let selectedOption = ''
  document.querySelectorAll(`[name=${inputName}]`).forEach(function (item) {
    if (item.checked) {
      selectedOption = item.value
    }
  })
  return selectedOption
}

AlphaPos.prototype.addDrink = function (drink) {
  let orderListsCard = `
    <div class="card mb-3">
    <div class="card-body pt-3 pr-3">
      <div class="text-right">
        <span data-alpha-pos="delete-drink">×</span>
      </div>
      <h6 class="card-title mb-1">${drink.name}</h6>
      <div class="card-text">${drink.ice}</div>
      <div class="card-text">${drink.sugar}</div>
    </div>
    <div class="card-footer text-right py-2">
      <div class="card-text text-muted">$ <span data-drink-price>${drink.price()}</span></div>
    </div>
  </div>
  `
  orderLists.insertAdjacentHTML('afterbegin', orderListsCard)

  if (!orderLists.querySelector('[data-alpha-pos="checkout"]')) {
    orderLists.insertAdjacentHTML('beforeend', `
      <div class="text-right">
          <button class="btn btn-light" style="min-width:120px;" data-alpha-pos="checkout">Checkout</button>
      </div>
    `)
  }
}

AlphaPos.prototype.deleteDrink = function (target) {
  target.remove()
}

AlphaPos.prototype.checkout = function () {
  let totalAmount = 0
  document.querySelectorAll('[data-drink-price]').forEach(function(drink) {
    console.log(drink)
    console.log(drink.textContent)
    totalAmount += Number(drink.textContent)
  })
  return totalAmount
}

AlphaPos.prototype.clearOrder = function (target) {
  target.querySelectorAll('.card').forEach(function(card) {
    card.remove()
  })
}

function Drink (name, sugar, ice) {
  this.name = name
  this.sugar = sugar
  this.ice = ice
}

Drink.prototype.price = function () {
  switch (this.name) {
    case 'Black Tea':
    case 'Oolong Tea':
    case 'Baozong Tea':
    case 'Green Tea':
      return 30
    case 'Bubble Milk Tea':
    case 'Lemon Green Tea':
      return 50
    case 'Black Tea Latte':
    case 'Matcha Latte':
      return 55
    default:
      alert('No this drink')
  }
}
