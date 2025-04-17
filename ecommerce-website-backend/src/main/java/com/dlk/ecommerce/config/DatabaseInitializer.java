package com.dlk.ecommerce.config;

import com.dlk.ecommerce.domain.entity.*;
import com.dlk.ecommerce.domain.request.user.ReqCreateUser;
import com.dlk.ecommerce.repository.*;
import com.dlk.ecommerce.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DatabaseInitializer implements CommandLineRunner {
    private final PermissionRepository permissionRepository;
    private final RolePermissionRepository rolePermissionRepository;
    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ToolTypeRepository toolTypeRepository;
    private final ToolRepository toolRepository;
    private final UserService userService;
    private final PaymentMethodRepository paymentMethodRepository;
    private final AddressRepository addressRepository;


    @Override
    public void run(String... args) throws Exception {
        System.out.println(">>> START INIT DATABASE");
        long countPermissions = permissionRepository.count();
        long countRoles = roleRepository.count();
        long countUsers = userRepository.count();
        long countToolTypes = toolTypeRepository.count();
        long countTools = toolRepository.count();
        long countPaymentMethod = paymentMethodRepository.count();
        long countAddress = addressRepository.count();


        if (countPermissions == 0) {
            ArrayList<Permission> arr = new ArrayList<>();
            arr.add(new Permission("Create a tool", "/api/v1/tools", "POST", "TOOLS"));
            arr.add(new Permission("Get a tool by id", "/api/v1/tools/{id}", "GET", "TOOLS"));
            arr.add(new Permission("Get tools with pagination", "/api/v1/tools", "GET", "TOOLS"));
            arr.add(new Permission("Get tools owner by user id", "/api/v1/tools/{id}", "GET", "TOOLS"));
            arr.add(new Permission("Get tools by type id", "/api/v1/tools/type-tools/{id}", "GET", "TOOLS"));
            arr.add(new Permission("Update a tool", "/api/v1/tools/{id}", "PUT", "TOOLS"));
            arr.add(new Permission("Delete a tool", "/api/v1/tools/{id}", "DELETE", "TOOLS"));
            arr.add(new Permission("Restore a tool", "/api/v1/tools/{id}", "PATCH", "TOOLS"));

            arr.add(new Permission("Create a tooltypes", "/api/v1/tooltypes", "POST", "TOOL_TYPES"));
            arr.add(new Permission("Update a tooltypes", "/api/v1/tooltypes/{id}", "PUT", "TOOL_TYPES"));
            arr.add(new Permission("Delete a tooltypes", "/api/v1/tooltypes/{id}", "DELETE", "TOOL_TYPES"));
            arr.add(new Permission("Get a tooltypes by id", "/api/v1/tooltypes/{id}", "GET", "TOOL_TYPES"));
            arr.add(new Permission("Restore tooltypes by id", "/api/v1/tooltypes/{id}", "PATCH", "TOOL_TYPES"));
            arr.add(new Permission("Get tooltypes with pagination", "/api/v1/tooltypes", "GET", "TOOL_TYPES"));

            arr.add(new Permission("Create a permission", "/api/v1/permissions", "POST", "PERMISSIONS"));
            arr.add(new Permission("Get a permission by id", "/api/v1/permissions/{id}", "GET", "PERMISSIONS"));
            arr.add(new Permission("Get permissions with pagination", "/api/v1/permissions", "GET", "PERMISSIONS"));
            arr.add(new Permission("Update a permission", "/api/v1/permissions/{id}", "PUT", "PERMISSIONS"));
            arr.add(new Permission("Delete a permission", "/api/v1/permissions/{id}", "DELETE", "PERMISSIONS"));
            arr.add(new Permission("Restore a permission", "/api/v1/permissions/{id}", "PATCH", "PERMISSIONS"));

            arr.add(new Permission("Create a role", "/api/v1/roles", "POST", "ROLES"));
            arr.add(new Permission("Get a role by id", "/api/v1/roles/{id}", "GET", "ROLES"));
            arr.add(new Permission("Get roles with pagination", "/api/v1/roles", "GET", "ROLES"));
            arr.add(new Permission("Update a role", "/api/v1/roles/{id}", "PUT", "ROLES"));
            arr.add(new Permission("Delete a role", "/api/v1/roles/{id}", "DELETE", "ROLES"));
            arr.add(new Permission("Restore a role", "/api/v1/roles/{id}", "PATCH", "ROLES"));

            arr.add(new Permission("Create a role-permission", "/api/v1/roles-permissions", "POST", "ROLE_PERMISSIONS"));
            arr.add(new Permission("Get a roles-permissions by id", "/api/v1/roles-permissions/{id}", "GET", "ROLE_PERMISSIONS"));
            arr.add(new Permission("Get roles-permissions with pagination", "/api/v1/roles-permissions", "GET", "ROLE_PERMISSIONS"));
            arr.add(new Permission("Get roles-permissions by roleID", "/api/v1/roles-permissions/role-owner/{id}",
                    "GET",
                    "ROLE_PERMISSIONS"));
            arr.add(new Permission("Update a roles-permissions", "/api/v1/roles-permissions/{id}", "PUT", "ROLE_PERMISSIONS"));
            arr.add(new Permission("Delete a roles-permissions", "/api/v1/roles-permissions/{id}", "DELETE", "ROLE_PERMISSIONS"));
            arr.add(new Permission("Restore a roles-permissions", "/api/v1/roles-permissions/{id}", "PATCH", "ROLE_PERMISSIONS"));


            arr.add(new Permission("Create a user", "/api/v1/users", "POST", "USERS"));
            arr.add(new Permission("Update a user", "/api/v1/users/{id}", "PUT", "USERS"));
            arr.add(new Permission("Delete a user", "/api/v1/users/{id}", "DELETE", "USERS"));
            arr.add(new Permission("Restore a user", "/api/v1/users/{id}", "PATCH", "USERS"));
            arr.add(new Permission("Get a user by id", "/api/v1/users/{id}", "GET", "USERS"));
            arr.add(new Permission("Get users with pagination", "/api/v1/users", "GET", "USERS"));
            arr.add(new Permission("Update user role", "/api/v1/users/user-role", "POST", "USERS"));

            arr.add(new Permission("Create a payment method", "/api/v1/paymentmethods", "POST", "PAYMENT_METHODS"));
            arr.add(new Permission("Update a payment method", "/api/v1/paymentmethods/{id}", "PUT", "PAYMENT_METHODS"));
            arr.add(new Permission("Delete a payment method", "/api/v1/paymentmethods/{id}", "DELETE", "PAYMENT_METHODS"));
            arr.add(new Permission("Restore a payment method", "/api/v1/paymentmethods/{id}", "PATCH", "PAYMENT_METHODS"));
            arr.add(new Permission("Get a payment method by id", "/api/v1/paymentmethods/{id}", "GET", "PAYMENT_METHODS"));
            arr.add(new Permission("Get all payment methods with pagination", "/api/v1/paymentmethods", "GET", "PAYMENT_METHODS"));

            arr.add(new Permission("Create an order", "/api/v1/orders", "POST", "ORDERS"));
            arr.add(new Permission("Update an order", "/api/v1/orders/{id}", "PUT", "ORDERS"));
            arr.add(new Permission("Get an order by ID", "/api/v1/orders/{id}", "GET", "ORDERS"));
            arr.add(new Permission("Get all orders with pagination", "/api/v1/orders", "GET", "ORDERS"));
            arr.add(new Permission("Get orders by user ID", "/api/v1/orders/user-order/{userId}", "GET", "ORDERS"));
            arr.add(new Permission("Get orders by address ID", "/api/v1/orders/address-order/{addressId}", "GET", "ORDERS"));
            arr.add(new Permission("Get orders by payment method ID", "/api/v1/orders/payment-method-order/{paymentMethodId}", "GET", "ORDERS"));
            arr.add(new Permission("Get orders by status", "/api/v1/orders/status-order", "POST", "ORDERS"));

            arr.add(new Permission("Create an address", "/api/v1/addresses", "POST", "ADDRESSES"));
            arr.add(new Permission("Update an address", "/api/v1/addresses/{id}", "PUT", "ADDRESSES"));
            arr.add(new Permission("Delete an address", "/api/v1/addresses/{id}", "DELETE", "ADDRESSES"));
            arr.add(new Permission("Restore an address", "/api/v1/addresses/{id}", "PATCH", "ADDRESSES"));
            arr.add(new Permission("Get an address by ID", "/api/v1/addresses/{id}", "GET", "ADDRESSES"));
            arr.add(new Permission("Get all addresses with pagination", "/api/v1/addresses", "GET", "ADDRESSES"));
            arr.add(new Permission("Get addresses by user ID with pagination", "/api/v1/addresses/user-address/{id}",
                    "GET", "ADDRESSES"));

            arr.add(new Permission("Get order tool by ID", "/api/v1/ordertools/{id}", "GET", "ORDER_TOOL"));
            arr.add(new Permission("Create an order tool", "/api/v1/ordertools", "POST", "ORDER_TOOL"));
            arr.add(new Permission("Update an order tool", "/api/v1/ordertools/{orderToolId}", "PUT", "ORDER_TOOL"));
            arr.add(new Permission("Get all order tools", "/api/v1/ordertools", "GET", "ORDER_TOOL"));
            arr.add(new Permission("Get order tools by order ID", "/api/v1/ordertools/order/{orderId}", "GET", "ORDER_TOOL"));

            arr.add(new Permission("Login", "/api/v1/auth/login", "POST", "AUTH"));
            arr.add(new Permission("Logout", "/api/v1/auth/logout", "POST", "AUTH"));
            arr.add(new Permission("Register a new user", "/api/v1/auth/register", "POST", "AUTH"));
            arr.add(new Permission("Get account", "/api/v1/auth/account", "GET", "AUTH"));
            arr.add(new Permission("Refresh token", "/api/v1/auth/refresh", "GET", "AUTH"));

//            arr.add(new Permission("Get cart by id", "/api/v1/carts/{id}", "GET", "CART"));
//            arr.add(new Permission("Create a cart", "/api/v1/carts", "POST", "CART"));
//            arr.add(new Permission("Update a cart", "/api/v1/carts/{id}", "PUT", "CART"));
//            arr.add(new Permission("Get cart by user ID", "/api/v1/carts/user-cart/{id}", "GET", "CART"));
//
//            arr.add(new Permission("Get cart tool by ID", "/api/v1/cart-tools/{id}", "GET", "CART_TOOL"));
//            arr.add(new Permission("Create a cart tool", "/api/v1/cart-tools", "POST", "CART_TOOL"));
//            arr.add(new Permission("Update a cart tool", "/api/v1/cart-tools/{id}", "PUT", "CART_TOOL"));
//            arr.add(new Permission("Get all cart tools", "/api/v1/cart-tools", "GET", "CART_TOOL"));


            arr.add(new Permission("Download a file", "/api/v1/files", "POST", "FILES"));
            arr.add(new Permission("Upload a file", "/api/v1/files", "GET", "FILES"));

            this.permissionRepository.saveAll(arr);
        }

        if (countRoles == 0) {
            // tạo Role SUPER_ADMIN
            // lấy tất cả permissions
            List<Permission> allPermissions = permissionRepository.findAll();

            // tạo role mới SUPER_ADMIN id = 1
            Role adminRole = new Role();
            adminRole.setName("SUPER_ADMIN");
            adminRole.setDescription("Super Admin có tất cả permissions");
            Role savedRoleAdmin = roleRepository.save(adminRole);

            // gán tất cả permissions cho role SUPER_ADMIN
            List<RolePermission> rolePermissions = new ArrayList<>();
            for (Permission permission : allPermissions) {
                RolePermission rolePermission = new RolePermission();
                rolePermission.setRole(savedRoleAdmin);
                rolePermission.setPermission(permission);
                rolePermissions.add(rolePermission);
            }
            rolePermissionRepository.saveAll(rolePermissions);

            // tạo Role SELLER
            // lấy 1 số permission cho role SELLER
            List<Permission> sellerPermissions = List.of(
//                    permissionRepository.findByName("Create a tool"),
//                    permissionRepository.findByName("Update a tool"),
//                    permissionRepository.findByName("Delete a tool"),
//                    permissionRepository.findByName("Get tools with pagination"),
//                    permissionRepository.findByName("Get a tool by id"),
                    permissionRepository.findByName("Get orders by user ID"),
                    permissionRepository.findByName("Create an order"),
                    permissionRepository.findByName("Update an order"),
                    permissionRepository.findByName("Get all orders with pagination"),
                    permissionRepository.findByName("Get orders by status"),
//                    permissionRepository.findByName("Restore a tool"),
                    permissionRepository.findByName("Get a user by id"),
                    permissionRepository.findByName("Create a tooltypes"),
                    permissionRepository.findByName("Update a tooltypes"),
                    permissionRepository.findByName("Delete a tooltypes"),
                    permissionRepository.findByName("Get a tooltypes by id"),
                    permissionRepository.findByName("Restore tooltypes by id"),
                    permissionRepository.findByName("Get tooltypes with pagination"),
                    permissionRepository.findByName("Update user role"),
                    permissionRepository.findByName("Update a user")
            );
            Role sellerRole = new Role();
            sellerRole.setName("SELLER");
            sellerRole.setDescription("Seller có quyền quản lý sản phẩm");
            Role savedRoleSeller = roleRepository.save(sellerRole);

            List<RolePermission> rolePermissionsSeller = new ArrayList<>();
            for (Permission permission : sellerPermissions) {
                RolePermission rolePermission = new RolePermission();
                rolePermission.setRole(savedRoleSeller);
                rolePermission.setPermission(permission);
                rolePermissionsSeller.add(rolePermission);
            }
            rolePermissionRepository.saveAll(rolePermissionsSeller);

            // tạo Role BUYER
            // lấy 1 số permission cho role BUYER
            List<Permission> buyerPermissions = List.of(
                    permissionRepository.findByName("Get tools with pagination"),
                    permissionRepository.findByName("Get a tool by id"),
                    permissionRepository.findByName("Create an order"),
                    permissionRepository.findByName("Update an order"),
                    permissionRepository.findByName("Get all orders with pagination"),
                    permissionRepository.findByName("Get orders by user ID"),
                    permissionRepository.findByName("Get orders by status"),
                    permissionRepository.findByName("Get an order by ID"),
                    permissionRepository.findByName("Restore a tool"),
                    permissionRepository.findByName("Get a user by id"),
                    permissionRepository.findByName("Update user role"),
                    permissionRepository.findByName("Update a user")
            );
            Role buyerRole = new Role();
            buyerRole.setName("BUYER");
            buyerRole.setDescription("Buyer có quyền mua hàng");
            Role savedRoleBuyer = roleRepository.save(buyerRole);

            List<RolePermission> rolePermissionsBuyer = new ArrayList<>();
            for (Permission permission : buyerPermissions) {
                RolePermission rolePermission = new RolePermission();
                rolePermission.setRole(savedRoleBuyer);
                rolePermission.setPermission(permission);
                rolePermissionsBuyer.add(rolePermission);
            }
            rolePermissionRepository.saveAll(rolePermissionsBuyer);

        }

        if (countUsers == 0) {
            // tạo user với role SUPER_ADMIN
            ReqCreateUser adminUser = new ReqCreateUser();
            adminUser.setEmail("admin@gmail.com");
            adminUser.setFullName("I'm super admin");
            adminUser.setPassword("123456");
            adminUser.setImageUrl("default.png");

            Role adminRole = this.roleRepository.findByName("SUPER_ADMIN");
            if (adminRole != null) {
                adminUser.setRole(adminRole);
            }
            userService.createUser(adminUser);

            // tạo user với role SELLER1
            ReqCreateUser sellerUser1 = new ReqCreateUser();
            sellerUser1.setEmail("seller1@gmail.com");
            sellerUser1.setFullName("I'm seller 1");
            sellerUser1.setPassword("123456");
            sellerUser1.setImageUrl("default.png");


            // tạo user với role SELLER2
            ReqCreateUser sellerUser2 = new ReqCreateUser();
            sellerUser2.setEmail("seller2@gmail.com");
            sellerUser2.setFullName("I'm seller 2");
            sellerUser2.setPassword("123456");
            sellerUser2.setImageUrl("default.png");

            Role sellerRole = this.roleRepository.findByName("SELLER");
            if (sellerRole != null) {
                sellerUser1.setRole(sellerRole);
                sellerUser2.setRole(sellerRole);
            }
            userService.createUser(sellerUser1);
            userService.createUser(sellerUser2);

            // tạo user với role BUYER1
            ReqCreateUser buyerUser1 = new ReqCreateUser();
            buyerUser1.setEmail("buyer1@gmail.com");
            buyerUser1.setFullName("I'm buyer 1");
            buyerUser1.setPassword("123456");
            buyerUser1.setImageUrl("default.png");

            Role buyerRole1 = this.roleRepository.findByName("BUYER");
            if (buyerRole1 != null) {
                buyerUser1.setRole(buyerRole1);
            }
            userService.createUser(buyerUser1);

            // tạo user với role BUYER2
            ReqCreateUser buyerUser2 = new ReqCreateUser();
            buyerUser2.setEmail("buyer2@gmail.com");
            buyerUser2.setFullName("I'm buyer 2");
            buyerUser2.setPassword("123456");
            buyerUser2.setImageUrl("default.png");

            Role buyerRole2 = this.roleRepository.findByName("BUYER");
            if (buyerRole2 != null) {
                buyerUser2.setRole(buyerRole2);
            }
            userService.createUser(buyerUser2);
        }

        if (countToolTypes == 0) {
            // Khởi tạo ToolType
            List<ToolType> toolTypes = new ArrayList<>();

            // Bút
            ToolType type1 = ToolType.builder().name("Bút bi").build();
            ToolType type2 = ToolType.builder().name("Bút chì").build();
            ToolType type3 = ToolType.builder().name("Bút máy").build();
            ToolType type4 = ToolType.builder().name("Bút dạ quang").build();
            ToolType type5 = ToolType.builder().name("Bút xóa").build();
            ToolType type30 = ToolType.builder().name("Bút màu").build();

            toolTypes.add(type1);
            toolTypes.add(type2);
            toolTypes.add(type3);
            toolTypes.add(type4);
            toolTypes.add(type5);
            toolTypes.add(type30);

            // Giấy
            ToolType type6 = ToolType.builder().name("Giấy in").build();
            ToolType type7 = ToolType.builder().name("Giấy note").build();
            ToolType type8 = ToolType.builder().name("Giấy nhớ").build();
            ToolType type9 = ToolType.builder().name("Phong bì").build();
            ToolType type10 = ToolType.builder().name("Giấy decal").build();

            toolTypes.add(type6);
            toolTypes.add(type7);
            toolTypes.add(type8);
            toolTypes.add(type9);
            toolTypes.add(type10);

            // Dụng cụ học tập/văn phòng
            ToolType type11 = ToolType.builder().name("Thước kẻ").build();
            ToolType type12 = ToolType.builder().name("Compa").build();
            ToolType type13 = ToolType.builder().name("Kéo").build();
            ToolType type14 = ToolType.builder().name("Dao rọc giấy").build();
            ToolType type15 = ToolType.builder().name("Bấm kim").build();
            ToolType type16 = ToolType.builder().name("Ghim bấm").build();
            ToolType type17 = ToolType.builder().name("Kẹp giấy").build();
            ToolType type18 = ToolType.builder().name("Băng dính").build();
            ToolType type19 = ToolType.builder().name("Keo dán").build();
            ToolType type20 = ToolType.builder().name("Máy tính").build();

            toolTypes.add(type11);
            toolTypes.add(type12);
            toolTypes.add(type13);
            toolTypes.add(type14);
            toolTypes.add(type15);
            toolTypes.add(type16);
            toolTypes.add(type17);
            toolTypes.add(type18);
            toolTypes.add(type19);
            toolTypes.add(type20);

            // File/Bìa đựng
            ToolType type21 = ToolType.builder().name("File hồ sơ").build();
            ToolType type22 = ToolType.builder().name("Bìa còng").build();
            ToolType type23 = ToolType.builder().name("Bìa lá").build();
            ToolType type24 = ToolType.builder().name("Túi đựng tài liệu").build();

            toolTypes.add(type21);
            toolTypes.add(type22);
            toolTypes.add(type23);
            toolTypes.add(type24);

            // Các loại khác
            ToolType type25 = ToolType.builder().name("Sổ tay").build();
            ToolType type26 = ToolType.builder().name("Lịch để bàn").build();
            ToolType type27 = ToolType.builder().name("Bảng trắng").build();
            ToolType type28 = ToolType.builder().name("Phấn").build();
            ToolType type29 = ToolType.builder().name("Khác").build();

            toolTypes.add(type25);
            toolTypes.add(type26);
            toolTypes.add(type27);
            toolTypes.add(type28);
            toolTypes.add(type29);

            toolTypeRepository.saveAll(toolTypes);
        }

        if (countPaymentMethod == 0) {
            List<PaymentMethod> paymentMethods = new ArrayList<>();
            paymentMethods.add(PaymentMethod.builder().name("Thanh toán khi nhận hàng").isActive(true).build());
            paymentMethods.add(PaymentMethod.builder().name("Thẻ tín dụng/Ghi nợ").isActive(true).build());
            paymentMethods.add(PaymentMethod.builder().name("Thanh toán qua Paypal").isActive(true).build());
            paymentMethodRepository.saveAll(paymentMethods);
        }

        if (countAddress == 0) {
            List<Address> addresses = new ArrayList<>();
            addresses.add(Address.builder()
                    .city("Cần Thơ")
                    .district("Bình Thủy")
                    .ward("Bình Thủy")
                    .street("Nhà của admin")
                    .user(userRepository.findByEmail("admin@gmail.com").orElse(null))
                    .build());

            addresses.add(Address.builder()
                    .city("Cần Thơ")
                    .district("Bình Thủy")
                    .ward("Bình Thủy")
                    .street("Nhà của buyer 1")
                    .user(userRepository.findByEmail("buyer1@gmail.com").orElse(null))
                    .build());

            addresses.add(Address.builder()
                    .city("Cần Thơ")
                    .district("Bình Thủy")
                    .ward("Bình Thủy")
                    .street("Nhà của buyer 2")
                    .user(userRepository.findByEmail("buyer2@gmail.com").orElse(null))
                    .build());

            addresses.add(Address.builder()
                    .city("Cần Thơ")
                    .district("Bình Thủy")
                    .ward("Bình Thủy")
                    .street("Nhà của seller 1")
                    .user(userRepository.findByEmail("seller1@gmail.com").orElse(null))
                    .build());

            addresses.add(Address.builder()
                    .city("Cần Thơ")
                    .district("Bình Thủy")
                    .ward("Bình Thủy")
                    .street("Nhà của seller 2")
                    .user(userRepository.findByEmail("seller2@gmail.com").orElse(null))
                    .build());


            addressRepository.saveAll(addresses);
        }


        if (countPermissions > 0 && countRoles > 0 && countUsers > 0 && countToolTypes > 0 && countTools > 0 && countPaymentMethod > 0 && countAddress > 0) {
            System.out.println(">>> SKIP INIT DATABASE ~ ALREADY HAVE DATA...");
        } else
            System.out.println(">>> END INIT DATABASE");

    }
}
