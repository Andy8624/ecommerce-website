import CartComponent from "../features/cart/components/CartComponent"

const Cart = ({ cartItems, setCartItems }) => {
    return (
        <div>
            <CartComponent cartItems={cartItems} setCartItems={setCartItems} />
        </div>
    )
}

export default Cart