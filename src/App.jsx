import { useState, useEffect } from 'react'
import Guitar from "./components/Guitar"
import Header from "./components/Header"
import { db } from './data/db'



function App() {


   const initialCart = () => {
     const localStorageCart = localStorage.getItem('cart')
     return localStorageCart ? JSON.parse(localStorageCart) : []
   }

  const [data, setData] = useState(db)
  const [cart, setCart] = useState(initialCart)

  const maxItems = 5
  const minItems = 1

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  function addToCart(item) {


    const itemExist = cart.findIndex(guitar => guitar.id === item.id)
    if (itemExist >= 0) { //Existe en el carrito
      if (cart[itemExist].quantity >= maxItems) return
      const updateCart = [...cart]
      updateCart[itemExist].quantity++
      setCart(updateCart)
    } else {
      item.quantity = 1
      setCart(prevCart => [...prevCart, item])
    }
  }

  //Eliminar desde el carrito de compras
  function removeFromCart(id) {
    setCart(prevCart => prevCart.filter(guitar => guitar.id !== id))
  }

  function increaseQuantity(id) {
    const updatedCart = cart.map(item => {
      if (item.id === id && item.quantity < maxItems) {
        return {
          ...item,
          quantity: item.quantity + 1
        }
      }
      return item
    })
    setCart(updatedCart)
  }

  function decrementQuantity(id) {
    const downgrade = cart.map(item => {
      if (item.id == id && item.quantity > minItems) {
        return {
          ...item,
          quantity: item.quantity - 1
        }
      }
      return item
    })
    setCart(downgrade)
  }

  function cleanCart() {
    setCart([])
  }


  return (
    <>
      <Header
        cart={cart}
        removeFromCart={removeFromCart}
        increaseQuantity={increaseQuantity}
        decrementQuantity={decrementQuantity}
        cleanCart={cleanCart}
      />


      <main className="container-xl mt-5">
        <h2 className="text-center">Nuestra Colección</h2>

        <div className="row mt-5">
          {data.map((guitar) => (
            <Guitar
              key={guitar.id}
              guitar={guitar}
              setCart={setCart}
              addToCart={addToCart}
            />
          )
          )}


        </div>
      </main>

      <footer className="bg-dark mt-5 py-5">
        <div className="container-xl">
          <p className="text-white text-center fs-4 mt-4 m-md-0">GuitarLA - Todos los derechos Reservados</p>
        </div>
      </footer>
    </>
  )
}

export default App
