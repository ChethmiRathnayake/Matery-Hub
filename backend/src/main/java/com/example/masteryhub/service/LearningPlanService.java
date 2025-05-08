package com.example.masteryhub.service;

import com.example.masteryhub.DTO.request.LearningPlanRequest;
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
        User user = userRepository.findById(requestDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        LearningPlan plan = new LearningPlan();
        plan.setTitle(requestDTO.getTitle());
        plan.setDescription(requestDTO.getDescription());
        plan.setStartDate(requestDTO.getStartDate());
        plan.setEndDate(requestDTO.getEndDate());
        plan.setUser(user);

        List<PlanItem> items = requestDTO.getItems().stream().map(dto -> {
            PlanItem item = new PlanItem();
            item.setTopic(dto.getTopic());
            item.setResourceLink(dto.getResourceLink());
            item.setCompleted(dto.isCompleted());
            item.setLearningPlan(plan); // set back-ref
            return item;
        }).collect(Collectors.toList());

        plan.setPlanItems(items);

        LearningPlan savedPlan = learningPlanRepository.save(plan);
        return mapToResponseDTO(savedPlan);
    }

    public List<LearningPlanResponse> getAllPlansForUser(Long userId) {
        return learningPlanRepository.findByUser_Id(userId).stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    private LearningPlanResponse mapToResponseDTO(LearningPlan plan) {
        LearningPlanResponse response = new LearningPlanResponse();
        response.setPlanId(plan.getPlanId());
        response.setTitle(plan.getTitle());
        response.setDescription(plan.getDescription());
        response.setStartDate(plan.getStartDate());
        response.setEndDate(plan.getEndDate());
        response.setUserId(plan.getUser().getId());

        List<PlanItemResponse> itemDTOs = plan.getPlanItems().stream().map(item -> {
            PlanItemResponse dto = new PlanItemResponse();
            dto.setItemId(item.getItemId());
            dto.setTopic(item.getTopic());
            dto.setResourceLink(item.getResourceLink());
            dto.setCompleted(item.isCompleted());
            return dto;
        }).collect(Collectors.toList());

        response.setItems(itemDTOs);
        return response;
    }

    @Transactional
    public LearningPlanResponse updatePlan(Long id, LearningPlanRequest request) {
        LearningPlan plan = learningPlanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plan not found"));

        plan.setTitle(request.getTitle());
        plan.setDescription(request.getDescription());
        plan.setStartDate(request.getStartDate());
        plan.setEndDate(request.getEndDate());

        if (request.getItems() != null) {
            // Clear existing items
            plan.getPlanItems().clear();

            List<PlanItem> updatedItems = request.getItems().stream().map(req -> {
                PlanItem item = new PlanItem();
                item.setTopic(req.getTopic());
                item.setResourceLink(req.getResourceLink());
                item.setCompleted(req.isCompleted());
                item.setLearningPlan(plan); // re-bind back
                return item;
            }).collect(Collectors.toList());

            plan.setPlanItems(updatedItems);
        }

        return mapToResponseDTO(learningPlanRepository.save(plan));
    }


    @Transactional
    public void deletePlan(Long id) {
        if (!learningPlanRepository.existsById(id)) {
            throw new RuntimeException("Plan not found");
        }
        learningPlanRepository.deleteById(id);
    }

}
