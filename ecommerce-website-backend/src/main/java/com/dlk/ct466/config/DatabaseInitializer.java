package com.dlk.ct466.config;

import com.dlk.ct466.controller.CourseController;
import com.dlk.ct466.domain.entity.*;
import com.dlk.ct466.repository.*;
import com.dlk.ct466.service.UserService;
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
    private final CourseRepository courseRepository;
    private final CourseController courseController;
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
        long countCourse = courseRepository.count();
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
                    permissionRepository.findByName("Update user role")

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
                    permissionRepository.findByName("Update user role")
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
            User adminUser = new User();
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
            User sellerUser1 = new User();
            sellerUser1.setEmail("seller1@gmail.com");
            sellerUser1.setFullName("I'm seller 1");
            sellerUser1.setPassword("123456");
            sellerUser1.setImageUrl("default.png");


            // tạo user với role SELLER2
            User sellerUser2 = new User();
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
            User buyerUser1 = new User();
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
            User buyerUser2 = new User();
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
            ToolType type1 = ToolType.builder().name("Bút cánh diều").build();
            ToolType type2 = ToolType.builder().name("Giấy").build();
            ToolType type3 = ToolType.builder().name("Mực").build();

            toolTypes.add(type1);
            toolTypes.add(type2);
            toolTypes.add(type3);
            toolTypeRepository.saveAll(toolTypes);
        }

        if (toolRepository.count() == 0) {
            User seller1 = userRepository.findByEmail("seller1@gmail.com").orElse(null);
            User seller2 = userRepository.findByEmail("seller2@gmail.com").orElse(null);
            // Khởi tạo Tool
            List<Tool> tools = new ArrayList<>();

            tools.add(Tool.builder()
                    .name("Bút Jinhao TIANDAO 1935\n")
                    .description("Bút dành cho tín đồ thích bút to. \n")
                    .price(new BigDecimal("180000"))
                    .discountedPrice(new BigDecimal("169000"))
                    .stockQuantity(100)
                    .imageUrl("but1.png")
                    .toolType(toolTypeRepository.findById(1L).orElse(null))
                    .isActive(true)
                    .deleted(false)
                    .user(seller1)
                    .build());

            tools.add(Tool.builder()
                    .name("BÚT BI OHTO CELSUS CERAMIC 0.5MM CB-15C\n")
                    .description("Một lựa chọn hoàn hảo cho ai đang tìm bút bi ký.\n" +
                            "\n⭐  Xuất xứ : Nhật Bản\n" +
                            "\n" +
                            "⚡\uFE0F  Hãng sản xuất : OHTO\n" +
                            "\n" +
                            "OHTO là một hãng bút đã hơn 100 tuổi với thế mạnh là sản xuất bút bi nên những cây bút bi của OHTO gấy ấn tượng mạnh với người tiêu dùng.\n" +
                            "\n" +
                            "⭐  Bút bi dạng nước sử dụng gốm cho đầu bút bi. Bề mặt bi không trơn nhẵn mà có vô số các lỗ nhỏ, mực sẽ bám vào các lỗ này giúp nét viết ra liên tục và mượt mà.\n" +
                            "\n" +
                            " \n" +
                            "\n" +
                            "⭐  Thân bút bằng kim loại có độ bóng và tạo ra cảm giác sang trọng, \"đầm tay\" khi viết.")
                    .price(new BigDecimal("550000"))
                    .discountedPrice(new BigDecimal("0"))
                    .stockQuantity(50)
                    .imageUrl("but2.png")
                    .toolType(toolTypeRepository.findById(1L).orElse(null))
                    .isActive(true)
                    .deleted(false)
                    .user(seller1)
                    .build());

            tools.add(Tool.builder()
                    .name("Giấy hoa Xa Trục Thảo - Set Happy School - 2.5mm - 12 tờ A4 không lem\n")
                    .description("- Giấy A4 định lượng 100 có phụ gia chống thấm đảm bảo không lem và có độ bền cao trong môi trường ẩm.\n" +
                            "\n" +
                            "- Màu kem chụp ăn ảnh, cho ra màu trắng thuần.\n" +
                            "\n" +
                            "- Ô li 2.5mm tương tự vở học sinh.\n" +
                            "\n" +
                            "- In màu offset 1 mặt siêu rõ nét và lên ảnh rực rỡ, 12 tờ là 12 mẫu khác nhau, chủ đề thầy trò xinh xắn.\n" +
                            "\n" +
                            "- Đường kẻ màu xanh nhạt viết nổi chữ.\n" +
                            "\n" +
                            "- Để lẻ tờ, dễ viết, dễ chụp ảnh, dễ chọn lọc và đưa vào bộ sưu tập.\n" +
                            "\n" +
                            "- Mua 5 set tặng thêm 1 set.\n" +
                            "\n" +
                            "Sản phẩm do Xa Trục Thảo thiết kế và in ấn, phân phối bởi Cánh Diều.")
                    .price(new BigDecimal("20000"))
                    .discountedPrice(new BigDecimal("0"))
                    .stockQuantity(200)
                    .imageUrl("giay1.png")
                    .toolType(toolTypeRepository.findById(2L).orElse(null))
                    .isActive(true)
                    .deleted(false)
                    .user(seller1)
                    .build());

            tools.add(Tool.builder()
                    .name("Mực Pilot Iroshizuku 50ml - màu mới")
                    .description("Pilot ra mắt 3 màu mực bút máy Iroshizuku mới vào năm 2022. Những loại mực tuyệt đẹp này được lấy cảm hứng từ môi trường tươi đẹp của Nhật Bản. \n" +
                            "\n" +
                            "1. Hana-ikada (花筏) - Bè hoa anh đào Nhật Bản: lấy cảm hứng từ những bông hoa anh đào xinh đẹp, trôi bồng bềnh trên dòng sông đang chảy.\n" +
                            "\n" +
                            "2. Hotaru-bi (蛍火) - Ánh sáng đom đóm: lấy cảm hứng từ ánh sáng dịu nhẹ của những chú đom đóm mỏng manh. Màu này là một màu xanh lá cây tươi sáng với màu vàng ấm áp.\n" +
                            "\n" +
                            "3. Sui-gyoku (翠玉) - Ngọc lục bảo: lấy cảm hứng từ ánh sáng xanh lục đậm của một loại đá quý ngọc lục bảo vô cùng quý giá.")
                    .price(new BigDecimal("440000"))
                    .discountedPrice(new BigDecimal("419000"))
                    .stockQuantity(30)
                    .imageUrl("muc1.png")
                    .toolType(toolTypeRepository.findById(3L).orElse(null))
                    .isActive(true)
                    .deleted(false)
                    .user(seller1)
                    .build());

            tools.add(Tool.builder()
                    .name("Bút mài Cánh Diều 303 - thân nhám mới\n")
                    .description("Đây là cây bút máy ngòi mài với nét mảnh và êm. Nét mảnh của mẫu 303 mảnh hơn mẫu " +
                            "301 nhưng không mảnh bằng mẫu 302 (êm hơn mẫu 302). Thân bút vừa với cả bàn tay người lớn và học sinh. Bút phù hợp với người đã có kỹ thuật viết bút mài tốt.S")
                    .price(new BigDecimal("90000"))
                    .discountedPrice(new BigDecimal("0"))
                    .stockQuantity(25)
                    .imageUrl("but3.png")
                    .toolType(toolTypeRepository.findById(1L).orElse(null))
                    .isActive(true)
                    .deleted(false)
                    .user(seller1)
                    .build());

            tools.add(Tool.builder()
                    .name("Bút Cánh Diều 202 ngòi kim tinh\n")
                    .description("Bút Cánh Diều 202 có thiết kế nhỏ gọn phù hợp với học sinh tiểu học, với kiểu ngòi kim tinh kín giúp hạn chế tối đa lem bẩn mực do chạm vào ngòi. \n" +
                            "Bút có định vị tay cầm, phần định vị làm vân sọc ngang giúp cầm bút êm, không trơn.")
                    .price(new BigDecimal("25000"))
                    .discountedPrice(new BigDecimal("0"))
                    .stockQuantity(25)
                    .imageUrl("canhdieu1.png")
                    .toolType(toolTypeRepository.findById(1L).orElse(null))
                    .isActive(true)
                    .deleted(false)
                    .user(seller2)
                    .build());

            tools.add(Tool.builder()
                    .name("Bút Cánh Diều 107 ngòi kim tinh\n")
                    .description("- Bút có định vị tay cầm, phần định vị làm vân sọc ngang giúp cầm bút êm, không " +
                            "trơn.\n \n" +
                            "- Mực ra đều, vừa đủ nên nhanh khô.\n" +
                            "\n" +
                            "- Ngòi nét nhỏ phù hợp học sinh tiểu học viết hàng ngày.\n" +
                            "\n" +
                            "- Bút có sẵn Converter (piston) bơm mực đi kèm. Bút lắp ống mực chuẩn 2,6mm.\n" +
                            "\n" +
                            "- Thân bút bằng nhựa dẻo, bền, va đập không bị nứt vỡ. Có nhiều lựa chọn màu sắc rất đáng yêu.\n" +
                            "\n" +
                            "- Bút giá 35k, ngòi thay giá 5k (ngòi rất dễ thay). Bút dùng cùng loại ngòi với bút CD 202 và CD 106\n" +
                            "✅Bút có 2 kiểu ngòi:")
                    .price(new BigDecimal("30000"))
                    .discountedPrice(new BigDecimal("0"))
                    .stockQuantity(25)
                    .imageUrl("canhdieu2.png")
                    .toolType(toolTypeRepository.findById(1L).orElse(null))
                    .isActive(true)
                    .deleted(false)
                    .user(seller2)
                    .build());

            toolRepository.saveAll(tools);
        }

        if (countPaymentMethod == 0) {
            List<PaymentMethod> paymentMethods = new ArrayList<>();
            paymentMethods.add(PaymentMethod.builder().name("Thanh toán khi nhận hàng").isActive(true).build());
            paymentMethods.add(PaymentMethod.builder().name("Thẻ tín dụng/Ghi nợ").isActive(true).build());
            paymentMethods.add(PaymentMethod.builder().name("Thanh toán qua Paypal").isActive(true).build());
            paymentMethodRepository.saveAll(paymentMethods);
        }

        if (countCourse == 0) {
            List<Course> courses = new ArrayList<>();
            courses.add(Course.builder()
                    .courseUrl("https://www.youtube.com/playlist?list=PLAyNEaBn-10Tc0BMn1OiHbMID2VPMv-Y1")
                    .price(new BigDecimal("500000"))
                    .discountedPrice(new BigDecimal("0"))
                    .user(userRepository.findByEmail("seller1@gmail.com").orElse(null))
                    .build());

            courses.add(Course.builder()
                    .courseUrl("https://www.youtube.com/playlist?list=PLp1vfj-6olW8lapBHPGT5gxFO5_NKTKsW")
                    .price(new BigDecimal("1000000"))
                    .discountedPrice(new BigDecimal("899000"))
                    .user(userRepository.findByEmail("seller1@gmail.com").orElse(null))
                    .build());

            courses.add(Course.builder()
                    .courseUrl("https://www.youtube.com/playlist?list=PLp1vfj-6olW8XnVFezjNZ2viSGx2WY4_K")
                    .price(new BigDecimal("100000"))
                    .discountedPrice(new BigDecimal("0"))
                    .user(userRepository.findByEmail("seller2@gmail.com").orElse(null))
                    .build());

            courseRepository.saveAll(courses);
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


        if (countPermissions > 0 && countRoles > 0 && countUsers > 0 && countToolTypes > 0 && countTools > 0 && countPaymentMethod > 0 && countCourse > 0 && countAddress > 0) {
            System.out.println(">>> SKIP INIT DATABASE ~ ALREADY HAVE DATA...");
        } else
            System.out.println(">>> END INIT DATABASE");

    }
}
