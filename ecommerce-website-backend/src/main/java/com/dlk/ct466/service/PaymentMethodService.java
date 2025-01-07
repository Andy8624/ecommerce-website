package com.dlk.ct466.service;

import com.dlk.ct466.domain.entity.PaymentMethod;
import com.dlk.ct466.domain.entity.ToolType;
import com.dlk.ct466.domain.response.ResPaginationDTO;
import com.dlk.ct466.repository.PaymentMethodRepository;
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
public class PaymentMethodService {
    private final PaymentMethodRepository paymentMethodRepository;

    private final FilterParser filterParser;
    private final FilterSpecificationConverter filterSpecificationConverter;

    public PaymentMethod getPaymentMethodById(long id) throws IdInvalidException {
        return paymentMethodRepository.findByIdIfNotDeleted(id).orElseThrow(
                () -> new IdInvalidException("Payment method with id: " + id + " not exist")
        );
    }

    public PaymentMethod getPaymentMethodByIdAdmin(long id) throws IdInvalidException {
        return paymentMethodRepository.findById(id).orElseThrow(
                () -> new IdInvalidException("Payment method with id: " + id + " not exist")
        );
    }

    public PaymentMethod createPaymentMethod(PaymentMethod paymentMethod) {
        Optional<PaymentMethod> dbPaymentMethod = paymentMethodRepository.findByName(paymentMethod.getName());
        if (dbPaymentMethod.isPresent()) {
            throw new IllegalArgumentException("Payment method with name: '" + paymentMethod.getName() + "' already " +
                    "exist");
        }
        return paymentMethodRepository.save(paymentMethod);
    }

    public PaymentMethod updatePaymentMethod(PaymentMethod paymentMethod, long id) throws IdInvalidException {
        PaymentMethod dbPaymentMethod = getPaymentMethodById(id).toBuilder()
                .name(paymentMethod.getName())
                .isActive(paymentMethod.isActive())
                .build();
        return paymentMethodRepository.save(dbPaymentMethod);
    }

    public Void deletePaymentMethod(long id) throws IdInvalidException {
        PaymentMethod dbPaymentMethod = getPaymentMethodById(id);
        dbPaymentMethod.setDeleted(true);
        paymentMethodRepository.save(dbPaymentMethod);
        return null;
    }

    public Void restorePaymentMethod(long id) throws IdInvalidException {
        PaymentMethod dbPaymentMethod = getPaymentMethodById(id);
        dbPaymentMethod.setDeleted(false);
        paymentMethodRepository.save(dbPaymentMethod);
        return null;
    }

    public ResPaginationDTO getAllPaymentMethod(Pageable pageable) {
        FilterNode node = filterParser.parse("deleted=false");
        FilterSpecification<PaymentMethod> spec = filterSpecificationConverter.convert(node);

        Page<PaymentMethod> pagePaymentMethod = paymentMethodRepository.findAll(spec, pageable);
        return PaginationUtil.getPaginatedResult(pagePaymentMethod, pageable);
    }

    public ResPaginationDTO getAllPaymentMethodAdmin(Pageable pageable) {
        Page<PaymentMethod> pagePaymentMethod = paymentMethodRepository.findAll(pageable);
        return PaginationUtil.getPaginatedResult(pagePaymentMethod, pageable);
    }
}
