package com.example.masteryhub.hateoas;

import com.example.masteryhub.controller.UserController;
import com.example.masteryhub.models.User;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;

public class UserHateoasHelper {

//    // Add HATEOAS links for any user by ID (admin or own access)
//    public static EntityModel<User> addLinksToUser(User user) {
//        EntityModel<User> entityModel = EntityModel.of(user);
//
//        // Self link (GET /api/users/{id})
//        entityModel.add(WebMvcLinkBuilder.linkTo(
//                        WebMvcLinkBuilder.methodOn(UserController.class).getUser(user.getId()))
//                .withSelfRel());
//
//        // Update link (PUT /api/users/{id})
//        entityModel.add(WebMvcLinkBuilder.linkTo(
//                        WebMvcLinkBuilder.methodOn(UserController.class).updateUser(user.getId(), user))
//                .withRel("update"));
//
//        // Delete link (DELETE /api/users/{id})
//        entityModel.add(WebMvcLinkBuilder.linkTo(
//                        WebMvcLinkBuilder.methodOn(UserController.class).deleteUser(user.getId()))
//                .withRel("delete"));
//
//        return entityModel;
//    }

    // Add HATEOAS links for currently authenticated user (/me endpoints)
    public static EntityModel<User> addLinksToMyUser(User user) {
        EntityModel<User> entityModel = EntityModel.of(user);

        // Self link (/me)
        entityModel.add(WebMvcLinkBuilder.linkTo(
                        WebMvcLinkBuilder.methodOn(UserController.class).getUser(null)) // null since it's injected from auth
                .withSelfRel());

        // Update link (/me)
        entityModel.add(WebMvcLinkBuilder.linkTo(
                        WebMvcLinkBuilder.methodOn(UserController.class).updateUser(user, null))
                .withRel("update"));

        // Change password link
        entityModel.add(WebMvcLinkBuilder.linkTo(
                        WebMvcLinkBuilder.methodOn(UserController.class).changePassword(null, null))
                .withRel("change-password"));

        return entityModel;
    }
}
