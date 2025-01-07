export const ALL_PERMISSIONS = {
    PERMISSIONS: {
        GET_PAGINATE: { method: "GET", apiPath: '/api/v1/permissions', module: "PERMISSIONS" },
        CREATE: { method: "POST", apiPath: '/api/v1/permissions', module: "PERMISSIONS" },
        UPDATE: { method: "PUT", apiPath: '/api/v1/permissions/{id}', module: "PERMISSIONS" },
        DELETE: { method: "DELETE", apiPath: '/api/v1/permissions/{id}', module: "PERMISSIONS" },
        RESTORE: { method: "PATCH", apiPath: '/api/v1/permissions/{id}', module: "PERMISSIONS" },
    },
    TOOLS: {
        CREATE: { method: "POST", apiPath: '/api/v1/tools', module: "TOOLS" },
        GET_BY_ID: { method: "GET", apiPath: '/api/v1/tools/{id}', module: "TOOLS" }, // cho guest user
        GET_PAGINATE: { method: "GET", apiPath: '/api/v1/tools', module: "TOOLS" }, // cho guest user
        GET_OWNER: { method: "GET", apiPath: '/api/v1/tools/{id}', module: "TOOLS" }, // cho guest user
        GET_BY_TYPE_ID: { method: "GET", apiPath: '/api/v1/tools/type-tools/{id}', module: "TOOLS" }, // cho guest user
        UPDATE: { method: "PUT", apiPath: '/api/v1/tools/{id}', module: "TOOLS" },
        DELETE: { method: "DELETE", apiPath: '/api/v1/tools/{id}', module: "TOOLS" },
        RESTORE: { method: "PATCH", apiPath: '/api/v1/tools/{id}', module: "TOOLS" },
    },
    TOOL_TYPES: {
        CREATE: { method: "POST", apiPath: '/api/v1/tooltypes', module: "TOOL_TYPES" },
        GET_BY_ID: { method: "GET", apiPath: '/api/v1/tooltypes/{id}', module: "TOOL_TYPES" },
        GET_PAGINATE: { method: "GET", apiPath: '/api/v1/tooltypes', module: "TOOL_TYPES" },
        UPDATE: { method: "PUT", apiPath: '/api/v1/tooltypes/{id}', module: "TOOL_TYPES" },
        DELETE: { method: "DELETE", apiPath: '/api/v1/tooltypes/{id}', module: "TOOL_TYPES" },
        RESTORE: { method: "PATCH", apiPath: '/api/v1/tooltypes/{id}', module: "TOOL_TYPES" },
    },
    ROLES: {
        CREATE: { method: "POST", apiPath: '/api/v1/roles', module: "ROLES" },
        GET_BY_ID: { method: "GET", apiPath: '/api/v1/roles/{id}', module: "ROLES" },
        GET_PAGINATE: { method: "GET", apiPath: '/api/v1/roles', module: "ROLES" },
        UPDATE: { method: "PUT", apiPath: '/api/v1/roles/{id}', module: "ROLES" },
        DELETE: { method: "DELETE", apiPath: '/api/v1/roles/{id}', module: "ROLES" },
        RESTORE: { method: "PATCH", apiPath: '/api/v1/roles/{id}', module: "ROLES" },
    },
    ROLE_PERMISSIONS: {
        CREATE: { method: "POST", apiPath: '/api/v1/roles-permissions', module: "ROLE_PERMISSIONS" },
        GET_BY_ID: { method: "GET", apiPath: '/api/v1/roles-permissions/{id}', module: "ROLE_PERMISSIONS" },
        GET_PAGINATE: { method: "GET", apiPath: '/api/v1/roles-permissions', module: "ROLE_PERMISSIONS" },
        GET_BY_ROLE_ID: { method: "GET", apiPath: '/api/v1/roles-permissions/role-owner/{id}', module: "ROLE_PERMISSIONS" },
        UPDATE: { method: "PUT", apiPath: '/api/v1/roles-permissions/{id}', module: "ROLE_PERMISSIONS" },
        DELETE: { method: "DELETE", apiPath: '/api/v1/roles-permissions/{id}', module: "ROLE_PERMISSIONS" },
        RESTORE: { method: "PATCH", apiPath: '/api/v1/roles-permissions/{id}', module: "ROLE_PERMISSIONS" },
    },
    USERS: {
        CREATE: { method: "POST", apiPath: '/api/v1/users', module: "USERS" },
        GET_BY_ID: { method: "GET", apiPath: '/api/v1/users/{id}', module: "USERS" },
        GET_PAGINATE: { method: "GET", apiPath: '/api/v1/users', module: "USERS" },
        UPDATE: { method: "PUT", apiPath: '/api/v1/users/{id}', module: "USERS" },
        DELETE: { method: "DELETE", apiPath: '/api/v1/users/{id}', module: "USERS" },
        RESTORE: { method: "PATCH", apiPath: '/api/v1/users/{id}', module: "USERS" },
    },
    PAYMENT_METHODS: {
        CREATE: { method: "POST", apiPath: '/api/v1/paymentmethods', module: "PAYMENT_METHODS" },
        GET_BY_ID: { method: "GET", apiPath: '/api/v1/paymentmethods/{id}', module: "PAYMENT_METHODS" },
        GET_PAGINATE: { method: "GET", apiPath: '/api/v1/paymentmethods', module: "PAYMENT_METHODS" },
        UPDATE: { method: "PUT", apiPath: '/api/v1/paymentmethods/{id}', module: "PAYMENT_METHODS" },
        DELETE: { method: "DELETE", apiPath: '/api/v1/paymentmethods/{id}', module: "PAYMENT_METHODS" },
        RESTORE: { method: "PATCH", apiPath: '/api/v1/paymentmethods/{id}', module: "PAYMENT_METHODS" },
    },
    ORDERS: {
        CREATE: { method: "POST", apiPath: '/api/v1/orders', module: "ORDERS" },
        GET_BY_ID: { method: "GET", apiPath: '/api/v1/orders/{id}', module: "ORDERS" },
        GET_PAGINATE: { method: "GET", apiPath: '/api/v1/orders', module: "ORDERS" },
        GET_BY_USER_ID: { method: "GET", apiPath: '/api/v1/orders/user-order/{userId}', module: "ORDERS" },
        GET_BY_ADDRESS_ID: { method: "GET", apiPath: '/api/v1/orders/address-order/{addressId}', module: "ORDERS" },
        GET_BY_PAYMENT_METHOD_ID: { method: "GET", apiPath: '/api/v1/orders/payment-method-order/{paymentMethodId}', module: "ORDERS" },
        GET_BY_STATUS: { method: "POST", apiPath: '/api/v1/orders/status-order', module: "ORDERS" },
        UPDATE: { method: "PUT", apiPath: '/api/v1/orders/{id}', module: "ORDERS" },
    },
    ADDRESSES: {
        CREATE: { method: "POST", apiPath: '/api/v1/addresses', module: "ADDRESSES" },
        GET_BY_ID: { method: "GET", apiPath: '/api/v1/addresses/{id}', module: "ADDRESSES" },
        GET_PAGINATE: { method: "GET", apiPath: '/api/v1/addresses', module: "ADDRESSES" },
        GET_BY_USER_ID: { method: "GET", apiPath: '/api/v1/addresses/user-address/{userId}', module: "ADDRESSES" },
        UPDATE: { method: "PUT", apiPath: '/api/v1/addresses/{id}', module: "ADDRESSES" },
        DELETE: { method: "DELETE", apiPath: '/api/v1/addresses/{id}', module: "ADDRESSES" },
        RESTORE: { method: "PATCH", apiPath: '/api/v1/addresses/{id}', module: "ADDRESSES" },
    },
    ORDER_TOOL: {
        CREATE: { method: "POST", apiPath: '/api/v1/ordertools', module: "ORDER_TOOL" },
        GET_BY_ID: { method: "GET", apiPath: '/api/v1/ordertools/{id}', module: "ORDER_TOOL" },
        GET_PAGINATE: { method: "GET", apiPath: '/api/v1/ordertools', module: "ORDER_TOOL" },
        GET_BY_ORDER_ID: { method: "GET", apiPath: '/api/v1/ordertools/order/{orderId}', module: "ORDER_TOOL" },
        UPDATE: { method: "PUT", apiPath: '/api/v1/ordertools/{orderToolId}', module: "ORDER_TOOL" },
    },
    AUTH: { // cho guest user
        LOGIN: { method: "POST", apiPath: '/api/v1/auth/login', module: "AUTH" },
        LOGOUT: { method: "POST", apiPath: '/api/v1/auth/logout', module: "AUTH" },
        REGISTER: { method: "POST", apiPath: '/api/v1/auth/register', module: "AUTH" },
        ACCOUNT: { method: "GET", apiPath: '/api/v1/auth/account', module: "AUTH" },
        REFRESH: { method: "GET", apiPath: '/api/v1/auth/refresh', module: "AUTH" },
    },
    FILES: {
        DOWNLOAD: { method: "POST", apiPath: '/api/v1/files', module: "FILES" },
        UPLOAD: { method: "GET", apiPath: '/api/v1/files', module: "FILES" },
    }
}
