package com.dlk.ct466.service;

import com.dlk.ct466.domain.entity.Tool;
import com.dlk.ct466.domain.entity.ToolType;
import com.dlk.ct466.domain.response.ResPaginationDTO;
import com.dlk.ct466.repository.ToolRepository;
import com.dlk.ct466.repository.ToolTypeRepository;
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
public class ToolTypeService {
    private final ToolTypeRepository toolTypeRepository;
    private final FilterParser filterParser;
    private final FilterSpecificationConverter filterSpecificationConverter;

    public ToolType getToolTypeById(long id) throws IdInvalidException {
        return toolTypeRepository.findByIdIfNotDeleted(id).orElseThrow(
                () -> new IdInvalidException("Tool type with id: " + id + " not found")
        );
    }

    public ToolType getToolTypeByIdAdmin(long id) throws IdInvalidException {
        return toolTypeRepository.findById(id).orElseThrow(
                () -> new IdInvalidException("Tool type with id: " + id + " not found")
        );
    }

    public ToolType createToolType(ToolType toolType) {
        // check tool type name in db
        Optional<ToolType> existingToolType = toolTypeRepository.findByNameNotDeleted(toolType.getName());

        if (existingToolType.isPresent()) {
            throw new IllegalArgumentException("Tool type with name: '" + toolType.getName() + "' already exist");
        }

        return toolTypeRepository.save(toolType);
    }

    public ToolType updateToolType(ToolType toolType, long id) throws IdInvalidException {
        ToolType dbToolType = getToolTypeById(id);
        dbToolType.setName(toolType.getName());
        return toolTypeRepository.save(dbToolType);
    }

    public Void deleteToolType(long id) throws IdInvalidException {
        ToolType dbToolType = getToolTypeById(id);
        dbToolType.setDeleted(true);
        toolTypeRepository.save(dbToolType);
        return null;
    }

    public Void restoreToolType(long id) throws IdInvalidException {
        ToolType dbToolType = getToolTypeById(id);
        dbToolType.setDeleted(false);
        toolTypeRepository.save(dbToolType);
        return null;
    }

    public ResPaginationDTO getAllToolType(Pageable pageable) {
        FilterNode node = filterParser.parse("deleted=false");
        FilterSpecification<ToolType> spec = filterSpecificationConverter.convert(node);

        Page<ToolType> pageToolTypes = toolTypeRepository.findAll(spec, pageable);
        return PaginationUtil.getPaginatedResult(pageToolTypes, pageable);
    }

    public ResPaginationDTO getAllToolTypeAdmin(Pageable pageable) {
        Page<ToolType> pageToolTypes = toolTypeRepository.findAll(pageable);
        return PaginationUtil.getPaginatedResult(pageToolTypes, pageable);
    }
}

