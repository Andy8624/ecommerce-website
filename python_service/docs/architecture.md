# Luồng hoạt động hệ thống
Giai đoạn 1: Hiển thị sản phẩm theo xu hướng (trend) khi chưa có dữ liệu thao tác

Giai đoạn 2: Dần dần chuyển sang UBCF khi có dữ liệu thao tác

Giai đoạn 3: Lấy DS SP tương tự từ DS SP mà người dùng đã tương tác
    - Lấy từ 5sp mà người dùng đã tương tác gần nhất (Từ mỗi SP đó sẽ dùng CBF để tìm ra 3sp tương tự -> tối đa 15sp)
    - Không bao gồm SP gốc mà người dùng đã tương tác

Giai đoạn 4: Chuẩn hóa Score của từng thuật toán UBCF và CBF và kết hợp theo trọng số 
    - UBCF đã dùng Min-Max Scaling đẻ chuẩn hóa về khoảng 0-1

Giai đoạn 5: Trả về DS SP giảm dân theo trọng số

# Xử lí bên trong thuật toán
    UBCF
        - Lấy dữ liệu 
            + Dữ liệu tương tác (view, add_cart, remove_cart, share, ... ) (Gán trọng số cố định cho từng loại tương tác)
            + Dữ liệu đánh giá (rating, comment)
        - Từ dữ liệu tương tác
            + Xây dựng ma trận tương tác giữa người dùng và sản phẩm (User-Item Matrix)
        - Từ dữ liệu đánh giá 
            + Chuẩn hóa dữ liệu đánh giá về khoảng [-1, 1] và cộng trọng số với dữ liệu tương tác 
            + Chuyển ma trận đầy đủ sang ma trận thưa để tiết kiệm dữ liệu khi thực hiện tính toán KNN
            + Chuẩn hóa dữ liệu ma trận đầy đủ bằng phương pháp Min-Max-Scaling, giá trị sẽ trong khoảng [0, 1]
        - Xử lí UBCF
            + Nếu người dùng không có dữ liệu tương tác -> trả về DS SP Trend
            + Xử dụng thuật toán KNN tìm 5 người tương tự nhất với user hiện tại
            + Lấy ra các SP mà người dùng tương tự đã tương tác
            + Duyệt qua các các SP người dùng tương tự đã tương tác -> Nếu người dùng hiện tại cũng đã tương tác -> Giảm 80% điểm
            + Trả về DS SP theo điểm giảm dần
    CBF 
        - Lấy dữ liệu tất cả SP (Gồm các thuộc tính: name, description, type, brand, price)
        - Gộp tất cả thông tin của 1 SP lại thành 1 chuỗi
        - Sử dụng TF-IDF vectorizer để chuyển chuỗi thành vector và tính ma trận tương đồng
        - Lấy dữ liệu 5 SP mà người dùng tương tác gần nhất (Dữ liệu thời gian thật)
        - Mỗi SP đó sẽ gọi thuật toán CBF để lấy ra 3 SP liên quan