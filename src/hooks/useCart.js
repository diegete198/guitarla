import { useState, useEffect, useMemo } from 'react'
import { db } from '../data/db'

export const useCart = () => {

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

        //State Derivado
        const isEmpty = useMemo(() => cart.length === 0, [cart])
        const cartTotal = useMemo(() => cart.reduce((total, item) => total + (item.quantity * item.price), 0), [cart])
    

    return {
        data,
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decrementQuantity,
        cleanCart,
        isEmpty,
        cartTotal
    }

}