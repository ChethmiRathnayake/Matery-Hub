package com.example.masteryhub.hateoas;


import com.example.masteryhub.DTO.request.UserProfileRequest;
import com.example.masteryhub.controller.UserProfileController;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;

public class UserProfileHateoasHelper {

    // Method to generate HATEOAS links for a single user profile
//    public static EntityModel<UserProfileRequest> addLinksToProfile(UserProfileRequest profile) {
//        EntityModel<UserProfileRequest> entityModel = EntityModel.of(profile);
//
//        // Add self link
//        entityModel.add(WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(UserProfileController.class).getById(profile.getId())).withSelfRel());
//
//        // Add update link
//        entityModel.add(WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(UserProfileController.class).update(profile, null)).withRel("update"));
//
//        // Add delete link
//        entityModel.add(WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(UserProfileController.class).delete(null)).withRel("delete"));
//
//        return entityModel;
//    }

    // Method to generate HATEOAS links for the 'me' endpoint
    public static EntityModel<UserProfileRequest> addLinksToMyProfile(UserProfileRequest profile) {
        EntityModel<UserProfileRequest> entityModel = EntityModel.of(profile);

        // Add self link (to the 'me' endpoint)
        entityModel.add(WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(UserProfileController.class).getMyProfile(null)).withSelfRel());

        // Add update link
        entityModel.add(WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(UserProfileController.class).update(profile, null)).withRel("update"));

        // Add delete link
        entityModel.add(WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(UserProfileController.class).delete(null)).withRel("delete"));

        // Upload profile picture (POST /me/profile-picture)
        entityModel.add(WebMvcLinkBuilder.linkTo(
                WebMvcLinkBuilder.methodOn(UserProfileController.class).uploadProfilePicture(null, null)
        ).withRel("uploadProfilePicture"));

        // Upload banner image (POST /me/banner-image)
        entityModel.add(WebMvcLinkBuilder.linkTo(
                WebMvcLinkBuilder.methodOn(UserProfileController.class).uploadBannerImage(null, null)
        ).withRel("uploadBannerImage"));

        // Delete profile picture (DELETE /profile-picture/me)
        entityModel.add(WebMvcLinkBuilder.linkTo(
                WebMvcLinkBuilder.methodOn(UserProfileController.class).deleteProfilePicture(null)
        ).withRel("deleteProfilePicture"));

        // Delete banner image (DELETE /banner-image/me)
        entityModel.add(WebMvcLinkBuilder.linkTo(
                WebMvcLinkBuilder.methodOn(UserProfileController.class).deleteBannerImage(null)
        ).withRel("deleteBannerImage"));


        return entityModel;
    }
}
