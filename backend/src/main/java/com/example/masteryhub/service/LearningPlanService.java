package com.example.masteryhub.service;

import com.example.masteryhub.DTO.request.LearningPlanRequest;
import com.example.masteryhub.DTO.request.PlanItemRequest;
import com.example.masteryhub.DTO.response.LearningPlanResponse;
import com.example.masteryhub.DTO.response.PlanItemResponse;
import com.example.masteryhub.models.LearningPlan;
import com.example.masteryhub.models.PlanItem;
import com.example.masteryhub.models.User;
import com.example.masteryhub.repository.LearningPlanRepo;
import com.example.masteryhub.repository.PlanItemRepository;
import com.example.masteryhub.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LearningPlanService {
    private final LearningPlanRepo learningPlanRepository;
    private final PlanItemRepository planItemRepository;
    private final UserRepository userRepository;

    @Transactional
    public LearningPlanResponse createPlan(LearningPlanRequest requestDTO) {
        try {
            // Validate input
            if (requestDTO.getUserId() == null) {
                throw new IllegalArgumentException("User ID cannot be null");
            }

            User user = userRepository.findById(requestDTO.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Create and validate plan
            LearningPlan plan = createAndValidatePlan(requestDTO, user);

            // Save and return
            LearningPlan savedPlan = learningPlanRepository.save(plan);
            return convertToResponseDTO(savedPlan);

        } catch (IllegalArgumentException e) {
            throw e; // Re-throw validation exceptions
        } catch (Exception e) {
            throw new RuntimeException("Failed to create learning plan: " + e.getMessage());
        }
    }

    private LearningPlan createAndValidatePlan(LearningPlanRequest requestDTO, User user) {
        LearningPlan plan = new LearningPlan();
        plan.setTitle(requestDTO.getTitle());
        plan.setDescription(requestDTO.getDescription());
        plan.setUser(user);

        // Handle dates
        LocalDate startDate = convertToLocalDate(requestDTO.getStartDate());
        LocalDate endDate = convertToLocalDate(requestDTO.getEndDate());

        if (endDate.isBefore(startDate)) {
            throw new IllegalArgumentException("End date cannot be before start date");
        }

        plan.setStartDate(startDate);
        plan.setEndDate(endDate);

        // Create items
        List<PlanItem> items = requestDTO.getItems().stream()
                .map(dto -> createPlanItem(dto, plan))
                .collect(Collectors.toList());

        if (items.isEmpty()) {
            throw new IllegalArgumentException("At least one learning item is required");
        }

        plan.setPlanItems(items);
        return plan;
    }

    public List<LearningPlanResponse> getAllPlansForUser(Long userId) {
        return learningPlanRepository.findByUser_Id(userId).stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public LearningPlanResponse getPlanById(Long planId) {
        return learningPlanRepository.findById(planId)
                .map(this::convertToResponseDTO)
                .orElseThrow(() -> new RuntimeException("Plan not found"));
    }

    @Transactional
    public LearningPlanResponse updatePlan(Long id, LearningPlanRequest request) {
        LearningPlan plan = learningPlanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plan not found"));

        plan.setTitle(request.getTitle());
        plan.setDescription(request.getDescription());

        try {
            plan.setStartDate(convertToLocalDate(request.getStartDate()));
            plan.setEndDate(convertToLocalDate(request.getEndDate()));
        } catch (DateTimeParseException e) {
            throw new IllegalArgumentException("Invalid date format. Please use YYYY-MM-DD format");
        }

        if (request.getItems() != null) {
            // Clear existing items
            plan.getPlanItems().clear();

            List<PlanItem> updatedItems = request.getItems().stream()
                    .map(req -> createPlanItem(req, plan))
                    .collect(Collectors.toList());

            plan.setPlanItems(updatedItems);
        }

        return convertToResponseDTO(learningPlanRepository.save(plan));
    }

    @Transactional
    public void deletePlan(Long id) {
        if (!learningPlanRepository.existsById(id)) {
            throw new RuntimeException("Plan not found");
        }
        learningPlanRepository.deleteById(id);
    }

    @Transactional
    public PlanItemResponse updateItemStatus(Long planId, Long itemId, boolean completed) {
        PlanItem item = planItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        if (!item.getLearningPlan().getPlanId().equals(planId)) {
            throw new RuntimeException("Item doesn't belong to this plan");
        }

        item.setCompleted(completed);
        PlanItem updatedItem = planItemRepository.save(item);

        return PlanItemResponse.builder()
                .itemId(updatedItem.getItemId())
                .topic(updatedItem.getTopic())
                .resourceLink(updatedItem.getResourceLink())
                .completed(updatedItem.isCompleted())
                .build();
    }

    // Helper methods
    private LocalDate convertToLocalDate(Object date) {
        if (date == null) {
            throw new IllegalArgumentException("Date cannot be null");
        }

        if (date instanceof LocalDate) {
            return (LocalDate) date;
        }

        if (date instanceof String) {
            return LocalDate.parse((String) date);
        }

        throw new IllegalArgumentException("Unsupported date type: " + date.getClass());
    }

    private PlanItem createPlanItem(PlanItemRequest dto, LearningPlan plan) {
        PlanItem item = new PlanItem();
        item.setTopic(dto.getTopic());
        item.setResourceLink(dto.getResourceLink());
        item.setCompleted(dto.isCompleted());
        item.setLearningPlan(plan);
        return item;
    }

    private LearningPlanResponse convertToResponseDTO(LearningPlan plan) {
        return LearningPlanResponse.builder()
                .planId(plan.getPlanId())
                .title(plan.getTitle())
                .description(plan.getDescription())
                .startDate(plan.getStartDate())
                .endDate(plan.getEndDate())
                .userId(plan.getUser().getId())
                .items(plan.getPlanItems().stream()
                        .map(this::convertToItemResponse)
                        .collect(Collectors.toList()))
                .build();
    }

    private PlanItemResponse convertToItemResponse(PlanItem item) {
        return PlanItemResponse.builder()
                .itemId(item.getItemId())
                .topic(item.getTopic())
                .resourceLink(item.getResourceLink())
                .completed(item.isCompleted())
                .build();
    }
}