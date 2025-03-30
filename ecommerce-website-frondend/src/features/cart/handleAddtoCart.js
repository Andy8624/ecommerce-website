import { toast } from "react-toastify";
import { getCartTool } from "../../services/CartToolService";

export const handleAddToCart = async ({
    tool,
    permissions,
    carts,
    checkExist,
    createCartItem,
    updateCartItem,
    cartItems,
    setCartItems,
    cartQuantity,
    setCartQuantity,
    addQuantity,
    variantDetailId1,
    variantDetailId2
}) => {

    if (permissions.length === 0) {
        throw new Error('Permission required');
    }

    const newCartItem = {
        tool: { toolId: tool.toolId },
        cart: { cartId: carts?.cartId },
        variantDetailId1,
        variantDetailId2,
        quantity: addQuantity
    };
    // console.log(newCartItem);

    const cartToolId = await checkExist(newCartItem);
    if (cartToolId === 0) {
        await createCartItem(newCartItem);
        setCartQuantity(cartQuantity + 1);
    } else {
        const cartTools = await getCartTool(cartToolId);
        // console.log(cartTools);
        const newQuantity = cartTools.quantity += addQuantity;
        setCartItems(cartItems?.map(item =>
            item.id === cartToolId ? { ...item, quantity: newQuantity } : item
        ));

        await updateCartItem({
            data: { quantity: newQuantity },
            cartToolId: cartToolId
        }, {
            onSuccess: () => toast.success("Thêm vào giỏ hàng thành công"),
            onError: (error) => toast.error(error.message || "Thêm vào giỏ hàng thất bại")
        });
    }
};
