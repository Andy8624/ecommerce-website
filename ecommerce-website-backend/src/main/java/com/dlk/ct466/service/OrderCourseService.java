package com.dlk.ct466.service;

import com.dlk.ct466.domain.entity.Course;
import com.dlk.ct466.domain.entity.Order;
import com.dlk.ct466.domain.entity.OrderCourse;
import com.dlk.ct466.domain.mapper.OrderCourseMapper;
import com.dlk.ct466.domain.response.ResPaginationDTO;
import com.dlk.ct466.repository.OrderCourseRepository;
import com.dlk.ct466.util.PaginationUtil;
import com.dlk.ct466.util.error.IdInvalidException;
import com.turkraft.springfilter.converter.FilterSpecification;
import com.turkraft.springfilter.converter.FilterSpecificationConverter;
import com.turkraft.springfilter.parser.FilterParser;
import com.turkraft.springfilter.parser.node.FilterNode;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OrderCourseService {
    private final OrderCourseRepository orderCourseRepository;
    private final OrderService orderService;
    private final CourseService courseService;
    private final FilterParser filterParser;
    private final FilterSpecificationConverter filterSpecificationConverter;

    public OrderCourse getOrderCourseById(String id) throws IdInvalidException {
        return orderCourseRepository.findById(id).orElseThrow(
                () -> new IdInvalidException("Order course id: " + id + " not found")
        );
    }

    public OrderCourse createOrderCourse(OrderCourse request) throws IdInvalidException {
        Order order = orderService.getOrderById(request.getOrder().getOrderId());
        Course course = courseService.getCourseById(request.getCourse().getCourseId());

        Optional<OrderCourse> existOrderCourse =
                orderCourseRepository.findByOrderOrderIdAndCourseCourseId(order.getOrderId(), course.getCourseId());

        OrderCourse orderCourse;

        orderCourse = existOrderCourse.orElseGet(() -> OrderCourse.builder()
                .order(order)
                .course(course)
                .quantity(1)
                .build());

        return orderCourseRepository.save(orderCourse);
    }

    public OrderCourse updateOrderCourse(OrderCourse request, String id) throws IdInvalidException {
        OrderCourse dbOrderCourse = getOrderCourseById(id);

        Order newOrder = orderService.getOrderById(request.getOrder().getOrderId());
        dbOrderCourse.setOrder(newOrder);

        Course newCourse = courseService.getCourseById(request.getCourse().getCourseId());
        dbOrderCourse.setCourse(newCourse);

        return orderCourseRepository.save(dbOrderCourse);
    }

    public ResPaginationDTO getAllOrderCourses(Pageable pageable) {
        Page<OrderCourse> pageOrderCourse = orderCourseRepository.findAll(pageable);
        return PaginationUtil.getPaginatedResult(pageOrderCourse, pageable);
    }

    public ResPaginationDTO getOrderCoursesByOrderId(Pageable pageable, String orderId) throws IdInvalidException {
        orderService.getOrderById(orderId);

        FilterNode node = filterParser.parse("order.id='" + orderId + "'");
        FilterSpecification<OrderCourse> spec = filterSpecificationConverter.convert(node);

        Page<OrderCourse> pageOrderCourse = orderCourseRepository.findAll(spec, pageable);
        return PaginationUtil.getPaginatedResult(pageOrderCourse, pageable);
    }

    public ResPaginationDTO getOrderCoursesByCourseId(Pageable pageable, String courseId) throws IdInvalidException {
        courseService.getCourseById(courseId);

        FilterNode node = filterParser.parse("course.id='" + courseId + "'");
        FilterSpecification<OrderCourse> spec = filterSpecificationConverter.convert(node);

        Page<OrderCourse> pageOrderCourse = orderCourseRepository.findAll(spec, pageable);
        return PaginationUtil.getPaginatedResult(pageOrderCourse, pageable);
    }

    public void deleteOrderCourse(String id) throws IdInvalidException {
        OrderCourse orderCourse = getOrderCourseById(id);
        orderCourseRepository.delete(orderCourse);
    }

    public ResPaginationDTO getOrderCoursesByUserId(Pageable pageable, String userId) {
        FilterNode node = filterParser.parse("order.user.id='" + userId + "'");
        FilterSpecification<OrderCourse> spec = filterSpecificationConverter.convert(node);

        Page<OrderCourse> pageOrderCourse = orderCourseRepository.findAll(spec, pageable);
        return PaginationUtil.getPaginatedResult(pageOrderCourse, pageable, OrderCourseMapper::toDto);
    }
}
